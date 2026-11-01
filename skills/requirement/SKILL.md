---
name: requirement
description: Interview the developer and write one complete requirement file for the dev loop, checking dependencies and overlap first. Use when they want to add a requirement, spec a feature, or line up the next dev-loop task. Argument is a task ID or a short description of the change.
argument-hint: [task ID, or a short description of the change]
---

Turn `$ARGUMENTS` into a filled-out requirement file, ready for the loop's
Scan step. This skill only produces that file. It never writes implementation
code and never changes a task's status (that happens after Gate 2).

Read `.dev-loop/config.json` first. Paths below come from it. If it is
missing, stop and offer `/devloop:init`.

## 1. Identify the task

- If `$ARGUMENTS` looks like a task ID (`1.1`, `2.2-unique-email`),
  look it up in `docs.tasks` for its description, phase and dependencies. Name
  the file `<requirements.dir>/<id>-<kebab-case-name>.md`.
- If it is free text, name the file after what the change does, not the
  feature area (`invoice-reminder-schedule.md`, not `invoices.md`).
- If a dependency is not done, stop and say so. Foundations land before
  features. Do not draft work that cannot start yet.

## 2. Check for overlap

Read every file in `requirements.dir`. If one already covers this task or
overlaps materially, say so and ask whether to extend it instead.

## 3. Read before asking

Read what already answers the question: `docs.rules`, `docs.process`,
`learnings.file`, a search of `learnings.archive` for the area and nearby
task IDs, the documents in `blueprint.dir` if the config has a `blueprint` key,
and the real code if the files exist. If the change conflicts with an approved
blueprint document, or serves no feature in the PRD, say so and ask whether to
change the document first. Only interview about what is
not answered there: scope edges, cases the task leaves open, anywhere a
default would be a guess. Resolve ambiguity now, not during the loop.

**Every question goes through the question tool.** Recommended option first,
a line under each option saying what picking it means, up to four per call.
If a question has no sensible options, the reading should have answered it;
if it truly is open, offer the two or three likeliest answers.

## 4. Fill the template

Copy `requirements.template` to the target path and fill every section:

- **Problem / goal**: plain language, from the task's place in the build order.
- **Scope**: in scope, and out of scope. Out of scope names at least two things
  this deliberately does not do.
- **Acceptance criteria**: concrete and testable. Rewrite a vague criterion
  ("handle errors properly") into one a test can check ("a missing
  `DATABASE_URL` at boot exits non-zero before the port opens") and confirm
  the rewrite with the developer.
- **Context / constraints**: affected files (or "unknown, Scan to locate"),
  related past work, framework limits, non-goals, and the blueprint trace: the
  `F-n` feature and task this serves, or N/A if the project has no blueprint.
- **Architecture and security notes**: which of
  `architecture.characteristics` this change could affect, and which of
  `security.trustBoundaries` it crosses, if any. This tells the loop whether
  the security reviewer must also look at the plan.
- **Test expectations**: tests that must still pass, new coverage needed, and
  manual steps for anything that cannot be automated.
- **Notes for planning**: what is already known about the approach, or
  questions the plan must answer.

## 5. The rule check

Go through the `ruleCheckHeading` list at the bottom of the template against
`docs.rules`. Tick what this change touches and delete the lines that do not
apply, so Plan reads the exact rule text before writing code.

## 6. Size it

Right-sized means the plan fits on one screen and the diff can be read in one
sitting. If the criteria split into two groups that do not need each other,
propose two files. A change touching a front end, a back end and a migration is usually
three. The split is the developer's call: ask it with the question tool.

## 7. Show the result

Print the file's path and full contents, and say whether step 1 or 2 changed
anything. Do not start the loop yourself. Offer it as the next step with the
question tool.
