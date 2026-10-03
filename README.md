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
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin used for metadata, canonical links, Open Graph, `sitemap.xml` and `robots.txt`. **No custom domain is configured yet**, so production currently resolves via `VERCEL_PROJECT_PRODUCTION_URL` (injected by Vercel at build time) to `https://arleth-newstyle.vercel.app`. Set this variable explicitly when a real domain is added. See `lib/site-url.ts`. |

### Site origin

`lib/site-url.ts` is the single source of truth for the absolute origin, resolved in
this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL` — injected automatically on Vercel builds
3. `http://localhost:3000` — local development

An earlier revision hardcoded `https://arlethnewstyle.com` as the fallback. That
domain has no DNS record, and it shipped: canonical, `og:url`, `og:image`, the
sitemap and `robots.txt` all pointed at a dead host. Nothing looked broken at
build time, which is exactly why there is now **no invented default** — the
fallback is an obviously-local origin, and `warnIfUnresolvedOrigin()` prints a
build warning when it is in use.

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

**There are only three unique shop photographs.** The site used to ship ten files
from those three sources; perceptual hashing proved several were the same frame
(`interior.webp` and `work-02.webp` were a dHash distance of 2 apart), so the
page repeated itself and the gallery strip claimed "6 photographs" while showing
three pictures. The current rule, enforced in `lib/business.ts`:

- one photograph, one placement per page
- no re-crops added merely to fill space
- alt text describes only what is verifiable ("the shop interior"), never an
  unverified claim about what is in frame

Allocation: `google-01` → hero (tall) and the community band (wide, ~7000px
apart — the single deliberate repeat); `google-02` → gallery portrait;
`google-03` → gallery landscape.

The shop's Instagram media could not be retrieved programmatically (the public
endpoints return a rate-limited or JS-only shell and the media API requires
auth), so no Instagram imagery is used and nothing is claimed to come from it.
`scripts/image-audit.mjs` re-checks for duplicates via perceptual hashing.

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
  icon.svg             favicon
  robots.ts sitemap.ts
components/            one file per section + header/footer/reveal
lib/business.ts        single source of truth for all verified facts
assets/
  og-source.jpg        build-time input for the OG card (not deployed)
scripts/
  optimize-images.mjs  Sharp crop/resize pipeline
  audit.mjs            Playwright layout/a11y/contrast audit
  image-audit.mjs      perceptual-hash duplicate + image-quality forensics
  layout-audit.mjs     per-image render geometry, section heights, console errors
  network-audit.mjs    real image downloads, CLS, overflow
  probe-gallery.mjs    gallery grid row-packing / void check
  probe.mjs            computed-style diagnostics
  _raw/                original photography (gitignored)
```

---

## Deployment

The build is fully static (`next build` prerenders `/`, the OG image, the icon,
`robots.txt` and `sitemap.xml`) and can be deployed to any Node host or
static-aware platform. On Vercel no configuration is needed — the production
origin is injected automatically. On any other host, set `NEXT_PUBLIC_SITE_URL`
to that host's origin before building.