import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { SPONSORS, SPONSOR_TIERS, EVENT } from "@/data/hackathon";

export default function Sponsors({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="sponsors"
      label="Sponsors"
      heading={<>Grown with help from people who build things.</>}
      lede={
        <p>
          Sponsorship pays for food, travel grants, and prizes — not for a logo wall.
          Three tiers, named after what a forest needs.{" "}
          <a
            href={`mailto:${EVENT.email}`}
            className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4"
          >
            Talk to us
          </a>
          .
        </p>
      }
      tone="alt"
    >
      {/* Logo grid — placeholders until real partners are confirmed */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SPONSORS.map((s, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <div className="glass glass-sheen grid h-24 place-items-center p-4 text-center">
              <span className="text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
                {s.name}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {detailed && (
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {SPONSOR_TIERS.map((tier, i) => (
            <Reveal key={tier.tier} delay={i * 0.08}>
              <div className="glass glass-sheen flex h-full flex-col gap-4 p-6">
                <div>
                  <p className="eyebrow text-[var(--color-accent)]">{tier.tier}</p>
                  <p className="mt-1 text-[1.75rem] font-light leading-none tracking-[var(--tracking-tight)]">
                    {tier.price}
                  </p>
                </div>
                <ul className="space-y-2 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent-bright)]"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${EVENT.email}?subject=${tier.tier} sponsorship — ${EVENT.name}`}
                  className="btn btn-glass mt-auto"
                >
                  Enquire
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
