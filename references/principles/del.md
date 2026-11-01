# DEL: delivery

- **DEL-1 Small batches are safer.** Each change is easier to reason about and to undo. (SEAG 24; DDIA 4)
- **DEL-2 Separate deploy from release.** Put risky features behind a flag so they can be isolated and turned off. Remove the flag once settled. (SEAG 24)
- **DEL-3 Reality is the benchmark.** Staged rollouts find what staging cannot. Say how the change will be watched and undone. (SEAG 24; Serverless 8)
- **DEL-4 Build the path to production first.** On a new application, establish the pipeline before features. (Serverless 6)
- **DEL-5 A broken pipeline stops the line.** Fix it before adding features. (Serverless 6)
- **DEL-6 Build once and promote.** Use one artifact across environments, with configuration supplied at runtime. (Docker 13)
- **DEL-7 Infrastructure is code.** Environments must be reproducible and disposable, not hand-tuned. (Serverless 6; Docker 2)
- **DEL-8 Ship only what gets used.** Check whether a feature still earns its cost, and remove it if not. (SEAG 24)
