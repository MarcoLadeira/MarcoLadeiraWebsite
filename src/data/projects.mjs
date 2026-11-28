// Public project summaries and case-study content.
export const flagship = [
  {
    "slug": "fenergo",
    "name": "Software engineering at Fenergo",
    "short": "Fenergo",
    "kind": "Professional",
    "year": "Sep 2025 – present",
    "status": "Current role",
    "statusTone": "live",
    "role": "Graduate to Associate Software Engineer",
    "team": "Multiple engineering teams",
    "stack": [
      "C#",
      ".NET",
      "TypeScript",
      "React",
      "LLM integration",
      "AWS",
      "EventStoreDB",
      "DynamoDB"
    ],
    "lede": "My work at Fenergo has ranged from event-driven back-end services to full-stack delivery and AI for regulated financial software.",
    "card": "Client lifecycle management, full-stack delivery and a three-person AI beta team.",
    "accent": "ink",
    "caseStudy": {
      "confidential": true,
      "overview": "Fenergo builds software for financial institutions to onboard clients and meet ongoing know-your-customer and anti-money-laundering obligations. I joined the core platform team as a graduate and have since worked across engineering teams and different areas of the product.",
      "problem": "Client lifecycle workflows span services, data and user-facing steps. Engineers need to understand how a change behaves beyond the screen or service where it started.",
      "motivation": "I wanted to understand the whole path from a business requirement to a change that people could use in production.",
      "responsibilities": [
        "On the core platform, I worked on event-driven back-end services, including patterns for keeping processing consistent across retries and concurrent updates.",
        "In full-stack work, I contribute to requirements, design, implementation, debugging, testing and release validation with product and engineering colleagues.",
        "As part of the company’s first AI initiative, I helped a small engineering team bring an application to beta and worked on language-model integrations for a regulated workflow."
      ],
      "principles": [
        [
          "Event handling",
          "I work with patterns such as CQRS, idempotent event processing and optimistic concurrency where the system calls for them."
        ],
        [
          "AI workflows",
          "I account for review and error handling where a language model is part of a larger workflow."
        ]
      ],
      "lessons": [
        "Working across teams has made me more deliberate about what a system promises at its boundaries and where another team needs context.",
        "Understanding how a change will be tested and released makes the implementation easier to reason about."
      ],
      "statusText": "I joined as a Graduate Software Engineer in September 2025 and was promoted to Associate Software Engineer in 2026.",
      "links": [
        [
          "Fenergo",
          "https://www.fenergo.com/"
        ]
      ]
    }
  },
  {
    "slug": "vesta",
    "name": "Vesta",
    "short": "Vesta",
    "kind": "Independent product",
    "year": "2026 — now",
    "status": "Private alpha",
    "statusTone": "alpha",
    "role": "Product, design and development",
    "team": "Solo",
    "stack": [
      "Python",
      "PySide6 / QtWebEngine",
      "JavaScript",
      "SQLite",
      "Playwright",
      "Vitest",
      "pytest",
      "GitHub Actions"
    ],
    "lede": "A desktop workspace and CLI for AI-assisted coding, with controls for model choice, spend and runs in progress.",
    "card": "An AI coding workspace where you can follow a run, review the result and see what it cost.",
    "accent": "vesta",
    "hero": "vesta/workspace",
    "caseStudy": {
      "overview": "I built Vesta to keep coding-agent work in one place. The desktop workspace shows activity and results while the CLI offers the same core workflows for people who prefer the terminal.",
      "problem": "It can be hard to see what a coding agent is doing, how much a run has cost and whether it has actually stopped.",
      "motivation": "I wanted one view where I could work with a model and still see the commands, edits and costs around it.",
      "responsibilities": [
        "Designed and implemented the desktop workspace and CLI.",
        "Built model selection and routing, run activity, usage accounting and cancellation into the workflow.",
        "Added browser tests for the interface and fixtures that demonstrate operation without calling live providers."
      ],
      "media": [
        {
          "key": "vesta/workspace",
          "caption": "Reviewing a completed change with its checks and spend. Vesta interface shown with sample data.",
          "alt": "Vesta workspace showing a completed code update, checks and spending."
        },
        {
          "key": "vesta/team-map",
          "caption": "The AI Team view shows which agents are in a run and how work passes between them. Sample data.",
          "alt": "Vesta AI Team map with three agents and a handoff from implementation to review."
        }
      ],
      "architecture": {
        "caption": "One request path behind two interfaces. Cheap, deterministic tiers are tried first; paid cloud models only run after confirmation.",
        "layers": [
          [
            "Interfaces",
            [
              "Desktop app · PySide6 + QtWebEngine",
              "CLI · `vesta route`, `vesta ask`, `vesta savings`"
            ]
          ],
          [
            "Shared core",
            [
              "Task pipeline",
              "Capability router (L0 → L3)",
              "Run modes & permissions",
              "Cancellation & activity events"
            ]
          ],
          [
            "Providers",
            [
              "Deterministic tools (L0)",
              "Local models (L1)",
              "Free-tier APIs",
              "Claude · Codex · Copilot CLIs (paid, confirmed)"
            ]
          ],
          [
            "Evidence",
            [
              "Cost ledger · SQLite",
              "Signed savings receipts",
              "Isolated Git worktrees",
              "Run journal"
            ]
          ]
        ]
      },
      "challenges": [
        {
          "title": "Making Stop actually stop",
          "body": "Model calls are provider CLI subprocesses. The first version used a 20-minute blocking `subprocess.run`, so the Stop button did nothing and a late reply could overwrite the screen. I rebuilt the path end to end: a cancellation event threads from the JavaScript button, through the Qt bridge and pipeline, to a streaming `Popen` reader that checks it about five times a second and kills the whole process tree — including grandchildren that could otherwise keep spending money or editing the repo. Stale results are rejected by request ID.",
          "code": {
            "lang": "python",
            "label": "vestahub/accounts.py — excerpt",
            "text": "def _terminate(proc, *, tracker=None) -> bool:\n    \"\"\"Stop a running process *and its whole tree*: grandchildren\n    spawned by a provider CLI must not survive Stop and keep\n    spending or mutating the repo.\"\"\"\n    if tracker is not None:\n        tracker.force_terminate(reason_code=\"process_tree_termination_started\")\n    terminate_tree(proc)\n    confirmed = proc is None or proc.poll() is not None\n    if tracker is not None and confirmed:\n        tracker.mark_terminated(reason_code=\"process_exit_observed\")\n    return confirmed"
          }
        },
        {
          "title": "Routing by capability, not by list order",
          "body": "Auto mode originally picked the first configured free model and stopped at the first error. I replaced it with capability-based selection: score the models the user actually has for the task, try the cheapest capable one, and fall back automatically on empty answers, rate limits or auth failures — asking for confirmation only when a call is genuinely paid, destructive or irreversible."
        }
      ],
      "decisions": [
        [
          "Desktop shell",
          "PySide6 + QtWebEngine, web UI inside",
          "Electron; native Qt widgets only",
          "Keeps the core in Python next to the CLI; web tech for the interface. Larger install, and a classic Qt fallback has to be maintained."
        ],
        [
          "Cost model",
          "Tiered L0–L3 with configurable per-tier rates",
          "Exact per-provider billing",
          "Honest and reproducible estimates, clearly labelled as estimates. Not an invoice."
        ],
        [
          "Safety",
          "Edits run in isolated Git worktrees; push needs explicit, revocable consent",
          "Edit in place",
          "Slightly more disk and plumbing; a bad run can never touch your working copy or remote without permission."
        ],
        [
          "Testing",
          "Mocked provider runtimes — no test ever spends money",
          "Live provider tests in CI",
          "Fast, free and deterministic; live behaviour is covered separately by an opt-in provider canary."
        ]
      ],
      "testing": "I test run behaviour in Python and use browser fixtures to verify how activity, cancellation and costs appear in the workspace.",
      "lessons": [
        "A run timeline is only helpful if completed, cancelled and failed work are reported consistently.",
        "Provider integrations are easier to evaluate when model selection, execution and accounting have clear boundaries."
      ],
      "statusText": "The current build is a private alpha. The screenshots use its real interface with test fixtures. Costs in those screens are demonstration values.",
      "links": []
    }
  },
  {
    "slug": "oddlings",
    "name": "ONE Oddlings",
    "short": "Oddlings",
    "kind": "Independent product",
    "year": "2026 — now",
    "status": "Development preview",
    "statusTone": "alpha",
    "role": "Game design and development",
    "team": "Solo",
    "stack": [
      "TypeScript",
      "React",
      "Vite",
      "CSS Modules",
      "Web Audio",
      "Playwright",
      "Vitest"
    ],
    "lede": "A browser puzzle game about putting a board of little characters back in order, one swap at a time.",
    "card": "A puzzle game with quick daily runs, a cast of Oddlings and a deceptively simple swap rule.",
    "accent": "oddlings",
    "hero": "oddlings/title",
    "caseStudy": {
      "overview": "A run gives you a board of Oddlings and a rule to satisfy. Swap two pieces, check whether the board now fits, then move through more boards as the run continues.",
      "problem": "A short puzzle has to feel fair immediately. The player needs to understand the goal and recognise what changed after a swap.",
      "motivation": "I wanted a game that could make sense in a few seconds and still draw me back for the next daily puzzle.",
      "responsibilities": [
        "Worked on the rules, characters’ presentation, daily runs, touch controls and the browser interface.",
        "Built deterministic board generation and replay links so a run can be reproduced.",
        "Built a separate board checker and on-device difficulty adjustment."
      ],
      "media": [
        {
          "key": "oddlings/fever",
          "caption": "Fever during a timed desktop run.",
          "alt": "The ONE Oddlings board during Fever, with the current goal and score."
        },
        {
          "key": "oddlings/phone",
          "caption": "A night-theme board on the mobile layout.",
          "alt": "Mobile ONE Oddlings run on a portrait screen with one board piece selected."
        },
        {
          "key": "oddlings/cast",
          "caption": "The current cast, with each Oddling shown in its own colour.",
          "alt": "The ONE Oddlings cast screen showing six characters."
        }
      ],
      "demo": "verifier",
      "video": {
        "src": "assets/img/work/oddlings/gameplay.webm",
        "fallback": "assets/img/work/oddlings/gameplay.mp4",
        "poster": "assets/img/work/oddlings/fever-1440.webp",
        "posterAlt": "ONE Oddlings board during Fever in a desktop run.",
        "w": 1280,
        "h": 800,
        "caption": "Three boards from the development build, including a drag swap, a click swap and Fever."
      },
      "architecture": {
        "caption": "Boards are built from a seed and checked by code that shares nothing with the generator. Daily boards never depend on the player.",
        "layers": [
          [
            "Input",
            [
              "Tap-tap, drag or keyboard",
              "Movement threshold between tap and drag"
            ]
          ],
          [
            "Run",
            [
              "Seeded run state · 5:00 clock",
              "Wrong swap: board restored, −15 s",
              "Praise, milestones, stars"
            ]
          ],
          [
            "Boards",
            [
              "Generator: finished picture + one breaking swap",
              "Independent verifier",
              "Adaptive skill model (free runs only)"
            ]
          ],
          [
            "Persistence",
            [
              "Local results & streaks (versioned keys)",
              "Replayable challenge links (v1–v3)"
            ]
          ]
        ]
      },
      "challenges": [
        {
          "title": "Every board must be fair",
          "body": "The generator builds a finished picture, then breaks it with one swap. That is not enough on its own: a bug could still ship an unsolvable board. A separate checker re-reads each board as literal rows and columns — no gameplay helpers — and confirms at least one swap satisfies the visible goal. Any swap that satisfies the goal is accepted, not just the generator's. A quality script builds 500 runs of 40 boards (20,000) and re-checks every one; the last run had zero failures.",
          "code": {
            "lang": "ts",
            "label": "src/experiments/fix/arcade/verify.ts — excerpt",
            "text": "// Independent stated-goal checker: operates on literal row strings,\n// not gameplay helpers.\nexport function checkedRepairs(grid: readonly Glyph[], goal: Goal): Pair[] {\n  const found: Pair[] = [];\n  for (let a = 0; a < 8; a++)\n    for (let b = a + 1; b < 9; b++) {\n      const left = grid[a], right = grid[b];\n      if (!left || !right || sameLook(left, right)) continue;\n      const trial = grid.map((g, i) => (i === a ? right : i === b ? left : g));\n      if (check(trial, goal)) found.push([a, b]);\n    }\n  return found;\n}"
          }
        }
      ],
      "decisions": [
        [
          "Board source",
          "Generated from seeds + independent verifier",
          "Hand-authored levels",
          "Endless content and replayable links; costs a second implementation of the rules to check the first."
        ],
        [
          "Adaptivity",
          "On-device skill estimates, free runs only",
          "Server-side tuning; adapt everything",
          "Private and explainable; dailies stay identical for everyone."
        ],
        [
          "Penalty",
          "Wrong swap restores the board and costs 15 s",
          "Lives; game over",
          "Keeps runs flowing for beginners while still rewarding accuracy."
        ],
        [
          "Motion",
          "Short, fast animations; reduced motion removes movement, never information",
          "Long celebratory sequences",
          "Feels quick; every animation must earn its time."
        ]
      ],
      "testing": "An independent checker validates the generated boards. I also test keyboard, pointer and touch controls through browser runs.",
      "lessons": [
        "The most useful feedback is close to the piece you moved, especially on a small screen.",
        "Independent verification helps distinguish a difficult board from one the generator should never have made."
      ],
      "statusText": "These are captures from a development build. The playable rules demo above is a simplified version of the board mechanic.",
      "links": []
    }
  },
  {
    "slug": "savetheplanet",
    "name": "SaveThePlanet",
    "short": "SaveThePlanet",
    "kind": "Hackathon · team lead",
    "year": "Sep 2026",
    "status": "Hackathon prototype",
    "statusTone": "done",
    "role": "Product Owner and Technical Lead",
    "team": "Four-person team",
    "stack": [
      "Python",
      "JavaScript",
      "Forecasting model (GridToEv)",
      "Constraint-based optimisation",
      "Node test runner"
    ],
    "lede": "A team prototype that forecasts periods of surplus Irish renewable electricity and proposes when flexible EVs could charge.",
    "card": "A hackathon prototype that links Irish grid data and forecasts to a flexible EV charging plan.",
    "accent": "stp",
    "hero": "savetheplanet/current-dashboard",
    "caseStudy": {
      "overview": "SaveThePlanet was built by a four-person team at Hack the Climate in Dublin. We used Irish grid data to explore whether flexible charging could use energy that might otherwise be turned down.",
      "problem": "The grid can sometimes generate more renewable power than it can use or move. A flexible vehicle can wait for a better charging window if it still has time to reach the driver’s required charge.",
      "motivation": "We wanted to turn a grid forecast into a decision someone could actually understand and act on.",
      "responsibilities": [
        "Set the product scope, prioritised the demo and coordinated a four-person multidisciplinary team.",
        "Helped connect the forecasting, charging plan and dashboard into one prototype.",
        "Worked through an incentive model that explains how benefits might be shared if the approach were deployed."
      ],
      "media": [
        {
          "key": "savetheplanet/current-impact",
          "caption": "The impact screen shows an illustrative savings split. The prototype has no measured charging or emissions outcomes.",
          "alt": "SaveThePlanet impact screen showing a simulated benefit and how it could be split."
        },
        {
          "key": "savetheplanet/recorded-forecast",
          "caption": "Replay of a day of recorded wind and solar curtailment alongside an experimental forecast.",
          "alt": "SaveThePlanet forecast detail comparing recorded wind and solar curtailment with a predicted period."
        }
      ],
      "architecture": {
        "caption": "Every value on screen carries its provenance: recorded, predicted, deterministic or simulated.",
        "layers": [
          [
            "Data",
            [
              "EirGrid dispatch-down records (real)",
              "GridToEv +30 / +60 min predictions (real model output)",
              "Fleet & site presets (simulated)"
            ]
          ],
          [
            "Backend · Python",
            [
              "Targets chosen from predictions only",
              "Constraint-aware charging optimiser",
              "Offers & incentive split",
              "Battery / hydrogen scenarios"
            ]
          ],
          [
            "Frontend · JavaScript",
            [
              "Dashboard",
              "Forecast",
              "Charging",
              "Impact"
            ]
          ],
          [
            "Evidence",
            [
              "Evidence ledger (E1–E20)",
              "Deterministic demo fallback",
              "475 documented tests"
            ]
          ]
        ]
      },
      "challenges": [
        {
          "title": "A good forecast is not a feasible charge",
          "body": "The optimiser checks every plan against hard constraints — site power limits, charger counts and rates, and each car's arrival, departure and energy need — and reports why a vehicle could not be served, most fundamental reason first. A tempting forecast that the fleet can't actually absorb is shown as such.",
          "code": {
            "lang": "python",
            "label": "backend/optimizer.py — excerpt",
            "text": "def check_plan(plan):\n    \"\"\"Every hard-constraint violation in a plan (empty list when feasible).\"\"\"\n    problems = []\n    for vehicle in plan.fleet['vehicles']:\n        vid, site = vehicle['id'], plan.sites[vehicle['site']]\n        for slot, energy in plan.alloc[vid].items():\n            if slot not in plan.available[vid]:\n                problems.append(f'{vid}: charged while not plugged in (slot {slot})')\n            if energy > min(vehicle['maxKw'], site['chargerKw']) * SLOT_HOURS + EPS:\n                problems.append(f'{vid}: exceeds vehicle/charger rate in slot {slot}')\n    # ...site power and charger-count checks per half-hour\n    return problems"
          }
        },
        {
          "title": "No look-ahead, no wishful thinking",
          "body": "The demo replays real history, so it would have been easy to cheat. Offers lock 30 minutes before a window and are chosen from predictions only; +60 forecasts are never mixed with +30. Tests enforce both rules."
        }
      ],
      "decisions": [
        [
          "Use case",
          "EV charging as the first flexible load",
          "Batteries, heat pumps, data centres",
          "Focused and demoable in days; other loads left as next steps."
        ],
        [
          "Incentive",
          "Share the incremental saving 50 / 25 / 25 (driver / operator / platform)",
          "Flat discount",
          "Drivers get a reason to shift; offers are rejected when ordinary smart charging is already cheaper."
        ],
        [
          "Demo reliability",
          "Known-good replay scenario as fallback",
          "Live feeds only",
          "The story works even if a network dependency fails on stage."
        ]
      ],
      "testing": "We replayed historical scenarios and checked the scheduling constraints with automated tests. The browser also includes offline example data for demonstrations.",
      "lessons": [
        "Start with the constraints that matter to the driver and the charging equipment, then optimise within them.",
        "Keep historical data, forecasts and simulated outcomes labelled separately so the demo is easy to interpret."
      ],
      "statusText": "The prototype is available as source code. It was demonstrated with historical data and simulated scenarios. It has no measured real-world charging or emissions outcome.",
      "links": [
        [
          "Source on GitHub",
          "https://github.com/MarcoLadeira/SaveThePlanet"
        ],
        ["Watch the hackathon demo", "https://www.youtube.com/watch?v=l3k8zUsx8Ng"]
      ]
    }
  }
];

export const archive = [
  {
    "name": "NASA Space Explorer",
    "year": "2025",
    "kind": "Full-stack web",
    "text": "React, TypeScript and an Express API wrapping five NASA open APIs (APOD, Mars Rover, EPIC, NEO, media search), with React Query caching and route tests. The hosted demo has been retired; the source and deployment notes remain.",
    "stack": [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "Docker"
    ],
    "links": [
      [
        "Source",
        "https://github.com/MarcoLadeira/NasaAPI"
      ]
    ]
  },
  {
    "name": "ORO Patient App",
    "year": "2025",
    "kind": "Final-year team project",
    "text": "I led front-end development of the ORO patient app and managed project work in Mahara. The team built the smart dispenser, patient app, pharmacist app and server, then demonstrated them together at the DkIT Computing Expo 2025.",
    "stack": [
      "Ionic",
      "JavaScript",
      "Go",
      "Python"
    ],
    "links": [
      [
        "Team repository",
        "https://github.com/Mayv-dev/PharmaCube"
      ]
    ]
  },
  {
    "name": "Achievr",
    "year": "2025",
    "kind": "Native iOS",
    "text": "A goal-tracking iOS app built natively in Swift with UIKit and GRDB/SQLite for local persistence.",
    "stack": [
      "Swift",
      "UIKit",
      "SQLite",
      "GRDB"
    ],
    "links": [
      [
        "Source",
        "https://github.com/MarcoLadeira/iosMobileApp"
      ]
    ]
  }
];
