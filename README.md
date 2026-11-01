# devloop

A requirement-driven dev loop for Claude Code, packaged as a plugin so every
project runs the same loop.

**Engine shared, config local.** This repository holds what is the same
everywhere: the loop, the blueprint stage, the requirement interview, four
read-only agents and the engineering principles they all apply. Each project holds what differs in one file, `.dev-loop/config.json`.

## The loop

```
Blueprint (new applications, once): PRD -> TRD -> App Flow -> UI/UX Design
       -> Backend Schema -> Implementation Plan, each approved by you

Blueprint check -> Detect -> Scan -> Plan -> Architecture review -> GATE 1
       -> Execute -> Test -> Security review -> GATE 2 -> Record -> Update state
```

| Piece | Kind | Job |
|---|---|---|
| `/devloop:blueprint` | skill | Produces and approves the six documents an application needs before code |
| `/devloop:run` | skill | Runs the loop; the main session is the only writer |
| `/devloop:requirement` | skill | Interviews you and writes one requirement file |
| `/devloop:init` | skill | Sets up `.dev-loop/` in a new project |
| `scout` | agent | Reads rules, learnings and code; returns a briefing |
| `architect` | agent | Reviews the plan before Gate 1 |
| `test-runner` | agent | Runs the configured checks; reports failures only |
| `security-reviewer` | agent | Reviews the diff before Gate 2 (and the plan when a trust boundary is crossed) |
| `scripts/detect.mjs` | script | Hashes requirement and blueprint files against `.dev-loop/state.json` |
| `references/engineering-principles.md` | reference | Index to rules from eight engineering books, routed to each loop step and blueprint document |
| `references/principles/` | reference | The rules, one file per section, so each step loads only what applies |

Agents never edit files, never change git state and never ask you anything.
Their questions come back to the main session, which asks you.

## Add devloop and Superpowers to a project

Superpowers is optional. To use devloop alone, skip the Superpowers lines below.
Run these in a terminal, from the project's root folder.

**1. Add the devloop marketplace.** Use the GitHub line once this repository is
published there, or the folder line for a local copy:

```
claude plugin marketplace add ElijahSean/devloop --scope project
claude plugin marketplace add "C:\path\to\devloop" --scope project
```

A folder path only works on your machine, so teammates need the GitHub line.

**2. Install both plugins for this project.** Both must be in place before step 4:

```
claude plugin install devloop@devloop --scope project
claude plugin install superpowers@claude-plugins-official --scope project
```

If Claude says it cannot find `claude-plugins-official`, first run
`claude plugin marketplace add anthropics/claude-plugins-official`.

**3. Check, then start a new Claude session.** Plugins and the Superpowers startup
hook only load when a session starts.

```
claude plugin list
```

Both plugins should show as enabled.

**4. Set up the project.** In the new session:

```
/devloop:init
```

It writes `.dev-loop/config.json` and asks what it could not work out, including
whether this is a new application and whether you want test-first development. It
also adds the Superpowers rule to your rules file, usually `CLAUDE.md`. That rule
keeps Superpowers' other skills out of the loop, so check that the section
"Superpowers and the dev loop" is there.

**5. Commit the setup.** Commit `.claude/settings.json` so anyone who clones the
project is offered the same plugins, along with `CLAUDE.md`. Commit `.dev-loop/`
too, unless you chose at step 4 to keep the loop's files local.

**6. Start working.**

| Project | Next command |
|---|---|
| New application | `/devloop:blueprint`, then `/devloop:requirement <task ID>`, then `/devloop:run` |
| Existing code | `/devloop:requirement "<the change>"`, then `/devloop:run` |

**If the project already has devloop:** `/devloop:init` will not touch an existing
`.dev-loop/`. Install Superpowers as in step 2 and start a new session. Then
`/devloop:run` offers to add the rule. To turn on test-first development, add
`"superpowers": { "tdd": true }` to `.dev-loop/config.json`.

**To get a newer devloop later:** run these in the project, then start a new
session:

```
claude plugin marketplace update devloop
claude plugin update devloop@devloop --scope project
```

## Using it

### 1. Set up a project (once)

```
/devloop:init
```

It reads the repo, drafts `.dev-loop/config.json`, and asks you only what it
could not find: your top three architecture characteristics, the trust
boundaries, what data is sensitive, whether the loop's files stay out of git,
and whether this is a new application. It then creates the requirement template,
the learnings file and an empty state file. It never overwrites an existing
`.dev-loop/`.

Pick the three characteristics carefully. The architect weighs every plan
against these and nothing else, so three honest ones beat ten vague ones.

### Blueprint a new application (once)

```
/devloop:blueprint
/devloop:blueprint trd
```

On a new application the loop will not start until six documents are approved.
The skill interviews you and drafts them one at a time in `docs/blueprint/`,
stopping for your approval after each:

| Order | Document | Holds | Also reviewed by |
|---|---|---|---|
| 1 | PRD | Problem, users, goals, non-goals, features with `F-n` IDs | |
| 2 | TRD | Architecture, stack, integrations, targets, security, decisions and their costs | `architect`, `security-reviewer` |
| 3 | App Flow | Journeys, screen map, state changes, error paths | |
| 4 | UI/UX Design | Principles, tokens, text wireframes, screen states, accessibility | |
| 5 | Backend Schema | Entities, constraints, indexes, access rules, API surface | `architect`, `security-reviewer` |
| 6 | Implementation Plan | Phases, tasks with dependencies, the `F-n` each covers, risks | `architect` |

A document that does not fit, such as UI/UX for a background service, still
exists and says why. When the plan is approved, its tasks are copied to
`docs.tasks`, and the design and decision paths in the config are set.

The script reports each document with one of these words:

| Status | Meaning | What to do |
|---|---|---|
| missing | The file does not exist | Draft it |
| draft | Never approved | Review and approve it |
| edited | Changed since you approved it | Approve the new text or restore it |
| stale | Unchanged, but a document it relies on changed | Revise it, or confirm it still holds |
| approved | Current | Nothing |

To change a decision later, run `/devloop:blueprint <id>`. Every document built
on it goes stale, and the loop stops until you have revised or confirmed each one.
That is deliberate: it is cheaper than building on a design that moved.

Existing projects are not affected. With `required` false, or with no `blueprint`
key at all, the loop works as it did before. Run `/devloop:blueprint` there only
if you want the documents; it describes the code as it stands.

### 2. Line up a change

```
/devloop:requirement 3.2
/devloop:requirement "add a CSV export to the reports page"
```

Give it a task ID or a short description. It checks the task's dependencies
and any overlapping requirement file, reads the rules and learnings, then
interviews you with clickable questions and writes one file in the
requirements folder. It writes no code.

### 3. Run the loop

```
/devloop:run
```

It picks the first new or edited requirement and works through the steps.
You are needed at exactly two points:

| You see | What to do |
|---|---|
| **Gate 1**: the plan, the architect's findings, the trade-offs being accepted | Approve, send back with changes, or reject. Nothing is written before you approve |
| **Gate 2**: the diff, test results, the security reviewer's findings and what was done about each | Read the diff, then approve or send back |

Between the gates it may stop early to ask a question, or after three failed
fixes on the same test, with what it tried. After Gate 2 approval it writes the
learnings entry and marks the requirement done. **That is the moment to run
`/compact`**, never mid-task.

If nothing changed it says so and stops. One requirement at a time.

**Small changes cost less.** A change of at most three files, with no schema
change, new dependency, shared interface, security-sensitive code or departure
from a rule or blueprint document, skips the architecture and security reviews.
Scan, Test and both gates still run. Gate 1 tells you the reviews are being
skipped and offers to run them anyway, and if the finished diff turns out bigger
than planned, they run before Gate 2.

### 4. Read a review

Both reviewers score each finding as impact (1 to 3) times likelihood (1 to 3):

| Score | Meaning | What the loop does |
|---|---|---|
| 6 or 9 | High | Fixes it, or turns it into a question for you, before the gate |
| 3 or 4 | Medium | Brings it to the gate as a trade-off you are accepting |
| 1 or 2 | Low | Listed, no action required |

Each security finding names the line that causes it and a test that would
prove it. A finding without a line is listed as an open question instead.

A finding that rests on an engineering principle also names its rule ID and
source, such as `DATA-2` (DDIA 7). Rules that passed are not listed.

### 5. Use an agent on its own

The agents also work outside the loop. Ask in plain words:

- "Use the devloop:architect agent to review this plan: ..." for a design you
  are weighing before writing a requirement.
- "Have devloop:security-reviewer review master~3..HEAD in diff mode" for
  commits made outside the loop.
- "Have devloop:security-reviewer review this plan in plan mode" for a feature
  that adds a webhook, an upload or a sign-in path.
- "Run devloop:test-runner, full run" for a check of the whole project.

They read `.dev-loop/config.json` either way, so the project's rules apply.

### 6. Tune it per project

Everything project-specific is in `.dev-loop/config.json`:

- **A new check**: add it to `checks`. Give it a `when` tag (for example
  `"when": "migration"`) to run it only when a plan sets that tag.
- **A test quirk** the runner keeps misreporting: add a line to `testNotes`.
- **A lesson learned twice**: the loop adds it to the rule check at the bottom
  of the requirement template for you, at Record.
- **A principle that does not fit**: write the project's rule in `docs.rules`.
  It wins over the engineering principles, and the report mentions the conflict.

### 7. Update the engine

Change a skill, agent or reference here, bump `version` in
`.claude-plugin/plugin.json`, commit and push. Then update each project with the
commands under
[Add devloop and Superpowers to a project](#add-devloop-and-superpowers-to-a-project).
There is nothing to copy.

### 8. Run it on a schedule

A scheduled task's prompt only needs to name the project and the skill, for
example "Run /devloop:run for the project at E:\my-project". The task must have the
devloop marketplace enabled, which needs this repo on GitHub.

### 9. Use it with Superpowers (optional)

Devloop works alone. [Superpowers](https://github.com/obra/superpowers) adds
useful habits inside the steps, but its other skills compete with the loop, so
install it per project, as described in
[Add devloop and Superpowers to a project](#add-devloop-and-superpowers-to-a-project),
and keep its rule in place.

`/devloop:init` adds the rule from `templates/superpowers-rule.md` to your rules
file, and `/devloop:run` offers to add it if it is missing. The rule relies on
Claude following it; nothing enforces it.

| Skill | Where it is used |
|---|---|
| `receiving-code-review` | Weighing review findings (steps 4 and 8, and the blueprint's reviews) |
| `test-driven-development` | Execute, only when `superpowers.tdd` is true |
| `systematic-debugging` | Test, within the three-attempt cap |
| `verification-before-completion` | Before Gate 2 |
| `writing-skills` | Editing skills, including devloop's own |

Every other Superpowers skill stays out, because devloop already owns that work
or forbids it: `brainstorming`, `writing-plans`, `executing-plans`,
`subagent-driven-development`, `requesting-code-review` and
`finishing-a-development-branch`, among others.

### Troubleshooting

- **"No .dev-loop/config.json"**: run `/devloop:init`.
- **"The blueprint is not ready"**: run `/devloop:blueprint`. It resumes at the
  first document that is not approved.
- **"No task covers F-n"**: the Implementation Plan never mentions that PRD
  feature. Add a task for it, or remove the feature from the PRD.
- **Detect cannot run** (no Node where the project lives): the loop hashes the
  files by hand instead, same result, just slower.
- **Every requirement shows as new**: `state.json` is keyed by file name. A
  renamed file is new by design.
- **Two agents with the same name**: the project still has its own copies in
  `.claude/agents/`. Delete them; the plugin's are `devloop:scout` and so on.

## Where the review principles come from

- `architect`: *Fundamentals of Software Architecture*, 2nd ed. (Richards and
  Ford) for trade-off analysis, characteristics, modularity, connascence,
  fitness functions, decision records and the risk matrix; *Designing
  Data-Intensive Applications* (Kleppmann) for transactions, write skew,
  idempotency, clocks, schema evolution and integrity.
- `security-reviewer`: the structural principles from the same two books, and
  the OWASP Top 10 and ASVS for concrete application checks, since neither book
  is a security book.

Both score findings with the book's impact x likelihood matrix, 1 to 9, so
"high" means the same thing in both reports.

`references/principles/` widens this to eight books, summarised in our own words: the two above, plus *Learning Domain-Driven Design* (Khononov),
*Software Engineering at Google* (Winters, Manshreck and Wright), *Serverless
Development on AWS* (Brisals and Hedger), *Docker: Up & Running*, 3rd ed. (Kane
and Matthias), *AI Engineering* (Huyen) and *The Staff Engineer's Path* (Reilly).
The routing table in `references/engineering-principles.md` says which rules apply
at each step. It adds no steps, removes
no gate and gives no agent the power to write. `docs.rules` wins over approved
blueprint documents, and both win over the principles.

## Developing the plugin

To install it in a project, see
[Add devloop and Superpowers to a project](#add-devloop-and-superpowers-to-a-project).

While developing the plugin itself, load it straight from disk:
`claude --plugin-dir ./devloop`. Test the script with
`node --test scripts/detect.test.mjs`.

## The config contract

See `templates/config.json` for every key with a note on what it does. The
short version:

| Key | Read by |
|---|---|
| `docs.*` | everything |
| `blueprint.*` | init, blueprint, run, requirement, scout, architect, security-reviewer |
| `superpowers.*` | init, run |
| `requirements`, `learnings`, `ruleCheckHeading` | init, run, requirement, scout |
| `checks`, `criticalTests` | test-runner, blueprint |
| `testNotes` | test-runner |
| `architecture.*` | init, architect, security-reviewer, requirement, blueprint |
| `security.*` | init, security-reviewer, run, requirement, blueprint |
| `git.*` | run, test-runner |

If a project needs something the engine cannot express, add a config key and
teach the engine to read it. Never put a project's name or command into the
engine.

Learnings stay in the project that produced them. This repository holds only the
blank template, and its `.gitignore` keeps a project's `.dev-loop/`, requirements,
blueprint and learnings files out if the loop is ever run here.
