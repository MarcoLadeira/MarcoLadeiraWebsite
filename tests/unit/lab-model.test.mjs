import { test } from "node:test";
import assert from "node:assert/strict";
import { compute, PRESETS, DEFAULT_CAPACITY, fmt } from "../../assets/js/lab-model.js";

const load = { dau: 864_000, rpu: 100, readShare: 90, peak: 2, cacheHit: 80, respKb: 10, writeKb: 1 };

test("average and peak load follow the stated formulas", () => {
  const r = compute(load);
  assert.equal(r.avgRps, 1000); // 864,000 × 100 ÷ 86,400
  assert.equal(r.peakRps, 2000);
  assert.ok(Math.abs(r.peakReads - 1800) < 1e-9);
  assert.ok(Math.abs(r.peakWrites - 200) < 1e-9);
});

test("app tier is sized N+1 at target utilisation", () => {
  const r = compute(load); // 2000 ÷ (1000 × 0.7) = 2.86 → 3, +1 spare
  assert.equal(r.appNodes, 4);
  const lost = compute(load, DEFAULT_CAPACITY, { cacheCold: false, loseAppNode: true, primaryFailover: false });
  assert.equal(lost.appActive, 3);
  assert.ok(lost.appUtil > r.appUtil);
});

test("a cold cache sends every read to replicas sized for the warm hit rate", () => {
  const warm = compute(load);
  const cold = compute(load, DEFAULT_CAPACITY, { cacheCold: true, loseAppNode: false, primaryFailover: false });
  assert.equal(cold.replicas, warm.replicas);
  assert.ok(Math.abs(cold.dbReads - 1800) < 1e-9);
  assert.ok(cold.replicaUtil > warm.replicaUtil * 4);
});

test("failover queues writes and reports a finite drain time when there is spare capacity", () => {
  const r = compute(load, DEFAULT_CAPACITY, { cacheCold: false, loseAppNode: false, primaryFailover: true });
  assert.ok(Math.abs(r.queued - 200 * 30) < 1e-6);
  assert.ok(Number.isFinite(r.drainSeconds) && r.drainSeconds > 0);
  assert.match(r.verdict, /failover/);
});

test("write-heavy loads shard the primary", () => {
  const r = compute({ ...load, dau: 50_000_000, readShare: 10 });
  assert.ok(r.shards > 1);
  assert.ok(r.primaryUtil <= 0.7 + 1e-9);
});

test("every preset produces finite, positive results", () => {
  for (const [k, p] of Object.entries(PRESETS)) {
    const r = compute(p);
    for (const key of ["avgRps", "peakRps", "storageTbYear", "egressTbMonth"]) assert.ok(Number.isFinite(r[key]) && r[key] > 0, `${k}.${key}`);
    assert.ok(r.verdict.length > 20);
  }
});

test("number formatting is compact and stable", () => {
  assert.equal(fmt(950), "950");
  assert.equal(fmt(1234), "1.2k");
  assert.equal(fmt(83_333), "83k");
  assert.equal(fmt(2_500_000), "2.5M");
  assert.equal(fmt(Infinity), "∞");
});
