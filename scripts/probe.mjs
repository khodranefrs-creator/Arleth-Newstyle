import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4310/";
const width = Number(process.argv[3] ?? 390);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, missing: true };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      sel,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      display: cs.display,
      padding: cs.padding,
      paddingBlock: cs.paddingBlock,
      paddingInline: cs.paddingInline,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      position: cs.position,
      gridColumn: cs.gridColumn,
      gridTemplateColumns: cs.gridTemplateColumns,
    };
  };
  return {
    galleryGrid: pick('#work .grid.grid-cols-4'),
    heroTypeCol: pick('h1'),
    heroLine: pick('h1 .hero-display + div .hero-display, h1 div .hero-display'),
    btnHeader: pick('header a.btn'),
    heroAddr: pick('main a.group.flex'),
    mobileSheetBtn: pick('#mobile-nav a.btn'),
    shell: pick('main .shell'),
    main: pick('main'),
    sectionWork: pick('#work'),
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
