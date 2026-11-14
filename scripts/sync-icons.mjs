import { mkdirSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const heroes = require("../src/data/heroes.json");
const dest = join(__dirname, "..", "public", "heroes", "icons");

mkdirSync(dest, { recursive: true });

const entries = Object.values(heroes);
let done = 0;

for (const hero of entries) {
  const shortName = hero.name.replace("npc_dota_hero_", "");
  const url = `https://steamcdn-a.akamaihd.net/apps/dota2/images/heroes/${shortName}_icon.png`;
  const outFile = join(dest, `${hero.name}.png`);

  let res = await fetch(url);
  if (!res.ok) {
    // Fallback to dota_react icon for newer heroes not in old CDN
    const fallbackPath = hero.icon?.replace(/\?$/, "");
    const fallbackUrl = `https://cdn.steamstatic.com${fallbackPath}`;
    res = await fetch(fallbackUrl);
    if (!res.ok) {
      console.warn(`Failed ${hero.name}: ${res.status}`);
      continue;
    }
    console.log(`\n  (fallback) ${hero.name}`);
  }

  const buffer = await res.arrayBuffer();
  const { writeFileSync } = await import("fs");
  writeFileSync(outFile, Buffer.from(buffer));

  done++;
  process.stdout.write(`\r${done}/${entries.length} icons downloaded`);
}

console.log(`\nDone. ${done} icons saved to public/heroes/icons/`);
