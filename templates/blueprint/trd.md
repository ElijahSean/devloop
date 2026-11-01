# TRD: <fill: application name>

> How it is built, and what each choice costs. The loop's reviewers treat this
> as the record of decisions.

## Architecture
- Style: <fill: for example modular monolith, or API plus web client>
- Top characteristics, in priority order: <fill: must match architecture.characteristics in the config>

```mermaid
flowchart LR
  <fill: components and what calls what>
```

## Stack
| Layer | Choice | Why this one |
|---|---|---|
| <fill: layer> | <fill: technology and major version> | <fill: reason> |

## Integrations
| External system | Used for | On timeout, duplicate or outage |
|---|---|---|
| <fill: system, or "None"> | <fill: purpose> | <fill: behaviour> |

## Non-functional requirements
- Performance: <fill: measurable target>
- Reliability: <fill: measurable target>
- Scale: <fill: expected load>
- Observability: <fill: how a failure would be noticed>

## Security
- Trust boundaries: <fill: every place outside input enters; must match the config>
- Authentication and authorization: <fill: approach>
- Sensitive data: <fill: what must never leak or be logged; must match the config>

## Decisions
| Decision | Reason | Cost accepted | How it stays true |
|---|---|---|---|
| <fill: decision> | <fill: business reason> | <fill: downside> | <fill: test, lint rule or constraint> |

## Features covered
<fill: any F-n from the PRD with a technical consequence, and what that is>

## Open questions
- <fill: what is still undecided, or "None">
