import { shop, address } from "@/lib/business";
import { ArrowUpRight } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";
import { maps } from "@/lib/business";

export default function Shop() {
  return (
    <section id="shop" aria-labelledby="shop-heading" className="section-y border-t border-ink-line-soft">
      <div className="shell">
        {/* The photograph that used to sit here was the same frame as a gallery
            tile a few hundred pixels above — identical file, identical pixels.
            The section reads as a typographic column instead. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-4 xl:col-span-6 xl:col-start-4">
            <Reveal>
              <SectionLabel index="04" title="The shop" />
            </Reveal>

            <Reveal delay={60}>
              <h2 id="shop-heading" className="display-lg mt-8">
                More than
                <br />
                <span className="text-ember">a cut.</span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="body-lg mt-7 max-w-[40ch] text-paper-dim">{shop.lede}</p>
            </Reveal>

            <Reveal delay={180}>
              <dl className="mt-10">
                {shop.attributes.map((a) => (
                  <div
                    key={a.label}
                    className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-ink-line py-5 md:grid-cols-12 md:items-baseline"
                  >
                    <dt className="label-sm text-mute-dim md:col-span-3">{a.label}</dt>
                    <dd className="md:col-span-9">
                      <span className="display-sm block text-paper">{a.value}</span>
                      <span className="body-md mt-2 block max-w-[46ch] text-mute">{a.detail}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={240}>
              <p className="label-sm mt-8 flex items-center gap-3 text-mute-dim">
                <span className="h-px w-8 bg-ink-line" aria-hidden="true" />
                {address.line1} · {address.line2}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <a
                href={maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline group mt-9"
              >
                Get directions
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
