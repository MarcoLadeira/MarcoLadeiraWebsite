// Essays and shorter notes. Bodies live in src/content/<slug>.html (the author's own words).
// URLs are preserved from the previous site: /writing/<slug>/ and /updates/<slug>/.

export const essays = [
  {
    slug: "hybrid-workflow-cli-mcp-agents",
    path: "writing/hybrid-workflow-cli-mcp-agents/",
    title: "The best AI workflow is hybrid",
    summary:
      "Not CLI versus MCP versus agents: knowing what each is good at, and composing them on purpose.",
    date: "2026-03-18",
    minutes: 3,
  },
  {
    slug: "software-engineering-in-the-age-of-ai",
    path: "writing/software-engineering-in-the-age-of-ai/",
    title: "Software engineering is moving toward systems judgment",
    summary:
      "AI isn't removing the need for engineers. It's moving the centre of gravity toward intent, interfaces and reliable boundaries.",
    date: "2025-12-24",
    minutes: 3,
  },
];

export const notes = [
  {
    slug: "aws-ml-specialty-and-current-ai-focus",
    path: "updates/aws-ml-specialty-and-current-ai-focus/",
    title: "AWS machine learning exam prep and what I’m working on",
    summary: "Notes on exam preparation, model integration and evaluation in production.",
    date: "2026-03-14",
    minutes: 1,
  },
  {
    slug: "fenergo-ai-initiative",
    path: "updates/fenergo-ai-initiative/",
    title: "Selected for Fenergo's first AI initiative",
    summary: "Moving from the core platform to bring practical AI tooling into enterprise financial software.",
    date: "2026-01-12",
    minutes: 1,
  },
  {
    slug: "first-months-at-fenergo",
    path: "updates/first-months-at-fenergo/",
    title: "First months at Fenergo",
    summary: "A fast education in event-driven backends: CQRS, optimistic concurrency, idempotency, EventStoreDB and DynamoDB.",
    date: "2025-10-31",
    minutes: 1,
  },
];
