import type { AllySynergy, LaneMatchupRate } from "@/types/dota";

const STRATZ_API = "https://api.stratz.com/graphql";

type PositionEnum =
  | "POSITION_1"
  | "POSITION_2"
  | "POSITION_3"
  | "POSITION_4"
  | "POSITION_5";

const toPositionEnum = (position: number): PositionEnum => {
  if (position < 1 || position > 5)
    throw new Error(`Invalid position: ${position}`);
  return `POSITION_${position}` as PositionEnum;
};

type LaneOutcomeRow = {
  heroId2: number;
  position: string;
  matchCount: number;
  winCount: number;
  lossCount: number;
};

type LaneOutcomeResponse = {
  data: {
    heroStats: {
      laneOutcome: LaneOutcomeRow[];
    };
  };
};

const stratzQuery = async <T>(query: string): Promise<T> => {
  const key = process.env.STRATZ_API_KEY;
  if (!key) throw new Error("STRATZ_API_KEY is not set");

  const res = await fetch(STRATZ_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "User-Agent": "STRATZ_API",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`Stratz API error: ${res.status}`);
  return res.json() as Promise<T>;
};

export const getLaneMatchupWinRate = async (
  heroId: number,
  vsHeroId: number,
  position: number,
): Promise<LaneMatchupRate | null> => {
  const posEnum = toPositionEnum(position);
  const query = `{
    heroStats {
      laneOutcome(heroId: ${heroId}, isWith: false, bracketBasicIds: [DIVINE_IMMORTAL], positionIds: [${posEnum}]) {
        heroId2
        matchCount
        winCount
        lossCount
      }
    }
  }`;

  const data = await stratzQuery<LaneOutcomeResponse>(query);
  const row = (data.data?.heroStats?.laneOutcome ?? []).find(
    (o) => o.heroId2 === vsHeroId,
  );

  if (!row || row.matchCount === 0) return null;
  return { heroId, vsHeroId, position, winRate: row.winCount / row.matchCount };
};

export const getAllySynergy = async (
  heroId: number,
  allyHeroId: number,
  position: number,
): Promise<AllySynergy | null> => {
  const posEnum = toPositionEnum(position);
  const query = `{
    heroStats {
      laneOutcome(heroId: ${heroId}, isWith: true, bracketBasicIds: [DIVINE_IMMORTAL], positionIds: [${posEnum}]) {
        heroId2
        matchCount
        winCount
      }
    }
  }`;

  const data = await stratzQuery<LaneOutcomeResponse>(query);
  const row = (data.data?.heroStats?.laneOutcome ?? []).find(
    (o) => o.heroId2 === allyHeroId,
  );

  if (!row || row.matchCount === 0) return null;
  return {
    heroId,
    allyHeroId,
    position,
    synergyScore: row.winCount / row.matchCount,
  };
};
