# ARCH: architecture and trade-offs

- **ARCH-1 Name the cost.** Every option has a downside. If a plan shows none, it has not been found yet. Do not accept "best practice" as the reason. (FoSA 1, 27)
- **ARCH-2 Choose the least-worst option for this project.** Judge against the top three characteristics in the config, not generic ones. Redo the analysis each time. (FoSA 1, 2, 4)
- **ARCH-3 Limit characteristics.** Each one costs design and upkeep. Reject work that serves a characteristic nobody asked for at the expense of one they did. (FoSA 4, 5)
- **ARCH-4 Record the why.** Decisions that affect structure, characteristics, dependencies, interfaces or construction techniques need context, decision, consequences and how compliance is checked. (FoSA 21)
- **ARCH-5 Decide at the last responsible moment.** Decide when waiting would cost more than the risk it removes. A decision with only a technical reason gets re-argued, so give the business reason too. (FoSA 21)
- **ARCH-6 Keep rules true with checks.** A rule that matters needs an automated check: a test, lint rule, constraint or script. Otherwise it drifts. (FoSA 6)
- **ARCH-7 Group what changes together.** Prefer modules built around workflows. A component that only wraps create, read, update and delete for one table is the entity trap. (FoSA 3, 8)
- **ARCH-8 Keep strong coupling local.** Sharing a name or type across modules is fine. Sharing a value's meaning, argument order, an algorithm or call timing belongs inside one module. (FoSA 3)
- **ARCH-9 Stay monolithic until a reason says otherwise.** A modular monolith is a sound default. Distribute only for a named characteristic that needs it, because distribution adds new failure modes. (FoSA 9, 11, 18, 19; DDIA 8)
