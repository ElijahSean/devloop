# Backend Schema: <fill: application name>

> The data and the interfaces over it. Guarantees belong here, as constraints,
> rather than in application code. If the application stores nothing, write
> "Not applicable because <reason>" under Data model, and still cover the
> interfaces it exposes.

## Data model
```mermaid
erDiagram
  <fill: entities and relationships>
```

## Entities

### <fill: entity name> (<fill: F-n>)
| Field | Type | Null? | Constraint or default | Sensitive? |
|---|---|---|---|---|
| <fill: field> | <fill: type> | <fill: yes or no> | <fill: constraint> | <fill: yes or no> |

Indexes: <fill: index and the query it serves>

Who can read and write: <fill: access rule, enforced where>

## Guarantees
| Rule that must never break | Enforced by |
|---|---|
| <fill: for example, one account per email address> | <fill: database constraint, lock or transaction> |

## API surface
| Method and path, or event | Caller | Input | Output | Errors | Feature |
|---|---|---|---|---|---|
| <fill: route> | <fill: who> | <fill: input> | <fill: output> | <fill: errors> | <fill: F-n> |

## Retries and idempotency
<fill: what can be retried, and the identifier that makes a retry safe>

## Migration and retention
<fill: how the schema changes safely, how long data is kept, and how it is removed>

## Open questions
- <fill: what is still undecided, or "None">
