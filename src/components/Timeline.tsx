import Link from "next/link";
import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { SCHEDULE } from "@/data/hackathon";

export default function Timeline({ compact = false }: { compact?: boolean }) {
  return (
    <SectionWrapper
      id="schedule"
      label="Schedule"
      heading={<>Thirty-six hours, start to stage.</>}
      lede={
        compact ? (
          <p>
            The shape of the weekend. Times are indicative and will be locked two weeks
            out —{" "}
            <Link href="/schedule" className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4">
              see the full schedule
            </Link>
            .
          </p>
        ) : undefined
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {SCHEDULE.map((day, di) => (
          <Reveal key={day.day} delay={di * 0.08}>
            <div className="glass glass-sheen h-full p-6">
              <header className="mb-5">
                <p className="eyebrow text-[var(--color-accent)]">{day.day}</p>
                <p className="mt-1 text-[var(--font-size-lg)] font-light tracking-[var(--tracking-snug)]">
                  {day.date}
                </p>
              </header>

              <ol className="relative space-y-5 border-l border-[rgba(47,85,39,0.14)] pl-5">
                {(compact ? day.items.slice(0, 4) : day.items).map((item) => (
                  <li key={item.time + item.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[1.44rem] top-[0.5em] h-1.5 w-1.5 rounded-full bg-[var(--color-accent-bright)] ring-2 ring-[rgba(255,255,255,0.7)]"
                    />
                    <p className="font-mono text-[var(--font-size-xs)] tracking-[var(--tracking-wide)] text-[var(--color-text-tertiary)]">
                      {item.time}
                    </p>
                    <p className="mt-0.5 font-medium tracking-[var(--tracking-snug)]">
                      {item.title}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                        {item.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              {compact && day.items.length > 4 && (
                <p className="mt-5 text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
                  + {day.items.length - 4} more
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
