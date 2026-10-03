/**
 * Builds the production image set from the real Arleth New Style source photos.
 *
 * SOURCE PROVENANCE
 *  - google-01 / google-02 / google-03 were downloaded from the shop's own Google
 *    Business Profile (Place ID ChIJL4HRXWLpQIYR9mfAMrhX4Vk, 10850 S Gessner Rd).
 *    These are owner-uploaded photos of the business itself.
 *  - avatar-source.jpeg is the brand avatar from the shop's official Linktree.
 *
 * No stock photography, no generated imagery, no other businesses.
 *
 * Each output slot is a real crop of a real photo. Crops are framing choices
 * (art direction), not new content.
 *
 * Run: npm run images
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "scripts", "_raw");
const outDir = path.join(root, "public", "images", "arleth");

/** @type {{ out: string, src: string, w: number, h: number, pos: string, q?: number }[]} */
const slots = [
  // Hero — tall editorial portrait, right column of the hero
  { out: "hero", src: "google-01.jpg", w: 1100, h: 1467, pos: "attention" },

  // Lookbook — full frames
  { out: "work-01", src: "google-02.jpg", w: 1100, h: 1467, pos: "attention" },
  { out: "work-02", src: "google-03.jpg", w: 1600, h: 1200, pos: "attention" },
  { out: "work-03", src: "google-01.jpg", w: 1200, h: 1200, pos: "centre" },
  { out: "work-04", src: "google-02.jpg", w: 1600, h: 900, pos: "north" },

  // Shop / experience
  { out: "interior", src: "google-03.jpg", w: 1400, h: 1050, pos: "centre" },

  // Detail crops — tight bands used as rhythm between full frames
  { out: "detail-01", src: "google-01.jpg", w: 1600, h: 800, pos: "south" },
  { out: "detail-02", src: "google-03.jpg", w: 1000, h: 1400, pos: "east" },
];

const avatarSlot = { out: "brand-avatar", src: "avatar-source.jpg", w: 600, h: 600 };

/**
 * Dedicated source for the social share card. satori (next/og) cannot decode
 * WebP, so this stays a JPEG.
 */
async function buildOgSource() {
  const input = path.join(srcDir, "google-01.jpg");
  if (!existsSync(input)) {
    console.warn("  ! missing source for og card (skipping)");
    return;
  }
  await sharp(input)
    .rotate()
    .resize(1080, 1260, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(outDir, "og-source.jpg"));
  console.log("  ok  og-source.jpg  1080x1260");
}

async function build({ out, src, w, h, pos, q = 80 }) {
  const input = path.join(srcDir, src);
  if (!existsSync(input)) {
    console.warn(`  ! missing source: ${src} (skipping ${out})`);
    return false;
  }
  await sharp(input)
    .rotate()
    .resize(w, h, { fit: "cover", position: pos, withoutEnlargement: false })
    .webp({ quality: q, effort: 5 })
    .toFile(path.join(outDir, `${out}.webp`));

  const meta = await sharp(path.join(outDir, `${out}.webp`)).metadata();
  const { size } = await stat(path.join(outDir, `${out}.webp`));
  console.log(
    `  ok  ${out}.webp  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)}kb`,
  );
  return true;
}

async function main() {
  if (!existsSync(srcDir)) {
    console.error(`No raw source folder at ${srcDir}`);
    process.exit(1);
  }
  await mkdir(outDir, { recursive: true });

  console.log("Source files:");
  console.log((await readdir(srcDir)).map((f) => `  - ${f}`).join("\n"));

  console.log("\nBuilding slots:");
  for (const slot of slots) await build(slot);
  await build({ ...avatarSlot, pos: "attention", q: 88 });
  await buildOgSource();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
