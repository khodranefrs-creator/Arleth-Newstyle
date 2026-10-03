# Arleth New Style — Barbershop, Houston TX

A dark, editorial, production-ready marketing site for **Arleth New Style Barbershop**
at 10850 S Gessner Rd, Houston, TX 77071.

Built with Next.js (App Router), React 19, Tailwind CSS v4 and TypeScript.
Every route is statically prerendered.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run images     # re-optimise source photography (Sharp)
npm run audit      # Playwright layout / a11y / contrast audit
```

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | in production | Canonical origin used for metadata, canonical links, Open Graph, `sitemap.xml` and `robots.txt`. Falls back to `https://arlethnewstyle.com`, which **must** be replaced with the real domain before launch. |

---

## Content integrity

This site deliberately ships **no invented content**. The following were verified
from the shop's own public profiles, Google Business Profile and Maps data, and
are stored in one place — [`lib/business.ts`](lib/business.ts):

- Address, phone, and geographic coordinates
- Instagram, TikTok, Threads, WhatsApp, Linktree and Google listing URLs
- Texas Cosmetology Commission TDLR licence number and listed expiry
- Real shop photography (see below)
- Recurring themes drawn from the volume of public Google reviews

The following are **not** presented anywhere, because they could not be verified:

- Prices or a service menu
- Opening hours
- Staff names or portraits
- Individual review quotes or star ratings attributed to a named reviewer
- Any online booking / scheduling product
- Awards, "since YYYY" founding claims, or "X customers served" statistics

`services` presents the two booking channels that *are* real (walk-ins and the
phone/WhatsApp line) instead of inventing a price list. Where the site links
outward — maps, directions, the Google listing, the social profiles — the link is
the verification.

### Photography

All imagery is genuine photography of this shop, sourced from its public Google
Business Profile plus the avatar published on the official Linktree. Originals are
kept out of git in `scripts/_raw/` (gitignored); `npm run images` produces the
optimised WebP set in `public/images/arleth/`.

The shop's Instagram media could not be retrieved programmatically (the public
endpoints rate-limit or require auth), so no Instagram imagery is used.

---

## Design system

Defined as CSS custom properties in [`app/globals.css`](app/globals.css).
Contrast ratios are annotated next to each colour token — the scale is
contrast-checked, not eyeballed.

| Token | Value | Role | On ink |
| --- | --- | --- | --- |
| `--color-ink` | `#0a0a09` | Page base | — |
| `--color-paper` | `#f3efe7` | Primary type | 17.4:1 |
| `--color-paper-dim` | `#cbc5b8` | Secondary type | 11.6:1 |
| `--color-mute` | `#9d9a92` | Body copy | 7.1:1 |
| `--color-mute-dim` | `#7e7c75` | Metadata, labels | 4.8:1 |
| `--color-ember` | `#d9713c` | Accent **type** on dark | 6.1:1 |
| `--color-ember-deep` | `#a94a1c` | Accent **fills** | 5.0:1 with paper text |

`ember` and `ember-deep` are intentionally different: a single copper cannot act
as both small accent type and a filled surface and stay at WCAG AA.

Typefaces are Archivo (display), Manrope (UI/body) and IBM Plex Mono (labels),
loaded through `next/font` so there is no layout shift and no external request.

---

## Accessibility

- Semantic landmarks, single `h1`, ordered heading levels, and a skip link
- Visible focus rings on every interactive element
- Full keyboard support in the navigation and the gallery lightbox
  (`Esc` closes, `←`/`→` move, focus is trapped and restored)
- `aria-expanded` / `aria-controls` on the mobile menu
- Sticky mobile action bar with real `<a>` semantics
- All decorative text and rules marked `aria-hidden`
- `prefers-reduced-motion` disables reveals, marquees and smooth scrolling
- Tap targets meet WCAG 2.2 AA (24px minimum) and are sized for 44px on touch

`npm run audit` drives a real Chromium across **320 / 390 / 430 / 768 / 1280 /
1440 / 1920** and fails on: document-level horizontal overflow, clipped text
(elements whose `scrollWidth` exceeds `clientWidth`), sub-AA tap targets,
sub-AA text contrast (accounting for `-webkit-text-stroke`), and images missing
`alt`. Decorative nodes marked `aria-hidden` are exempt from the contrast pass.

---

## Project layout

```
app/
  layout.tsx           fonts, metadata, JSON-LD (BarberShop + WebSite)
  page.tsx             homepage composition
  globals.css          design tokens, type scale, utilities
  opengraph-image.tsx  branded share image (built from real photography)
  icon.svg           favicon
  robots.ts sitemap.ts
components/            one file per section + header/footer/reveal
lib/business.ts        single source of truth for all verified facts
scripts/
  optimize-images.mjs  Sharp crop/resize pipeline
  audit.mjs            Playwright layout/a11y/contrast audit
  probe.mjs            computed-style diagnostics
  _raw/                original photography (gitignored)
```

---

## Deployment

The build is fully static (`next build` prerenders `/`, the OG image, the icon,
`robots.txt` and `sitemap.xml`) and can be deployed to any Node host or
static-aware platform. Set `NEXT_PUBLIC_SITE_URL` to the production origin
before building.