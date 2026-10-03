/**
 * Measures what the browser ACTUALLY downloads for images, which `img.src`
 * does not tell you (Next puts the largest candidate in `src` and lets the
 * browser choose from `srcset` + `sizes`).
 *
 * Also reports layout stability and the widest element on the page.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:4310";
const viewports = [
  { name: "320", width: 320, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

async function main() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    const images = [];
    page.on("response", async (res) => {
      const url = res.url();
      if (!url.includes("/_next/image")) return;
      try {
        const buf = await res.body();
        const file = decodeURIComponent((url.match(/url=([^&]+)/) || [])[1] || "?");
        images.push({
          file: file.split("/").pop(),
          kb: Math.round((buf.length / 1024) * 10) / 10,
          status: res.status(),
          url: url.replace(BASE, ""),
        });
      } catch {
        /* body unavailable */
      }
    });

    // layout shift
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) window.__cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const cls = await page.evaluate(() => window.__cls || 0);

    // scroll the whole page so every lazy image actually resolves
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const widest = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width > docW + 1 && r.height > 4) {
          out.push({
            sel: `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(/\s+/).filter(Boolean).slice(0, 3).join(".")}`,
            w: Math.round(r.width),
            docW,
          });
        }
      }
      return out.slice(0, 6);
    });

    const totalKb = images.reduce((a, b) => a + b.kb, 0);
    console.log(`\n${"=".repeat(74)}\nVIEWPORT ${vp.width}   CLS ${cls.toFixed(4)}   images downloaded: ${images.length}   total ${totalKb.toFixed(0)}KB`);
    console.log("-".repeat(74));
    for (const i of images) {
      console.log(`  ${String(i.kb).padStart(7)}KB  ${i.status}  ${i.file}`);
    }
    const over = images.filter((i) => i.kb > 170);
    if (over.length) {
      console.log(`  HEAVY (>170KB): ${over.map((i) => `${i.file}=${i.kb}KB`).join(", ")}`);
    }
    if (widest.length) {
      console.log(`  OVERFLOWING ELEMENTS (>${widest[0].docW}px):`);
      for (const w of widest) console.log(`    ${w.w}px  ${w.sel}`);
    } else {
      console.log(`  no element exceeds viewport width`);
    }

    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});