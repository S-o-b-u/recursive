"use client";

import Link from "next/link";
import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { SCHEDULE } from "@/data/hackathon";

const DAY_STYLES = [
  {
    bg: "#f2f7ee", // Mint mist field sheet
    borderColor: "rgba(120, 160, 110, 0.35)",
    tapeBg: "rgba(220, 238, 215, 0.7)",
    accentDot: "#467232",
    tagColor: "#2c5020",
    shadow: "0 18px 45px rgba(25, 45, 20, 0.12)",
  },
  {
    bg: "#f7f1e6", // Manila expedition ledger
    borderColor: "rgba(180, 140, 90, 0.35)",
    tapeBg: "rgba(245, 230, 210, 0.7)",
    accentDot: "#8c561b",
    tagColor: "#663b10",
    shadow: "0 18px 45px rgba(45, 35, 15, 0.12)",
  },
  {
    bg: "#faf0f3", // Dusty rose finale docket
    borderColor: "rgba(190, 120, 145, 0.35)",
    tapeBg: "rgba(248, 220, 230, 0.7)",
    accentDot: "#94385a",
    tagColor: "#6e233f",
    shadow: "0 18px 45px rgba(50, 20, 35, 0.12)",
  },
];

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
            <Link
              href="/schedule"
              className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4 text-emerald-800 font-medium"
            >
              see the full schedule
            </Link>
            .
          </p>
        ) : undefined
      }
    >
      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {SCHEDULE.map((day, di) => {
          const style = DAY_STYLES[di] || DAY_STYLES[0];
          return (
            <Reveal key={day.day} delay={di * 0.08}>
              <div
                className="timeline-sheet"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                  boxShadow: style.shadow,
                }}
              >
                {/* Frosted Washi Tape Tab */}
                <div
                  className="timeline-tape"
                  style={{ backgroundColor: style.tapeBg }}
                  aria-hidden="true"
                />

                <header className="mb-6 border-b border-black/8 pb-4">
                  <span
                    className="timeline-day-tag"
                    style={{ color: style.tagColor }}
                  >
                    {day.day}
                  </span>
                  <p className="timeline-date">{day.date}</p>
                </header>

                <ol className="relative space-y-5 border-l-2 border-black/10 pl-5">
                  {(compact ? day.items.slice(0, 4) : day.items).map((item) => (
                    <li key={item.time + item.title} className="relative">
                      <span
                        aria-hidden
                        className="timeline-marker-dot"
                        style={{ backgroundColor: style.accentDot }}
                      />
                      <span className="timeline-time">{item.time}</span>
                      <p className="timeline-item-title">{item.title}</p>
                      {item.note && (
                        <p className="timeline-item-note">{item.note}</p>
                      )}
                    </li>
                  ))}
                </ol>

                {compact && day.items.length > 4 && (
                  <p className="mt-5 text-sm font-mono text-emerald-900/60 font-medium">
                    + {day.items.length - 4} more items
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        /* ── Tactile Field Journal Daily Sheet ── */
        .timeline-sheet {
          position: relative;
          height: 100%;
          padding: clamp(1.75rem, 4vw, 2.25rem);
          border-radius: 16px;
          border: 1px solid;
          color: #152417;
          transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms ease;
        }
        .timeline-sheet:hover {
          transform: translateY(-5px);
        }

        .timeline-tape {
          position: absolute;
          top: -11px;
          left: 2.5rem;
          width: 50px;
          height: 18px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.65);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .timeline-day-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .timeline-date {
          margin-top: 0.25rem;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #122415;
          letter-spacing: -0.015em;
        }

        .timeline-marker-dot {
          position: absolute;
          left: -1.65rem;
          top: 0.35rem;
          width: 9px;
          height: 9px;
          border-radius: 50% 45% 55% 48% / 48% 54% 46% 52%;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.85);
        }

        .timeline-time {
          display: inline-block;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #556c56;
          background: rgba(0, 0, 0, 0.04);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .timeline-item-title {
          margin-top: 0.25rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-weight: 600;
          font-size: 0.98rem;
          color: #122415;
          line-height: 1.35;
        }

        .timeline-item-note {
          margin-top: 0.2rem;
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.86rem;
          line-height: 1.45;
          color: #4c624d;
        }
      `}</style>
    </SectionWrapper>
  );
}
