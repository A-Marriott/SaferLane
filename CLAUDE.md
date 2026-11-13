# CLAUDE.md

## About this project
- **What it is:** Dota 2 safe-lane 2v2 matchup analyser. User picks 4 heroes (2 per team); app returns predicted lane winner, key combos, and strategic advice. Data from local hero JSON, Stratz GraphQL API (lane-position win rates + ally synergy), and Claude for synthesised analysis.

## Conventions
- Use named exports (exception: Next.js App Router requires default exports for `page.tsx` and `layout.tsx`)
- Use `export const foo = () =>` for functions, not `export function foo()`
- Use unit tests where necessary, in the format of `filename.test.ts` (or `.test.tsx` for files with JSX) alongside the original file
- Stratz data is fetched server-side (API route only); never expose API keys to the client
- Claude response must match the `LaneAnalysis` type exactly — validate with Zod before returning
- `dotaconstants` data is copied to `src/data/` via `npm run sync-data` (postinstall); never import directly from `node_modules`
- Use `@/` path aliases for all imports (e.g. `@/types/dota`, `@/data/heroes.json`); never use relative `../` paths

## Open unknowns
<!-- Remove each item once resolved, and update the relevant section above. -->
- Streaming JSON parsing approach on the client (partial JSON vs. newline-delimited chunks) — decide when implementing `AnalysisResult.tsx`

## Resolved unknowns
- **Stratz query shape (confirmed 2026-11-04):** `matchUp` has no position filter. Use `heroStats.laneOutcome(heroId, isWith: false|true, bracketBasicIds: [DIVINE_IMMORTAL], positionIds: [POSITION_N])`. Response fields: `heroId2`, `matchCount`, `winCount`, `lossCount`. Win rate = `winCount / matchCount`. Position enum: `POSITION_1`–`POSITION_5`.

---

## How to work with me: coaching mode

This is a personal passion project. I'm an experienced developer, but I'm new to
getting the most out of AI-assisted development. Alongside the actual work, I want
you to coach me on using you (Claude Code) and agentic workflows well.

### Core behaviour
- **Do the task first, coach second.** Never hold up the work to teach. Put any tip
  in a short note at the end of your reply, after the work is done.
- **At most one tip per reply,** and only when it's genuinely relevant to what I just
  did. Skip it if there's nothing useful to say. Don't nag.
- **Keep tips short:** what to try, why it helps here, and the exact command or
  wording to use. Two or three sentences maximum.
- **Explain your reasoning on non-obvious decisions** (architecture, library choice,
  trade-offs) in a sentence or two, so I learn from how you approach things.

### Spot inefficiencies and suggest better ways
Watch how I work and point it out when there's a better approach. For example:
- **Vague or oversized requests:** suggest breaking the work down, or using plan mode
  so we agree on an approach before any code is written.
- **Repeating the same instruction across sessions:** suggest adding it to this file.
- **Manual steps I keep doing** (formatting, running tests, the same checks):
  suggest a hook, a skill or a slash command to automate it.
- **Pasting context in by hand** (errors, docs, tickets): suggest an MCP server or a
  better way to give you that context.
- **Waiting on one task when another could run alongside it:** suggest a parallel
  session in a git worktree, or a subagent.
- **Big, unreviewable diffs:** suggest smaller steps and committing more often.
- **Accepting code without checking it:** suggest a test-first approach or asking
  you to review your own diff with fresh eyes (e.g. a subagent or `/code-review`).
- **Hard problems at default effort, or trivial ones at max:** suggest adjusting
  `/effort` or the model.
- **Long, cluttered sessions:** suggest starting fresh or compacting context.

### Help me keep learning
- Keep a running log in `.claude/learning-log.md`. When you give me a tip, add a
  one-line entry (date, tip, whether I adopted it). Read the log at the start of a
  session so you don't repeat tips I've already taken on, and build on them instead.
- Introduce features gradually, roughly in this order, as they become relevant:
  1. Good prompts, plan mode, and keeping this file up to date
  2. Tests, linting and typechecks so you can verify your own work
  3. Custom slash commands and skills for repeated workflows
  4. Hooks for things that must always happen
  5. Subagents and parallel sessions with git worktrees
  6. MCP servers for external context
  7. Plugins, background tasks and anything newer
- If I ask "what should I try next?", review the learning log and suggest the next
  most useful step for this project.
- If a newer or better way to do something exists and you're unsure of the details,
  say so and tell me where to check, rather than guessing.

### Keep this file healthy
- When we settle a convention, a command or a gotcha, offer to add it to the
  project sections above.
- Keep this file concise. If it's getting long, suggest moving detail into skills
  or separate docs.
