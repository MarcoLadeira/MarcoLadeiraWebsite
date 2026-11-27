// A small, honest re-creation of ONE Oddlings' board rules for the case study.
// The goal checker mirrors src/experiments/fix/arcade/verify.ts in the game:
// it reads literal rows and columns and shares nothing with the generator below.

const SHAPES = ["circle", "square", "triangle", "diamond"];
const GOALS = {
  rows: { title: "Row buddies", rule: "Same shape across each row." },
  columns: { title: "Stand together", rule: "Same shape down each column." },
  latin: { title: "No repeats", rule: "No shape twice in any row or column." },
  cross: { title: "Cross purposes", rule: "Columns share a shape; rows share a coat." },
  mirror: { title: "Looking glass", rule: "Each row reads the same from both ends." },
};

// ---- independent checker (ported from the game) ----
const rowsOf = (v) => [v.slice(0, 3), v.slice(3, 6), v.slice(6, 9)];
const colsOf = (v) => [0, 1, 2].map((c) => v.filter((_, i) => i % 3 === c));
const same = (lines) => lines.every((l) => l[0] === l[1] && l[1] === l[2]);
const different = (lines) => lines.every(([a, b, c]) => a !== b && b !== c && a !== c);
const mirror = (v) => rowsOf(v).every((l) => l[0] === l[2]);
export function check(grid, goal) {
  const shape = grid.map((g) => g.shape);
  const coat = grid.map((g) => g.coat);
  switch (goal) {
    case "rows": return same(rowsOf(shape));
    case "columns": return same(colsOf(shape));
    case "latin": return different(rowsOf(shape)) && different(colsOf(shape));
    case "cross": return same(colsOf(shape)) && same(rowsOf(coat));
    case "mirror": return mirror(shape) && mirror(coat);
    default: return false;
  }
}
const look = (g) => `${g.coat}-${g.shape}`;
export function repairs(grid, goal) {
  const found = [];
  for (let a = 0; a < 8; a++)
    for (let b = a + 1; b < 9; b++) {
      if (look(grid[a]) === look(grid[b])) continue;
      const t = grid.map((g, i) => (i === a ? grid[b] : i === b ? grid[a] : g));
      if (check(t, goal)) found.push([a, b]);
    }
  return found;
}

// ---- generator: a finished picture, broken by one swap ----
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function solved(goal, r) {
  const [a, b, c] = shuffle(r, SHAPES);
  const g = (shape, coat = "solid") => ({ shape, coat });
  switch (goal) {
    case "rows": return [a, a, a, b, b, b, c, c, c].map((s) => g(s));
    case "columns": return [a, b, c, a, b, c, a, b, c].map((s) => g(s));
    case "latin": return [a, b, c, b, c, a, c, a, b].map((s) => g(s));
    case "cross": {
      const coats = shuffle(r, ["solid", "outline", "solid"]);
      return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => g([a, b, c][i % 3], coats[Math.floor(i / 3)]));
    }
    case "mirror": {
      const row = () => { const e = pick(r, SHAPES), m = pick(r, SHAPES), coat = pick(r, ["solid", "outline"]); return [g(e, coat), g(m, pick(r, ["solid", "outline"])), g(e, coat)]; };
      return [...row(), ...row(), ...row()];
    }
  }
}
export function makeBoard(goal, seed) {
  const r = rng(seed);
  for (let tries = 0; tries < 200; tries++) {
    const done = solved(goal, r);
    const a = Math.floor(r() * 9), b = Math.floor(r() * 9);
    if (a === b || look(done[a]) === look(done[b])) continue;
    const broken = done.map((x, i) => (i === a ? done[b] : i === b ? done[a] : x));
    if (!check(broken, goal) && repairs(broken, goal).length) return broken;
  }
  return null;
}

// ---- UI ----
const GLYPH = {
  circle: '<circle cx="20" cy="20" r="13"/>',
  square: '<rect x="8" y="8" width="24" height="24" rx="2"/>',
  triangle: '<path d="M20 6 34 32H6Z"/>',
  diamond: '<path d="M20 5 35 20 20 35 5 20Z"/>',
};
const svg = (g) => `<svg viewBox="0 0 40 40" aria-hidden="true" class="vf-glyph vf-${g.shape} vf-${g.coat}">${GLYPH[g.shape]}</svg>`;
const name = (g) => `${g.coat === "outline" ? "outlined" : "solid"} ${g.shape}`;

function mount(root) {
  const order = Object.keys(GOALS);
  let gi = 0, seed = 7, grid, picked = null, fixed = false, moves = 0, hint = [];
  const board = root.querySelector("[data-vf-board]");
  const goalEl = root.querySelector("[data-vf-goal]");
  const out = root.querySelector("[data-vf-out]");
  const status = root.querySelector("[data-vf-status]");

  function newBoard() {
    const goal = order[gi % order.length];
    grid = makeBoard(goal, seed++);
    picked = null; fixed = false; moves = 0; hint = [];
    goalEl.innerHTML = `<strong>${GOALS[goal].title}</strong> — ${GOALS[goal].rule}`;
    render();
    const n = repairs(grid, goal).length;
    out.textContent = `Checker: this board breaks the goal, and ${n} swap${n === 1 ? "" : "s"} would fix it.`;
  }
  function render() {
    board.innerHTML = grid
      .map((g, i) => `<button type="button" class="vf-cell${picked === i ? " is-picked" : ""}${fixed ? " is-fixed" : ""}${hint.includes(i) ? " is-hint" : ""}" data-i="${i}" aria-pressed="${picked === i}" aria-label="Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${name(g)}">${svg(g)}</button>`)
      .join("");
  }
  board.addEventListener("click", (e) => {
    const cell = e.target.closest("[data-i]");
    if (!cell || fixed) return;
    const i = Number(cell.dataset.i);
    if (picked === null) { picked = i; render(); board.querySelector(`[data-i="${i}"]`).focus(); return; }
    if (picked === i) { picked = null; render(); board.querySelector(`[data-i="${i}"]`).focus(); return; }
    const goal = order[gi % order.length];
    const a = picked, b = i;
    const trial = grid.map((g, k) => (k === a ? grid[b] : k === b ? grid[a] : g));
    moves++;
    picked = null;
    if (check(trial, goal)) {
      grid = trial; fixed = true; hint = []; render();
      const msg = `Fixed in ${moves} ${moves === 1 ? "try" : "tries"}. The checker confirms every line holds.`;
      out.textContent = msg; status.textContent = msg;
    } else {
      render();
      const msg = "Not that pair — the checker found a line that still breaks the goal. The board is unchanged.";
      out.textContent = msg; status.textContent = msg;
      board.querySelector(`[data-i="${b}"]`).focus();
    }
  });
  root.querySelector("[data-vf-next]").addEventListener("click", () => { gi++; newBoard(); });
  root.querySelector("[data-vf-hint]").addEventListener("click", () => {
    const [a, b] = repairs(grid, order[gi % order.length])[0] || [];
    if (a === undefined) return;
    hint = [a, b];
    render();
    status.textContent = `Hint: swap row ${Math.floor(a / 3) + 1} column ${(a % 3) + 1} with row ${Math.floor(b / 3) + 1} column ${(b % 3) + 1}.`;
  });
  root.hidden = false;
  root.parentElement.querySelector("[data-vf-fallback]")?.remove();
  newBoard();
}

document.querySelectorAll("[data-verifier]").forEach(mount);
