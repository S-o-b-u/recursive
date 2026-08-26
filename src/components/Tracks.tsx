import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { TRACKS } from "@/data/hackathon";

export default function Tracks({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="tracks"
      label="Tracks"
      heading={<>Four chairs on the hill. Pick one and sit down.</>}
      lede={
        <p>
          Each track is a seat — a direction, not a cage. Your project has to lean
          toward one of them, and every track carries its own prize.
        </p>
      }
      tone="alt"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TRACKS.map((track, i) => (
          <Reveal key={track.slug} delay={i * 0.07}>
            <article
              id={track.slug}
              className="glass glass-sheen flex h-full flex-col gap-4 p-6 sm:p-7"
            >
              <header className="flex items-center justify-between gap-3">
                <span className="eyebrow text-[var(--color-accent)]">{track.seat}</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-accent)] opacity-70" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  {/* chair glyph */}
                  <path d="M7 4v9m10-9v9M6 13h12M8 13v7m8-7v7" strokeLinecap="round" />
                </svg>
              </header>

              <h3 className="text-[var(--font-size-2xl)] font-light tracking-[var(--tracking-snug)]">
                {track.title}
              </h3>

              <p className="text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {track.summary}
              </p>

              {detailed && (
                <ul className="mt-auto space-y-2 border-t border-[rgba(47,85,39,0.1)] pt-4">
                  {track.prompts.map((p) => (
                    <li
                      key={p}
                      className="flex gap-2.5 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
                    >
                      <span aria-hidden className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent-bright)]" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
