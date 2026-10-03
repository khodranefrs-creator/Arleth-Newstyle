import Image from "next/image";
import { community, bandPhoto, contact } from "@/lib/business";
import { ArrowUpRight, Phone } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export default function Community() {
  return (
    <section aria-labelledby="community-heading" className="relative isolate overflow-hidden">
      <div className="relative min-h-[78svh] w-full md:min-h-[86svh]">
        <Image
          src={bandPhoto.src}
          alt={bandPhoto.alt}
          width={bandPhoto.width}
          height={bandPhoto.height}
          loading="lazy"
          quality={74}
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Legibility scrim — a single horizontal gradient, left-weighted */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,9,0.94)_0%,rgba(10,10,9,0.82)_38%,rgba(10,10,9,0.28)_72%,rgba(10,10,9,0.5)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(10,10,9,0.7))]"
        />

        <div className="shell flex min-h-[78svh] flex-col justify-between py-14 md:min-h-[86svh] md:py-20">
          <Reveal>
            <p className="label-sm max-w-[30ch] text-ember">{community.kicker}</p>
          </Reveal>

          <div className="max-w-4xl">
            <Reveal delay={80}>
              <h2 id="community-heading" className="display-lg">
                {community.headline.map((line, i) => (
                  <span
                    key={line}
                    className={i === 1 ? "text-ember block" : "block"}
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="body-lg mt-7 max-w-[46ch] text-paper-dim">{community.body}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#book" className="btn btn-primary">
                  Book your cut
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a href={contact.phoneHref} className="btn btn-outline">
                  <Phone className="size-3.5" />
                  {contact.phoneDisplay}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
