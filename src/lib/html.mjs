// Minimal, dependency-free HTML templating with escaping by default.
// `html` escapes every interpolated value unless it is wrapped in `raw()`
// or is itself the result of an `html` call. Arrays are flattened.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

class Safe {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new Safe(String(value ?? ""));

export function escape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
}

function render(value) {
  if (value === null || value === undefined || value === false) return "";
  if (value instanceof Safe) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  return escape(value);
}

export function html(strings, ...values) {
  let out = "";
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) out += render(values[i]);
  });
  return new Safe(out);
}

/** Inline rich text: allows *emphasis* and [links](url) in data strings, escaping everything else. */
export function md(text) {
  let s = escape(text);
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links last, and only safe schemes.
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, href) => {
    if (!/^(https?:|mailto:|\/|#)/.test(href)) return label;
    const ext = /^https?:/.test(href);
    return `<a href="${href}"${ext ? ' rel="noopener"' : ""}>${label}</a>`;
  });
  return raw(s);
}
