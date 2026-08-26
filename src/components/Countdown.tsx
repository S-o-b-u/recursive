"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";

/**
 * THE COUNTER — a deep-forest slab inset in the light page, so it reads as one
 * hard object rather than a band with two seams.
 *
 * SSR-safe: the digits render as "--" on the server and on first paint, then
 * fill in after mount. Counting down during render would hydrate-mismatch.
 * Tabular figures + fixed grid columns mean the seconds tick without nudging
 * the layout a single pixel.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function split(ms: number) {
  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    mins: Math.floor((ms % HOUR) / MINUTE),
    secs: Math.floor((ms % MINUTE) / SECOND),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const target = new Date(EVENT.startsAt).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, SECOND);
    return () => window.clearInterval(id);
  }, [target]);

  const t = left === null ? null : split(left);
  const live = left !== null && left === 0;

  const cells: { value: string; label: string }[] = [
    { value: t ? pad(t.days) : "--", label: "days" },
    { value: t ? pad(t.hours) : "--", label: "hours" },
    { value: t ? pad(t.mins) : "--", label: "minutes" },
    { value: t ? pad(t.secs) : "--", label: "seconds" },
  ];

  return (
    <section id="countdown" className="cd" aria-label="Countdown to Recursive">
      <div className="cd-inner">
        <RevealBlock className="cd-slab" y={30}>
          <RevealHeading
            className="cd-heading"
            lines={live ? ["Gates are", "open."] : ["Gates open", "in"]}
          />

          <div className="cd-grid" role="timer" aria-live="off">
            {cells.map((c) => (
              <div key={c.label} className="cd-cell">
                <span className="cd-num">{c.value}</span>
                <span className="cd-unit">{c.label}</span>
              </div>
            ))}
          </div>

          <div className="cd-foot">
            <div className="cd-when">
              <span className="cd-date">{EVENT.dates}</span>
              <span className="cd-where">
                {EVENT.duration} · {EVENT.venue}
              </span>
            </div>

            <a
              href={EVENT.devfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cd-cta"
            >
              Register on Devfolio
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .cd {
          position: relative;
          width: 100%;
          background: var(--color-bg);
          padding-block: clamp(4rem, 10vh, 8rem);
        }

        .cd-inner {
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }

        .cd-slab {
          position: relative;
          overflow: hidden;
          border-radius: clamp(22px, 3vw, 42px);
          padding: clamp(2rem, 5vw, 4.25rem);
          color: #E9F1E2;
          background:
            radial-gradient(120% 140% at 15% 0%, rgba(143, 196, 90, 0.16) 0%, rgba(143, 196, 90, 0) 55%),
            linear-gradient(158deg, #17291B 0%, #0C160E 100%);
          box-shadow:
            0 30px 70px rgba(16, 27, 18, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .cd-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.6rem, 3.6vw, 2.9rem);
          line-height: 0.98;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #E9F1E2;
        }

        .cd-grid {
          margin-top: clamp(1.75rem, 4vh, 3rem);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.5rem, 2vw, 1.5rem);
        }
        .cd-cell {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 0.9rem;
          border-top: 1px solid rgba(233, 241, 226, 0.16);
        }
        .cd-num {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.9rem, 10.5vw, 8rem);
          line-height: 0.86;
          letter-spacing: -0.035em;
          color: #F2F8EC;
          /* Fixed-width figures: the seconds must not shove the layout. */
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
        }
        .cd-unit {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.6rem, 1vw, 0.72rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-accent-bright);
        }

        .cd-foot {
          margin-top: clamp(2.25rem, 5vh, 3.5rem);
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .cd-when { display: flex; flex-direction: column; gap: 0.3rem; }
        .cd-date {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1.05rem, 1.9vw, 1.45rem);
          font-weight: 450;
          letter-spacing: -0.02em;
          color: #E9F1E2;
        }
        .cd-where {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          color: rgba(233, 241, 226, 0.58);
        }

        .cd-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          height: 3.1rem;
          padding-inline: 1.7rem;
          border-radius: var(--radius-pill);
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 550;
          letter-spacing: -0.012em;
          color: #10200f;
          background: linear-gradient(180deg, #F4FAEE 0%, #DDE9D2 100%);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: transform 200ms var(--ease-out), gap 200ms var(--ease-out);
        }
        .cd-cta svg { width: 1rem; height: 1rem; }
        .cd-cta:hover { transform: translateY(-2px); gap: 0.8rem; }
        .cd-cta:active { transform: scale(0.98); }

        @media (max-width: 620px) {
          .cd-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem 1rem; }
          .cd-num { font-size: clamp(3.4rem, 20vw, 5rem); }
          .cd-foot { flex-direction: column; align-items: flex-start; }
          .cd-cta { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
