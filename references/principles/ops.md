# OPS: operating in production

- **OPS-1 Observability is part of the feature.** Say how anyone will know this works and how they will debug it. In distributed systems it is not optional. (FoSA 9; Serverless 8; AIE 10)
- **OPS-2 Alert on what users feel.** Alert on capabilities and critical paths. Component-level alarms cause noise and get ignored. (Serverless 8)
- **OPS-3 Measure percentiles.** Averages hide the slow requests that real users hit. (DDIA 1)
- **OPS-4 Separate transient and permanent failures.** Retry the first and route the second to a person. (Serverless 8)
- **OPS-5 Know your limits.** Check service quotas, downstream capacity and connection pools, not just your own scale. Load test critical paths before big events. (Serverless 7, 8)
- **OPS-6 Treat cost as a design input.** Estimate before building and alert on budgets. Pay-per-use also means a traffic spike or a loop becomes a bill. (Serverless 9)
- **OPS-7 Debug with evidence.** Verify the symptom, form a hypothesis, test it against telemetry, repeat. (Serverless 8)
