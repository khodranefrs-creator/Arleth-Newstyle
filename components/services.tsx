import { services, contact } from "@/lib/business";
import { ArrowUpRight, Phone, WhatsApp } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";

const glyphs: Record<string, React.ReactNode> = {
  "walk-in": null,
  dm: null,
  whatsapp: <WhatsApp className="size-4" />,
  call: <Phone className="size-4" />,
};

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-y border-t border-ink-line-soft"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          {/* Left — position */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="02" title={services.eyebrow} />
            </Reveal>

            <Reveal delay={60}>
              <h2 id="services-heading" className="display-lg mt-8">
                {services.headline.map((line, i) => (
                  <span key={line} className={i === 1 ? "text-ember block" : "block"}>
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="body-md mt-7 max-w-[42ch] text-paper-dim">{services.lede}</p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  WhatsApp the shop
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a href={contact.phoneHref} className="btn btn-outline">
                  <Phone className="size-3.5" />
                  {contact.phoneDisplay}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — real booking channels, hairline rows (no cards) */}
          <div className="lg:col-span-7 lg:pl-6">
            <Reveal delay={80}>
              <p className="label-sm mb-5 text-mute-dim">How to book</p>
            </Reveal>

            <ul>
              {services.channels.map((c, i) => (
                <Reveal as="li" key={c.id} delay={100 + i * 70}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block border-t border-ink-line py-6 transition-colors duration-400 hover:bg-ink-raised md:px-3"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="label-sm flex items-center gap-2 text-mute-dim">
                        {glyphs[c.id]}
                        {c.label}
                      </span>
                      <span className="label-sm flex items-center gap-1.5 text-paper-dim transition-colors duration-300 group-hover:text-ember-soft">
                        <span className="hidden sm:inline">{c.action}</span>
                        <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </span>

                    <span className="display-sm mt-4 block text-paper transition-colors duration-300 group-hover:text-ember-soft">
                      {c.value}
                    </span>

                    <span className="body-md mt-2 block max-w-[52ch] text-mute">{c.detail}</span>
                  </a>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={380}>
              <p className="border-t border-ink-line pt-5 text-[0.8125rem] leading-relaxed text-mute-dim">
                Service menu, timing and pricing are confirmed directly by the shop — nothing is
                published here that the shop has not confirmed.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
