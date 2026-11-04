import { copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "node_modules", "dotaconstants", "build");
const dest = join(root, "src", "data");

mkdirSync(dest, { recursive: true });

const files = ["heroes.json", "hero_abilities.json", "abilities.json"];
for (const file of files) {
  copyFileSync(join(src, file), join(dest, file));
  console.log(`Copied ${file}`);
}
