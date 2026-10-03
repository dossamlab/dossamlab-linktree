// Converts the art in art-raw/ into the WebP files the page loads. Run: npm run art
// - art-raw/*.png: card illustrations and hero-bg (see docs/showroom-art-brief.md)
// - art-raw/render/sculpture/*.png: hero sculpture turntable frames (scripts/blender/sculpture.py)
// - art-raw/render/emblems/*.png: group emblems (scripts/blender/sculpture.py)
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = "art-raw";
const pngsIn = (dir) => (existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith(".png")) : []);

mkdirSync("public/visuals/covers", { recursive: true });
for (const file of pngsIn(RAW_DIR)) {
  const id = path.basename(file, ".png");
  const isHero = id === "hero-bg";
  for (const width of isHero ? [1280, 2400] : [480, 960]) {
    const height = Math.round(isHero ? (width * 9) / 16 : (width * 5) / 4);
    const out = isHero ? `public/visuals/hero-bg-${width}.webp` : `public/visuals/covers/${id}-${width}.webp`;
    await sharp(path.join(RAW_DIR, file)).resize(width, height, { fit: "cover" }).webp({ quality: 80 }).toFile(out);
    console.log(out);
  }
}

const SCULPTURE_DIR = path.join(RAW_DIR, "render/sculpture");
const frames = pngsIn(SCULPTURE_DIR);
if (frames.length) {
  // One square crop for every frame: the union of what the sculpture covers at each angle,
  // so the empty margin goes away without the turntable jumping between frames.
  const box = { left: Infinity, top: Infinity, right: 0, bottom: 0 };
  let size = 0;
  for (const file of frames) {
    const source = path.join(SCULPTURE_DIR, file);
    size = (await sharp(source).metadata()).width;
    const { info } = await sharp(source).trim().toBuffer({ resolveWithObject: true });
    const left = -info.trimOffsetLeft;
    const top = -info.trimOffsetTop;
    box.left = Math.min(box.left, left);
    box.top = Math.min(box.top, top);
    box.right = Math.max(box.right, left + info.width);
    box.bottom = Math.max(box.bottom, top + info.height);
  }
  const side = Math.min(size, Math.round(Math.max(box.right - box.left, box.bottom - box.top) * 1.04));
  const clamp = (value) => Math.max(0, Math.min(size - side, Math.round(value)));
  const crop = { left: clamp((box.left + box.right - side) / 2), top: clamp((box.top + box.bottom - side) / 2), width: side, height: side };
  console.log(`sculpture crop ${JSON.stringify(crop)} of ${size}px`);

  for (const width of [720, 480]) {
    mkdirSync(`public/visuals/sculpture/${width}`, { recursive: true });
    for (const file of frames) {
      const out = `public/visuals/sculpture/${width}/${path.basename(file, ".png")}.webp`;
      await sharp(path.join(SCULPTURE_DIR, file)).extract(crop).resize(width, width).webp({ quality: 74, alphaQuality: 80 }).toFile(out);
    }
    console.log(`public/visuals/sculpture/${width}/ (${frames.length} frames)`);
  }
}

const emblems = pngsIn(path.join(RAW_DIR, "render/emblems"));
if (emblems.length) mkdirSync("public/visuals/emblems", { recursive: true });
for (const file of emblems) {
  const out = `public/visuals/emblems/${path.basename(file, ".png")}.webp`;
  // Trim the transparent margin so the object fills the small emblem box.
  const trimmed = await sharp(path.join(RAW_DIR, "render/emblems", file)).trim().toBuffer();
  await sharp(trimmed)
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(out);
  console.log(out);
}
