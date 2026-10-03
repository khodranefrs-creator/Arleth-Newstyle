import Image from "next/image";
import { shop, shopPhoto, address } from "@/lib/business";
import { ArrowUpRight } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";
import { maps } from "@/lib/business";

export default function Shop() {
  return (
    <section id="shop" aria-labelledby="shop-heading" className="section-y border-t border-ink-line-soft">
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          {/* Photograph — bleeds off the LEFT edge to vary the rhythm */}
          <Reveal className="-mx-5 lg:col-span-6 lg:mx-0 lg:-ml-10 xl:-ml-16">
            <figure className="frame frame-hover group relative aspect-4/3 w-full lg:aspect-[4/5]">
              <Image
                src={shopPhoto.src}
                alt={shopPhoto.alt}
                width={shopPhoto.width}
                height={shopPhoto.height}
                loading="lazy"
                quality={80}
                sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 48vw, 40vw"
                className="h-full w-full object-cover"
              />
              <span aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-ember/70" />
              <figcaption className="label-sm absolute bottom-0 left-0 bg-ink/85 px-3 py-2 text-paper-dim backdrop-blur-sm">
                {address.line1} · {address.line2}
              </figcaption>
            </figure>
          </Reveal>

          {/* Text + spec table */}
          <div className="lg:col-span-6 lg:pl-8 xl:pl-12">
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
