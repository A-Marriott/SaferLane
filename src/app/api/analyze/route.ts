import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getHeroById } from "@/lib/hero-data";
import { getAllySynergy, getLaneMatchupWinRate } from "@/lib/stratz";
import { AnalyzeRequest, LaneAnalysisSchema } from "@/types/dota";

const client = new Anthropic();

const buildPrompt = (input: {
  teamA: { name: string; abilities: string[] }[];
  teamB: { name: string; abilities: string[] }[];
  matchupRates: { hero: string; vs: string; winRate: number }[];
  synergies: { hero: string; ally: string; score: number }[];
}): string => {
  const heroSummary = (heroes: { name: string; abilities: string[] }[]) =>
    heroes.map((h) => `- ${h.name}: ${h.abilities.join(", ")}`).join("\n");

  const matchupLines = input.matchupRates
    .map(
      (m) =>
        `  ${m.hero} vs ${m.vs}: ${(m.winRate * 100).toFixed(1)}% win rate`,
    )
    .join("\n");

  const synergyLines = input.synergies
    .map(
      (s) =>
        `  ${s.hero} + ${s.ally}: ${(s.score * 100).toFixed(1)}% win rate together`,
    )
    .join("\n");

  return `You are a Dota 2 expert analyst. Analyse this safe-lane 2v2 matchup.

Team A:
${heroSummary(input.teamA)}

Team B:
${heroSummary(input.teamB)}

Statistical data (Divine/Immortal bracket):
Matchup win rates:
${matchupLines || "  No data available"}

Ally synergy win rates:
${synergyLines || "  No data available"}

Return a JSON object with exactly this structure:
{
  "predicted_winner": "Team A" | "Team B" | "Even",
  "confidence": "slight" | "moderate" | "strong",
  "reasoning": "string",
  "team_a_combos": [{ "name": "string", "description": "string" }],
  "team_b_combos": [{ "name": "string", "description": "string" }],
  "strategic_advice": {
    "team_a": "string",
    "team_b": "string"
  },
  "key_timings": "string"
}

Return only the JSON object with no markdown, code blocks, or other text.`;
};

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsed = AnalyzeRequest.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { team1, team2 } = parsed.data;

  const [heroA1, heroA2, heroB1, heroB2] = [
    getHeroById(team1[0]),
    getHeroById(team1[1]),
    getHeroById(team2[0]),
    getHeroById(team2[1]),
  ];

  if (!heroA1 || !heroA2 || !heroB1 || !heroB2) {
    return NextResponse.json({ error: "Unknown hero ID" }, { status: 400 });
  }

  // Position 1 = carry, position 4 = support (safe lane)
  const [matchA1vsB1, matchA1vsB2, matchA2vsB1, matchA2vsB2, synA, synB] =
    await Promise.all([
      getLaneMatchupWinRate(team1[0], team2[0], 1),
      getLaneMatchupWinRate(team1[0], team2[1], 1),
      getLaneMatchupWinRate(team1[1], team2[0], 4),
      getLaneMatchupWinRate(team1[1], team2[1], 4),
      getAllySynergy(team1[0], team1[1], 1),
      getAllySynergy(team2[0], team2[1], 1),
    ]);

  const matchupRates = [
    matchA1vsB1 && {
      hero: heroA1.stats.localized_name,
      vs: heroB1.stats.localized_name,
      winRate: matchA1vsB1.winRate,
    },
    matchA1vsB2 && {
      hero: heroA1.stats.localized_name,
      vs: heroB2.stats.localized_name,
      winRate: matchA1vsB2.winRate,
    },
    matchA2vsB1 && {
      hero: heroA2.stats.localized_name,
      vs: heroB1.stats.localized_name,
      winRate: matchA2vsB1.winRate,
    },
    matchA2vsB2 && {
      hero: heroA2.stats.localized_name,
      vs: heroB2.stats.localized_name,
      winRate: matchA2vsB2.winRate,
    },
  ].filter(Boolean) as { hero: string; vs: string; winRate: number }[];

  const synergies = [
    synA && {
      hero: heroA1.stats.localized_name,
      ally: heroA2.stats.localized_name,
      score: synA.synergyScore,
    },
    synB && {
      hero: heroB1.stats.localized_name,
      ally: heroB2.stats.localized_name,
      score: synB.synergyScore,
    },
  ].filter(Boolean) as { hero: string; ally: string; score: number }[];

  const toAbilityNames = (ctx: ReturnType<typeof getHeroById>) =>
    ctx?.abilities.map((a) => a.dname) ?? [];

  const prompt = buildPrompt({
    teamA: [
      { name: heroA1.stats.localized_name, abilities: toAbilityNames(heroA1) },
      { name: heroA2.stats.localized_name, abilities: toAbilityNames(heroA2) },
    ],
    teamB: [
      { name: heroB1.stats.localized_name, abilities: toAbilityNames(heroB1) },
      { name: heroB2.stats.localized_name, abilities: toAbilityNames(heroB2) },
    ],
    matchupRates,
    synergies,
  });

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Claude returned malformed JSON", raw: text.slice(0, 200) },
      { status: 502 },
    );
  }
  const result = LaneAnalysisSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Claude response did not match expected schema",
        details: result.error,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(result.data);
};
