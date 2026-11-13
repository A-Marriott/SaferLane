import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAllySynergy, getLaneMatchupWinRate } from "./stratz";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("STRATZ_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const makeLaneOutcomeResponse = (rows: object[]) => ({
  ok: true,
  json: () => Promise.resolve({ data: { heroStats: { laneOutcome: rows } } }),
});

describe("getLaneMatchupWinRate", () => {
  it("returns win rate for a matching pair", async () => {
    mockFetch.mockResolvedValue(
      makeLaneOutcomeResponse([
        { heroId2: 20, matchCount: 100, winCount: 55, lossCount: 45 },
        { heroId2: 25, matchCount: 200, winCount: 90, lossCount: 110 },
      ]),
    );

    const result = await getLaneMatchupWinRate(8, 20, 1);
    expect(result).toEqual({
      heroId: 8,
      vsHeroId: 20,
      position: 1,
      winRate: 0.55,
    });
  });

  it("includes correct positionIds in query", async () => {
    mockFetch.mockResolvedValue(makeLaneOutcomeResponse([]));
    await getLaneMatchupWinRate(8, 20, 2);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.query).toContain("POSITION_2");
    expect(body.query).toContain("isWith: false");
  });

  it("returns null when vsHeroId not in results", async () => {
    mockFetch.mockResolvedValue(
      makeLaneOutcomeResponse([
        { heroId2: 99, matchCount: 50, winCount: 25, lossCount: 25 },
      ]),
    );
    expect(await getLaneMatchupWinRate(8, 20, 1)).toBeNull();
  });

  it("returns null when matchCount is zero", async () => {
    mockFetch.mockResolvedValue(
      makeLaneOutcomeResponse([
        { heroId2: 20, matchCount: 0, winCount: 0, lossCount: 0 },
      ]),
    );
    expect(await getLaneMatchupWinRate(8, 20, 1)).toBeNull();
  });

  it("throws on invalid position", async () => {
    await expect(getLaneMatchupWinRate(8, 20, 6)).rejects.toThrow(
      "Invalid position",
    );
  });

  it("throws when STRATZ_API_KEY is not set", async () => {
    vi.unstubAllEnvs();
    await expect(getLaneMatchupWinRate(8, 20, 1)).rejects.toThrow(
      "STRATZ_API_KEY",
    );
  });

  it("throws on non-ok HTTP response", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 429 });
    await expect(getLaneMatchupWinRate(8, 20, 1)).rejects.toThrow(
      "Stratz API error: 429",
    );
  });
});

describe("getAllySynergy", () => {
  it("returns synergy score for a matching ally pair", async () => {
    mockFetch.mockResolvedValue(
      makeLaneOutcomeResponse([{ heroId2: 5, matchCount: 500, winCount: 300 }]),
    );

    const result = await getAllySynergy(8, 5, 1);
    expect(result).toEqual({
      heroId: 8,
      allyHeroId: 5,
      position: 1,
      synergyScore: 0.6,
    });
  });

  it("includes isWith: true in query", async () => {
    mockFetch.mockResolvedValue(makeLaneOutcomeResponse([]));
    await getAllySynergy(8, 5, 1);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.query).toContain("isWith: true");
  });

  it("returns null when allyHeroId not found", async () => {
    mockFetch.mockResolvedValue(makeLaneOutcomeResponse([]));
    expect(await getAllySynergy(8, 5, 1)).toBeNull();
  });
});
