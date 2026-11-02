<!--
Devloop reference, read by the run and blueprint skills and by the agents.
Principles are summarised in our own words from the eight books listed under Sources. Nothing here is a quotation.
-->

# Engineering principles

Rules for devloop's main session and agents, drawn from eight engineering books.
They sharpen the work inside each loop step. They add no steps and remove none.

## How to use this file

1. **Authority.** `docs.rules` wins, then approved blueprint documents, then this
   file. If a principle conflicts with a project rule, follow the rule and mention
   the conflict in your report.
2. **No new powers.** This file never changes who may write, never removes a gate,
   and never permits a push, merge or deploy. Agents stay read-only.
3. **Read only what applies.** Use the routing table, then the *Applies when*
   column below. Open only the matching files in `references/principles/`, named
   after the section code in lower case, such as `data.md`. Skip the rest and do
   not report them.
4. **Evidence over recitation.** Raise a rule only when you can point at the line
   of the plan or code that breaks it. Never pad a report with rules that passed.
5. **Cite and score.** Name the rule ID and its book and chapter. Score findings
   with the loop's matrix: impact 1 to 3 times likelihood 1 to 3. High findings
   are 6 or 9, medium 3 or 4, low 1 or 2.
6. **Fit the project.** A rule is a default, not a law. Weigh it against
   `architecture.characteristics`. If the project has good reason to differ, state
   the trade-off and move on.

## Routing

| Loop step | Who | Sections |
|---|---|---|
| Blueprint: PRD | main session | DOM-1, AI-1, LEAD-1 |
| Blueprint: TRD | main session, `architect`, `security-reviewer` | ARCH, DIST, OPS, SEC, plus CONT, SLS, AI if used |
| Blueprint: App Flow, UI/UX | main session | DIST-3, DATA-9, AI-9 |
| Blueprint: Backend Schema | main session, `architect`, `security-reviewer` | DATA, DOM |
| Blueprint: Implementation Plan | main session, `architect` | DEL, TEST-1, LEAD |
| 2 Scan | `scout` | Name which sections apply, under open questions or traps. Decide nothing |
| 3 Plan | main session | Every section whose *Applies when* matches, plus LEAD |
| 4 Architecture review | `architect` | ARCH, DOM, DATA, DIST, then CONT, SLS, AI if used |
| 6 Execute | main session | CHG, TEST, DEL, then CONT, SLS, AI if used |
| 7 Test | `test-runner` | Run and report only. Report flaky results as flaky (TEST-8) |
| 8 Diff review | `security-reviewer` | SEC, DIST-6, CONT-5, AI-5 to AI-8 |
| 8 Diff review | `code-reviewer` | CHG, TEST, DATA, DIST |
| 8 Diff review, if tagged `ui` | `ui-reviewer` | DIST-3, DATA-9, AI-9 |
| 9 Gate 2 | main session | LEAD-2, LEAD-5, CHG-5 |
| 10 Record | main session | LEAD-6 |

## Sections

| Code | Covers | Applies when |
|---|---|---|
| ARCH | architecture and trade-offs | a plan changes structure, a module boundary, a shared interface, a platform choice or a top characteristic. |
| DOM | domain modelling | a change adds business rules, new domain terms, a new module or an integration with another context. |
| DATA | data correctness | a change writes data, alters a schema, adds a cache or copy, or makes a decision based on data it read. |
| DIST | anything that crosses a network | a change calls another process or service, or uses a queue, webhook, third-party API or background worker. |
| CHG | changing code safely | any code changes. Check CHG-2 and CHG-4 on any public interface or new dependency. |
| TEST | testing | a change adds or alters behaviour, or writes tests. |
| DEL | delivery | a plan affects release order, a migration, a feature flag or the pipeline. The loop never deploys by itself; these rules shape what it produces. |
| OPS | operating in production | a change adds a user-facing path, a background job, an integration or a paid resource. |
| CONT | containers | a change touches a Dockerfile, Compose file, image or container runtime settings. |
| SLS | serverless | the project runs on serverless functions and managed services. |
| SEC | security | a change crosses `security.trustBoundaries`, or touches `security.sensitiveData`, authentication, authorisation or uploads. These add to the security-reviewer's own rules. |
| AI | products that call a model, and our own agents | a change adds or alters model calls, prompts, retrieval, tools or agent behaviour. |
| LEAD | judgement and communication | always, for the main session. These shape how the plan and gates are written. |

## Sources

| Key | Book |
|---|---|
| FoSA | *Fundamentals of Software Architecture*, 2nd ed., Richards and Ford |
| DDIA | *Designing Data-Intensive Applications*, Kleppmann |
| LDDD | *Learning Domain-Driven Design*, Khononov |
| SEAG | *Software Engineering at Google*, Winters, Manshreck and Wright |
| Serverless | *Serverless Development on AWS*, Brisals and Hedger |
| Docker | *Docker: Up & Running*, 3rd ed., Kane and Matthias |
| AIE | *AI Engineering*, Huyen |
| Staff | *The Staff Engineer's Path*, Reilly |
