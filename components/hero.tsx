import Image from "next/image";
import { contact, address, heroPhoto, identity, instagram, visiting } from "@/lib/business";
import { ArrowDown, ArrowRight, ArrowUpRight, Phone } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-[74px] md:pt-[88px]"
    >
      {/* Ambient warmth behind the type — very low opacity, one soft field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-ember-deep/10 blur-[140px]"
      />

      <div className="shell">
        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-12 xl:gap-x-12">
          {/* ---------------------------------------------------------------
              TYPE COLUMN — a query container, so the display type sizes
              against its own track instead of the viewport.
          ----------------------------------------------------------------*/}
          <div className="query-col flex min-w-0 flex-col justify-center py-10 lg:col-span-7 lg:min-h-[calc(100svh-88px)] lg:py-24">
            {/* Location / positioning line */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="label-sm text-ember">
                  {identity.city}, {identity.stateName}
                </span>
                <span className="h-px w-8 bg-ink-line" aria-hidden="true" />
                <span className="label-sm text-mute">{identity.zip}</span>
                <span className="h-px w-8 bg-ink-line" aria-hidden="true" />
                <span className="label-sm text-mute">{identity.neighbourhood}</span>
              </div>
            </Reveal>

            {/* Wordmark */}
            <h1 id="hero-heading" className="mt-6 md:mt-8">
              <span className="sr-only">
                {identity.name} — {identity.trade} in {identity.city}, {identity.state}
              </span>
              <span aria-hidden="true" className="block">
                <Reveal delay={60}>
                  <span className="hero-display block">Arleth</span>
                </Reveal>
                <Reveal delay={140}>
                  <span className="hero-display text-stroke block">New Style</span>
                </Reveal>
              </span>
            </h1>

            {/* Trade + hairline */}
            <Reveal delay={220}>
              <div className="mt-7 flex items-center gap-4 md:mt-9">
                <span className="size-1.5 shrink-0 bg-ember" aria-hidden="true" />
                <span className="label text-paper-dim">{identity.trade}</span>
                <span className="h-px flex-1 bg-ink-line" aria-hidden="true" />
              </div>
            </Reveal>

            {/* Positioning line */}
            <Reveal delay={280}>
              <p className="body-lg mt-7 max-w-[34ch] text-paper-dim md:mt-8">
                Sharp cuts. Clean details.{" "}
                <span className="text-paper">Your style, your way.</span>
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={340}>
              <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11">
                <a href="#book" className="btn btn-primary">
                  Book your cut
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a
                  href="#work"
                  className="btn btn-outline group"
                >
                  View the work
                  <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>

            {/* Address + phone */}
            <Reveal delay={400}>
              <div className="mt-10 grid max-w-lg grid-cols-1 gap-px border border-ink-line bg-ink-line sm:grid-cols-2">
                <a
                  href="#contact"
                  className="group flex items-center gap-3 bg-ink px-4 py-4 transition-colors duration-300 hover:bg-ink-lift"
                >
                  <span className="label-sm shrink-0 text-mute-dim">Find</span>
                  <span className="label-sm text-paper-dim transition-colors group-hover:text-paper">
                    {address.line1}
                  </span>
                </a>
                <a
                  href={contact.phoneHref}
                  className="group flex items-center gap-3 bg-ink px-4 py-4 transition-colors duration-300 hover:bg-ink-lift"
                >
                  <span className="label-sm shrink-0 text-mute-dim">Call</span>
                  <Phone className="size-3.5 shrink-0 text-ember" />
                  <span className="label-sm text-paper-dim transition-colors group-hover:text-paper">
                    {contact.phoneDisplay}
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------------
              IMAGE COLUMN — bleeds off the right edge
          ----------------------------------------------------------------*/}
          <div className="relative -mx-5 lg:col-span-5 lg:mx-0 lg:-mr-10 xl:-mr-16">
            <Reveal delay={120} className="h-full">
              <figure className="frame group relative aspect-4/5 w-full lg:aspect-auto lg:h-full lg:min-h-[calc(100svh-88px)]">
                <Image
                  src={heroPhoto.src}
                  alt={heroPhoto.alt}
                  width={heroPhoto.width}
                  height={heroPhoto.height}
                  priority
                  fetchPriority="high"
                  quality={82}
                  sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 42vw, 50vw"
                  className="h-full w-full object-cover object-center"
                />

                {/* Left edge: a single hard ember rule rather than a scrim */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px bg-ember/70"
                />

                {/* Bottom plate — holds the caption, no gradient needed */}
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-ink/80 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
                  <span className="label-sm text-paper-dim">
                    <span className="text-ember">01</span> / {address.line1}
                  </span>
                  <span className="label-sm hidden text-mute sm:inline">
                    {identity.city}, {identity.state}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Edge-bleed vertical address, far right, desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <span className="label-sm text-mute-dim block [writing-mode:vertical-rl] rotate-180">
          {address.single}
        </span>
      </div>

      {/* Bottom utility row */}
      <div className="shell">
        <div className="flex items-center justify-between gap-6 border-t border-ink-line py-5">
          <p className="label-sm text-mute">{visiting.headline}</p>
<a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label-sm group hidden items-center gap-2 py-3 text-mute-dim transition-colors hover:text-paper sm:inline-flex"
          >
            {instagram.handle}
            <ArrowUpRight className="size-3 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#work"
            className="label-sm group hidden items-center gap-2 text-mute-dim transition-colors hover:text-paper lg:inline-flex"
          >
            Scroll
            <ArrowDown className="size-3 transition-transform duration-500 group-hover:translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
