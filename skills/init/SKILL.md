---
name: init
description: Set up the dev loop in a new project. Reads the repository to propose .dev-loop/config.json (checks, rules, top architecture characteristics, trust boundaries), then creates the requirement template and learnings files. Use when the user wants to add the dev loop to a project or /devloop:run says the config is missing.
---

Set up the project half of the dev loop in the current repository. The engine
already lives in this plugin; this creates only what differs per project.

## 1. Look before asking

Read the repository: the language and package manager, the test and type-check
commands (package.json scripts, build.gradle, pyproject, Makefile), any
`CLAUDE.md`, `AGENTS.md`, contributing guide or task list, and whether
`.dev-loop/` already exists. If it does, stop and offer to review the existing
config instead of overwriting it.

## 2. Propose, then confirm

Draft `.dev-loop/config.json` from `${CLAUDE_PLUGIN_ROOT}/templates/config.json`,
filling every value you could find. Then use the question tool, at most four
questions per call, recommended option first, for what you could not find:

- **Top three architecture characteristics**, in priority order. Offer the
  likeliest from what the project does (for an online store: data integrity,
  payment security, cost). Explain in one line why only three: the architect
  agent weighs every plan against these, and a list of ten weighs nothing.
- **Trust boundaries**: every place outside input enters (HTTP routes,
  webhooks, uploads, queues, email replies). Offer what you found in the code.
- **Sensitive data**: what must never be logged or leaked.
- **Whether the loop's files are committed or kept local.** Some projects keep
  `.dev-loop/`, the rules and the learnings out of git; ask, and add them to
  `.gitignore` only if the answer is local.
- **Whether this is a new application or existing code.** Recommend whichever the
  repository suggests. New sets `blueprint.required` to true, so the loop waits
  for the six documents `/devloop:blueprint` produces. Existing sets it to false,
  and the loop works as it did without a blueprint.
- **Test-first development**, only if `superpowers:` skills are available in this
  session. Yes sets `superpowers.tdd` to true, so Execute writes a failing test
  before any code and deletes code written without one. No sets it to false.

## 3. Create the files

Only create what does not exist:

- `.dev-loop/config.json` (the confirmed draft)
- `.dev-loop/state.json` with `{"_comment": "...", "scanned": {}}`
- `<requirements.dir>/_template.md` from
  `${CLAUDE_PLUGIN_ROOT}/templates/requirement.md`
- `learnings.file` from `${CLAUDE_PLUGIN_ROOT}/templates/LEARNINGS.md`
- If there is no rules file at all, a short `CLAUDE.md` with a Commands
  section and an empty "Rules that break things silently" section, and say
  that filling it is the most valuable thing the developer can do next.
- If `superpowers:` skills are available in this session, add
  `${CLAUDE_PLUGIN_ROOT}/templates/superpowers-rule.md` to the rules file, unless
  it already has a "Superpowers and the dev loop" section. Without this rule,
  those skills compete with the loop's gates.

## 4. Hand off

Show the config and list the files created. With the question tool, offer
`/devloop:blueprint` as the next step if `blueprint.required` is true, otherwise
`/devloop:requirement`.
