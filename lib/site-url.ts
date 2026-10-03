/**
 * Single source of truth for the absolute origin used by canonical URLs,
 * Open Graph tags, JSON-LD, sitemap.xml and robots.txt.
 *
 * Resolution order (first candidate that yields a valid absolute origin wins):
 *  1. NEXT_PUBLIC_SITE_URL          — explicit override, always wins
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time, so the
 *                                     correct origin is used on deploy with no
 *                                     manual configuration
 *  3. http://localhost:3000         — local development
 *
 * There is deliberately NO invented fallback domain. An earlier revision
 * hardcoded "https://arlethnewstyle.com", which has no DNS record; that
 * shipped to production and broke canonical URLs, og:url, og:image, the
 * sitemap and robots.txt all at once. A wrong default is worse than a
 * visible localhost default, because nothing looks broken at build time.
 *
 * NOTE: VERCEL_PROJECT_PRODUCTION_URL is a BARE HOSTNAME with no protocol —
 * its literal value is "arleth-newstyle.vercel.app". Passing that straight to
 * `new URL()` throws ERR_INVALID_URL and fails the build at page-data
 * collection, so every candidate is normalised before use.
 */

/**
 * Turn a possibly-bare hostname into a validated absolute origin, or return
 * null if it cannot be made into one. Adds https:// when no protocol is
 * present and reduces the result to `URL.origin` so a stray path or trailing
 * slash cannot leak into canonical URLs.
 */
function toOrigin(raw: string | undefined | null): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export const siteUrl =
  toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "http://localhost:3000";

export const isLocalOrigin = siteUrl.startsWith("http://localhost");

/**
 * Loud build-time warning. A metadata bug like a dead canonical is invisible
 * in the browser — it only shows up as a broken share card or an unindexed
 * sitemap — so it has to shout at build time instead.
 *
 * Guarded by globalThis so each build worker prints at most once.
 */
export function warnIfUnresolvedOrigin() {
  if (!isLocalOrigin) return;
  const seen = globalThis as { __arlethOriginWarned?: boolean };
  if (seen.__arlethOriginWarned) return;
  seen.__arlethOriginWarned = true;
  console.warn(
    "[site-url] Origin not set - canonical/og/sitemap will point at localhost. " +
      "Set NEXT_PUBLIC_SITE_URL, or build on Vercel which injects " +
      "VERCEL_PROJECT_PRODUCTION_URL automatically. (lib/site-url.ts)",
  );
}