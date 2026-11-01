# LEARNINGS.md

Read in full at the start of every Scan. Appended to at the end of every loop,
success or not.

**This file keeps the most recent entries only** (the number is `learnings.keep`
in `.dev-loop/config.json`). At Record, after appending, move the oldest
entries to the end of the archive file, unedited. Scan searches the archive
instead of reading it, so this file stays cheap to read.

**A lesson learned twice is a check, not an entry.** When an entry repeats an
older one, add a line to the rule check at the bottom of the requirement
template (or a rule to `CLAUDE.md`) and say in the entry that you did.

Entry format: five bullets, one or two lines each. The full story of a bug
goes in the commit message body, where `git log` keeps it searchable.

```
## <date> - requirement: <short title>
- Requirement actually needed: <what turned out to be the real ask>
- Approach that worked: <one line>
- Surprises / root causes: <bugs hit, why, and the fix>
- Test gaps closed: <what wasn't covered before, what is now>
- Watch-outs for next time: <what to check first>
```

Never put real secrets, API keys, or real personal data in here. Use
placeholders.

---
