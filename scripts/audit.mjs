/**
 * Layout + a11y audit. Measures the built site in a real browser across
 * breakpoints and reports anything that overflows its container, fails the
 * minimum tap-target size, or breaks contrast.
 *
 * Run: node scripts/audit.mjs [url]
 */
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4310/";

const viewports = [
  { name: "mobile-sm  320", width: 320, height: 720 },
  { name: "mobile     390", width: 390, height: 844 },
  { name: "phablet    430", width: 430, height: 932 },
  { name: "tablet     768", width: 768, height: 1024 },
  { name: "laptop    1280", width: 1280, height: 800 },
  { name: "desktop   1440", width: 1440, height: 900 },
  { name: "wide      1920", width: 1920, height: 1080 },
];

const browser = await chromium.launch();
let problems = 0;

/* ---------- helpers injected into the page ---------- */
const probe = () => {
  const out = { overflow: [], tap: [], small: [], contrast: [], tiny: [], images: [] };

  const vw = document.documentElement.clientWidth;

  /* 1. horizontal overflow */
  out.docScrollW = document.documentElement.scrollWidth;
  out.docClientW = vw;

  const describe = (el) => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
    return `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join(".")} "${t}"`;
  };

  /* 2. any element whose content spills past the viewport on the right */
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1.5 || r.left < -1.5) {
      /* ignore deliberate bleeds that sit inside an overflow-hidden parent */
      let p = el.parentElement, clipped = false;
      while (p) {
        const pc = getComputedStyle(p);
        if (pc.overflowX === "hidden" || pc.overflowX === "clip") { clipped = true; break; }
        p = p.parentElement;
      }
      if (clipped) continue;
      out.overflow.push({ el: describe(el), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }

  /* 3. text that overflows its own block (headings clipped by a column) */
  for (const el of document.querySelectorAll("h1,h2,h3,p,span,a,dd,dt,address,figcaption")) {
    if (el.children.length > 0 && el.tagName !== "A") continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.overflow !== "visible") continue;
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      out.tiny.push({ el: describe(el), scrollW: el.scrollWidth, clientW: el.clientWidth });
    }
  }

  /* 4. interactive tap targets. WCAG 2.2 AA "Target Size (Minimum)" is 24px;
     44px is the comfortable-target guideline we also want to hit. */
  if (vw < 768) {
    for (const el of document.querySelectorAll("a,button,[role=button]")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" && el.closest("header")) continue;
      if (r.height < 24 || r.width < 24) {
        out.tap.push({ el: describe(el), w: Math.round(r.width), h: Math.round(r.height), level: "AA" });
      } else if (r.height < 44 || r.width < 44) {
        out.small.push({ el: describe(el), w: Math.round(r.width), h: Math.round(r.height), level: "44" });
      }
    }
  }

  /* 5. images missing alt / dimensions */
  for (const img of document.querySelectorAll("img")) {
    if (img.getAttribute("alt") === null) out.images.push({ issue: "no alt", src: img.currentSrc.slice(-60) });
    if (!img.getAttribute("width") || !img.getAttribute("height")) {
      out.images.push({ issue: "no intrinsic size attrs", src: img.currentSrc.slice(-60) });
    }
  }

  return out;
};

const contrastFn = () => {
  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      const p = parse(c);
      if (p.length >= 3 && (p[3] === undefined || p[3] > 0.85)) return [p[0], p[1], p[2]];
      n = n.parentElement;
    }
    return [10, 10, 9];
  };
  const res = [];
  for (const el of document.querySelectorAll("p,span,a,h1,h2,h3,dt,dd,address,figcaption,button,li")) {
    const txt = (el.textContent || "").trim();
    if (!txt || el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.3) continue;
    /* Pure decoration (ghost wordmarks, rules, texture) is hidden from AT and
       exempt from 1.4.3 — measuring it only produces noise. */
    if (el.closest('[aria-hidden="true"]')) continue;
    /* Outlined (text-stroke) type paints with the stroke colour, not `color`. */
    let fg = parse(cs.color);
    const stroke = parse(cs.webkitTextStrokeColor);
    const strokeW = parseFloat(cs.webkitTextStrokeWidth || "0");
    if (stroke.length >= 3 && strokeW > 0 && fg[3] !== undefined && fg[3] === 0) fg = stroke;
    if (fg.length < 3) continue;
    const bg = bgOf(el);
    const l1 = lum(fg[0], fg[1], fg[2]);
    const l2 = lum(bg[0], bg[1], bg[2]);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      res.push({
        el: `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join(".")}`,
        txt: txt.slice(0, 40),
        ratio: Math.round(ratio * 100) / 100,
        need,
        px: Math.round(px),
      });
    }
  }
  return res;
};

/* ---------- run ---------- */
for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(700);

  const r = await page.evaluate(probe);
  const c = vp.width >= 768 ? await page.evaluate(contrastFn) : [];

  console.log(`\n=== ${vp.name} ===`);
  const overflowDoc = r.docScrollW > r.docClientW + 1;
  console.log(`  document scrollW ${r.docScrollW} vs clientW ${r.docClientW} ${overflowDoc ? "  <-- HORIZONTAL OVERFLOW" : "ok"}`);

  const bad = [...r.overflow, ...r.tiny, ...r.tap, ...r.images, ...c];
  problems += bad.length;
  if (!bad.length) console.log("  no issues");
  for (const o of r.overflow) console.log(`  OVERFLOW  ${JSON.stringify(o)}`);
  for (const o of r.tiny) console.log(`  CLIPPED   ${JSON.stringify(o)}`);
  for (const o of r.tap) console.log(`  TAP-AA    ${JSON.stringify(o)}`);
  for (const o of r.small) console.log(`  TAP-44    ${JSON.stringify(o)}`);
  for (const o of r.images) console.log(`  IMAGE     ${JSON.stringify(o)}`);
  for (const o of c) console.log(`  CONTRAST  ${JSON.stringify(o)}`);

  await page.close();
}

await browser.close();
console.log(`\n${problems === 0 ? "PASS — no layout, a11y or contrast problems found" : `TOTAL ISSUES: ${problems}`}`);
