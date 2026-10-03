import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { address, contact, identity, seo } from "@/lib/business";

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  /* The shop's own photograph, embedded so the share card is never generic.
     JPEG because satori cannot decode WebP. Lives in assets/, not public/, so
     the 230KB source is never deployed as a fetchable asset. */
  const photo = await readFile(path.join(process.cwd(), "assets", "og-source.jpg"));

  /* Mirrors the tokens in app/globals.css. These were previously the old
     pre-contrast-audit values (#c2552a / #8a8880), which made the share card
     visibly inconsistent with the site and failed AA on the small label. */
  const INK = "#0a0a09";
  const PAPER = "#f3efe7";
  const PAPER_DIM = "#cbc5b8";
  const MUTE = "#9d9a92";
  const EMBER = "#d9713c";
  const LINE = "#232220";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: INK,
          color: PAPER,
          fontFamily: "sans-serif",
        }}
      >
        {/* Type block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 660,
            padding: "56px 0 56px 60px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 7, height: 7, backgroundColor: EMBER }} />
            <div
              style={{
                fontSize: 17,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: EMBER,
                display: "flex",
              }}
            >
              Houston, Texas
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                lineHeight: 0.86,
                letterSpacing: -4,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              Arleth
            </div>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                lineHeight: 0.86,
                letterSpacing: -4,
                textTransform: "uppercase",
                color: MUTE,
                display: "flex",
              }}
            >
              New Style
            </div>
            <div
              style={{
                marginTop: 26,
                paddingTop: 18,
                borderTop: `1px solid ${LINE}`,
                fontSize: 20,
                color: PAPER_DIM,
                display: "flex",
              }}
            >
              Sharp cuts. Clean details. Your style, your way.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 18,
              letterSpacing: 1.5,
              color: MUTE,
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>{address.line1}</div>
            <div style={{ display: "flex", color: PAPER }}>{contact.phoneDisplay}</div>
          </div>
        </div>

        {/* Photograph */}
        <div style={{ display: "flex", position: "relative", width: 540 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`Photograph of ${identity.name} at ${address.line1}`}
            src={`data:image/jpeg;base64,${photo.toString("base64")}`}
            width={540}
            height={630}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: EMBER,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
