// Project and case-study content. Every number here is traceable to the
// project's own repository or documentation (see docs/PORTFOLIO-AUDIT.md).
// `status` must describe the real state of the work today, not the plan.

export const flagship = [
  {
    slug: "fenergo",
    name: "Enterprise AI at Fenergo",
    short: "Fenergo",
    kind: "Professional",
    year: "2025 — now",
    status: "Beta · details confidential",
    statusTone: "live",
    role: "Associate Software Engineer · one of three engineers",
    team: "Three engineers, alongside product",
    stack: ["C#", ".NET", "TypeScript", "React", "LLM integration", "AWS", "EventStoreDB", "DynamoDB"],
    lede:
      "Building AI into client lifecycle management software for banks and financial institutions — where every answer may feed a compliance decision.",
    card:
      "One of a three-person team that built an enterprise AI application from scratch and took it to beta, inside regulated KYC/AML software.",
    accent: "ink",
    proof: [
      ["Beta", "built from scratch"],
      ["3", "engineers on the build"],
      ["Regulated", "KYC / AML domain"],
    ],
    caseStudy: {
      confidential: true,
      overview:
        "Fenergo makes client lifecycle management software that banks and other financial institutions use for onboarding, KYC and anti-money-laundering work. I joined the core platform as a graduate in September 2025, was selected for the company's first AI initiative in early 2026, and was promoted to Associate Software Engineer. This page describes the work at the level that is public; it deliberately leaves out internal architecture, metrics, screenshots and client details.",
      problem:
        "Compliance teams spend a large share of their time gathering, reading and reconciling information before a human can make a decision. Language models can take on part of that work, but in this domain a confident wrong answer is worse than no answer: outputs have to be explainable, permissioned, auditable and easy for a person to check and override.",
      motivation:
        "It is the hardest place I know to make AI useful: the bar is not 'impressive demo', it is 'a regulated institution will rely on this'. That forces good engineering habits — explicit boundaries, honest failure modes, and a human in control.",
      responsibilities: [
        "One of three engineers who built the application from an empty repository to a beta release.",
        "Full-stack implementation in C#/.NET and TypeScript/React, including LLM integration and AI workflows.",
        "Requirements analysis with product, technical design, debugging, automated and manual testing, and release validation.",
        "Earlier, on the core platform: event-driven backend work — CQRS, optimistic concurrency, idempotent processing on EventStoreDB and DynamoDB.",
      ],
      principles: [
        ["Human oversight by design", "AI proposes; a person decides. Consequential actions stay with the user, who should always be able to check an answer and reject it."],
        ["Boundaries before features", "Model access belongs behind explicit, permission-aware interfaces rather than scattered through a codebase, so security and data rules are enforced in one place."],
        ["Fail visibly", "When the model is unavailable, slow or unsure, the user is told so plainly. Silent degradation is treated as a bug."],
        ["Release discipline", "A beta is a promise to real users. Validating a release end to end against the scenarios people actually run matters as much as unit tests."],
      ],
      lessons: [
        "Most of the work in an enterprise AI feature is not the prompt. It is permissions, data boundaries, error handling, evaluation and the interface that lets a person trust — or overrule — the result.",
        "Small teams move fast when ownership is clear. With three engineers, everyone touches requirements, code, tests and release.",
        "Event-driven systems taught me to think in terms of what has happened and what must never happen twice — a habit that transfers directly to AI workflows with retries and partial failure.",
      ],
      statusText: "Beta release delivered. Product specifics, usage and internals are confidential.",
      links: [["Fenergo", "https://www.fenergo.com/"]],
    },
  },
  {
    slug: "vesta",
    name: "Vesta",
    short: "Vesta",
    kind: "Independent product",
    year: "2026 — now",
    status: "Private alpha · v0.2.1 Alpha.1 · not publicly released",
    statusTone: "alpha",
    role: "Sole developer — product, design and engineering",
    team: "Solo",
    stack: ["Python", "PySide6 / QtWebEngine", "JavaScript", "SQLite", "Playwright", "Vitest", "pytest", "GitHub Actions"],
    lede:
      "A local-first desktop workspace and CLI for AI-assisted coding that routes each task to the cheapest model that can do it, shows every step while it works, and can be stopped instantly.",
    card:
      "A local-first AI coding workspace and CLI: cost-aware model routing, a visible activity timeline, real cancellation and signed savings receipts.",
    accent: "vesta",
    proof: [
      ["7,900+", "Python test functions"],
      ["1,300+", "Vitest & Playwright cases"],
      ["660+", "pull requests merged"],
    ],
    hero: "vesta/chat",
    caseStudy: {
      overview:
        "Vesta sits between a developer and the AI coding tools they already use — Claude, Codex, Copilot and local models. It decides which model a task actually needs, runs it with live, inspectable activity, records what it cost, and lets the user stop it at any moment. One shared core drives both a desktop app and a command-line interface.",
      problem:
        "AI coding tools became powerful and opaque at the same time. They spend tokens you can't see, run actions you can't easily inspect, and report value you can't verify. Every task — from 'write a commit message' to 'refactor this module' — tends to go to the most expensive model by default.",
      motivation:
        "I use these tools every day and wanted three things none of them gave me together: the cheapest safe route for each task, a clear view of what the agent is doing, and a Stop button that actually stops it.",
      responsibilities: [
        "Product definition, interface design and brand.",
        "Architecture of the shared core (`vestahub`) behind the GUI (`vesta`) and CLI.",
        "Model routing, provider adapters, cancellation, cost ledger, GitHub automation and repository safety.",
        "Test strategy across Python unit/integration, headless GUI, Vitest and Playwright end-to-end suites.",
      ],
      media: [
        { key: "vesta/chat", caption: "A finished run: summary, checks that passed, the code that changed and the diff — all in one turn. Rendered from Vesta's own visual-regression suite." },
        { key: "vesta/usage", caption: "Usage: what Vesta has spent today and this month, spending limits, and an 'ask before a task exceeds' threshold." },
        { key: "vesta/safety", caption: "Safety & Privacy: run modes, permissions and what is kept locally." },
      ],
      architecture: {
        caption: "One request path behind two interfaces. Cheap, deterministic tiers are tried first; paid cloud models only run after confirmation.",
        layers: [
          ["Interfaces", ["Desktop app · PySide6 + QtWebEngine", "CLI · `vesta route`, `vesta ask`, `vesta savings`"]],
          ["Shared core", ["Task pipeline", "Capability router (L0 → L3)", "Run modes & permissions", "Cancellation & activity events"]],
          ["Providers", ["Deterministic tools (L0)", "Local models (L1)", "Free-tier APIs", "Claude · Codex · Copilot CLIs (paid, confirmed)"]],
          ["Evidence", ["Cost ledger · SQLite", "Signed savings receipts", "Isolated Git worktrees", "Run journal"]],
        ],
      },
      challenges: [
        {
          title: "Making Stop actually stop",
          body: "Model calls are provider CLI subprocesses. The first version used a 20-minute blocking `subprocess.run`, so the Stop button did nothing and a late reply could overwrite the screen. I rebuilt the path end to end: a cancellation event threads from the JavaScript button, through the Qt bridge and pipeline, to a streaming `Popen` reader that checks it about five times a second and kills the whole process tree — including grandchildren that could otherwise keep spending money or editing the repo. Stale results are rejected by request ID.",
          code: {
            lang: "python",
            label: "vestahub/accounts.py — excerpt",
            text: `def _terminate(proc, *, tracker=None) -> bool:
    """Stop a running process *and its whole tree*: grandchildren
    spawned by a provider CLI must not survive Stop and keep
    spending or mutating the repo."""
    if tracker is not None:
        tracker.force_terminate(reason_code="process_tree_termination_started")
    terminate_tree(proc)
    confirmed = proc is None or proc.poll() is not None
    if tracker is not None and confirmed:
        tracker.mark_terminated(reason_code="process_exit_observed")
    return confirmed`,
          },
        },
        {
          title: "Routing by capability, not by list order",
          body: "Auto mode originally picked the first configured free model and stopped at the first error. I replaced it with capability-based selection: score the models the user actually has for the task, try the cheapest capable one, and fall back automatically on empty answers, rate limits or auth failures — asking for confirmation only when a call is genuinely paid, destructive or irreversible.",
        },
        {
          title: "One source of truth for a run",
          body: "GUI, CLI and receipts each read state from different files, so they could disagree. I'm moving every run onto a single journal — one request, one task identity, one ordered event history — and documenting each step with file and line references rather than intentions. This is ongoing work and the docs say so.",
        },
      ],
      decisions: [
        ["Desktop shell", "PySide6 + QtWebEngine, web UI inside", "Electron; native Qt widgets only", "Keeps the core in Python next to the CLI; web tech for the interface. Larger install, and a classic Qt fallback has to be maintained."],
        ["Cost model", "Tiered L0–L3 with configurable per-tier rates", "Exact per-provider billing", "Honest and reproducible estimates, clearly labelled as estimates. Not an invoice."],
        ["Safety", "Edits run in isolated Git worktrees; push needs explicit, revocable consent", "Edit in place", "Slightly more disk and plumbing; a bad run can never touch your working copy or remote without permission."],
        ["Testing", "Mocked provider runtimes — no test ever spends money", "Live provider tests in CI", "Fast, free and deterministic; live behaviour is covered separately by an opt-in provider canary."],
      ],
      testing:
        "Every behaviour that matters is tested at more than one layer. The repository contains about 7,900 pytest functions and around 1,360 Vitest and Playwright cases, including visual-regression snapshots of the interface in three themes and at phone, tablet and desktop sizes. A mock Qt bridge lets the real front-end JavaScript run in Chromium without Qt. Model runtimes are mocked (`FakeAccountRunner`, `FakeStreamingRunner`), so no test launches a paid CLI or makes a network call.",
      results: [
        "A working desktop app and CLI in private alpha, built through 1,800+ commits since May 2026.",
        "A reproducible savings report: five everyday tasks routed to free local tiers instead of a frontier model (`docs/PROOF.md`).",
        "Around 126,000 lines of Python and 660+ merged pull requests, each carrying its own tests.",
      ],
      lessons: [
        "'It works' is not the same as 'it can be stopped'. Cancellation, timeouts and stale results deserve as much design as the happy path.",
        "Write down what is true, not what is intended. Vesta's design docs separate measured facts from plans, which has saved me from believing my own roadmap.",
        "A cost tool must be scrupulous about its own numbers; every estimate in the UI says it is an estimate.",
      ],
      statusText:
        "Private alpha (v0.2.1 Alpha.1). There is no public package or installer yet; the repository is private while the first verified release artifact is prepared.",
      links: [],
    },
  },
  {
    slug: "oddlings",
    name: "ONE Oddlings",
    short: "Oddlings",
    kind: "Independent product",
    year: "2026 — now",
    status: "In development · not yet public",
    statusTone: "alpha",
    role: "Sole developer — game design, engineering and production",
    team: "Solo",
    stack: ["TypeScript", "React", "Vite", "CSS Modules", "Web Audio", "Playwright", "Vitest"],
    lede:
      "A five-minute browser puzzle game. Four characters stand on a 3×3 board and two are in the wrong place: swap them to fix the pattern, then fix as many boards as you can before the clock runs out.",
    card:
      "A browser puzzle game with generated, independently verified boards, an on-device adaptive difficulty model, a daily run and streaks.",
    accent: "oddlings",
    proof: [
      ["20,000", "generated boards re-verified"],
      ["11", "kinds of goal"],
      ["1,100+", "unit & end-to-end test cases"],
    ],
    hero: "oddlings/run",
    caseStudy: {
      overview:
        "ONE is a small site with two original puzzle games. ONE Classic is a daily 3×3 visual-reasoning puzzle; ONE Oddlings is the faster, more playful one. Circle, Square, Triangle and Diamond stand on a board that breaks its goal in exactly one place. One swap fixes it, the next board drops in, and a five-minute run asks how many you can fix.",
      problem:
        "Most casual puzzle games either hand-author a few hundred levels or generate boards that are occasionally unfair. I wanted endless, genuinely fresh boards that are always solvable, that get harder as you improve, and that never use dark patterns to keep people playing.",
      motivation:
        "Games are the most honest product test there is: if it isn't fun in the first ten seconds, nobody stays. It also let me combine algorithms, interaction design, motion and sound in one product.",
      responsibilities: [
        "Game design: rules, goals, pacing, scoring, praise, the daily run and streaks.",
        "Engineering: board generator, independent verifier, adaptive skill model, input (tap, drag and keyboard), sound and motion.",
        "Character art direction and asset pipeline: sprite QA scripts, measured eye contours for blinks, right-sized WebP copies.",
        "Quality: unit, replay and end-to-end tests; accessibility and reduced-motion support; release gates.",
      ],
      media: [
        { key: "oddlings/today", caption: "Today: the daily run ticket and a free five-minute run." },
        { key: "oddlings/run", caption: "A run in progress. The goal card shows the rule in words and as a picture; Oddlings that already fit wear a tick." },
        { key: "oddlings/meet", caption: "Meet the Oddlings: each character has idle, picked, oops and happy poses." },
      ],
      video: {
        src: "assets/img/work/oddlings/run-desktop.mp4",
        poster: "assets/img/work/oddlings/run-desktop-poster.webp",
        w: 1280,
        h: 800,
        caption: "Real gameplay, recorded with Playwright against a production build: five boards fixed in a row across three kinds of goal. No sound.",
      },
      architecture: {
        caption: "Boards are built from a seed and checked by code that shares nothing with the generator. Daily boards never depend on the player.",
        layers: [
          ["Input", ["Tap-tap, drag or keyboard", "Movement threshold between tap and drag"]],
          ["Run", ["Seeded run state · 5:00 clock", "Wrong swap: board restored, −15 s", "Praise, milestones, stars"]],
          ["Boards", ["Generator: finished picture + one breaking swap", "Independent verifier", "Adaptive skill model (free runs only)"]],
          ["Persistence", ["Local results & streaks (versioned keys)", "Replayable challenge links (v1–v3)"]],
        ],
      },
      challenges: [
        {
          title: "Every board must be fair",
          body: "The generator builds a finished picture, then breaks it with one swap. That is not enough on its own: a bug could still ship an unsolvable board. A separate checker re-reads each board as literal rows and columns — no gameplay helpers — and confirms at least one swap satisfies the visible goal. Any swap that satisfies the goal is accepted, not just the generator's. A quality script builds 500 runs of 40 boards (20,000) and re-checks every one; the last run had zero failures.",
          code: {
            lang: "ts",
            label: "src/experiments/fix/arcade/verify.ts — excerpt",
            text: `// Independent stated-goal checker: operates on literal row strings,
// not gameplay helpers.
export function checkedRepairs(grid: readonly Glyph[], goal: Goal): Pair[] {
  const found: Pair[] = [];
  for (let a = 0; a < 8; a++)
    for (let b = a + 1; b < 9; b++) {
      const left = grid[a], right = grid[b];
      if (!left || !right || sameLook(left, right)) continue;
      const trial = grid.map((g, i) => (i === a ? right : i === b ? left : g));
      if (check(trial, goal)) found.push([a, b]);
    }
  return found;
}`,
          },
        },
        {
          title: "Difficulty that adapts without being creepy",
          body: "Free runs adapt to the player using an on-device skill model in the style of Glicko: one ability estimate per kind of goal, each with its own uncertainty, and a logistic chance of a clean solve. Nothing about time spent, purchases, device or account influences a choice. Daily runs never adapt, so everyone gets the same boards.",
        },
        {
          title: "Measuring how much novelty really exists",
          body: "A stress test built 110,000 candidate boards and counted repeats at three strengths: exact boards, look-alikes (the same layout with shapes renamed) and structures (the same solving logic under the goal's own symmetries). Most goals have only two to seven genuinely different structures, which proved that real variety has to come from mixing goals — and changed the roadmap.",
        },
        {
          title: "Links that never change what they replay",
          body: "Runs are seeded and versioned (`v=1`, `v=2`, `v=3`). A digest of 6,000 boards pins older schedules in a replay test, so a friend's challenge link always rebuilds the exact boards it was shared with.",
        },
      ],
      decisions: [
        ["Board source", "Generated from seeds + independent verifier", "Hand-authored levels", "Endless content and replayable links; costs a second implementation of the rules to check the first."],
        ["Adaptivity", "On-device skill estimates, free runs only", "Server-side tuning; adapt everything", "Private and explainable; dailies stay identical for everyone."],
        ["Penalty", "Wrong swap restores the board and costs 15 s", "Lives; game over", "Keeps runs flowing for beginners while still rewarding accuracy."],
        ["Motion", "Short, fast animations; reduced motion removes movement, never information", "Long celebratory sequences", "Feels quick; every animation must earn its time."],
      ],
      testing:
        "The ONE repository has 150+ test files and roughly 1,100 unit and end-to-end cases, including replay tests that pin old board schedules, a 20,000-board quality run, sprite QA (alpha, halos, framing and a shared foot line for all 20 sprites) and an art manifest check that fails the build if a web copy goes stale. End-to-end tests run in Chromium, with Firefox and WebKit available.",
      results: [
        "Both games are implemented on the main branch; Oddlings is in the preview build.",
        "Zero failures across 20,000 generated boards in the latest quality run.",
        "Keyboard, drag and tap input; reduced-motion and dark-theme support; sound off by default.",
      ],
      lessons: [
        "If the rules are the product, check them twice — with two pieces of code that don't share assumptions.",
        "Measure novelty before promising it. The stress test changed the roadmap more than any opinion did.",
        "Game feel is engineering: tick marks on settled pieces, a draining time bar and a rising pitch for each fix in a row made the biggest difference.",
      ],
      statusText:
        "In development, targeting a public release. Nothing is public yet; remaining gates include real-player tests and art rights paperwork. Screenshots and footage are from the current preview build.",
      links: [],
    },
  },
  {
    slug: "savetheplanet",
    name: "SaveThePlanet",
    short: "SaveThePlanet",
    kind: "Hackathon · team lead",
    year: "Sep 2026",
    status: "Hackathon prototype · complete",
    statusTone: "done",
    role: "Product Owner & Technical Lead · four-person team",
    team: "Four engineers",
    stack: ["Python", "JavaScript", "Forecasting model (GridToEv)", "Constraint-based optimisation", "Node test runner"],
    lede:
      "Can we forecast renewable electricity that is about to be wasted, and turn it into cheaper, better-timed EV charging? A four-person hackathon prototype built on real Irish grid data.",
    card:
      "Led a four-person team at Hack the Climate 2026: real Irish grid data, 30-minute-ahead curtailment forecasts and a constraint-aware EV charging plan.",
    accent: "stp",
    proof: [
      ["475", "automated tests documented"],
      ["+30 min", "ahead renewable forecasts"],
      ["4", "people led as PO & tech lead"],
    ],
    hero: "savetheplanet/dashboard",
    caseStudy: {
      overview:
        "SaveThePlanet was built in September 2026 for Hack the Climate, an energy-industry hackathon held at Microsoft's Dublin campus, where teams worked with real energy datasets and Microsoft AI tools on renewable curtailment. Our prototype connects Irish grid data, a 30-minute-ahead forecast of energy at risk, real charging-site constraints, an EV charging plan and a transparent business model in one product.",
      problem:
        "Ireland dispatches down a meaningful share of its wind and solar output when the grid can't use it. Meanwhile EVs charge whenever drivers plug in. The interesting question isn't 'is there surplus?' but 'can a specific charger, at a specific site, with specific cars, actually use it in time — and is it cheaper than ordinary smart charging?'",
      motivation:
        "It was a chance to lead: to turn a broad climate brief into a product a judge could understand in seven minutes, without overstating anything a prototype can't prove.",
      responsibilities: [
        "Product ownership: problem definition, product flow (Forecast → Recover → Charge → Impact), scope and priorities.",
        "Team leadership: divided the work across four people, ran integration and kept the build demoable.",
        "Engineering: dashboard development, coordination of backend and model integration, and code review.",
        "The business case, the demo script and the evidence ledger behind every number on the slides.",
      ],
      media: [
        { key: "savetheplanet/dashboard", caption: "Dashboard: renewable energy at risk for a target half-hour, why it is at risk, and how much flexible charging could use it." },
        { key: "savetheplanet/charging", caption: "Charging: a replay day's schedule against renewable supply, and the best half-hours to charge." },
        { key: "savetheplanet/impact", caption: "Impact: estimated outcomes, clearly marked as simulated." },
      ],
      architecture: {
        caption: "Every value on screen carries its provenance: recorded, predicted, deterministic or simulated.",
        layers: [
          ["Data", ["EirGrid dispatch-down records (real)", "GridToEv +30 / +60 min predictions (real model output)", "Fleet & site presets (simulated)"]],
          ["Backend · Python", ["Targets chosen from predictions only", "Constraint-aware charging optimiser", "Offers & incentive split", "Battery / hydrogen scenarios"]],
          ["Frontend · JavaScript", ["Dashboard", "Forecast", "Charging", "Impact"]],
          ["Evidence", ["Evidence ledger (E1–E20)", "Deterministic demo fallback", "475 documented tests"]],
        ],
      },
      challenges: [
        {
          title: "A good forecast is not a feasible charge",
          body: "The optimiser checks every plan against hard constraints — site power limits, charger counts and rates, and each car's arrival, departure and energy need — and reports why a vehicle could not be served, most fundamental reason first. A tempting forecast that the fleet can't actually absorb is shown as such.",
          code: {
            lang: "python",
            label: "backend/optimizer.py — excerpt",
            text: `def check_plan(plan):
    """Every hard-constraint violation in a plan (empty list when feasible)."""
    problems = []
    for vehicle in plan.fleet['vehicles']:
        vid, site = vehicle['id'], plan.sites[vehicle['site']]
        for slot, energy in plan.alloc[vid].items():
            if slot not in plan.available[vid]:
                problems.append(f'{vid}: charged while not plugged in (slot {slot})')
            if energy > min(vehicle['maxKw'], site['chargerKw']) * SLOT_HOURS + EPS:
                problems.append(f'{vid}: exceeds vehicle/charger rate in slot {slot}')
    # ...site power and charger-count checks per half-hour
    return problems`,
          },
        },
        {
          title: "No look-ahead, no wishful thinking",
          body: "The demo replays real history, so it would have been easy to cheat. Offers lock 30 minutes before a window and are chosen from predictions only; +60 forecasts are never mixed with +30. Tests enforce both rules.",
        },
        {
          title: "Saying exactly what is real",
          body: "I wrote an evidence ledger that tags every number in the pitch as recorded, predicted, deterministic, illustrative or hypothetical, with its source file. The tariffs, fleet, battery and hydrogen pathway are examples, and the product says so on screen.",
        },
      ],
      decisions: [
        ["Use case", "EV charging as the first flexible load", "Batteries, heat pumps, data centres", "Focused and demoable in days; other loads left as next steps."],
        ["Incentive", "Share the incremental saving 50 / 25 / 25 (driver / operator / platform)", "Flat discount", "Drivers get a reason to shift; offers are rejected when ordinary smart charging is already cheaper."],
        ["Demo reliability", "Known-good replay scenario as fallback", "Live feeds only", "The story works even if a network dependency fails on stage."],
      ],
      testing:
        "The demo's evidence ledger documents 475 automated tests: 392 backend (Python `unittest`, including eight hosted-model checks) and 83 frontend (Node's built-in test runner), run in CI on every pull request. These are documented historical counts from September 2026.",
      results: [
        "A working end-to-end prototype across four product areas, demonstrated in a seven-minute pitch.",
        "A worked pilot model that breaks even for the platform at 300 charges a month per site — clearly labelled illustrative, not revenue.",
        "A public repository with product spec, architecture, decision log, demo script, Q&A and evidence ledger.",
      ],
      lessons: [
        "As a lead, the most valuable artefact I produced wasn't code — it was the shared product flow that let four people build towards the same seven minutes.",
        "Credibility comes from what you refuse to claim. Separating real from simulated made the pitch stronger, not weaker.",
        "Deterministic fallbacks are cheap insurance for live demos.",
      ],
      statusText: "Complete as a hackathon prototype. A real pilot would need live feeds, a site partner, metering and an independent emissions check.",
      links: [["Source on GitHub", "https://github.com/MarcoLadeira/SaveThePlanet"]],
    },
  },
];

export const archive = [
  {
    name: "NASA Space Explorer",
    year: "2025",
    kind: "Full-stack web",
    text: "React, TypeScript and an Express API wrapping five NASA open APIs (APOD, Mars Rover, EPIC, NEO, media search), with React Query caching and route tests. The hosted demo has been retired; the source and deployment notes remain.",
    stack: ["React", "TypeScript", "Node.js", "Express", "Docker"],
    links: [["Source", "https://github.com/MarcoLadeira/NasaAPI"]],
  },
  {
    name: "ORO Patient App",
    year: "2025",
    kind: "Final-year team project",
    text: "Sole developer of the patient mobile app for a smart pill dispenser, part of a team building the dispenser, pharmacist app and server. Demonstrated publicly at the DkIT Computing Expo 2025.",
    stack: ["Ionic", "JavaScript", "Go", "Python"],
    links: [["Team repository", "https://github.com/Mayv-dev/PharmaCube"]],
  },
  {
    name: "Achievr",
    year: "2025",
    kind: "Native iOS",
    text: "A goal-tracking iOS app built natively in Swift with UIKit and GRDB/SQLite for local persistence.",
    stack: ["Swift", "UIKit", "SQLite", "GRDB"],
    links: [["Source", "https://github.com/MarcoLadeira/iosMobileApp"]],
  },
];
