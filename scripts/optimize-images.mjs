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
 * There are only THREE unique shop photographs. Each is cropped at most twice
 * and only where two genuinely different framings are needed (the hero's tall
 * portrait and the community band's wide atmosphere shot). Previously this file
 * produced ten outputs from those same three sources; perceptual hashing showed
 * several were the same frame, so the site repeated itself. Do not add slots
 * just to fill the layout — a smaller, honest gallery is the intent.
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
/* Build-time only input for the OG card. Deliberately NOT under public/, so it
   is never deployed as a fetchable asset. */
const ogDir = path.join(root, "assets");

/** @type {{ out: string, src: string, w: number, h: number, pos: string, q?: number }[]} */
const slots = [
  // Hero — tall editorial portrait, right column of the hero
  { out: "hero", src: "google-01.jpg", w: 1100, h: 1467, pos: "attention" },

  // Lookbook — one frame per unique photograph, no re-crops
  { out: "work-01", src: "google-02.jpg", w: 1100, h: 1467, pos: "attention" },
  { out: "work-02", src: "google-03.jpg", w: 1600, h: 1200, pos: "attention" },

  // Community band — the hero shot again, ~7000px further down the page.
  // Desktop gets a wide 2:1 crop; mobile reuses the hero's existing 3:4 crop
  // rather than generating a byte-identical duplicate of it.
  { out: "detail-01", src: "google-01.jpg", w: 1600, h: 800, pos: "south" },
];

const avatarSlot = { out: "brand-avatar", src: "avatar-source.jpg", w: 600, h: 600 };

/**
 * Dedicated source for the social share card. satori (next/og) cannot decode
 * WebP, so this stays a JPEG. Written to assets/, not public/.
 */
async function buildOgSource() {
  const input = path.join(srcDir, "google-01.jpg");
  if (!existsSync(input)) {
    console.warn("  ! missing source for og card (skipping)");
    return;
  }
  await mkdir(ogDir, { recursive: true });
  await sharp(input)
    .rotate()
    .resize(1080, 1260, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(ogDir, "og-source.jpg"));
  console.log("  ok  assets/og-source.jpg  1080x1260");
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
