# DOM: domain modelling

- **DOM-1 Classify the subdomain first.** Core gets the best design and engineers. Supporting can stay simple. Generic should be bought or adopted, not built. (LDDD 1)
- **DOM-2 Use one language.** Use the domain's terms in code, tests, schema and docs. Each term has one meaning, and no two terms name the same thing, within a context. (LDDD 2)
- **DOM-3 Split when a word means two things.** Conflicting meanings signal two bounded contexts. Keep one model per context rather than a compromise model. (LDDD 3)
- **DOM-4 Match the pattern to the complexity.** Simple logic: transaction script. Simple logic on complex data: active record. Complicated rules with invariants: domain model. (LDDD 5, 6, 10)
- **DOM-5 Guard invariants in one place.** All changes go through the aggregate's commands, committed in one transaction. Keep aggregates as small as strong consistency allows, and reference others by ID. (LDDD 6, 11)
- **DOM-6 Translate at the border.** Put an anticorruption layer between this model and a messy or external one. Do not let another system's model leak in. (LDDD 4, 9)
- **DOM-7 Publish events reliably.** Save the state change and the outgoing event in one transaction with an outbox, then relay it. Use a saga or process manager for multi-step flows. (LDDD 9)
- **DOM-8 Separate public and private events.** Publish only what consumers need. Internal events shared widely become a hidden coupling. (LDDD 15)
- **DOM-9 Event-source only when history is the requirement.** Use it for audit or analysis needs, not by default. (LDDD 7)
- **DOM-10 Migrate gradually.** Prefer incremental replacement around a boundary. Big rewrites add more risk than value. (LDDD 13)
