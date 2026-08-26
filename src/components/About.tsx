import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { EVENT } from "@/data/hackathon";

const FACTS = [
  { label: "When", value: EVENT.dates },
  { label: "How long", value: EVENT.duration },
  { label: "Where", value: EVENT.format },
  { label: "Team size", value: EVENT.teamSize },
];

export default function About() {
  return (
    <SectionWrapper
      id="about"
      label="About"
      heading={<>A simple rule, repeated, becomes a forest.</>}
      tone="deep"
      className="about"
    >
      <div className="grid gap-[var(--space-block)] md:grid-cols-[1.15fr_1fr] md:items-start">
        <Reveal className="space-y-5 text-[var(--font-size-lg)] leading-[var(--leading-relaxed)] font-light text-[rgba(232,241,224,0.74)]">
          <p>
            Recursion and growth are the same idea wearing different clothes. A fern
            unfurls by repeating one instruction at a smaller scale. A river delta
            branches by branching. Nothing plans the whole shape — the shape is what
            the rule leaves behind.
          </p>
          <p>
            {EVENT.name} is {EVENT.duration} built on that premise. You arrive with one
            small idea and a hard deadline, and you find out what it grows into. No
            themes handed down from a stage, no busywork — four tracks, four chairs on
            the hill, and a room full of people willing to stay up with you.
          </p>
          <p>
            It is free, it is for beginners as much as for veterans, and everything you
            make stays yours.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="glass-dark grid gap-0 p-2">
            {FACTS.map((f, i) => (
              <li
                key={f.label}
                className={`flex items-baseline justify-between gap-4 px-5 py-4 ${
                  i > 0 ? "border-t border-[rgba(232,241,224,0.1)]" : ""
                }`}
              >
                <span className="about-fact-label">{f.label}</span>
                <span className="text-right text-[var(--font-size-lg)] font-light tracking-[var(--tracking-snug)] text-[#EFF3EB]">
                  {f.value}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <style>{`
        .about {
          position: relative;
          isolation: isolate;
          padding-top: clamp(5rem, 10vh, 7.5rem);
        }
        .about .section-label { color: var(--color-accent-bright); }
        .about .section-label::before { background: var(--color-accent-bright); }
        .about-fact-label {
          font-size: var(--font-size-xs);
          font-weight: 550;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          color: rgba(232, 241, 224, 0.5);
        }
      `}</style>
    </SectionWrapper>
  );
}
