# SLS: serverless

- **SLS-1 It is not automatically the right fit.** Assess workload, team readiness and cost before committing. (Serverless 2, 11)
- **SLS-2 Use small, single-purpose services.** Functions should have one job and connect through APIs and events. (Serverless 3)
- **SLS-3 Prefer native integrations.** If a function only moves data between services, try removing it. Less code means less to test, secure and pay for. (Serverless 5)
- **SLS-4 Zero trust and least privilege.** Authenticate and authorise every interface, internal ones too. Give each function its own narrow permissions. (Serverless 4)
- **SLS-5 Secure the supply chain.** Scan dependencies and detect leaked secrets in the pipeline. (Serverless 4)
