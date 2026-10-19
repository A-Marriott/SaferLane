# Plan: Dota 2 Lane Matchup Analyzer

## Context
Build a Next.js web app for Dota 2 players to analyse 2v2 safe lane matchups. User picks 4 heroes (2 per team), app returns: predicted lane winner, key combos, and strategic advice (e.g. whether to creep drag). Data comes from local hero JSON (dotaconstants), Stratz GraphQL API for lane-position-specific win rates and ally synergy data, and Claude for synthesised analysis.

---

## Stack
- Next.js 15, App Router, TypeScript
- `@anthropic-ai/sdk` for Claude API
- `dotaconstants` (devDep, data copied to `src/data/` via postinstall script)
- Stratz GraphQL API — accessed at runtime via MCP (see below)
- Vitest + React Testing Library for unit tests

## Stratz MCP (app runtime)
Rather than pre-fetching a fixed set of Stratz queries in `stratz.ts`, the `/api/analyze` route exposes Stratz as MCP tools and lets Claude decide which queries to run during analysis. Claude calls the tools mid-response, gets the data back, and synthesises it into `LaneAnalysis` JSON.

Tools to expose:
- `get_lane_matchup_winrate(heroId, vsHeroId, position)` — win rate for a hero pair filtered by lane position
- `get_ally_synergy(heroId, allyHeroId, position)` — synergy score for a team pair in position

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # Hero picker + results, single page
│   ├── globals.css
│   └── api/analyze/route.ts         # POST: fetch data → build context → stream Claude
├── components/
│   ├── HeroPicker.tsx               # 4-slot layout (2 per team)
│   ├── HeroSearch.tsx               # Single-slot combobox with client-side filter
│   ├── AnalysisResult.tsx           # Renders streamed JSON response
│   └── LaneResultCard.tsx           # Winner chip, combos, advice sections
├── lib/
│   ├── hero-data.ts                 # Module-level JSON load + lookup maps
│   ├── stratz.ts                    # GraphQL queries: lane matchup rates + ally synergy
│   ├── analysis-context.ts          # Assembles hero context objects + prompt
│   └── claude.ts                    # Anthropic SDK streaming wrapper
├── data/
│   ├── heroes.json                  # Copied from dotaconstants
│   ├── hero_abilities.json
│   ├── abilities.json
│   └── dota-strategy.md             # Hardcoded general Dota knowledge (lane mechanics, timings, etc.)
├── types/dota.ts                    # HeroContext, LaneAnalysis, etc.
scripts/
└── sync-constants.mjs               # Copies JSON from node_modules/dotaconstants/build/
src/
└── __tests__/
    ├── lib/
    │   ├── hero-data.test.ts         # Lookup maps return correct shape
    │   ├── stratz.test.ts            # Win rate calculation, synergy parsing (mocked fetch)
    │   └── analysis-context.test.ts  # Prompt assembly produces expected structure
    └── components/
        ├── HeroSearch.test.tsx       # Renders, filters, selects a hero
        └── LaneResultCard.test.tsx   # Renders each section from mock LaneAnalysis
.env.local                           # ANTHROPIC_API_KEY, STRATZ_API_KEY
```

---

## Data Flow
1. User picks 4 heroes in `HeroPicker`
2. `POST /api/analyze` fires with `{ team1: [id, id], team2: [id, id] }`
3. Local JSON lookup for each hero's stats + abilities (sync, module-scoped)
4. `analysis-context.ts` assembles hero context + builds Claude prompt; Stratz tools are passed to the SDK call
5. Claude calls Stratz MCP tools mid-response to fetch lane-position win rates and ally synergy as needed
6. Claude streams back structured JSON (`LaneAnalysis` type)
7. Client renders result cards progressively

---

## Key Data Fields (minimal v1)
**From heroes.json:** `id, localized_name, primary_attr, attack_type, roles, base_armor, base_health, base_health_regen, move_speed, attack_range, base_attack_min, base_attack_max`

**From abilities.json (per ability):** `dname, behavior, dmg_type, bkbpierce, desc` (truncated to 120 chars)

**From Stratz GraphQL:**
- Hero vs hero win rate filtered by lane position (pos 1/2/3/4) — more accurate than all-game rates
- Ally synergy win rate for each team's pair (e.g. CM + Juggernaut synergy score) — feeds the combos section directly

---

## Claude Prompt Structure
Pass: hero stats, ability behavior + BKB pierce flags, lane-position win rates, ally synergy scores.

Request JSON output matching `LaneAnalysis`:
```typescript
{
  predicted_winner: 'Team A' | 'Team B' | 'Even'
  confidence: 'slight' | 'moderate' | 'strong'
  reasoning: string                          // 2–3 sentences
  team_a_combos: { name, description }[]
  team_b_combos: { name, description }[]
  strategic_advice: { team_a, team_b }
  key_timings: string
}
```

---

## Strategy Knowledge Base (`src/data/dota-strategy.md`)
Research and author a markdown file covering general Dota 2 lane strategy that Claude will receive as context on every analysis. Topics to cover:
- Safe lane 2v2 dynamics: aggression vs defensive play, when each approach wins
- Creep pulling and creep dragging: mechanics, when it's worth it, which hero types benefit
- Level timing windows: why levels 3, 6, 10 are significant; how to exploit or survive them
- Lane archetypes: kill lane, sustain lane, poke lane — what each needs to succeed
- Hero stat thresholds: what move speed, attack range, and armor mean for lane outcomes
- Common counter-patterns: ranged vs melee, stuns vs escape abilities, nuke combos

This file is written once (with your help researching), then included verbatim in the Claude system prompt.

---

## Setup Steps
1. `npx create-next-app@latest . --typescript --app --tailwind --src-dir`
2. `npm install @anthropic-ai/sdk zod`
3. `npm install --save-dev dotaconstants vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`
4. Add `sync-constants.mjs` + `postinstall` script, run `npm run sync-data`
5. Register free API key at stratz.com/api
6. Add `.env.local` with `ANTHROPIC_API_KEY` and `STRATZ_API_KEY`

---

## Build Order
Each step includes writing its unit tests alongside the implementation.

1. Research and author `src/data/dota-strategy.md` (strategy knowledge base)
2. Types (`src/types/dota.ts`)
3. Static data layer (`hero-data.ts`) + tests
4. Stratz GraphQL fetch (`stratz.ts`) + tests (mock `fetch`)
   ⚡ **Try parallel agents here:** Stratz query research (web/API explorer) can run alongside step 3 implementation. Open a worktree (`git worktree add ../dota-stratz-research`) and spawn a second Claude Code session to confirm the exact GraphQL query shape while the main session finishes the data layer.
5. Prompt assembly (`analysis-context.ts`) + tests
6. Claude streaming wrapper (`claude.ts`)
7. API route (`api/analyze/route.ts`)
8. UI components: `HeroSearch` → `HeroPicker` → `LaneResultCard` → `AnalysisResult` + component tests
9. Page (`page.tsx`) wiring it all together

---

## Keeping CLAUDE.md current
Whenever this plan has an open unknown (marked `TODO` or listed in "Open unknowns" in CLAUDE.md) and we resolve it during a session — e.g. we confirm the Stratz query shape, settle on a streaming approach, or add a lint command — update CLAUDE.md immediately: fill in the answer in the relevant section and remove the item from the "Open unknowns" list.

---

## Verification
- `npm test` — all unit tests pass
- `npm run dev`, pick CM + Juggernaut vs Snapfire + Mars, submit
- API route logs: confirm Stratz returns lane-position win rates + synergy scores
- Claude streams back valid JSON matching `LaneAnalysis` shape
- UI renders all sections: winner, combos, advice, timings
- Pick a hero with Blade Fury (Juggernaut) — verify Claude's reasoning mentions spell immunity
