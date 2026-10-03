import type { Metadata, Viewport } from "next";
import { Archivo, Manrope, IBM_Plex_Mono } from "next/font/google";
import { address, contact, identity, seo, socials, maps, location } from "@/lib/business";
import { siteUrl, warnIfUnresolvedOrigin } from "@/lib/site-url";
import "./globals.css";

/**
 * Set NEXT_PUBLIC_SITE_URL to the real production domain before launch.
 * See README.md and lib/site-url.ts — this value feeds canonical URLs,
 * Open Graph tags and schema, and an incorrect value is invisible locally.
 */
warnIfUnresolvedOrigin();

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: "%s | Arleth New Style Barbershop",
  },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: identity.name,
  authors: [{ name: identity.name }],
  creator: identity.name,
  publisher: identity.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: identity.name,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        /* Keep in sync with the `alt` export in opengraph-image.tsx, which
           takes precedence under Next's file-based metadata convention. Both
           read from seo.ogImageAlt so they cannot drift apart. */
        alt: seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "business",
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const sameAs = socials.map((s) => s.href);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgId = `${siteUrl}/#organization`;

  const barberShopSchema = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": orgId,
    name: identity.name,
    alternateName: [identity.shortName, "Arleth New Style Barber Shop"],
    description: seo.description,
    url: siteUrl,
    telephone: contact.phoneDisplay,
    image: [`${siteUrl}/opengraph-image`],
    address: {
      "@type": "PostalAddress",
      streetAddress: address.line1,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.postalCode,
      addressCountry: location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    hasMap: maps.listing,
    sameAs,
    areaServed: {
      "@type": "City",
      name: `${location.city}, ${location.stateName}`,
    },
    parentOrganization: {
      "@id": orgId,
    },
    knowsAbout: ["Haircuts", "Barber services", "Kids haircuts", "Walk-in barber"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: identity.name,
    inLanguage: "en-US",
    publisher: { "@id": orgId },
  };

  return (
    <html lang="en-US" className={`${archivo.variable} ${manrope.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([barberShopSchema, websiteSchema]),
          }}
        />
      </head>
      <body className="bg-ink text-paper antialiased">
        <a href="#main" className="skip-link label">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
