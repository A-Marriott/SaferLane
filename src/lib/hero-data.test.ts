import { describe, expect, it } from "vitest";
import { getAllHeroStats, getHeroById } from "./hero-data";

describe("getHeroById", () => {
  it("returns null for an unknown hero id", () => {
    expect(getHeroById(99999)).toBeNull();
  });

  it("returns a HeroContext for a known hero (Anti-Mage = 1)", () => {
    expect(getHeroById(1)).not.toBeNull();
  });

  it("returns correct stats for Anti-Mage", () => {
    const ctx = getHeroById(1)!;
    expect(ctx.stats.id).toBe(1);
    expect(ctx.stats.localized_name).toBe("Anti-Mage");
    expect(ctx.stats.primary_attr).toBe("agi");
    expect(ctx.stats.attack_type).toBe("Melee");
    expect(ctx.stats.roles).toContain("Carry");
    expect(ctx.stats.move_speed).toBeGreaterThan(0);
  });

  it("returns non-empty abilities for Anti-Mage", () => {
    const ctx = getHeroById(1)!;
    expect(ctx.abilities.length).toBeGreaterThan(0);
  });

  it("all abilities have a non-empty dname", () => {
    const ctx = getHeroById(1)!;
    for (const ability of ctx.abilities) {
      expect(ability.dname.length).toBeGreaterThan(0);
    }
  });

  it("all abilities have a defined behavior field", () => {
    const ctx = getHeroById(1)!;
    for (const ability of ctx.abilities) {
      expect(ability.behavior).toBeDefined();
    }
  });

  // generic_hidden has no dname — it should be excluded
  it("excludes abilities without a display name (e.g. generic_hidden)", () => {
    const ctx = getHeroById(1)!;
    const names = ctx.abilities.map((a) => a.dname);
    expect(names).not.toContain("");
  });
});

describe("getAllHeroStats", () => {
  it("returns a non-empty list", () => {
    expect(getAllHeroStats().length).toBeGreaterThan(0);
  });

  it("every entry has the required HeroStats fields", () => {
    for (const stats of getAllHeroStats()) {
      expect(typeof stats.id).toBe("number");
      expect(typeof stats.localized_name).toBe("string");
      expect(["str", "agi", "int", "all"]).toContain(stats.primary_attr);
      expect(["Melee", "Ranged"]).toContain(stats.attack_type);
      expect(Array.isArray(stats.roles)).toBe(true);
    }
  });

  it("contains Anti-Mage (id 1)", () => {
    const all = getAllHeroStats();
    expect(all.find((h) => h.id === 1)).toBeDefined();
  });
});
