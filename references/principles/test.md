# TEST: testing

- **TEST-1 Test by risk.** Find the critical user paths and the costliest failures, then spend tests there. Serving every path equally is a poor use of them. (SEAG 14; Serverless 7)
- **TEST-2 If it matters, it needs a test.** Anything you need to survive someone else's change must be protected by a test. (SEAG 11)
- **TEST-3 Test behaviour through public interfaces.** A refactor that keeps behaviour must not break tests. Name tests after the behaviour. (SEAG 12)
- **TEST-4 Assert on state, not on calls.** Prefer checking the result to checking which methods ran. (SEAG 12, 13)
- **TEST-5 Prefer real, then fake, then stub.** Use mocks sparingly, because heavy stubbing hides integration bugs and makes tests brittle. (SEAG 13)
- **TEST-6 Keep tests obvious.** No logic in tests. Clear beats shared, so some repetition is fine. Failure messages should explain themselves. (SEAG 12)
- **TEST-7 Fast and reliable tests run first.** Slow and less deterministic tests run later, so they do not block developers. (SEAG 23)
- **TEST-8 Flakiness is a defect.** Report it and fix it. Do not retry until green. (SEAG 11, 23; Serverless 7)
- **TEST-9 A bug fix starts with a failing test.** It proves the cause and prevents a return. (SEAG 11)
- **TEST-10 Do not test what you cannot fix.** Test your own use and contract with a managed service, not the service itself. (Serverless 7)
- **TEST-11 Balance tests with recovery.** Tests cannot catch everything. Pair them with fast delivery, observability and automatic recovery. (Serverless 7)
- **TEST-12 Fit the test mix to the logic.** Rich domain models lean on unit tests. Simple data-heavy code leans on integration tests. Scripts lean on end-to-end tests. (LDDD 10)
