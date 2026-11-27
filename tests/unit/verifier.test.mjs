import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.document = { querySelectorAll: () => [] }; // module mounts nothing under Node
const { makeBoard, check, repairs } = await import("../../assets/js/verifier.js");

test("every generated demo board is broken but fixable by one swap", () => {
  for (const goal of ["rows", "columns", "latin", "cross", "mirror"]) {
    for (let seed = 1; seed < 300; seed++) {
      const b = makeBoard(goal, seed);
      assert.ok(b, `${goal}#${seed} generated`);
      assert.equal(check(b, goal), false, `${goal}#${seed} starts broken`);
      const fixes = repairs(b, goal);
      assert.ok(fixes.length >= 1, `${goal}#${seed} has a fix`);
      for (const [a, c] of fixes) {
        const t = b.map((g, i) => (i === a ? b[c] : i === c ? b[a] : g));
        assert.ok(check(t, goal));
      }
    }
  }
});

test("the checker reads rules literally", () => {
  const g = (shape, coat = "solid") => ({ shape, coat });
  const rows = ["circle", "circle", "circle", "square", "square", "square", "diamond", "diamond", "diamond"].map((s) => g(s));
  assert.ok(check(rows, "rows"));
  assert.ok(!check(rows, "columns"));
  const latin = ["circle", "square", "diamond", "square", "diamond", "circle", "diamond", "circle", "square"].map((s) => g(s));
  assert.ok(check(latin, "latin"));
});
