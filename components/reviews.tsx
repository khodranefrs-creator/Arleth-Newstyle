import { reviews, maps } from "@/lib/business";
import { ArrowUpRight } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";

export default function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="section-y border-t border-ink-line-soft"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel index="05" title={reviews.eyebrow} />
            </Reveal>
            <Reveal delay={60}>
              <h2 id="reviews-heading" className="display-lg mt-8">
                See what
                <br />
                clients <span className="text-stroke">say</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="body-md mt-7 max-w-[38ch] text-paper-dim">{reviews.lede}</p>
            </Reveal>
            <Reveal delay={180}>
              <a
                href={reviews.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline group mt-9"
              >
                {reviews.cta}
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:pl-8 xl:pl-12">
            <Reveal delay={80}>
              <p className="label-sm mb-6 text-mute-dim">Recurring themes in the public reviews</p>
            </Reveal>

            <ul>
              {reviews.themes.map((t, i) => (
                <Reveal as="li" key={t.text} delay={100 + i * 90}>
                  <div className="group grid grid-cols-1 gap-4 border-t border-ink-line py-8 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-3">
                      <span className="display-md text-ember tabular-nums">
                        {t.mentions}
                      </span>
                      <span className="label-sm mt-2 block text-mute-dim">mentions</span>
                    </div>
                    <p className="display-sm max-w-[24ch] text-paper md:col-span-9">
                      {t.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={280}>
              <div className="border-t border-ink-line pt-5">
                <p className="max-w-[52ch] text-[0.8125rem] leading-relaxed text-mute-dim">
                  {reviews.attribution}
                </p>
                <a
                  href={maps.listing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-sm link-underline mt-4 inline-flex py-2 text-paper-dim transition-colors hover:text-paper"
                >
                  Open the Google listing
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
