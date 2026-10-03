// Converts art-raw/*.png (see docs/showroom-art-brief.md) into the WebP sizes the page loads. Run: npm run art
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = "art-raw";
mkdirSync("public/visuals/covers", { recursive: true });

for (const file of readdirSync(RAW_DIR).filter((name) => name.endsWith(".png"))) {
  const id = path.basename(file, ".png");
  const isHero = id === "hero-bg";
  for (const width of isHero ? [1280, 2400] : [480, 960]) {
    const height = Math.round(isHero ? (width * 9) / 16 : (width * 5) / 4);
    const out = isHero ? `public/visuals/hero-bg-${width}.webp` : `public/visuals/covers/${id}-${width}.webp`;
    await sharp(path.join(RAW_DIR, file)).resize(width, height, { fit: "cover" }).webp({ quality: 80 }).toFile(out);
    console.log(out);
  }
}
