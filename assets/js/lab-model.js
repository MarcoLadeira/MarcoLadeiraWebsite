// Capacity Lab — the model. Pure functions, no DOM: shared by the browser UI,
// the static build (to pre-render default results) and the unit tests.
// Every figure is a back-of-the-envelope estimate from the stated assumptions.

export const PRESETS = {
  "social-feed": { label: "Social feed (read-heavy)", dau: 20_000_000, rpu: 120, readShare: 95, peak: 3, cacheHit: 90, respKb: 8, writeKb: 1 },
  "ride-hailing": { label: "Ride-hailing (location writes)", dau: 5_000_000, rpu: 300, readShare: 40, peak: 4, cacheHit: 70, respKb: 2, writeKb: 0.5 },
  chat: { label: "Chat (balanced, fan-out)", dau: 10_000_000, rpu: 200, readShare: 50, peak: 3, cacheHit: 80, respKb: 1, writeKb: 1 },
  "e-commerce": { label: "E-commerce (sale-day peaks)", dau: 2_000_000, rpu: 60, readShare: 90, peak: 6, cacheHit: 85, respKb: 20, writeKb: 2 },
  "collab-docs": { label: "Collaborative docs", dau: 1_000_000, rpu: 400, readShare: 60, peak: 3, cacheHit: 75, respKb: 4, writeKb: 2 },
  "small-saas": { label: "B2B SaaS (small)", dau: 50_000, rpu: 100, readShare: 85, peak: 4, cacheHit: 80, respKb: 6, writeKb: 1 },
};

export const DEFAULT_CAPACITY = {
  appRps: 1000, // requests/s one stateless app instance can serve
  cacheOps: 50_000, // operations/s per cache node
  primaryWps: 3000, // writes/s one database primary sustains
  replicaRps: 8000, // reads/s per read replica
  headroom: 70, // target utilisation % at peak
  replication: 3, // stored copies of every byte
  failoverSeconds: 30, // writes paused during primary failover
};

export const DEFAULT_FAILURES = { cacheCold: false, loseAppNode: false, primaryFailover: false };

const SECONDS_PER_DAY = 86_400;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {typeof PRESETS["social-feed"]} load
 * @param {typeof DEFAULT_CAPACITY} cap
 * @param {typeof DEFAULT_FAILURES} fail
 */
export function compute(load, cap = DEFAULT_CAPACITY, fail = DEFAULT_FAILURES) {
  const readShare = clamp(load.readShare, 0, 100) / 100;
  const hitNormal = clamp(load.cacheHit, 0, 100) / 100;
  const hit = fail.cacheCold ? 0 : hitNormal;
  const head = clamp(cap.headroom, 10, 100) / 100;

  const avgRps = (load.dau * load.rpu) / SECONDS_PER_DAY;
  const peakRps = avgRps * load.peak;
  const peakReads = peakRps * readShare;
  const peakWrites = peakRps * (1 - readShare);

  // App tier: sized for peak at target utilisation, plus one spare (N+1).
  const appNeeded = Math.max(1, Math.ceil(peakRps / (cap.appRps * head)));
  const appNodes = appNeeded + 1;
  const appActive = Math.max(1, appNodes - (fail.loseAppNode ? 1 : 0));
  const appUtil = peakRps / (appActive * cap.appRps);

  // Cache: every read is a lookup, every write an invalidation.
  const cacheOpsPeak = peakReads + peakWrites;
  const cacheNodes = Math.max(1, Math.ceil(cacheOpsPeak / (cap.cacheOps * head)));
  const cacheUtil = fail.cacheCold ? 0 : cacheOpsPeak / (cacheNodes * cap.cacheOps);

  // Database reads: sized for the *normal* hit rate, so a cold cache shows the real risk.
  const dbReadsNormal = peakReads * (1 - hitNormal);
  const dbReads = peakReads * (1 - hit);
  const replicas = Math.max(1, Math.ceil(dbReadsNormal / (cap.replicaRps * head)));
  const replicaUtil = dbReads / (replicas * cap.replicaRps);

  // Database writes: one primary per shard.
  const shards = Math.max(1, Math.ceil(peakWrites / (cap.primaryWps * head)));
  const primaryUtil = peakWrites / (shards * cap.primaryWps);

  // Failover: writes queue while the primary is unavailable, then drain with spare capacity.
  const queued = fail.primaryFailover ? peakWrites * cap.failoverSeconds : 0;
  const spareWps = shards * cap.primaryWps - peakWrites;
  const drainSeconds = queued === 0 ? 0 : spareWps > 0 ? queued / spareWps : Infinity;

  // Storage and bandwidth (averages, not peaks).
  const writesPerDay = load.dau * load.rpu * (1 - readShare);
  const storageTbYear = (writesPerDay * load.writeKb * 365 * cap.replication) / 1e9;
  const egressTbMonth = (avgRps * load.respKb * SECONDS_PER_DAY * 30) / 1e9;

  const tiers = [
    { id: "app", label: "App servers", count: appNodes, util: appUtil, note: fail.loseAppNode ? `${appActive} of ${appNodes} healthy` : `${appNeeded} + 1 spare` },
    { id: "cache", label: "Cache", count: cacheNodes, util: cacheUtil, note: fail.cacheCold ? "cold — every read misses" : `${Math.round(hitNormal * 100)}% hit rate` },
    { id: "replica", label: "Read replicas", count: replicas, util: replicaUtil, note: `${fmt(dbReads)} reads/s reach the database` },
    { id: "primary", label: shards > 1 ? "Primaries (sharded)" : "Primary", count: shards, util: fail.primaryFailover ? 0 : primaryUtil, note: fail.primaryFailover ? `failing over — ${fmt(queued)} writes queued` : `${fmt(peakWrites)} writes/s at peak` },
  ];
  const hottest = tiers.reduce((a, b) => (b.util > a.util ? b : a));

  return {
    avgRps, peakRps, peakReads, peakWrites, dbReads,
    appNodes, appActive, appUtil, cacheNodes, cacheUtil, replicas, replicaUtil, shards, primaryUtil,
    queued, drainSeconds, storageTbYear, egressTbMonth, tiers, hottest,
    verdict: verdict(hottest, { queued, drainSeconds, fail }),
  };
}

function verdict(hottest, { queued, drainSeconds, fail }) {
  if (fail.primaryFailover) {
    const messages = [
      queued === 0
        ? "With no writes at peak, a primary failover queues nothing."
        : Number.isFinite(drainSeconds)
          ? `During a primary failover, ${fmt(queued)} writes queue up. They drain in ${fmtDuration(drainSeconds)} once the new primary takes over.`
          : "The primary has no spare write capacity, so the failover queue cannot drain. Add a shard or reduce write volume.",
    ];
    if (hottest.util > 1) {
      messages.push(`${hottest.label} are past 100% (${pct(hottest.util)}). ${advice(hottest.id)}`);
    }
    return messages.join(" ");
  }
  const u = hottest.util;
  if (u > 1) return `${hottest.label} are past 100% (${pct(u)}) — this design falls over at peak. ${advice(hottest.id)}`;
  if (u > 0.85) return `${hottest.label} run hottest at ${pct(u)} of capacity: workable, but with little room for a bad day. ${advice(hottest.id)}`;
  return `Every tier stays under 85% at peak; the busiest is ${hottest.label.toLowerCase()} at ${pct(u)}.`;
}

function advice(id) {
  return {
    app: "Add instances or make requests cheaper; app servers are stateless, so this is the easy fix.",
    cache: "Add cache nodes or shard the keyspace.",
    replica: "Warm the cache before traffic arrives, add replicas, or shed non-critical reads.",
    primary: "Shard writes by a key with even load, or batch them through a queue.",
  }[id];
}

export function fmt(n) {
  if (!Number.isFinite(n)) return "∞";
  if (n === 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e4) return `${Math.round(n / 1e3)}k`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  if (n >= 10 || Number.isInteger(n)) return String(Math.round(n));
  return n.toFixed(1);
}
export const pct = (u) => `${Math.round(u * 100)}%`;
export function fmtDuration(s) {
  if (!Number.isFinite(s)) return "never";
  if (s < 1) return "under a second";
  if (s < 60) return `${Math.round(s)} s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  return `${(s / 3600).toFixed(1)} h`;
}
