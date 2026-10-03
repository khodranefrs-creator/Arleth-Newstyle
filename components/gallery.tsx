"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryPhotos, instagram, tiktok, type Photo } from "@/lib/business";
import { Close } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";

type Slot = {
  photo: Photo;
  /** Tailwind grid placement + aspect ratio. Every row sums to 12 columns. */
  span: string;
  ratio: string;
  offset?: string;
};

/**
 * Grid placement + aspect ratio. Every row sums to exactly 12 columns on
 * `md` and up, so there is never a partially-filled row.
 *
 * This was six frames before. Because only three unique photographs exist,
 * that meant the same picture appeared twice inside a few thousand pixels —
 * and the trailing "live feed" panel sat alone in a 4-column row, leaving
 * 67-68% of that row as dead space at every width from 768px up. Two unique
 * frames plus a full-width panel fill both rows completely.
 */
const slots: Slot[] = [
  { photo: galleryPhotos[0], span: "col-span-6 md:col-span-5", ratio: "aspect-[3/4]" },
  { photo: galleryPhotos[1], span: "col-span-6 md:col-span-7", ratio: "aspect-[4/3]" },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) => (i === null ? i : (i + dir + slots.length) % slots.length)),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      // Keep tabbing inside the dialog.
      if (e.key === "Tab") {
        e.preventDefault();
        closeBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step]);

  const active = isOpen ? slots[openIndex].photo : null;

  return (
    <section id="work" aria-labelledby="work-heading" className="section-y border-t border-ink-line-soft">
      <div className="shell">
        {/* Header — deliberately off-centre */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="03" title="The work" />
            </Reveal>
            <Reveal delay={60}>
              <h2 id="work-heading" className="display-lg mt-8">
                Shot in
                <br />
                <span className="text-stroke">the shop</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <Reveal delay={120}>
              <p className="body-md max-w-[44ch] text-paper-dim">
                Photographs of the shop at{" "}
                <span className="text-paper">10850 S Gessner Rd</span>. For fresh cuts as they
                happen, the shop posts throughout the week on Instagram and TikTok.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Lookbook grid — edge to edge, deliberately breaking the shell */}
      <div className="mt-12 md:mt-16">
        <div className="shell">
          <div className="grid grid-cols-4 gap-3 md:grid-cols-12 md:gap-4">
            {slots.map((slot, i) => (
              <Reveal key={slot.photo.src} className={slot.span} delay={i * 60}>
                <button
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setOpenIndex(i);
                  }}
                  aria-label={`Open photograph ${slot.photo.index} of ${slots.length}: ${slot.photo.alt}`}
                  className={`frame frame-hover group relative block w-full cursor-zoom-in ${slot.ratio}`}
                >
                  <Image
                    src={slot.photo.src}
                    alt={slot.photo.alt}
                    width={slot.photo.width}
                    height={slot.photo.height}
                    loading="lazy"
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw"
                    className="h-full w-full object-cover"
                  />
                  <span className="frame-tag label-sm" aria-hidden="true">
                    {slot.photo.index}
                  </span>
                </button>
              </Reveal>
            ))}

            {/* Non-photographic panel — a full-width band so the grid closes
                cleanly instead of leaving a partial row. */}
            <Reveal className="col-span-12" delay={120}>
              <div className="flex flex-col gap-6 bg-ember-deep p-6 text-paper sm:flex-row sm:items-end sm:justify-between md:p-8">
                <div className="max-w-md">
                  <span className="label-sm text-paper">Live feed</span>
                  <p className="display-sm mt-4 leading-[0.95]">
                    {tiktok.handle}
                    <br />
                    {instagram.handle}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-sm border border-paper/40 px-4 py-3 transition-colors hover:border-paper hover:bg-paper hover:text-ember-deep"
                  >
                    Instagram
                  </a>
                  <a
                    href={tiktok.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-sm border border-paper/40 px-4 py-3 transition-colors hover:border-paper hover:bg-paper hover:text-ember-deep"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Under-grid meta strip */}
      <div className="shell">
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink-line pt-5">
          <p className="label-sm text-mute-dim">
            Photographs of the shop · Arleth New Style, Houston
          </p>
          <p className="label-sm text-mute-dim">Tap any frame to enlarge</p>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          Lightbox
      ----------------------------------------------------------------*/}
      {isOpen && active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph ${active.index} — ${active.alt}`}
          className="fixed inset-0 z-[90] flex flex-col bg-ink/97 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="label-sm text-mute">
              <span className="text-ember">{active.index}</span> /{" "}
              {String(slots.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photograph"
                className="label-sm border border-ink-line px-3 py-2 text-paper-dim transition-colors hover:border-paper hover:text-paper"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photograph"
                className="label-sm border border-ink-line px-3 py-2 text-paper-dim transition-colors hover:border-paper hover:text-paper"
              >
                Next
              </button>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label="Close"
                className="ml-1 inline-flex size-10 items-center justify-center border border-ink-line text-paper transition-colors hover:border-paper"
              >
                <Close className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-6">
            <Image
              key={active.src + active.index}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              quality={88}
              sizes="(max-width: 1023px) 92vw, 88vw"
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
