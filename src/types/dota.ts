import { z } from "zod";

// ---------------------------------------------------------------------------
// Hero data (from dotaconstants heroes.json)
// ---------------------------------------------------------------------------

export interface HeroStats {
  id: number;
  localized_name: string;
  icon: string;
  primary_attr: "str" | "agi" | "int" | "all";
  attack_type: "Melee" | "Ranged";
  roles: string[];
  base_armor: number;
  base_health: number;
  base_health_regen: number;
  move_speed: number;
  attack_range: number;
  base_attack_min: number;
  base_attack_max: number;
}

// ---------------------------------------------------------------------------
// Ability data (from dotaconstants abilities.json)
// ---------------------------------------------------------------------------

export interface AbilityInfo {
  dname: string;
  behavior: string | string[];
  dmg_type?: string;
  bkbpierce?: string;
  desc?: string;
}

// ---------------------------------------------------------------------------
// Assembled hero context (passed to Claude prompt)
// ---------------------------------------------------------------------------

export interface HeroContext {
  stats: HeroStats;
  abilities: AbilityInfo[];
}

// ---------------------------------------------------------------------------
// Stratz data
// ---------------------------------------------------------------------------

export interface LaneMatchupRate {
  heroId: number;
  vsHeroId: number;
  position: number;
  winRate: number;
}

export interface AllySynergy {
  heroId: number;
  allyHeroId: number;
  position: number;
  synergyScore: number;
}

// ---------------------------------------------------------------------------
// LaneAnalysis — Claude's structured output (validated with Zod)
// ---------------------------------------------------------------------------

export const ComboSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const LaneAnalysisSchema = z.object({
  predicted_winner: z.enum(["Team A", "Team B", "Even"]),
  confidence: z.enum(["slight", "moderate", "strong"]),
  reasoning: z.string(),
  team_a_combos: z.array(ComboSchema),
  team_b_combos: z.array(ComboSchema),
  strategic_advice: z.object({
    team_a: z.string(),
    team_b: z.string(),
  }),
  key_timings: z.string(),
});

export type Combo = z.infer<typeof ComboSchema>;
export type LaneAnalysis = z.infer<typeof LaneAnalysisSchema>;

// ---------------------------------------------------------------------------
// API request/response shapes
// ---------------------------------------------------------------------------

export const AnalyzeRequest = z.object({
  team1: z.tuple([z.number().int(), z.number().int()]),
  team2: z.tuple([z.number().int(), z.number().int()]),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequest>;
