import { address, contact, identity, location, maps, visiting } from "@/lib/business";
import { ArrowUpRight, Phone } from "@/components/icons";
import { Reveal, SectionLabel } from "@/components/reveal";

export default function Location() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-y border-t border-ink-line-soft"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
          {/* Address + phone + policy */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="06" title="Find us" />
            </Reveal>

            <Reveal delay={60}>
              <h2 id="contact-heading" className="display-lg mt-8">
                Pull up
                <br />
                <span className="text-ember">on Gessner.</span>
              </h2>
            </Reveal>

            <Reveal delay={110}>
              <address className="mt-9 not-italic">
                <p className="display-sm leading-[1.05] text-paper">
                  {address.line1}
                  <br />
                  <span className="text-mute">
                    {location.city}, {location.state} {location.postalCode}
                  </span>
                </p>
                <p className="label-sm mt-3 text-mute-dim">
                  {identity.neighbourhood} · {identity.city}, {identity.stateName}
                </p>
              </address>
            </Reveal>

            {/* Phone — the single most important tap target on the page */}
            <Reveal delay={160}>
              <a
                href={contact.phoneHref}
                className="group mt-7 flex items-center gap-4 border-b border-ink-line pb-5 transition-colors duration-400 hover:border-ember"
              >
                <span className="flex size-11 shrink-0 items-center justify-center border border-ink-line transition-colors duration-400 group-hover:border-ember group-hover:bg-ember-deep">
                  <Phone className="size-4 text-paper" />
                </span>
                <span>
                  <span className="label-sm block text-mute-dim">Call the shop</span>
                  <span className="display-sm mt-1 block text-paper transition-colors duration-300 group-hover:text-ember-soft">
                    {contact.phoneDisplay}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={210}>
              <p className="label mt-7 text-paper">{visiting.headline}</p>
              <dl className="mt-4">
                {visiting.notes.map((n) => (
                  <div
                    key={n.label}
                    className="flex items-baseline gap-4 border-t border-ink-line-soft py-3"
                  >
                    <dt className="label-sm w-24 shrink-0 text-mute-dim">{n.label}</dt>
                    <dd className="text-[0.8125rem] leading-relaxed text-mute">
                      <span className="text-paper-dim">{n.value}</span> — {n.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={maps.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Get directions
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          {/* Real map — verified listing, not a mock */}
          <Reveal className="lg:col-span-7" delay={100}>
            <div className="frame frame-hover group relative h-full min-h-[22rem] w-full border border-ink-line lg:min-h-[34rem]">
              <iframe
                title={`Map showing ${identity.name} at ${address.single}`}
                src={maps.embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.85)_invert(0.9)_contrast(0.92)_brightness(0.95)]"
              />
              <a
                href={maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="label absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 bg-ink px-4 py-3 text-paper opacity-0 transition-opacity duration-400 group-hover:opacity-100 focus-visible:opacity-100"
              >
                Open in Google Maps
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
            <p className="label-sm mt-3 text-mute-dim">
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)} ·{" "}
              {identity.neighbourhood}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
