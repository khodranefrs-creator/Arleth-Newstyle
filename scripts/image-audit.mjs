/**
 * Image forensics.
 *
 * Because the audit cannot rely on filenames, this measures the pixels:
 *  - dimensions / aspect ratio / file weight
 *  - aHash + dHash perceptual hashes to find images that are the SAME photograph
 *    re-cropped (filenames and byte size will not reveal this)
 *  - mean luminance, contrast (stddev) and saturation, to catch imagery that is
 *    crushed to black, blown out, or visually inconsistent with its neighbours
 *
 * Run: node scripts/image-audit.mjs
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function hash(file) {
  // aHash: 8x8 mean threshold. dHash: 9x8 horizontal gradient.
  const { data, info } = await sharp(file)
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = data;
  const bits = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits.push(px[y * 9 + x] > px[y * 9 + x + 1] ? 1 : 0);
    }
  }
  const ah = bits.join("");

  const dbits = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      dbits.push(px[y * 9 + x] < px[y * 9 + x + 1] ? 1 : 0);
    }
  }
  const dh = dbits.join("");

  return { ah, dh, info };
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

async function stats(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { data, info } = await img
    .resize(160, 160, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let sum = 0;
  let sumSq = 0;
  let satSum = 0;
  const n = info.width * info.height;
  for (let i = 0; i < n; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += lum;
    sumSq += lum * lum;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    satSum += mx === 0 ? 0 : (mx - mn) / mx;
  }
  const mean = sum / n;
  const sd = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
  const sat = (satSum / n) * 100;
  // share of very dark / very bright pixels
  let dark = 0;
  let bright = 0;
  for (let i = 0; i < n; i++) {
    const lum = 0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2];
    if (lum < 12) dark++;
    if (lum > 244) bright++;
  }

  return {
    w: meta.width,
    h: meta.height,
    ar: (meta.width / meta.height).toFixed(3),
    format: meta.format,
    mean: mean.toFixed(1),
    contrast: sd.toFixed(1),
    sat: sat.toFixed(1),
    crushedPct: ((dark / n) * 100).toFixed(1),
    blownPct: ((bright / n) * 100).toFixed(1),
  };
}

async function walk(dir, label) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, label)));
    else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name)) out.push({ file: full, name: e.name, group: label });
  }
  return out;
}

async function main() {
  const sets = [
    ...(await walk(path.join(root, "scripts", "_raw"), "RAW SOURCE")),
    ...(await walk(path.join(root, "public"), "SHIPPED")),
  ];

  const rows = [];
  for (const s of sets) {
    const st = await stat(s.file);
    const h = await hash(s.file);
    const q = await stats(s.file);
    rows.push({ ...s, kb: st.size / 1024, ...q, ah: h.ah, dh: h.dh });
  }

  console.log("=== IMAGE FORENSICS ===\n");
  console.log(
    "group".padEnd(12) +
      "file".padEnd(20) +
      "dims".padEnd(12) +
      "ar".padEnd(7) +
      "KB".padEnd(8) +
      "mean".padEnd(7) +
      "contr".padEnd(7) +
      "sat".padEnd(7) +
      "crush%".padEnd(8) +
      "blown%",
  );
  console.log("-".repeat(105));
  for (const r of rows) {
    console.log(
      r.group.padEnd(12) +
        r.name.padEnd(20) +
        `${r.w}x${r.h}`.padEnd(12) +
        r.ar.padEnd(7) +
        r.kb.toFixed(0).padEnd(8) +
        r.mean.padEnd(7) +
        r.contrast.padEnd(7) +
        r.sat.padEnd(7) +
        r.crushedPct.padEnd(8) +
        r.blownPct,
    );
  }

  // duplicate detection across everything
  console.log("\n=== PERCEPTUAL DUPLICATE CLUSTERS (dHash distance) ===");
  console.log("same photograph re-cropped => small distance; unrelated => large\n");
  const SHIPPED = rows.filter((r) => r.group === "SHIPPED");
  const seen = new Map();
  for (const r of rows) {
    const key = r.ah;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(r);
  }
  let cluster = 0;
  for (const list of seen.values()) {
    const uniq = new Map();
    for (const r of list) uniq.set(r.group + "|" + r.name, r);
    const arr = [...uniq.values()];
    let min = 999;
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++)
        min = Math.min(min, hamming(arr[i].dh, arr[j].dh));
    if (arr.length > 1 || min < 10) {
      cluster++;
      console.log(`cluster ${cluster}  (min dHash distance ${min})`);
      for (const r of arr) console.log(`    ${r.group.padEnd(12)} ${r.name}  ${r.w}x${r.h}`);
    }
  }

  console.log("\n=== SHIPPED IMAGE PAIRS, sorted by similarity ===");
  const pairs = [];
  for (let i = 0; i < SHIPPED.length; i++)
    for (let j = i + 1; j < SHIPPED.length; j++) {
      pairs.push({
        a: SHIPPED[i].name,
        b: SHIPPED[j].name,
        d: hamming(SHIPPED[i].dh, SHIPPED[j].dh),
      });
    }
  pairs.sort((x, y) => x.d - y.d);
  for (const p of pairs.slice(0, 16)) {
    const flag = p.d <= 10 ? "SAME PHOTO" : p.d <= 16 ? "similar" : "";
    console.log(`  ${String(p.d).padStart(3)}  ${p.a.padEnd(20)} ${p.b.padEnd(20)} ${flag}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});