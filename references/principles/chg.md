# CHG: changing code safely

- **CHG-1 Code is read for years.** Optimise for the reader and for the code's expected lifespan. Throwaway scripts and long-lived systems deserve different care. (SEAG 1, 9)
- **CHG-2 All observable behaviour is the contract.** With enough users, someone relies on your ordering, timing and error text. Treat such changes as breaking until usage is checked. (SEAG 1)
- **CHG-3 Keep changes small and single-purpose.** Separate refactors from behaviour changes so that reviewers can check each. (SEAG 9, 24)
- **CHG-4 A dependency is a long-term commitment.** Before adding one, weigh its upkeep, trust and security cost against a few lines of code. Pin versions and rely on CI to prove upgrades work. (SEAG 18, 21)
- **CHG-5 Comments and docs serve one audience and purpose.** Update them with the code, in the same change. Explain why, not what. (SEAG 10)
- **CHG-6 Automate rules, and keep few.** A rule must earn its cost. Enforce it with a tool, and tune out false positives or it will be ignored. (SEAG 8, 20)
- **CHG-7 Plan removal.** Everything has ongoing cost, and evolving in place is often cheaper than replacing. A replacement plan is unfinished until it says how the old thing is turned off. (SEAG 15; Staff 7)
- **CHG-8 Keep one version of each thing.** Avoid parallel implementations and long-lived branches. Choosing which version to use is itself a cost. (SEAG 16)
