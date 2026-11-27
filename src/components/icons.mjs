// Small, consistent line icons (1.5px stroke, 16px grid). Decorative: callers add aria-hidden or labels.
const p = (d, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;

const ICONS = {
  // Monogram: an M drawn as a single trace, ending in a node.
  mark: `<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><rect x="0.75" y="0.75" width="26.5" height="26.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 20V8l7 8 7-8v8.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="21" cy="20" r="2" fill="var(--signal)"/></svg>`,
  "arrow-ne": p('<path d="M5 11 11 5M6 5h5v5"/>', 12),
  "arrow-right": p('<path d="M3 8h10M9 4l4 4-4 4"/>'),
  download: p('<path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10"/>'),
  copy: p('<rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>'),
  check: p('<path d="m3 8.5 3 3 7-7"/>'),
  mail: p('<rect x="2" y="3.5" width="12" height="9" rx="1"/><path d="m2.5 4.5 5.5 4 5.5-4"/>'),
  play: p('<path d="M5 3.5v9l7-4.5z"/>'),
  lock: p('<rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>'),
};

export const icon = (name) => ICONS[name] || "";
