// Tests for the blueprint commands of detect.mjs, and for the older commands they
// must leave alone. Each test builds a throwaway project and runs the real script
// in it, because the script's contract is its output and exit code.
//
// Run with: node --test scripts/detect.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "detect.mjs");
const ORDER = ["prd", "trd", "app-flow", "ui-ux", "backend-schema", "implementation-plan"];

function project(t, blueprint = { required: true, dir: "docs/blueprint" }) {
  const root = mkdtempSync(join(tmpdir(), "devloop-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, ".dev-loop"));
  mkdirSync(join(root, "docs/blueprint"), { recursive: true });
  mkdirSync(join(root, "requirements"));
  const config = blueprint ? { blueprint } : {};
  writeFileSync(join(root, ".dev-loop/config.json"), JSON.stringify(config));
  return root;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: root, encoding: "utf8" });
}

function report(root) {
  const result = run(root, "--blueprint");
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function statusOf(root, id) {
  return report(root).docs.find((doc) => doc.id === id).status;
}

function write(root, id, text = `# ${id}\n`) {
  writeFileSync(join(root, "docs/blueprint", `${id}.md`), text);
}

function approveAll(root) {
  write(root, "prd", "# prd\nF-1 and F-2\n");
  for (const id of ORDER.slice(1, -1)) write(root, id);
  write(root, "implementation-plan", "# plan\nCovers F-1 and F-2\n");
  for (const id of ORDER) assert.equal(run(root, "--approve", id).status, 0);
}

test("no blueprint key: the project is not blocked and nothing is reported", (t) => {
  const root = project(t, null);
  assert.deepEqual(report(root), { required: false, ready: true, next: null, docs: [], uncovered: [] });
});

test("no blueprint key: --approve is refused", (t) => {
  const root = project(t, null);
  assert.equal(run(root, "--approve", "prd").status, 1);
});

test("required: false reports status but does not block", (t) => {
  const root = project(t, { required: false });
  const result = report(root);
  assert.equal(result.ready, true);
  assert.equal(result.next, "prd");
  assert.equal(result.docs[0].status, "missing");
});

test("required with no documents: all missing, not ready, starts at the PRD", (t) => {
  const root = project(t);
  const result = report(root);
  assert.equal(result.ready, false);
  assert.equal(result.next, "prd");
  assert.deepEqual(result.docs.map((doc) => doc.id), ORDER);
  assert.ok(result.docs.every((doc) => doc.status === "missing"));
});

test("a written but unapproved document is a draft", (t) => {
  const root = project(t);
  write(root, "prd");
  assert.equal(statusOf(root, "prd"), "draft");
});

test("all six approved and covered: ready", (t) => {
  const root = project(t);
  approveAll(root);
  const result = report(root);
  assert.equal(result.ready, true);
  assert.equal(result.next, null);
  assert.ok(result.docs.every((doc) => doc.status === "approved"));
});

test("editing an approved document marks it edited and its dependents stale", (t) => {
  const root = project(t);
  approveAll(root);
  write(root, "trd", "# trd, changed\n");
  const result = report(root);
  assert.equal(result.ready, false);
  assert.equal(result.next, "trd");
  assert.equal(statusOf(root, "prd"), "approved");
  assert.equal(statusOf(root, "trd"), "edited");
  assert.equal(statusOf(root, "app-flow"), "approved", "app-flow is not built on the trd");
  assert.equal(statusOf(root, "backend-schema"), "stale");
  assert.equal(statusOf(root, "implementation-plan"), "stale");
});

test("re-approving clears edited, and confirming clears stale", (t) => {
  const root = project(t);
  approveAll(root);
  write(root, "trd", "# trd, changed\n");
  assert.equal(run(root, "--approve", "trd").status, 0);
  assert.equal(statusOf(root, "trd"), "approved");
  assert.equal(run(root, "--approve", "backend-schema").status, 0);
  assert.equal(run(root, "--approve", "implementation-plan").status, 0);
  assert.equal(report(root).ready, true);
});

test("a line-ending change alone does not invalidate an approval", (t) => {
  const root = project(t);
  write(root, "prd", "# prd\nline two\n");
  assert.equal(run(root, "--approve", "prd").status, 0);
  write(root, "prd", "# prd\r\nline two\r\n");
  assert.equal(statusOf(root, "prd"), "approved");
});

test("--approve refuses a missing file and an unknown id, leaving state alone", (t) => {
  const root = project(t);
  assert.equal(run(root, "--approve", "prd").status, 1);
  assert.equal(run(root, "--approve", "nonsense").status, 1);
  assert.equal(run(root, "--approve").status, 1);
  assert.equal(statusOf(root, "prd"), "missing");
});

test("--approve refuses a document with placeholders left in it", (t) => {
  const root = project(t);
  write(root, "prd", "# prd\n<fill: the problem>\n");
  const result = run(root, "--approve", "prd");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /placeholders/);
  assert.equal(statusOf(root, "prd"), "draft");
});

test("--approve refuses until the documents it depends on are approved", (t) => {
  const root = project(t);
  write(root, "prd");
  write(root, "trd");
  const result = run(root, "--approve", "trd");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /prd is draft/);
  assert.equal(statusOf(root, "trd"), "draft");
});

test("the plan cannot be approved while a PRD feature is uncovered", (t) => {
  const root = project(t);
  write(root, "prd", "# prd\nF-1, F-2 and F-10\n");
  for (const id of ORDER.slice(1, -1)) write(root, id);
  for (const id of ORDER.slice(0, -1)) assert.equal(run(root, "--approve", id).status, 0);
  // F-1 is mentioned only as part of F-10 style text, which must not count.
  write(root, "implementation-plan", "# plan\nCovers F-10 and F-2\n");
  assert.deepEqual(report(root).uncovered, ["F-1"]);
  const result = run(root, "--approve", "implementation-plan");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /F-1\b/);
  write(root, "implementation-plan", "# plan\nCovers F-1, F-2 and F-10\n");
  assert.equal(run(root, "--approve", "implementation-plan").status, 0);
  assert.equal(report(root).ready, true);
});

test("the default detect and --mark still work, and keep blueprint state", (t) => {
  const root = project(t);
  approveAll(root);
  writeFileSync(join(root, "requirements/1.9-a.md"), "a");
  writeFileSync(join(root, "requirements/1.10-b.md"), "b");
  writeFileSync(join(root, "requirements/_notes.md"), "ignored");

  const before = JSON.parse(run(root).stdout);
  assert.deepEqual(before.changed.map((entry) => entry.status), ["new", "new"]);
  assert.match(before.changed[0].file, /1\.9-a\.md$/);

  assert.equal(run(root, "--mark", "requirements/1.9-a.md").status, 0);
  const after = JSON.parse(run(root).stdout);
  assert.equal(after.unchanged, 1);
  assert.equal(after.changed.length, 1);

  const state = JSON.parse(readFileSync(join(root, ".dev-loop/state.json"), "utf8"));
  assert.ok(state.blueprint.prd.hash);
  assert.equal(report(root).ready, true);
});

test("every shipped template is refused until it has been filled in", (t) => {
  const root = project(t);
  const templates = join(dirname(SCRIPT), "..", "templates", "blueprint");
  const prd = readFileSync(join(templates, "prd.md"), "utf8");
  write(root, "prd", prd);
  assert.equal(run(root, "--approve", "prd").status, 1);
  // Clear the way so each later template is refused for its own markers, not
  // because the document before it was unapproved.
  write(root, "prd", "# prd\n");
  assert.equal(run(root, "--approve", "prd").status, 0);
  for (const id of ORDER.slice(1)) {
    write(root, id, readFileSync(join(templates, `${id}.md`), "utf8"));
    const refused = run(root, "--approve", id);
    assert.equal(refused.status, 1, id);
    assert.match(refused.stderr, /placeholders/, id);
    write(root, id);
    assert.equal(run(root, "--approve", id).status, 0, id);
  }
});

test("the shipped learnings template holds no real entries", () => {
  const template = readFileSync(join(dirname(SCRIPT), "..", "templates", "LEARNINGS.md"), "utf8");
  assert.doesNotMatch(template, /^## \d/m, "learnings belong to the project that produced them");
});

test("every section the principles index lists or routes to has its file", () => {
  const references = join(dirname(SCRIPT), "..", "references");
  const index = readFileSync(join(references, "engineering-principles.md"), "utf8");
  const sections = index.split("## Sections")[1].split("## Sources")[0];
  const listed = [...sections.matchAll(/^\| ([A-Z]+) \|/gm)].map((match) => match[1]);
  assert.equal(listed.length, 13);
  for (const code of listed) {
    assert.ok(existsSync(join(references, "principles", `${code.toLowerCase()}.md`)), code);
  }
  const routing = index.split("## Routing")[1].split("## Sections")[0];
  const routed = routing.match(/\b[A-Z]{3,}\b/g).filter((word) => !["PRD", "TRD"].includes(word));
  for (const code of routed) assert.ok(listed.includes(code), `routed but not listed: ${code}`);
});

test("a missing config is an error, not a ready blueprint", (t) => {
  const root = project(t);
  rmSync(join(root, ".dev-loop/config.json"));
  assert.equal(run(root, "--blueprint").status, 1);
});
