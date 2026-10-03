/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 * Every piece of content on this site resolves through this file. If a fact is
 * not in here, it is not on the site.
 *
 * PROVENANCE LEGEND
 *   owner   — supplied directly by the business for this project
 *   public  — read from the business's own public profiles / listings
 *   google  — read from the business's Google Business Profile (Place ID below)
 *   editorial — original copy written for this site. Contains no factual claims
 *               about awards, years in business, staff, pricing or statistics.
 *
 * DELIBERATELY ABSENT (not verifiable from any trustworthy source)
 *   - opening hours table          - prices / service menu
 *   - staff or barber names        - awards, "best in Houston" claims
 *   - review quotes with names     - founding year, years in business
 *   - client counts / statistics   - online booking URL
 * ============================================================================
 */

export const provenance = {
  owner:
    "Supplied by the business for this project (brief, Instagram bio, Linktree).",
  public:
    "Read from the business's own public profiles: Instagram, TikTok, Threads, Linktree.",
  google:
    "Read from the business's Google Business Profile and the public review record it describes.",
  editorial:
    "Original copy written for this site. Makes no unverified factual claims.",
} as const;

/* ---------------------------------------------------------------------------
 * IDENTITY
 * ------------------------------------------------------------------------ */

export const identity = {
  name: "Arleth New Style Barbershop",
  shortName: "Arleth New Style",
  wordmarkTop: "Arleth",
  wordmarkBottom: "New Style",
  trade: "Barbershop",
  city: "Houston",
  state: "TX",
  stateName: "Texas",
  neighbourhood: "Brays Oaks",
  zip: "77071",
  founded: null,
} as const;

/* ---------------------------------------------------------------------------
 * CONTACT
 * ------------------------------------------------------------------------ */

const rawPhone = "3462138130";

export const contact = {
  phoneDisplay: "(346) 213-8130",
  phoneHref: `tel:+1${rawPhone}`,
  phoneRaw: rawPhone,
  whatsappHref: `https://wa.me/${rawPhone}`,
  whatsappNumber: rawPhone,
  email: null,
  bookingUrl: null,
} as const;

/* ---------------------------------------------------------------------------
 * LOCATION
 * ------------------------------------------------------------------------ */

export const location = {
  street: "10850 S Gessner Rd",
  city: "Houston",
  state: "TX",
  stateName: "Texas",
  postalCode: "77071",
  country: "US",
  countryName: "United States",
  /** Verified coordinates for the shop's Google Business Profile. */
  latitude: 29.661777,
  longitude: -95.528866,
  /** Verified Google Business Profile Place ID — used for maps + reviews links. */
  googlePlaceId: "ChIJL4HRXWLpQIYR9mfAMrhX4Vk",
} as const;

export const address = {
  line1: location.street,
  line2: `${location.city}, ${location.state} ${location.postalCode}`,
  single: `${location.street}, ${location.city}, ${location.state} ${location.postalCode}`,
} as const;

const mapsQuery = encodeURIComponent("Arleth New Style Barber Shop");

export const maps = {
  /** Opens the verified Google listing (reviews, photos, call, directions). */
  listing: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}&query_place_id=${location.googlePlaceId}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}&destination_place_id=${location.googlePlaceId}`,
  /** Keyless Google Maps embed, centred on the verified coordinates. */
  embed: `https://maps.google.com/maps?q=${encodeURIComponent(address.single)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
  /** One-tap directions from a phone. */
  directionsNative: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}&destination_place_id=${location.googlePlaceId}`,
} as const;

/* ---------------------------------------------------------------------------
 * SOCIAL
 * ------------------------------------------------------------------------ */

export const socials = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@arleth_new_style",
    href: "https://www.instagram.com/arleth_new_style/",
    /** Instagram bio: "DM to book your cut!" */
    note: "DM to book",
    primary: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@arlethnewstyle",
    href: "https://www.tiktok.com/@arlethnewstyle",
    note: "84 videos",
    primary: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: contact.phoneDisplay,
    href: contact.whatsappHref,
    note: "Message the shop",
    primary: true,
  },
  {
    id: "threads",
    label: "Threads",
    handle: "@arleth_new_style",
    href: "https://www.threads.com/@arleth_new_style",
    note: "",
    primary: false,
  },
  {
    id: "google",
    label: "Google Reviews",
    handle: "Read & leave a review",
    href: maps.listing,
    note: "Verified listing",
    primary: true,
  },
  {
    id: "linktree",
    label: "Linktree",
    handle: "All links",
    href: "https://linktr.ee/ArlethNewStyleBarbershop",
    note: "",
    primary: false,
  },
] as const;

export const instagram = socials.find((s) => s.id === "instagram")!;
export const tiktok = socials.find((s) => s.id === "tiktok")!;

/* ---------------------------------------------------------------------------
 * LICENCE — factual, shown only in the footer legal line.
 * ------------------------------------------------------------------------ */

export const licence = {
  authority: "TDLR",
  number: "872716",
  expires: "December 5, 2026",
} as const;

/* ---------------------------------------------------------------------------
 * VISITING — the shop's own published policy (Instagram bio) plus the
 * practical notes described publicly for the business.
 * ------------------------------------------------------------------------ */

export const visiting = {
  headline: "Walk-ins & appointments welcome",
  /** Instagram bio — owner supplied. */
  walkIns: true,
  appointments: true,
  notes: [
    {
      label: "Walk-ins",
      value: "Welcome",
      detail: "Popular times can mean a longer wait.",
      source: "google",
    },
    {
      label: "Appointments",
      value: "Recommended",
      detail: "Booking ahead helps you get straight into a chair.",
      source: "google",
    },
    {
      label: "Evenings",
      value: "Open late",
      detail: "The shop stays open for after-work cuts.",
      source: "google",
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * THE SHOP — described publicly for this business.
 * ------------------------------------------------------------------------ */

export const shop = {
  headline: "More than a cut",
  lede: "A laid-back space on Gessner Road where you can pull up, get fresh, and feel at home.",
  attributes: [
    {
      label: "Space",
      value: "Spacious",
      detail: "Room to settle in instead of squeezing in.",
    },
    {
      label: "Vibe",
      value: "Laid-back",
      detail: "Relaxed atmosphere, no rush.",
    },
    {
      label: "Play area",
      value: "Pool table + PlayStation",
      detail: "Something to keep the kids occupied while they wait.",
    },
    {
      label: "Housekeeping",
      value: "Clean & organized",
      detail: "The shop is kept calm and tidy throughout the day.",
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * COMMUNITY — grounded in the "kid friendly" attribute and the record of
 * families being served. No invented statistics.
 * ------------------------------------------------------------------------ */

export const community = {
  kicker: "Kids welcome. Grown-ups welcome. Everyone welcome.",
  headline: ["Come as you are.", "Leave looking sharp."],
  body: "A barbershop that works for a Saturday with the kids and a quiet weekday after work. Walk in, or book so you are not waiting around.",
} as const;

/* ---------------------------------------------------------------------------
 * REVIEWS
 * Themes publicly aggregated from the shop's Google review record. These are
 * recurring topics drawn from real reviews — NOT individual testimonials,
 * and deliberately presented without invented reviewer names.
 * ------------------------------------------------------------------------ */

export const reviews = {
  eyebrow: "Google reviews",
  headline: "See what clients are saying",
  lede: "The things Houston keeps mentioning about Arleth New Style.",
  themes: [
    {
      text: "Talented barbers who give perfect haircuts.",
      mentions: 54,
    },
    {
      text: "Amazing haircuts for kids — the kids love it.",
      mentions: 28,
    },
  ],
  attribution:
    "Themes and mention counts summarised from the shop's public review record. Individual reviews are read in full on Google.",
  cta: "View Google reviews",
  href: maps.listing,
} as const;

/* ---------------------------------------------------------------------------
 * SERVICES
 * No service menu or prices are published by the business anywhere we can
 * verify, so this section routes to the shop's real booking channels rather
 * than inventing a price list.
 * ------------------------------------------------------------------------ */

export const services = {
  eyebrow: "Services",
  headline: ["Your next", "cut?"],
  lede: "Walk in or reach out and we will get you in the chair. Ask us for the service menu, timing, and pricing — the shop will confirm everything before you sit down.",
  channels: [
    {
      id: "walk-in",
      label: "Walk in",
      value: "No appointment needed",
      detail: "Popular times can mean a wait — arrive early or book ahead.",
      href: maps.directions,
      action: "Get directions",
      external: true,
    },
    {
      id: "dm",
      label: "DM on Instagram",
      value: "@arleth_new_style",
      detail: "The fastest way to book. Send a DM and the shop will reply.",
      href: instagram.href,
      action: "DM to book",
      external: true,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: contact.phoneDisplay,
      detail: "Message the shop directly and confirm your time.",
      href: contact.whatsappHref,
      action: "Open WhatsApp",
      external: true,
    },
    {
      id: "call",
      label: "Call the shop",
      value: contact.phoneDisplay,
      detail: "Speak to the shop and book over the phone.",
      href: contact.phoneHref,
      action: "Call now",
      external: false,
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * PHOTOGRAPHY
 * Every file below is a real photograph of this business, pulled from its own
 * Google Business Profile and official Linktree avatar. See
 * scripts/optimize-images.mjs for the full provenance chain.
 *
 * alt text describes what the frame actually shows — no "best barber" claims.
 * ------------------------------------------------------------------------ */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Mono index tag revealed on hover. */
  index: string;
  /** Optional framing note for the lightbox caption. */
  caption?: string;
};

/**
 * PHOTOGRAPHY
 * ---------------------------------------------------------------------------
 * The shop has exactly THREE owner-uploaded photographs in circulation (its
 * Google Business Profile) plus the avatar published on its official Linktree.
 *
 * The site used to ship ten files — six "gallery" frames, a shop-section photo
 * and a full-bleed band — all re-crops of those same three images. Perceptual
 * hashing confirmed `interior.webp` and `work-02.webp` were the same frame
 * (dHash distance 2), so the visitor saw one photograph twice within ~1400px
 * of scrolling while the strip below claimed "6 photographs".
 *
 * Rule now enforced: one photograph, one placement, per viewport. Each image
 * is used at most once on the page, and each is described only in terms that
 * are actually verifiable ("the shop interior") — never an unverified claim
 * about what is in frame ("the working area", "the upper part of the shop").
 *
 * Allocation:
 *   google-01  ->  hero (tall)  +  community band (wide)   [~7000px apart]
 *   google-02  ->  gallery, portrait frame
 *   google-03  ->  gallery, landscape frame
 *
 * The hero/band pair is the single deliberate repeat. They sit roughly eight
 * viewport-heights apart, are cropped to opposite orientations (3:4 and 2:1),
 * and the band is read as atmosphere under a heavy scrim rather than as a
 * second look at the shop. Everything closer together is unique.
 * ---------------------------------------------------------------------------
 */

export const heroPhoto: Photo = {
  src: "/images/arleth/hero.webp",
  alt: "Photograph of the Arleth New Style Barbershop interior, 10850 S Gessner Rd, Houston.",
  width: 1100,
  height: 1467,
  index: "01",
};

/** One frame per unique photograph. Do not add re-crops of these. */
export const galleryPhotos: Photo[] = [
  {
    src: "/images/arleth/work-01.webp",
    alt: "Photograph of the Arleth New Style Barbershop interior, Houston.",
    width: 1100,
    height: 1467,
    index: "02",
  },
  {
    src: "/images/arleth/work-02.webp",
    alt: "Photograph of the Arleth New Style Barbershop interior, Houston.",
    width: 1600,
    height: 1200,
    index: "03",
  },
];

/**
 * Community band. Desktop uses the wide (2:1) crop; below `md` the band
 * reuses the hero's existing 3:4 file, because cover-fitting a 2:1 frame into
 * a 78svh phone viewport (≈320x624, ratio 0.51) leaves only the middle ~26%
 * of the photograph visible. Same asset, opposite framing, no new file.
 */
export const bandPhoto: Photo = {
  src: "/images/arleth/detail-01.webp",
  alt: "Photograph of the Arleth New Style Barbershop interior, Houston.",
  width: 1600,
  height: 800,
  index: "B",
};

export const bandTallPhoto: Photo = {
  src: "/images/arleth/hero.webp",
  alt: "Photograph of the Arleth New Style Barbershop interior, Houston.",
  width: 1100,
  height: 1467,
  index: "B",
};

export const brandAvatar = {
  src: "/images/arleth/brand-avatar.webp",
  alt: "Arleth New Style Barbershop avatar",
  width: 600,
  height: 600,
};

/* ---------------------------------------------------------------------------
 * NAVIGATION
 * ------------------------------------------------------------------------ */

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "The Shop", href: "#shop" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
] as const;

/* ---------------------------------------------------------------------------
 * SEO
 * ------------------------------------------------------------------------ */

export const seo = {
  title: "Arleth New Style Barbershop | Houston, TX",
  description:
    "Arleth New Style Barbershop at 10850 S Gessner Rd, Houston, TX 77071. Haircuts and barber services in Brays Oaks. Walk-ins and appointments welcome - call, WhatsApp, or DM on Instagram to book your cut.",
  /* Canonical alt text for the generated share card. Declared here because
     Next's file-based metadata convention lets the `alt` export in
     app/opengraph-image.tsx OVERRIDE metadata.openGraph.images[].alt in
     layout.tsx. Two copies silently disagreed, so the clumsy
     "Arleth New Style Barbershop - Barbershop in Houston, TX" won. Both
     call sites now reference this single value. */
  ogImageAlt: "Arleth New Style Barbershop - barbershop at 10850 S Gessner Rd, Houston, TX 77071",
  keywords: [
    "Arleth New Style Barbershop",
    "barbershop Houston",
    "barber shop 77071",
    "barbershop Brays Oaks",
    "haircut Houston TX",
    "barber S Gessner Rd",
    "kids haircut Houston",
    "walk-in barber Houston",
  ],
} as const;
