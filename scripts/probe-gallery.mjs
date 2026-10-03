/**
 * Focused probe on the gallery grid: row packing, empty cells, per-frame
 * geometry, and whether the grid's last row leaves a void.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:4310";

async function main() {
  const browser = await chromium.launch();
  for (const w of [768, 1024, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const info = await page.evaluate(() => {
      const grid = document.querySelector("#work .grid.grid-cols-4");
      if (!grid) return { err: "grid not found" };
      const gcs = getComputedStyle(grid);
      const cols = gcs.gridTemplateColumns.split(" ").map((v) => Math.round(parseFloat(v)));
      const kids = [...grid.children].map((k) => {
        const r = k.getBoundingClientRect();
        const img = k.querySelector("img");
        const fig = k.querySelector("figure, .frame, div");
        const fr = fig ? fig.getBoundingClientRect() : null;
        return {
          kind: img ? "IMG" : "PANEL",
          file: img ? decodeURIComponent(img.src).split("url=")[1]?.split("&")[0].split("/").pop() : "live-feed-panel",
          left: Math.round(r.left),
          top: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
          frameH: fr ? Math.round(fr.height) : null,
          frameW: fr ? Math.round(fr.width) : null,
          colStart: gcs.gridColumnStart,
        };
      });
      // group into visual rows by top offset
      const rows = [];
      for (const k of kids) {
        let row = rows.find((r) => Math.abs(r.top - k.top) < 8);
        if (!row) rows.push({ top: k.top, items: [], width: 0 });
        row = rows.find((r) => Math.abs(r.top - k.top) < 8);
        row.items.push(k);
      }
      for (const r of rows) r.width = r.items.reduce((a, b) => a + b.w, 0);
      return {
        cols,
        gridWidth: Math.round(grid.getBoundingClientRect().width),
        rows: rows.map((r) => ({
          top: r.top,
          usedWidth: r.width,
          colsUsed: r.items.length,
          items: r.items.map((i) => `${i.kind}:${i.file}@${i.left}(${i.w}x${i.frameH ?? i.h})`),
        })),
        sectionHeight: Math.round(document.querySelector("#work").getBoundingClientRect().height),
      };
    });

    console.log(`\n${"=".repeat(76)}\nWIDTH ${w}   grid=${info.gridWidth}px  cols=[${info.cols.join(",")}]  #work height=${info.sectionHeight}px`);
    for (const r of info.rows) {
      const voidPx = info.gridWidth - r.usedWidth;
      const flag = voidPx > 8 ? `  <-- VOID ${voidPx}px (${Math.round((voidPx / info.gridWidth) * 100)}% of row empty)` : "";
      console.log(`  row top=${r.top}  used=${r.usedWidth}px  ${flag}`);
      for (const i of r.items) console.log(`      ${i}`);
    }
    await page.close();
  }
  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});