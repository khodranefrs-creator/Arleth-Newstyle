import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { address, contact, identity } from "@/lib/business";

export const alt = `${identity.name} — ${identity.trade} in ${identity.city}, ${identity.state}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  /* The shop's own photograph, embedded so the share card is never generic.
     JPEG because satori cannot decode WebP. */
  const photo = await readFile(
    path.join(process.cwd(), "public", "images", "arleth", "og-source.jpg"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a09",
          color: "#f3efe7",
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
            <div style={{ width: 7, height: 7, backgroundColor: "#c2552a" }} />
            <div
              style={{
                fontSize: 17,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#c2552a",
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
                color: "#8a8880",
                display: "flex",
              }}
            >
              New Style
            </div>
            <div
              style={{
                marginTop: 26,
                paddingTop: 18,
                borderTop: "1px solid #232220",
                fontSize: 20,
                color: "#cbc5b8",
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
              color: "#8a8880",
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>{address.line1}</div>
            <div style={{ display: "flex", color: "#f3efe7" }}>{contact.phoneDisplay}</div>
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
              backgroundColor: "#c2552a",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
