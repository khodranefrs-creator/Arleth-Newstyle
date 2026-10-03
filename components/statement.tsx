import { SectionLabel, Reveal, Rule } from "@/components/reveal";

const pillars = [
  {
    label: "The cut",
    body: "Tell us the shape you want, or sit down and let the chair decide. Either way, the details are what matter.",
  },
  {
    label: "The room",
    body: "Spacious and laid-back on Gessner Road, set up so families and groups can wait without feeling like they are in the way.",
  },
  {
    label: "The hours",
    body: "The shop stays open late for after-work cuts. Book ahead and you go straight to a chair.",
  },
];

export default function Statement() {
  return (
    <section id="statement" aria-labelledby="statement-heading" className="section-y">
      <div className="shell">
        <Reveal>
          <SectionLabel index="01" title="The standard" />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7" delay={60}>
            <h2 id="statement-heading" className="display-lg">
              Your style,
              <br />
              <span className="text-ember">sharpened.</span>
            </h2>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:pb-3" delay={140}>
            <p className="body-md max-w-[46ch] text-paper-dim">
              Arleth New Style is a barbershop on Gessner Road in Houston. Walk in or book
              ahead, bring the shape you want or let the chair decide. Everything here is built
              around the cut — and around making the wait a comfortable one.
            </p>
          </Reveal>
        </div>

        <Rule className="mt-14 md:mt-20" />

        <div className="mt-px grid grid-cols-1 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal
              key={p.label}
              delay={i * 90}
              className={`group border-t border-ink-line py-8 md:border-t-0 md:py-10 ${
                i === 0 ? "md:pl-0" : "md:border-l md:pl-8"
              }`}
            >
              <h3 className="label text-paper transition-colors duration-300 group-hover:text-ember-soft">
                {p.label}
              </h3>
              <p className="body-md mt-4 max-w-[38ch] text-mute">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
