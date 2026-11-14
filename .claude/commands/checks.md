# Full codebase checks

Spawn the following agents **in parallel** using the Agent tool. Each agent should fix issues it finds, not just report them.

## Agent 1 — Lint & types
- Run `npm run lint` (Biome) and `npx tsc --noEmit`
- Fix any errors reported by either tool directly in the relevant files
- Re-run both to confirm clean
- Report: what was fixed, anything that couldn't be auto-fixed

## Agent 2 — Tests
- Run `npm test`
- For failing tests: investigate the cause
  - If the implementation is wrong, fix the implementation
  - If the test is wrong (e.g. stale snapshot or incorrect expectation), fix the test
  - Do not delete tests to make them pass
- Re-run `npm test` to confirm passing
- Report: what was fixed, anything that couldn't be auto-fixed

## Agent 4 — Accessibility
- Run /accessibility-audit (audit src/ and fix clear issues; flag ones needing human judgement)

## Summary
After all agents complete, print a consolidated table:

| Check | Status | Fixed | Needs review |
|-------|--------|-------|--------------|
| Lint & types | ✓/✗ | count | count |
| Tests | ✓/✗ | count | count |
| Accessibility | ✓/✗ | count | count |

List anything that needs human review, with file and reason.
