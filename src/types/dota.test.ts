import { describe, expect, it } from "vitest";
import { LaneAnalysisSchema } from "./dota";

const validAnalysis = {
  predicted_winner: "Team A",
  confidence: "moderate",
  reasoning: "Team A has superior early-game kill threat.",
  team_a_combos: [
    {
      name: "Frostbite + Stalk",
      description: "Rooting the carry for a Phantom Assassin Stalk proc.",
    },
  ],
  team_b_combos: [],
  strategic_advice: {
    team_a: "Punish the offlaner hard pre-6.",
    team_b: "Stack camps and wait for level 6.",
  },
  key_timings: "Level 3 power spike at ~2:00 is critical for Team A.",
};

describe("LaneAnalysisSchema", () => {
  it("accepts a valid analysis object", () => {
    const result = LaneAnalysisSchema.safeParse(validAnalysis);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid predicted_winner", () => {
    const result = LaneAnalysisSchema.safeParse({
      ...validAnalysis,
      predicted_winner: "Neither",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid confidence value", () => {
    const result = LaneAnalysisSchema.safeParse({
      ...validAnalysis,
      confidence: "high",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing strategic_advice field", () => {
    const { strategic_advice: _strategic_advice, ...rest } = validAnalysis;
    const result = LaneAnalysisSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects combos missing a description", () => {
    const result = LaneAnalysisSchema.safeParse({
      ...validAnalysis,
      team_a_combos: [{ name: "Only name" }],
    });
    expect(result.success).toBe(false);
  });
});
