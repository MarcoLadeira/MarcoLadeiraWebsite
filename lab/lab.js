/* ================================================================
   LAB / EXPERIMENT 01 — System Architecture Generator
   Vanilla. Theme-aware. Reduced-motion aware. ~No dependencies.
   ================================================================ */

(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ─── Pattern knowledge base ──────────────────────────────────
       Each pattern: keywords for matching + a tier-graph of nodes
       and edges + reasoned design decisions. Curated, not inferred,
       so the output reads like real systems judgment.
       ────────────────────────────────────────────────────────── */

    var PATTERNS = {
        rideshare: {
            label: "Ride-sharing",
            keywords: ["uber", "lyft", "ride", "rides", "rider", "driver", "taxi", "cab", "dispatch", "carpool", "share"],
            graph: {
                edge:    [n("CDN", 1), n("Mobile clients", 3)],
                gateway: [n("API Gateway", 3), n("WebSocket Gateway", 3)],
                service: [n("Auth", 1), n("Trip Service", 3), n("Pricing", 2), n("Matching", 3), n("Driver Loc", 3), n("Notifications", 1), n("Payments", 2)],
                data:    [n("User DB · Postgres", 2), n("Trip DB · Postgres", 2), n("Geo Index · Redis", 3), n("Trip History · Cassandra", 2)],
                async:   [n("Kafka · location", 3), n("Trip events", 2), n("Pricing worker", 1), n("Surge model", 1)]
            },
            edges: [
                ["Mobile clients", "API Gateway"], ["Mobile clients", "WebSocket Gateway"], ["CDN", "API Gateway"],
                ["API Gateway", "Auth"], ["API Gateway", "Trip Service"], ["API Gateway", "Pricing"], ["API Gateway", "Payments"],
                ["WebSocket Gateway", "Driver Loc"], ["WebSocket Gateway", "Matching"],
                ["Trip Service", "Trip DB · Postgres"], ["Trip Service", "Matching"],
                ["Matching", "Geo Index · Redis"], ["Driver Loc", "Geo Index · Redis"],
                ["Auth", "User DB · Postgres"], ["Payments", "Trip DB · Postgres"],
                ["Pricing", "Surge model"],
                ["Trip Service", "Kafka · location"], ["Driver Loc", "Kafka · location"],
                ["Kafka · location", "Trip History · Cassandra"], ["Kafka · location", "Trip events"],
                ["Trip events", "Notifications"]
            ],
            decisions: [
                ["Primary store", "Postgres for trips, users, payments", "ACID matters here. A trip's lifecycle has too many invariants — fare lock, driver assignment, payment intent — to leave to eventual consistency."],
                ["Hot path", "Redis Geohash for live driver locations", "Sub-100ms nearest-driver queries at 10M+ updates/min. The geo index is the single most expensive read pattern; specialise it."],
                ["History store", "Cassandra for trip history", "Write-heavy, time-series, append-only. Postgres can serve the operational tier; Cassandra absorbs the long tail."],
                ["Streaming", "Kafka partitioned by region (geohash prefix)", "Hot regions stay hot — partitioning by region keeps consumer fan-out predictable and aligns with regional compliance boundaries."],
                ["Failure mode", "Pricing falls back to last-known surge per cell", "If the surge model latency spikes, the trip path must not block. Stale surge is acceptable; a 4-second checkout is not."]
            ]
        },

        social: {
            label: "Social feed",
            keywords: ["twitter", "social", "feed", "post", "posts", "follow", "follower", "timeline", "tweet", "tweets", "instagram", "tiktok", "reddit"],
            graph: {
                edge:    [n("CDN", 1), n("Web / Mobile", 3)],
                gateway: [n("API Gateway", 3), n("GraphQL Edge", 2)],
                service: [n("Auth", 1), n("Tweet Service", 3), n("Timeline", 3), n("Fanout", 3), n("Search", 2), n("Trending", 1), n("Ranking ML", 2)],
                data:    [n("Users · Postgres", 1), n("Tweets · Cassandra", 3), n("Timeline · Redis", 3), n("Search · Elastic", 2), n("Graph DB · followers", 2)],
                async:   [n("Kafka · writes", 3), n("Fanout worker", 3), n("Indexer", 2), n("Trending agg", 1)]
            },
            edges: [
                ["Web / Mobile", "API Gateway"], ["Web / Mobile", "GraphQL Edge"], ["CDN", "API Gateway"],
                ["API Gateway", "Auth"], ["API Gateway", "Tweet Service"], ["GraphQL Edge", "Timeline"], ["GraphQL Edge", "Search"],
                ["Tweet Service", "Tweets · Cassandra"], ["Auth", "Users · Postgres"],
                ["Timeline", "Timeline · Redis"], ["Timeline", "Ranking ML"],
                ["Ranking ML", "Tweets · Cassandra"],
                ["Search", "Search · Elastic"], ["Trending", "Tweets · Cassandra"],
                ["Tweet Service", "Kafka · writes"],
                ["Kafka · writes", "Fanout worker"], ["Kafka · writes", "Indexer"], ["Kafka · writes", "Trending agg"],
                ["Fanout worker", "Timeline · Redis"], ["Fanout worker", "Graph DB · followers"],
                ["Indexer", "Search · Elastic"]
            ],
            decisions: [
                ["Primary store", "Cassandra for tweets, Postgres for users", "Tweets are write-heavy, time-ordered, naturally partitioned by user_id. Users are small and need ACID — keep them on Postgres."],
                ["Fanout strategy", "Hybrid push/pull: push for normal, pull for celebrities", "Pure push storms a million caches when a celebrity tweets. Pure pull starves the home timeline. Hybrid at a 100K-follower threshold is the standard answer."],
                ["Timeline cache", "Redis materialised top-800 per user", "Most users never scroll past the first few hundred. Materialise the working set, fall through to compute-on-read for the long tail."],
                ["Search", "Elasticsearch with ~1s indexing lag", "Real-time search across 100M users isn't free. A 1-second lag on the indexer queue keeps cluster cost sane and is invisible to humans."],
                ["Ranking", "Two-tower model, served via on-host inference", "Network round-trips to a model server kill timeline latency. Co-locate ranking with timeline assembly."]
            ]
        },

        chat: {
            label: "Realtime chat",
            keywords: ["chat", "discord", "slack", "message", "messaging", "im", "dm", "channel", "presence", "conversation", "whatsapp", "telegram"],
            graph: {
                edge:    [n("WS Edge · regional", 3), n("Web / Mobile", 3)],
                gateway: [n("WS Gateway", 3), n("REST Gateway", 2)],
                service: [n("Auth", 1), n("Presence", 3), n("Channel Service", 2), n("Message Service", 3), n("Notifications", 2), n("Search", 1)],
                data:    [n("Users · Postgres", 1), n("Messages · Scylla", 3), n("Presence · Redis", 3), n("Search · Elastic", 1)],
                async:   [n("Kafka · messages", 3), n("Push worker", 2), n("Indexer", 1)]
            },
            edges: [
                ["Web / Mobile", "WS Edge · regional"], ["Web / Mobile", "REST Gateway"],
                ["WS Edge · regional", "WS Gateway"],
                ["WS Gateway", "Presence"], ["WS Gateway", "Message Service"], ["WS Gateway", "Channel Service"],
                ["REST Gateway", "Auth"], ["REST Gateway", "Channel Service"], ["REST Gateway", "Search"],
                ["Auth", "Users · Postgres"],
                ["Presence", "Presence · Redis"],
                ["Message Service", "Messages · Scylla"],
                ["Search", "Search · Elastic"],
                ["Message Service", "Kafka · messages"],
                ["Kafka · messages", "Push worker"], ["Kafka · messages", "Indexer"],
                ["Push worker", "Notifications"], ["Indexer", "Search · Elastic"]
            ],
            decisions: [
                ["WebSocket sharding", "Consistent hash on user_id, ~50K conns per edge", "Bounding connections per edge is what keeps a chat platform from cascading on a single hot box. Hashing keeps a user pinned for cache warmth."],
                ["Message store", "ScyllaDB partitioned by channel, clustered by time", "Reads are window queries (\"last 50 in this channel\"). The partition key must be channel; the cluster key must be time. ScyllaDB outperforms Cassandra on read-heavy chat at a fraction of the nodes."],
                ["Presence", "Redis pub/sub with 30s heartbeat TTL", "Online state is ephemeral by design. TTL handles disconnects without a graveyard cleanup job."],
                ["Notifications", "Off-channel via Kafka → per-platform workers", "Apple, Android, and email each have their own retry semantics. Routing through Kafka isolates each platform's failure mode."],
                ["Failure mode", "Edge degrades to read-only on gateway loss", "If the gateway is unreachable, the edge serves cached recent messages and queues outgoing locally. Better than a black screen."]
            ]
        },

        video: {
            label: "Video streaming",
            keywords: ["netflix", "youtube", "video", "stream", "streaming", "vod", "transcode", "playback", "hulu", "disney", "media"],
            graph: {
                edge:    [n("CDN edge POPs", 3), n("Origin shield", 2), n("Player clients", 3)],
                gateway: [n("API Gateway", 2), n("DRM service", 1)],
                service: [n("Auth", 1), n("Catalog", 2), n("Playback", 3), n("Recommendations", 2), n("Encoder ctrl", 1)],
                data:    [n("Catalog · Cassandra", 2), n("Users · Postgres", 1), n("Watch state · Dynamo", 3), n("Media · S3", 3), n("ML model store", 1)],
                async:   [n("Kafka · views", 3), n("Encoder pipeline", 2), n("Reco trainer", 1)]
            },
            edges: [
                ["Player clients", "CDN edge POPs"], ["CDN edge POPs", "Origin shield"], ["Origin shield", "Media · S3"],
                ["Player clients", "API Gateway"],
                ["API Gateway", "Auth"], ["API Gateway", "Catalog"], ["API Gateway", "Playback"], ["API Gateway", "Recommendations"],
                ["Auth", "Users · Postgres"],
                ["Catalog", "Catalog · Cassandra"],
                ["Playback", "DRM service"], ["Playback", "Watch state · Dynamo"],
                ["Recommendations", "ML model store"], ["Recommendations", "Catalog · Cassandra"],
                ["Encoder ctrl", "Encoder pipeline"], ["Encoder pipeline", "Media · S3"],
                ["Playback", "Kafka · views"],
                ["Kafka · views", "Reco trainer"], ["Reco trainer", "ML model store"]
            ],
            decisions: [
                ["Delivery", "90%+ traffic served from CDN edge POPs", "Origin pulls are a tax. A pre-warmed multi-bitrate ladder at the edge is what makes the unit economics of streaming work."],
                ["Encoding", "Per-title bitrate ladder, batch pipeline on ingest", "Compute at ingest is cheap; compute at playback is fatal. Encode every title into 4K/1080p/720p/480p variants up-front."],
                ["Watch state", "DynamoDB, partition user_id, sort title_id", "Resume position needs <30ms reads from anywhere on Earth. Dynamo's global tables are built for this exact shape."],
                ["Recommendations", "Two-tower retrieval + on-device ranking", "Server picks the candidate pool; the device picks the order. Cuts server cost and personalises faster than a round-trip allows."],
                ["Failure mode", "Player degrades to lower bitrate, never to a spinner", "Adaptive bitrate is the contract. If the network softens, drop quality silently — user watches; nobody pages oncall."]
            ]
        },

        ecommerce: {
            label: "Ecommerce",
            keywords: ["shopify", "amazon", "ecommerce", "store", "shop", "cart", "checkout", "product", "products", "order", "orders", "payment", "merchant", "seller"],
            graph: {
                edge:    [n("CDN · storefront", 3), n("Web / Mobile", 3)],
                gateway: [n("Storefront API", 3), n("Admin API", 1)],
                service: [n("Auth", 1), n("Catalog", 2), n("Cart", 2), n("Checkout", 3), n("Payments", 3), n("Inventory", 2), n("Fraud", 1)],
                data:    [n("Products · Postgres", 2), n("Orders · Postgres (sharded)", 3), n("Inventory · PG+Redis", 3), n("Search · Elastic", 1)],
                async:   [n("Kafka · order events", 3), n("Inventory worker", 2), n("Webhook dispatcher", 2), n("Email worker", 1)]
            },
            edges: [
                ["Web / Mobile", "CDN · storefront"], ["CDN · storefront", "Storefront API"],
                ["Web / Mobile", "Storefront API"], ["Web / Mobile", "Admin API"],
                ["Storefront API", "Auth"], ["Storefront API", "Catalog"], ["Storefront API", "Cart"], ["Storefront API", "Checkout"],
                ["Admin API", "Catalog"], ["Admin API", "Inventory"],
                ["Catalog", "Products · Postgres"], ["Catalog", "Search · Elastic"],
                ["Checkout", "Payments"], ["Checkout", "Inventory"], ["Checkout", "Fraud"],
                ["Payments", "Orders · Postgres (sharded)"],
                ["Inventory", "Inventory · PG+Redis"],
                ["Payments", "Kafka · order events"],
                ["Kafka · order events", "Inventory worker"], ["Kafka · order events", "Webhook dispatcher"], ["Kafka · order events", "Email worker"],
                ["Inventory worker", "Inventory · PG+Redis"]
            ],
            decisions: [
                ["Sharding", "Orders sharded by merchant_id", "Merchants are naturally isolated — there are no cross-merchant transactions. Sharding by merchant scales linearly with the platform."],
                ["Inventory", "Postgres of record, Redis read-through with optimistic locking", "Stock is a hot read and a contested write. Cache the read; use compare-and-set on the write. Reservations expire automatically at 5 minutes."],
                ["Payments", "Idempotent payment intents, two-phase capture", "Authorise on checkout, capture on fulfilment. Idempotency keys mean a network blip doesn't double-charge a customer."],
                ["Fraud", "Inline rules + ML scorer with hard 100ms budget", "Fraud check sits in the checkout latency budget. If the ML scorer slows down, the rules engine ships a verdict alone — checkout never blocks on a model."],
                ["Webhooks", "Dispatched async with exponential backoff", "Merchants' own webhook endpoints are unreliable by definition. Retries with backoff and a poison queue protect platform throughput."]
            ]
        },

        collab: {
            label: "Collaborative editor",
            keywords: ["notion", "figma", "google docs", "docs", "collab", "collaborative", "editor", "document", "documents", "multiplayer", "crdt", "yjs", "realtime edit"],
            graph: {
                edge:    [n("CDN · assets", 1), n("Web client", 3)],
                gateway: [n("REST Gateway", 2), n("WS Gateway · sync", 3)],
                service: [n("Auth", 1), n("Workspace", 1), n("Document Service", 3), n("Sync · CRDT", 3), n("Permissions", 2), n("Search", 1)],
                data:    [n("Docs · Postgres", 2), n("Op log · Postgres", 3), n("Sync state · Redis", 3), n("Search · Elastic", 1), n("Attachments · S3", 2)],
                async:   [n("Kafka · doc events", 3), n("Snapshot worker", 2), n("Indexer", 1), n("Notify worker", 1)]
            },
            edges: [
                ["Web client", "CDN · assets"], ["Web client", "REST Gateway"], ["Web client", "WS Gateway · sync"],
                ["REST Gateway", "Auth"], ["REST Gateway", "Workspace"], ["REST Gateway", "Document Service"], ["REST Gateway", "Search"],
                ["WS Gateway · sync", "Sync · CRDT"], ["WS Gateway · sync", "Permissions"],
                ["Sync · CRDT", "Op log · Postgres"], ["Sync · CRDT", "Sync state · Redis"],
                ["Document Service", "Docs · Postgres"], ["Document Service", "Attachments · S3"],
                ["Permissions", "Sync state · Redis"],
                ["Search", "Search · Elastic"],
                ["Sync · CRDT", "Kafka · doc events"],
                ["Kafka · doc events", "Snapshot worker"], ["Kafka · doc events", "Indexer"], ["Kafka · doc events", "Notify worker"],
                ["Snapshot worker", "Docs · Postgres"], ["Indexer", "Search · Elastic"]
            ],
            decisions: [
                ["Sync model", "Yjs CRDT with append-only operation log", "Last-write-wins loses edits during conflict. CRDTs converge by construction — every concurrent change preserves intent."],
                ["Storage", "Op log in Postgres, snapshots compacted hourly", "Replaying every op on document open gets slow at 100K+ ops. Snapshot every hour or 1000 ops; replay only the tail."],
                ["Sharding", "Documents sharded by doc_id, sticky WS routing", "Each doc has one writer-leader at a time. Sticky routing keeps the CRDT state warm and avoids remote merge round-trips."],
                ["Permissions", "Per-doc ACL cached in Redis, checked per op", "An ACL miss in the sync hot path costs 50ms. Cache the ACL with the doc; invalidate on permission change."],
                ["Search", "Hourly snapshot index + live op tail", "Full reindex on every keystroke would melt Elastic. Snapshots give the baseline; the tail keeps recent edits searchable within seconds."]
            ]
        }
    };

    function n(label, weight) { return { label: label, weight: weight || 1 }; }

    /* ─── Pattern detection ──────────────────────────────────── */

    function detectPattern(text) {
        var t = (text || "").toLowerCase();
        var best = { key: "social", score: 0 };
        Object.keys(PATTERNS).forEach(function (key) {
            var p = PATTERNS[key];
            var score = 0;
            p.keywords.forEach(function (kw) {
                var idx = t.indexOf(kw);
                if (idx !== -1) {
                    // Weight longer keywords higher (they're more specific signals)
                    score += 1 + Math.min(kw.length / 8, 1.5);
                }
            });
            if (score > best.score) best = { key: key, score: score };
        });
        // Confidence: 0..1 normalised (cap at 6 raw points)
        var confidence = Math.min(best.score / 6, 1);
        return { key: best.key, confidence: confidence };
    }

    function detectScale(text) {
        var t = (text || "").toLowerCase();
        // Match patterns like: "10 million", "100m", "1.5b", "500k users", "10000000"
        var match = t.match(/([\d.,]+)\s*(billion|b\b|million|m\b|thousand|k\b)?/);
        if (!match) return { tier: "large", users: null };
        var num = parseFloat(match[1].replace(/,/g, ""));
        var unit = (match[2] || "").trim();
        var multiplier = 1;
        if (unit === "billion" || unit === "b") multiplier = 1e9;
        else if (unit === "million" || unit === "m") multiplier = 1e6;
        else if (unit === "thousand" || unit === "k") multiplier = 1e3;
        var users = num * multiplier;
        var tier;
        if (users < 1e5) tier = "small";
        else if (users < 1e6) tier = "medium";
        else if (users < 1e7) tier = "large";
        else tier = "hyperscale";
        return { tier: tier, users: users };
    }

    function formatUsers(users) {
        if (users == null) return "—";
        if (users >= 1e9) return (users / 1e9).toFixed(users % 1e9 === 0 ? 0 : 1) + "B users";
        if (users >= 1e6) return (users / 1e6).toFixed(users % 1e6 === 0 ? 0 : 1) + "M users";
        if (users >= 1e3) return (users / 1e3).toFixed(0) + "K users";
        return users + " users";
    }

    /* ─── Layout ─────────────────────────────────────────────── */

    var TIER_ORDER = ["edge", "gateway", "service", "data", "async"];
    var TIER_LABEL = { edge: "EDGE", gateway: "GATEWAY", service: "SERVICE", data: "DATA", async: "ASYNC" };

    function buildGraph(patternKey) {
        var pattern = PATTERNS[patternKey];
        var nodesByLabel = {};
        var nodes = [];

        TIER_ORDER.forEach(function (tier) {
            (pattern.graph[tier] || []).forEach(function (node) {
                var item = { id: node.label, label: node.label, tier: tier, weight: node.weight };
                nodesByLabel[node.label] = item;
                nodes.push(item);
            });
        });

        var edges = [];
        pattern.edges.forEach(function (edge) {
            var from = nodesByLabel[edge[0]];
            var to = nodesByLabel[edge[1]];
            if (!from || !to) return;
            // Flux derived from destination node weight (busier nodes attract more particles)
            var flux = Math.max(0.6, (from.weight + to.weight) / 4);
            edges.push({ from: from, to: to, flux: flux });
        });

        return { pattern: pattern, nodes: nodes, edges: edges };
    }

    function layout(graph, width, height) {
        var paddingX = 22;
        var paddingTop = 36;
        var paddingBottom = 22;
        var tierGap = (width - paddingX * 2) / TIER_ORDER.length;
        var nodeWidth = Math.min(150, tierGap - 16);

        TIER_ORDER.forEach(function (tier, i) {
            var tierNodes = graph.nodes.filter(function (n) { return n.tier === tier; });
            if (tierNodes.length === 0) return;
            var availableHeight = height - paddingTop - paddingBottom;
            var nodeHeight = 30;
            var totalNodesHeight = tierNodes.length * nodeHeight;
            var totalGapHeight = availableHeight - totalNodesHeight;
            var gap = Math.max(8, totalGapHeight / (tierNodes.length + 1));
            var x = paddingX + i * tierGap + (tierGap - nodeWidth) / 2;
            var y = paddingTop + gap;
            tierNodes.forEach(function (node) {
                node.x = x;
                node.y = y;
                node.w = nodeWidth;
                node.h = nodeHeight;
                y += nodeHeight + gap;
            });
        });

        return { tierGap: tierGap, nodeWidth: nodeWidth, paddingTop: paddingTop };
    }

    /* ─── Renderer ───────────────────────────────────────────── */

    var canvas = document.getElementById("lab-canvas");
    var ctx = canvas ? canvas.getContext("2d") : null;
    var stage = document.getElementById("lab-stage");
    var promptForm = document.getElementById("lab-prompt");
    var promptInput = document.getElementById("lab-prompt-input");
    var chips = document.querySelectorAll(".lab-chip");
    var tagPattern = document.querySelector('[data-tag="pattern"]');
    var tagScale = document.querySelector('[data-tag="scale"]');
    var tagConfidence = document.querySelector('[data-tag="confidence"]');
    var decisionsTitle = document.querySelector('[data-decisions="title"]');
    var decisionsSummary = document.querySelector('[data-decisions="summary"]');
    var decisionsList = document.querySelector('[data-decisions="list"]');

    if (!canvas || !ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var currentGraph = null;
    var currentLayoutInfo = null;
    var hoveredNode = null;
    var particles = [];
    var lastFrame = 0;

    function resizeCanvas() {
        var rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return true;
    }

    function relayout() {
        if (!currentGraph) return;
        var rect = canvas.getBoundingClientRect();
        currentLayoutInfo = layout(currentGraph, rect.width, rect.height);
    }

    function bezierPoint(t, p0, p1, p2, p3) {
        var u = 1 - t;
        var tt = t * t;
        var uu = u * u;
        return {
            x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
            y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y
        };
    }

    function edgeAnchors(edge) {
        var fx = edge.from.x + edge.from.w;
        var fy = edge.from.y + edge.from.h / 2;
        var tx = edge.to.x;
        var ty = edge.to.y + edge.to.h / 2;
        var dx = Math.max(40, (tx - fx) * 0.5);
        return {
            p0: { x: fx, y: fy },
            p1: { x: fx + dx, y: fy },
            p2: { x: tx - dx, y: ty },
            p3: { x: tx, y: ty }
        };
    }

    function drawTierLabels(rect) {
        if (!currentLayoutInfo) return;
        ctx.save();
        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = "rgba(245, 240, 232, 0.32)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        TIER_ORDER.forEach(function (tier, i) {
            var x = 22 + i * currentLayoutInfo.tierGap + currentLayoutInfo.tierGap / 2;
            ctx.fillText(TIER_LABEL[tier], x, 14);
        });
        ctx.restore();
    }

    function drawEdges() {
        if (!currentGraph) return;
        ctx.save();
        currentGraph.edges.forEach(function (edge) {
            var connectedToHover = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);
            var dimmed = hoveredNode && !connectedToHover;
            ctx.strokeStyle = connectedToHover
                ? "rgba(245, 240, 232, 0.42)"
                : dimmed
                    ? "rgba(245, 240, 232, 0.05)"
                    : "rgba(245, 240, 232, 0.13)";
            ctx.lineWidth = connectedToHover ? 1.2 : 1;
            var a = edgeAnchors(edge);
            ctx.beginPath();
            ctx.moveTo(a.p0.x, a.p0.y);
            ctx.bezierCurveTo(a.p1.x, a.p1.y, a.p2.x, a.p2.y, a.p3.x, a.p3.y);
            ctx.stroke();
        });
        ctx.restore();
    }

    function drawNodes() {
        if (!currentGraph) return;
        ctx.save();
        ctx.font = '500 11.5px "Inter", system-ui, sans-serif';
        ctx.textBaseline = "middle";
        currentGraph.nodes.forEach(function (node) {
            var hovered = node === hoveredNode;
            var dimmed = hoveredNode && !hovered && !isConnectedToHover(node);
            var alpha = dimmed ? 0.32 : 1;

            ctx.fillStyle = hovered
                ? "rgba(245, 240, 232, 0.10)"
                : "rgba(255, 255, 255, " + (0.035 * alpha) + ")";
            ctx.strokeStyle = hovered
                ? "rgba(245, 240, 232, 0.55)"
                : "rgba(245, 240, 232, " + (0.18 * alpha) + ")";
            ctx.lineWidth = 1;
            roundRect(ctx, node.x, node.y, node.w, node.h, 7);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "rgba(245, 240, 232, " + (hovered ? 0.96 : (0.78 * alpha)) + ")";
            var label = fitLabel(node.label, node.w - 18);
            ctx.fillText(label, node.x + 10, node.y + node.h / 2 + 0.5);
        });
        ctx.restore();
    }

    function isConnectedToHover(node) {
        if (!hoveredNode || !currentGraph) return false;
        for (var i = 0; i < currentGraph.edges.length; i++) {
            var e = currentGraph.edges[i];
            if ((e.from === hoveredNode && e.to === node) || (e.to === hoveredNode && e.from === node)) return true;
        }
        return false;
    }

    function fitLabel(label, maxW) {
        // Cheap ellipsis — assumes ~6.4px per char at this font/size.
        var charW = 6.4;
        var maxChars = Math.floor(maxW / charW);
        if (label.length <= maxChars) return label;
        return label.slice(0, Math.max(1, maxChars - 1)) + "…";
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawParticles() {
        ctx.save();
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var connectedToHover = hoveredNode && (p.edge.from === hoveredNode || p.edge.to === hoveredNode);
            var dimmed = hoveredNode && !connectedToHover;
            var pos = bezierPoint(p.t, p.anchors.p0, p.anchors.p1, p.anchors.p2, p.anchors.p3);
            // Fade in/out at edges
            var fade = Math.min(p.t * 6, (1 - p.t) * 6, 1);
            var alpha = (dimmed ? 0.18 : connectedToHover ? 1 : 0.78) * fade;
            ctx.fillStyle = "rgba(245, 240, 232, " + alpha + ")";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, connectedToHover ? 2.3 : 1.9, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function spawnParticles(dt) {
        if (!currentGraph || prefersReducedMotion.matches) return;
        currentGraph.edges.forEach(function (edge) {
            // Re-cache anchors per frame in case of layout change
            edge._anchors = edge._anchors || edgeAnchors(edge);
            // Spawn rate: flux particles per second
            edge._spawnAcc = (edge._spawnAcc || 0) + edge.flux * dt;
            while (edge._spawnAcc >= 1) {
                particles.push({
                    edge: edge,
                    anchors: edge._anchors,
                    t: 0,
                    speed: 0.7 + Math.random() * 0.4 // 0.7..1.1 per second
                });
                edge._spawnAcc -= 1;
            }
        });
    }

    function tickParticles(dt) {
        for (var i = particles.length - 1; i >= 0; i--) {
            particles[i].t += particles[i].speed * dt;
            if (particles[i].t >= 1) particles.splice(i, 1);
        }
    }

    function drawOnce() {
        if (!currentGraph) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTierLabels();
        drawEdges();
        drawParticles();
        drawNodes();
    }

    function frame(now) {
        if (!currentGraph) {
            requestAnimationFrame(frame);
            return;
        }
        var dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.016;
        lastFrame = now;

        spawnParticles(dt);
        tickParticles(dt);

        drawOnce();

        requestAnimationFrame(frame);
    }

    /* ─── Hover ──────────────────────────────────────────────── */

    canvas.addEventListener("mousemove", function (e) {
        if (!currentGraph) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var found = null;
        for (var i = 0; i < currentGraph.nodes.length; i++) {
            var n = currentGraph.nodes[i];
            if (x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h) { found = n; break; }
        }
        if (found !== hoveredNode) {
            hoveredNode = found;
            canvas.style.cursor = found ? "pointer" : "default";
        }
    });

    canvas.addEventListener("mouseleave", function () {
        hoveredNode = null;
        canvas.style.cursor = "default";
    });

    /* ─── Generate ───────────────────────────────────────────── */

    function generate(text) {
        var pattern = detectPattern(text);
        var scale = detectScale(text);
        var graph = buildGraph(pattern.key);
        currentGraph = graph;
        // Clear any per-edge cached anchors from previous run
        graph.edges.forEach(function (e) { e._anchors = null; e._spawnAcc = 0; });
        particles = [];

        if (resizeCanvas()) relayout();

        if (stage) stage.dataset.state = "ready";

        // Synchronous first paint — guarantees the diagram is visible
        // even if rAF is throttled (hidden tab, screenshot, slow first frame).
        drawOnce();

        var conf = pattern.confidence;
        var confLabel = conf >= 0.45 ? "high confidence"
            : conf >= 0.22 ? "moderate confidence"
            : conf >= 0.08 ? "low confidence"
            : "fallback";

        if (tagPattern) tagPattern.textContent = graph.pattern.label;
        if (tagScale) tagScale.textContent = scale.tier + " · " + (scale.users != null ? formatUsers(scale.users) : "scale not specified");
        if (tagConfidence) tagConfidence.textContent = confLabel;

        if (decisionsTitle) decisionsTitle.textContent = graph.pattern.label + " — " + scale.tier + " tier";
        if (decisionsSummary) {
            decisionsSummary.textContent = "A " + graph.pattern.label.toLowerCase() +
                " topology shaped for " + (scale.users != null ? formatUsers(scale.users) : "the scale you described") +
                ". Hover any node to isolate its traffic.";
        }
        renderDecisions(graph.pattern.decisions);
    }

    function renderDecisions(decisions) {
        if (!decisionsList) return;
        decisionsList.innerHTML = "";
        decisions.forEach(function (d) {
            var wrap = document.createElement("div");
            wrap.className = "lab-decision";
            wrap.innerHTML =
                '<p class="lab-decision__label">' + escapeHtml(d[0]) + '</p>' +
                '<p class="lab-decision__value">' + escapeHtml(d[1]) + '</p>' +
                '<p class="lab-decision__why">' + escapeHtml(d[2]) + '</p>';
            decisionsList.appendChild(wrap);
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }

    /* ─── Wiring ─────────────────────────────────────────────── */

    promptForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = promptInput.value.trim();
        if (!v) return;
        generate(v);
    });

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            var p = chip.dataset.prompt;
            if (!p) return;
            promptInput.value = p;
            generate(p);
        });
    });

    var resizeRaf = null;
    window.addEventListener("resize", function () {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(function () {
            resizeRaf = null;
            if (resizeCanvas()) {
                relayout();
                if (currentGraph) currentGraph.edges.forEach(function (e) { e._anchors = null; });
            }
        });
    });

    // Initial sizing — wait for layout
    requestAnimationFrame(function () {
        resizeCanvas();
        requestAnimationFrame(frame);
    });

})();
