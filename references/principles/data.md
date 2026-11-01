# DATA: data correctness

- **DATA-1 Integrity before timeliness.** Late data can catch up. Wrong data stays wrong. (DDIA 12)
- **DATA-2 Check-then-act is a race.** Reading to decide and then writing allows write skew. Use a constraint, serializable isolation, row locks or, as a last resort, materialised conflict rows. An application check alone is a finding. (DDIA 7)
- **DATA-3 Avoid read-modify-write.** Use an atomic update, an explicit lock or compare-and-set on a version. (DDIA 7)
- **DATA-4 Related writes are one transaction.** Put the boundary where the business operation lives. (DDIA 7)
- **DATA-5 Enforce it in the database.** If an invariant must hold, prefer a unique, foreign key or check constraint. Code can be bypassed or raced. (DDIA 7, 9, 12)
- **DATA-6 Retries need idempotency.** Anything retryable carries an operation ID enforced unique in the database, end to end. (DDIA 8, 11, 12)
- **DATA-7 Change schemas in compatible steps.** Old and new code run together during a deploy, and old rows stay. Add, backfill, constrain, then remove. New code reads old data and old code tolerates new data. (DDIA 4)
- **DATA-8 Name the source of truth.** Caches, counters and search indexes are derived. State which store is authoritative and how a drifted copy is rebuilt. (DDIA 11, 12)
- **DATA-9 Plan for replication lag.** If reads can hit a replica, keep read-your-own-writes where a user would notice, and never let time appear to go backwards. (DDIA 5)
- **DATA-10 Fit the store and access pattern.** Choose the model by the data's relationships. Check indexes against real queries. Keep heavy analytics off the transactional path. Watch for hot partition keys. (DDIA 2, 3, 6)
- **DATA-11 Make guarantees auditable.** Prefer an audit row per decision, and checks that a constraint or index still exists. (DDIA 12)
- **DATA-12 Treat personal data as a responsibility.** Collect the minimum, and consider how a person is harmed if it is wrong, exposed or impossible to appeal. (DDIA 12)
