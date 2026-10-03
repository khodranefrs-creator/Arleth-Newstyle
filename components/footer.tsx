import { address, contact, identity, licence, location, maps, socials } from "@/lib/business";
import { ArrowUpRight } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink">
      {/* Oversized wordmark — the page closes on the name, not a card grid */}
      <div className="shell pt-14 md:pt-20">
        <p
          aria-hidden="true"
          className="-mb-[0.05em] block whitespace-nowrap font-display text-[clamp(1.5rem,8.6vw,9rem)] leading-[0.8] font-extrabold tracking-[-0.045em] text-paper/12 uppercase"
        >
          {identity.shortName}
        </p>
      </div>

      <div className="shell">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink-line py-12 md:grid-cols-4 lg:grid-cols-12 lg:py-16">
          {/* Identity */}
          <div className="col-span-2 lg:col-span-4">
            <p className="display-sm leading-tight text-paper">
              {identity.wordmarkTop}
              <br />
              <span className="text-mute">{identity.wordmarkBottom}</span>
            </p>
            <p className="label-sm mt-3 text-mute-dim">
              {identity.trade} · {location.city}, {location.state}
            </p>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <h2 className="label-sm text-mute-dim">Visit</h2>
            <address className="mt-4 not-italic">
              <a
                href={maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="body-md link-underline block text-paper-dim transition-colors hover:text-paper"
              >
                {address.line1}
                <br />
                {address.line2}
              </a>
            </address>
            <a
              href={contact.phoneHref}
              className="body-md link-underline mt-3 block text-paper-dim transition-colors hover:text-paper"
            >
              {contact.phoneDisplay}
            </a>
          </div>

          {/* Follow */}
          <div className="lg:col-span-5">
            <h2 className="label-sm text-mute-dim">Follow &amp; book</h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 border-b border-ink-line py-2.5 text-paper-dim transition-colors duration-300 hover:border-ember hover:text-paper"
                  >
                    <span className="label">{s.label}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-ink-line">
        <div className="shell">
          <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
            <p className="label-sm text-mute-dim">
              © {new Date().getFullYear()} {identity.name}. All rights reserved.
            </p>
            <p className="label-sm text-mute-dim">
              {licence.authority} licence #{licence.number} · listed expiry{" "}
              {licence.expires}
            </p>
            <p className="label-sm text-mute-dim">
              {location.city}, {location.stateName} · {location.postalCode}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
