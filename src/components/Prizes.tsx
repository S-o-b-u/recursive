import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { PRIZES, TRACK_PRIZE, SPECIAL_PRIZES } from "@/data/hackathon";

export default function Prizes({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="prizes"
      label="Prizes"
      heading={<>₹4.5 lakh in prizes, and a reason to finish.</>}
      lede={
        <p>
          Money helps, but the point is the deadline. Everything below is on top of
          food, workspace, and hardware for the weekend.
        </p>
      }
    >
      {/* Podium */}
      <div className="grid items-end gap-4 sm:grid-cols-3">
        {PRIZES.map((prize, i) => (
          <Reveal key={prize.place} delay={i * 0.08}>
            <div
              className={`glass glass-sheen flex h-full flex-col gap-4 p-6 text-center ${
                prize.featured
                  ? "glass-strong sm:-mt-8 sm:pb-9 sm:pt-8 ring-1 ring-[rgba(143,196,90,0.45)]"
                  : ""
              }`}
            >
              <p className="eyebrow text-[var(--color-accent)]">{prize.place}</p>
              <p
                className={`font-light tracking-[var(--tracking-tight)] ${
                  prize.featured ? "text-[2.6rem]" : "text-[2rem]"
                } leading-none`}
              >
                {prize.amount}
              </p>
              <ul className="mt-auto space-y-1.5 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                {prize.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Track prize */}
      <Reveal delay={0.1}>
        <div className="glass glass-sheen mt-4 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">{TRACK_PRIZE.label}</p>
            <p className="mt-1 text-[var(--color-text-secondary)]">{TRACK_PRIZE.note}</p>
          </div>
          <p className="text-[1.75rem] font-light leading-none tracking-[var(--tracking-tight)]">
            {TRACK_PRIZE.amount}
            <span className="ml-2 align-middle text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
              × 4
            </span>
          </p>
        </div>
      </Reveal>

      {detailed && (
        <div className="mt-10">
          <h3 className="mb-5 text-[var(--font-size-xl)] font-light">Special awards</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {SPECIAL_PRIZES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="glass p-5">
                  <p className="font-medium tracking-[var(--tracking-snug)]">{s.title}</p>
                  <p className="mt-1 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                    {s.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
