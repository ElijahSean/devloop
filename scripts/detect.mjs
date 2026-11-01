#!/usr/bin/env node
// detect.mjs: the Detect and Update state steps of the dev loop.
//
// Why a script and not a prompt: hashing files is deterministic work. Asking the
// model to hash forty files is slow and can be wrong silently; a script is exact
// and costs no tokens. The model only reads the result.
//
// Usage (run from the project root):
//   node detect.mjs                 -> prints {"changed":[...], "unchanged": n} as JSON
//   node detect.mjs --mark <file>   -> records <file>'s current hash in state.json
//   node detect.mjs --blueprint     -> prints the status of the six blueprint documents as JSON
//   node detect.mjs --approve <id>  -> records the approval of one blueprint document
//
// Only Node built-ins are used, so the script runs in any project, including
// ones that are not JavaScript (a Java or Python repo), as long as Node exists.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const LOOP_DIR = join(ROOT, ".dev-loop");
const CONFIG_PATH = join(LOOP_DIR, "config.json");
const STATE_PATH = join(LOOP_DIR, "state.json");

// The config decides where requirements live, so a project that keeps them in
// docs/specs/ works without changing the engine. "requirements" is the default.
function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    fail(`No ${CONFIG_PATH}. Run /devloop:init in this project first.`);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

// state.json maps filename -> sha256. The _comment key is kept so a human who
// opens the file knows what it is; the loop never treats it as a requirement.
function loadState() {
  if (!existsSync(STATE_PATH)) {
    return {
      _comment:
        "Tracks which requirement files have already been scanned, keyed by filename, so a change is only picked up once per edit. Hash is sha256 of the file's bytes.",
      scanned: {},
    };
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf8"));
}

// Hash the raw bytes, not the decoded text. Decoding would normalise line
// endings or a BOM on some machines, and the same file would then hash
// differently on Windows and macOS, making every requirement look changed.
function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function requirementFiles(dir, template) {
  if (!existsSync(dir)) fail(`Requirements folder ${dir} does not exist.`);
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    // The template is the blank form, never work. Skip it by name, and skip any
    // file starting with _ so a project can keep other notes in the folder.
    .filter((name) => name !== basename(template ?? "") && !name.startsWith("_"))
    .sort(byTaskId);
}

// Sort "1.10-x.md" after "1.9-x.md" and "1.13a" after "1.13". A plain string
// sort puts 1.10 before 1.9, which would hand the loop work out of build order.
function byTaskId(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function detect() {
  const config = loadConfig();
  const dir = join(ROOT, config.requirements?.dir ?? "requirements");
  const state = loadState();
  const changed = [];
  let unchanged = 0;

  for (const name of requirementFiles(dir, config.requirements?.template)) {
    const hash = sha256(join(dir, name));
    const previous = state.scanned[name];
    if (previous === hash) {
      unchanged += 1;
    } else {
      changed.push({ file: join(config.requirements?.dir ?? "requirements", name), hash, status: previous ? "updated" : "new" });
    }
  }
  console.log(JSON.stringify({ changed, unchanged }, null, 2));
}

// Update state is a separate command on purpose. The loop marks a file only
// after it got through at least Plan, so a run that crashes during Scan picks
// the same file up again next time instead of losing it.
function mark(relativePath) {
  const full = join(ROOT, relativePath);
  if (!existsSync(full)) fail(`Cannot mark ${relativePath}: file not found.`);
  const state = loadState();
  state.scanned[basename(relativePath)] = sha256(full);
  mkdirSync(LOOP_DIR, { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  console.log(`marked ${basename(relativePath)}`);
}

// The documents in drafting order, each with the documents it is built on. The
// engine fixes these so every project's agents can rely on the same names; a
// project only chooses the folder.
const BLUEPRINT = [
  { id: "prd", deps: [] },
  { id: "trd", deps: ["prd"] },
  { id: "app-flow", deps: ["prd"] },
  { id: "ui-ux", deps: ["prd", "app-flow"] },
  { id: "backend-schema", deps: ["prd", "trd", "app-flow"] },
  { id: "implementation-plan", deps: ["prd", "trd", "app-flow", "ui-ux", "backend-schema"] },
];
const UNFILLED = "<fill:";

// Unlike a requirement, an approved document blocks the loop when its hash moves.
// A false "edited" on a checkout with different line endings would stop every
// run, so these hashes are taken over the text with CRLF converted to LF.
function textHash(path) {
  const text = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  return createHash("sha256").update(text).digest("hex");
}

function blueprintDir(config) {
  return config.blueprint?.dir ?? "docs/blueprint";
}

function docPath(config, id) {
  return join(ROOT, blueprintDir(config), `${id}.md`);
}

function currentHash(config, id) {
  const path = docPath(config, id);
  return existsSync(path) ? textHash(path) : null;
}

// First match wins, so a document is only called stale once its own text is
// known to be the approved text.
function docStatus(config, state, doc) {
  const hash = currentHash(config, doc.id);
  const approval = state.blueprint?.[doc.id];
  if (hash === null) return "missing";
  if (!approval) return "draft";
  if (approval.hash !== hash) return "edited";
  const moved = doc.deps.some((dep) => approval.basedOn?.[dep] !== currentHash(config, dep));
  return moved ? "stale" : "approved";
}

function featureIds(path) {
  return existsSync(path) ? (readFileSync(path, "utf8").match(/\bF-\d+\b/g) ?? []) : [];
}

// A feature the plan never mentions is a feature nobody will build. Checked here
// because a rule with no automated check drifts.
function uncoveredFeatures(config) {
  const planPath = docPath(config, "implementation-plan");
  if (!existsSync(planPath)) return [];
  const planned = new Set(featureIds(planPath));
  const features = new Set(featureIds(docPath(config, "prd")));
  return [...features].filter((id) => !planned.has(id));
}

function blueprint() {
  const config = loadConfig();
  // No key means the project never opted in, and the loop must behave as it did
  // before this stage existed.
  if (!config.blueprint) {
    console.log(JSON.stringify({ required: false, ready: true, next: null, docs: [], uncovered: [] }, null, 2));
    return;
  }
  const state = loadState();
  const docs = BLUEPRINT.map((doc) => ({
    id: doc.id,
    file: `${blueprintDir(config)}/${doc.id}.md`,
    status: docStatus(config, state, doc),
  }));
  const uncovered = uncoveredFeatures(config);
  const required = config.blueprint.required === true;
  const complete = docs.every((doc) => doc.status === "approved") && uncovered.length === 0;
  const next = docs.find((doc) => doc.status !== "approved")?.id ?? null;
  console.log(JSON.stringify({ required, ready: !required || complete, next, docs, uncovered }, null, 2));
}

// Recording approval is the developer's decision, so the main session calls this
// only after they choose Approve. The refusals below are what the script can
// prove; whether the document is any good stays with the developer.
function approve(id) {
  const config = loadConfig();
  if (!config.blueprint) fail("No blueprint key in .dev-loop/config.json. Add one first.");
  const doc = BLUEPRINT.find((entry) => entry.id === id);
  if (!doc) fail(`Unknown document ${id}. Expected one of: ${BLUEPRINT.map((entry) => entry.id).join(", ")}.`);
  const path = docPath(config, id);
  if (!existsSync(path)) fail(`Cannot approve ${id}: ${path} not found.`);
  if (readFileSync(path, "utf8").includes(UNFILLED)) fail(`Cannot approve ${id}: it still contains ${UNFILLED} placeholders.`);

  const state = loadState();
  const byId = new Map(BLUEPRINT.map((entry) => [entry.id, entry]));
  for (const dep of doc.deps) {
    const status = docStatus(config, state, byId.get(dep));
    if (status !== "approved") fail(`Cannot approve ${id}: ${dep} is ${status}. Approve it first.`);
  }
  if (id === "implementation-plan") {
    const uncovered = uncoveredFeatures(config);
    if (uncovered.length > 0) fail(`Cannot approve ${id}: no task covers ${uncovered.join(", ")}.`);
  }

  state.blueprint ??= {};
  state.blueprint[id] = {
    hash: currentHash(config, id),
    approvedAt: new Date().toISOString(),
    basedOn: Object.fromEntries(doc.deps.map((dep) => [dep, currentHash(config, dep)])),
  };
  mkdirSync(LOOP_DIR, { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  console.log(`approved ${id}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const [flag, arg] = process.argv.slice(2);
if (flag === "--mark") mark(arg);
else if (flag === "--blueprint") blueprint();
else if (flag === "--approve") approve(arg);
else detect();
