## Superpowers and the dev loop

Devloop owns design, planning, execution and integration in this project. This
rule overrides the Superpowers skills, including their instruction to use a
skill whenever one might apply.

- Use only these Superpowers skills: `systematic-debugging`,
  `verification-before-completion`, `receiving-code-review`, `writing-skills`
  (when editing a skill), and `test-driven-development` when
  `superpowers.tdd` is true in `.dev-loop/config.json`.
- Do not use any other Superpowers skill. To design or build something, use
  `/devloop:blueprint`, `/devloop:requirement` and `/devloop:run`.
- Skills never change the loop: the main session is the only writer, both gates
  still stop for the developer, and nothing is pushed or merged.
