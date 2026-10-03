import { address, contact, identity, instagram, maps, visiting } from "@/lib/business";
import { ArrowUpRight, Phone, WhatsApp, Instagram } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const rows = [
  {
    id: "call",
    label: "Call the shop",
    value: contact.phoneDisplay,
    detail: "Speak to the shop and book over the phone",
    href: contact.phoneHref,
    glyph: <Phone className="size-4" />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: contact.phoneDisplay,
    detail: "Message the shop directly and confirm your time",
    href: contact.whatsappHref,
    glyph: <WhatsApp className="size-4" />,
  },
  {
    id: "dm",
    label: "DM on Instagram",
    value: instagram.handle,
    detail: instagram.note,
    href: instagram.href,
    glyph: <Instagram className="size-4" />,
  },
  {
    id: "directions",
    label: "Get directions",
    value: address.line1,
    detail: `${address.line2} · ${identity.neighbourhood}`,
    href: maps.directions,
    glyph: <ArrowUpRight className="size-4" />,
  },
];

export default function Booking() {
  return (
    <section
      id="book"
      aria-labelledby="book-heading"
      className="relative isolate overflow-hidden bg-paper text-ink"
    >
      <div className="shell section-y">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="label-sm text-ember-deep">07</span>
            <span className="h-px w-6 bg-ink/20" aria-hidden="true" />
            <span className="label-sm text-ink/55">Book</span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal delay={60}>
              <h2 id="book-heading" className="display-lg">
                Book
                <br />
                your cut.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <Reveal delay={120}>
              <p className="body-lg max-w-[38ch] text-ink/70">
                {visiting.headline}. Pick whichever channel you already use — the shop will
                confirm your time.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={160}>
          <ul className="mt-12 md:mt-16">
            {rows.map((r, i) => (
              <li key={r.id}>
                <a
                  href={r.href}
                  {...(r.id === "call" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className={`group grid grid-cols-1 items-center gap-x-6 gap-y-2 border-t border-ink/15 px-2 py-6 transition-colors duration-400 hover:bg-ink hover:text-paper md:grid-cols-12 md:px-4 ${
                    i === rows.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="label-sm flex items-center gap-2.5 text-ink/55 transition-colors group-hover:text-paper/60 md:col-span-3">
                    {r.glyph}
                    {r.label}
                  </span>
                  <span className="display-sm transition-transform duration-500 group-hover:translate-x-1 md:col-span-5">
                    {r.value}
                  </span>
                  <span className="body-md text-ink/55 transition-colors group-hover:text-paper/60 md:col-span-3">
                    {r.detail}
                  </span>
                  <span className="hidden justify-end md:col-span-1 md:flex">
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-ink/15 pt-8 md:mt-16">
            <address className="not-italic">
              <p className="display-sm leading-tight">
                {address.line1}
                <br />
                <span className="text-ink/55">{address.line2}</span>
              </p>
            </address>
            <p className="label-sm max-w-[26ch] text-ink/55">
              {identity.name} · Licensed by the {`Texas Department of Licensing & Regulation`}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
