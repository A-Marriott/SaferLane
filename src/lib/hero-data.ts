import abilitiesRaw from "@/data/abilities.json";
import heroAbilitiesRaw from "@/data/hero_abilities.json";
import heroesRaw from "@/data/heroes.json";
import type { AbilityInfo, HeroContext, HeroStats } from "@/types/dota";

type RawHero = {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  base_armor: number;
  base_health: number;
  base_health_regen: number;
  move_speed: number;
  attack_range: number;
  base_attack_min: number;
  base_attack_max: number;
};

type RawAbility = {
  dname?: string;
  behavior?: string | string[];
  dmg_type?: string;
  bkbpierce?: string;
  desc?: string;
};

const heroes = heroesRaw as Record<string, RawHero>;
const abilities = abilitiesRaw as unknown as Record<string, RawAbility>;
const heroAbilities = heroAbilitiesRaw as Record<
  string,
  { abilities: string[] }
>;

// Build id → { npcName, stats } at module load time
const heroById = new Map<number, { npcName: string; stats: HeroStats }>();

for (const raw of Object.values(heroes)) {
  heroById.set(raw.id, {
    npcName: raw.name,
    stats: {
      id: raw.id,
      localized_name: raw.localized_name,
      primary_attr: raw.primary_attr as HeroStats["primary_attr"],
      attack_type: raw.attack_type as HeroStats["attack_type"],
      roles: raw.roles,
      base_armor: raw.base_armor,
      base_health: raw.base_health,
      base_health_regen: raw.base_health_regen,
      move_speed: raw.move_speed,
      attack_range: raw.attack_range,
      base_attack_min: raw.base_attack_min,
      base_attack_max: raw.base_attack_max,
    },
  });
}

export const getHeroById = (id: number): HeroContext | null => {
  const entry = heroById.get(id);
  if (!entry) return null;

  const abilityNames = heroAbilities[entry.npcName]?.abilities ?? [];

  const heroAbilityList: AbilityInfo[] = abilityNames
    .map((name): AbilityInfo | null => {
      const a = abilities[name];
      if (!a?.dname) return null;
      return {
        dname: a.dname,
        behavior: a.behavior ?? "",
        dmg_type: a.dmg_type,
        bkbpierce: a.bkbpierce,
        desc: a.desc,
      };
    })
    .filter((a): a is AbilityInfo => a !== null);

  return { stats: entry.stats, abilities: heroAbilityList };
};

export const getAllHeroStats = (): HeroStats[] => {
  return [...heroById.values()].map((e) => e.stats);
};
