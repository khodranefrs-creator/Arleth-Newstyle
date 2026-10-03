"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/business";
import { Phone, WhatsApp } from "@/components/icons";

/**
 * Sticky mobile action bar. Three actions only: call, WhatsApp, book.
 * Slides away once the final booking section is on screen so it never covers
 * the conversion moment, and never appears on desktop.
 */
export default function MobileActions() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const target = document.getElementById("book");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setHide(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const link =
    "flex flex-1 flex-col items-center justify-center gap-1.5 py-3 transition-colors duration-300 active:bg-ink-lift";

  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-ink/95 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        hide ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        <a href={contact.phoneHref} className={`${link} text-paper`}>
          <Phone className="size-[18px]" />
          <span className="label-sm">Call</span>
        </a>

        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link} border-x border-ink-line text-paper`}
        >
          <WhatsApp className="size-[18px]" />
          <span className="label-sm">WhatsApp</span>
        </a>

        <a href="#book" className={`${link} bg-ember-deep text-paper`}>
          <span className="label-sm">Book</span>
        </a>
      </div>
    </nav>
  );
}
