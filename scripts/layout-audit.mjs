/**
 * Layout + image-rendering forensics against the running production build.
 *
 * Measures what the eye would judge, since the audit cannot view the page:
 *  - every <img>: rendered box vs natural box, object-fit, object-position,
 *    effective bytes-per-rendered-pixel, loading strategy, CLS contribution
 *  - duplicate image placements and how far apart they sit on the page
 *  - section heights (flagging sections that are mostly empty space)
 *  - console errors / failed requests
 */
import { chromium } from "playwright";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL || "http://localhost:4310";

const viewports = [
  { name: "320", width: 320, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

/** byte weight of each shipped asset, for waste analysis */
const assetBytes = {};
async function loadAssetSizes() {
  const dir = path.join(root, "public", "images", "arleth");
  const { readdir } = await import("node:fs/promises");
  for (const f of await readdir(dir)) {
    assetBytes[f] = (await stat(path.join(dir, f))).size;
  }
}

const probe = () => {
  const imgs = [...document.querySelectorAll("img")].map((img) => {
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt"),
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      boxW: Math.round(r.width),
      boxH: Math.round(r.height),
      top: Math.round(r.top + window.scrollY),
      loading: img.getAttribute("loading") || "(eager)",
      decoding: img.getAttribute("decoding") || "",
      fetchPriority: img.getAttribute("fetchpriority") || "",
      objectFit: cs.objectFit,
      objectPosition: cs.objectPosition,
      renderedAR: r.height ? (r.width / r.height).toFixed(3) : "0",
      naturalAR: img.naturalHeight ? (img.naturalWidth / img.naturalHeight).toFixed(3) : "0",
      complete: img.complete,
      inInitialViewport: r.top < window.innerHeight && r.bottom > 0,
    };
  });

  const sections = [...document.querySelectorAll("section, footer, header")].map((s) => {
    const r = s.getBoundingClientRect();
    return {
      tag: s.tagName.toLowerCase(),
      id: s.id || "",
      label:
        (s.querySelector("h1,h2")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34) ||
        s.getAttribute("aria-label") ||
        "",
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
    };
  });

  const docH = document.documentElement.scrollHeight;
  return { imgs, sections, docH, vw: window.innerWidth };
};

async function main() {
  await loadAssetSizes();
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    const consoleErrors = [];
    const failed = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 120));
    });
    page.on("requestfailed", (r) => failed.push(`${r.url().slice(-60)} ${r.failure()?.errorText}`));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(-60)}`);
    });

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
    await page.waitForTimeout(400);

    const data = await page.evaluate(probe);

    console.log(`\n${"=".repeat(78)}\nVIEWPORT ${vp.width}\n${"=".repeat(78)}`);
    console.log(`document height: ${data.docH}px`);

    // duplicate placements
    const bySrc = new Map();
    for (const im of data.imgs) {
      if (!bySrc.has(im.src)) bySrc.set(im.src, []);
      bySrc.get(im.src).push(im);
    }
    const dupes = [...bySrc.entries()].filter(([, v]) => v.length > 1);
    if (dupes.length) {
      console.log(`\nDUPLICATE image placements on one page: ${dupes.length}`);
      for (const [src, list] of dupes) {
        const file = src.split("/").pop();
        const tops = list.map((i) => i.top);
        const spread = Math.max(...tops) - Math.min(...tops);
        console.log(
          `  ${file}  x${list.length}  tops=[${tops.join(", ")}]  vertical spread ${spread}px  boxes=${list
            .map((i) => `${i.boxW}x${i.boxH}`)
            .join(" / ")}`,
        );
      }
    } else {
      console.log(`\nDUPLICATE image placements: none`);
    }

    // distortion + waste
    console.log(`\nIMAGES (rendered vs natural)`);
    console.log(
      `  ${"file".padEnd(20)}${"box".padEnd(11)}${"natural".padEnd(11)}${"rAR".padEnd(7)}${"nAR".padEnd(7)}${"fit".padEnd(6)}${"load".padEnd(9)}${"KB/renderPx".padEnd(12)}flags`,
    );
    for (const im of data.imgs) {
      const file = im.src.split("/").pop() || "(none)";
      const px = im.boxW * im.boxH;
      const kb = (assetBytes[file] || 0) / 1024;
      const density = px ? kb / (px / 1000) : 0;
      const flags = [];
      if (im.renderedAR !== "0" && im.naturalAR !== "0") {
        const d = Math.abs(Number(im.renderedAR) - Number(im.naturalAR)) / Number(im.naturalAR);
        if (d > 0.02) flags.push(`ASPECT-LOSS(${Math.round(d * 100)}%)`);
      }
      if (!im.complete) flags.push("NOT-COMPLETE");
      if (im.alt === null) flags.push("NO-ALT-ATTR");
      if (im.boxH < 80) flags.push(`TINY-BOX(${im.boxH}px)`);
      if (density > 0.9) flags.push(`HEAVY(${density.toFixed(2)}kb/kpx)`);
      if (im.inInitialViewport && im.loading === "lazy") flags.push("LAZY-ABOVE-FOLD");
      console.log(
        `  ${file.padEnd(20)}${`${im.boxW}x${im.boxH}`.padEnd(11)}${`${im.naturalW}x${im.naturalH}`.padEnd(11)}${im.renderedAR.padEnd(7)}${im.naturalAR.padEnd(7)}${(im.objectFit || "-").padEnd(6)}${im.loading.padEnd(9)}${density.toFixed(2).padEnd(12)}${flags.join(" ")}`,
      );
    }

    // section height distribution -> clutter / emptiness
    console.log(`\nSECTION HEIGHTS (share of page)`);
    const total = data.docH;
    const rows = data.sections
      .filter((s) => s.height > 0)
      .sort((a, b) => a.top - b.top);
    for (const s of rows) {
      const pct = ((s.height / total) * 100).toFixed(1);
      const bar = "#".repeat(Math.max(0, Math.round(s.height / 120)));
      console.log(
        `  ${s.top.toString().padStart(6)}  ${`${s.height}px`.padStart(7)} ${`${pct}%`.padStart(6)}  ${s.tag}${s.id ? "#" + s.id : ""} ${s.label.slice(0, 30).padEnd(30)} ${bar}`,
      );
    }

    if (consoleErrors.length) console.log(`\nCONSOLE ERRORS: ${consoleErrors.length}`);
    for (const e of consoleErrors) console.log(`  ${e}`);
    const realFailed = failed.filter((f) => !/favicon/i.test(f));
    if (realFailed.length) {
      console.log(`\nFAILED REQUESTS: ${realFailed.length}`);
      for (const f of realFailed) console.log(`  ${f}`);
    }

    await page.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});