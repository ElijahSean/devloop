# DIST: anything that crosses a network

- **DIST-1 Assume partial failure.** Requests can be lost, delayed or duplicated, and silence does not reveal whether the work happened. Answer: what happens on timeout, duplicate and partial failure, and who finds out? (DDIA 8; FoSA 9)
- **DIST-2 Bound every remote call.** Set a timeout. Retry only transient failures, with backoff and jitter, and only when idempotent (DATA-6). Stop calling a dependency that keeps failing. (DDIA 8; Serverless 5, 8)
- **DIST-3 Default to synchronous, go async for a reason.** Async adds ordering, duplicate and visibility problems. When a job is slow, acknowledge quickly and report the result later. (FoSA 19; Docker 13)
- **DIST-4 Do not order by wall clock.** Clocks jump. Use the database's time or a monotonic clock for durations, and fencing tokens or conditional writes to guard leases. (DDIA 8)
- **DIST-5 Compensation can fail too.** A saga needs a plan and an alert for when an undo step fails. (FoSA 9; LDDD 9)
- **DIST-6 Trust nothing that arrives.** Verify webhooks, queue messages and your own front end's requests at the boundary. (FoSA 9; Serverless 4)
- **DIST-7 Keep failed work visible.** Failed messages go to a dead-letter queue that someone is alerted about and can replay. (Serverless 3, 8)
- **DIST-8 Avoid the distributed monolith.** Services that must deploy together, or that call each other constantly, have the wrong boundaries. (LDDD 14; Serverless 2; FoSA 18)
