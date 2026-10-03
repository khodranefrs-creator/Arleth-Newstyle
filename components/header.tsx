"use client";

import { useEffect, useRef, useState } from "react";
import { nav, contact, instagram, identity } from "@/lib/business";
import { ArrowUpRight, Close, Menu, Phone } from "@/components/icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const ticking = useRef(false);

  /* Condense the bar once the hero starts leaving. */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section currently in view. */
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Lock scroll + close on Escape while the sheet is open. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-ink-line bg-ink/92 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell">
          <div
            className={`flex items-center justify-between gap-6 transition-[height] duration-500 ${
              scrolled ? "h-[68px] md:h-[76px]" : "h-[74px] md:h-[88px]"
            }`}
          >
            {/* Wordmark */}
            <a
              href="#top"
              className="group flex shrink-0 items-baseline gap-2 py-4 text-paper"
              aria-label={`${identity.name} — back to top`}
            >
              <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-0.03em] uppercase md:text-xl">
                Arleth
              </span>
              <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-0.03em] text-mute uppercase transition-colors duration-300 group-hover:text-ember-soft md:text-xl">
                New Style
              </span>
            </a>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {nav.map((item) => {
                  const isActive = active === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={isActive ? "true" : undefined}
                        className={`label link-underline transition-colors duration-300 ${
                          isActive ? "text-paper" : "text-mute hover:text-paper"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={contact.phoneHref}
                className="label hidden items-center gap-2 border border-ink-line px-4 py-3 text-paper-dim transition-colors duration-300 hover:border-paper hover:text-paper xl:inline-flex"
              >
                <Phone className="size-3.5" />
                {contact.phoneDisplay}
              </a>

              <a href="#book" className="btn btn-primary hidden sm:inline-flex">
                Book your cut
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                className="-mr-2 inline-flex size-11 items-center justify-center text-paper lg:hidden"
              >
                <Menu open={open} className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-ink transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        // Keep the sheet out of the tab order while closed.
        inert={!open}
      >
        <div className="shell flex h-full flex-col pt-[74px]">
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto py-8">
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} className="rule-t last:border-b">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4 text-paper transition-colors duration-300 hover:text-ember-soft"
                  >
                    <span className="label-sm text-mute-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display-md">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 pb-10">
            <a href="#book" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Book your cut
              <ArrowUpRight className="size-3.5" />
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href={contact.phoneHref} className="btn btn-outline !px-3">
                <Phone className="size-3.5" />
                Call
              </a>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline !px-3"
              >
                WhatsApp
              </a>
            </div>
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex items-center justify-center gap-2 py-3 text-mute transition-colors hover:text-paper"
            >
              {instagram.handle}
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/** Small close affordance kept separate so the header stays readable. */
export function SheetClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close menu"
      className="inline-flex size-11 items-center justify-center text-paper"
    >
      <Close className="size-6" />
    </button>
  );
}
