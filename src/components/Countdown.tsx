"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/data/hackathon";
import { RevealHeading, RevealBlock } from "@/components/ui/reveal";
import Atmosphere from "@/components/ui/Atmosphere";

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

  const cells: { value: string; label: string; unitTag: string }[] = [
    { value: t ? pad(t.days) : "--", label: "Days", unitTag: "DD" },
    { value: t ? pad(t.hours) : "--", label: "Hours", unitTag: "HH" },
    { value: t ? pad(t.mins) : "--", label: "Minutes", unitTag: "MM" },
    { value: t ? pad(t.secs) : "--", label: "Seconds", unitTag: "SS" },
  ];

  return (
    <section id="countdown" className="cd" aria-label="Countdown to Recursive">
      <Atmosphere zIndex={-1} seed={53} count={14} opacity={0.7} />

      {/* Ambient Forest Glow Behind the Chronometer Station */}
      <div className="cd-ambient-glow" aria-hidden="true" />

      <div className="cd-inner">
        <RevealBlock className="cd-station" y={28}>
          {/* Frosted Washi Tape Top Anchor */}
          <div className="cd-tape" aria-hidden="true" />

          {/* Top Instrument Status Ribbon */}
          <div className="cd-ribbon">
            <div className="cd-status-badge">
              <span className="cd-status-dot" aria-hidden="true" />
              <span>LIVE FIELD CHRONOMETER · 36H EXPEDITION</span>
            </div>
            <span className="cd-ribbon-tag">RECURSIVE 2026</span>
          </div>

          <div className="cd-heading-wrap">
            <RevealHeading
              className="cd-heading"
              lines={live ? ["Gates are", "open."] : ["Gates open", "in"]}
            />
          </div>

          {/* 4 Tactile Flip-Capsule Digit Instruments */}
          <div className="cd-grid" role="timer" aria-live="off">
            {cells.map((c) => (
              <div key={c.label} className="cd-capsule">
                <div className="cd-capsule-crease" aria-hidden="true" />
                <span className="cd-capsule-tag">{c.unitTag}</span>
                <span className="cd-num">{c.value}</span>
                <span className="cd-unit">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Footer Instrument Metadata & Action */}
          <div className="cd-foot">
            <div className="cd-when">
              <div className="cd-meta-row">
                <svg viewBox="0 0 24 24" className="cd-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="cd-date">{EVENT.dates}</span>
              </div>
              <div className="cd-meta-row">
                <svg viewBox="0 0 24 24" className="cd-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="cd-where">
                  {EVENT.duration} · {EVENT.venue}
                </span>
              </div>
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
          background: radial-gradient(130% 90% at 50% 30%, #162e1c 0%, #0d1910 100%);
          background-color: #0d1910;
          color: #f3f8ee;
          padding-block: clamp(6rem, 13vh, 10rem);
          overflow: hidden;
          z-index: 10;
        }

        .cd-ambient-glow {
          position: absolute;
          left: 50%;
          top: 35%;
          transform: translate(-50%, -50%);
          width: 70vw;
          max-width: 900px;
          height: 380px;
          background: radial-gradient(circle, rgba(143, 196, 90, 0.12) 0%, rgba(92, 140, 58, 0.04) 50%, transparent 75%);
          pointer-events: none;
          z-index: 1;
        }

        .cd-inner {
          position: relative;
          max-width: 84rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          z-index: 2;
        }

        /* ── Chronometer Instrument Station Chassis ── */
        .cd-station {
          position: relative;
          overflow: hidden;
          border-radius: clamp(24px, 3.5vw, 38px);
          padding: clamp(2rem, 4.5vw, 3.75rem);
          background:
            radial-gradient(120% 140% at 15% 0%, rgba(143, 196, 90, 0.14) 0%, rgba(143, 196, 90, 0) 55%),
            linear-gradient(160deg, rgba(22, 44, 28, 0.92) 0%, rgba(13, 24, 16, 0.97) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(143, 196, 90, 0.25);
          box-shadow:
            0 35px 80px rgba(0, 0, 0, 0.6),
            0 0 45px rgba(143, 196, 90, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Frosted washi tape anchor */
        .cd-tape {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 56px;
          height: 19px;
          background: rgba(230, 242, 222, 0.52);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }

        /* Top status ribbon */
        .cd-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: clamp(1.25rem, 3vh, 2rem);
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(143, 196, 90, 0.16);
        }

        .cd-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a6e06a;
        }

        .cd-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #a6e06a;
          box-shadow: 0 0 10px rgba(166, 224, 106, 0.85);
          animation: cd-dot-pulse 2s ease-in-out infinite;
        }

        @keyframes cd-dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        .cd-ribbon-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(243, 248, 238, 0.5);
        }

        .cd-heading {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 0.95;
          letter-spacing: -0.024em;
          text-transform: uppercase;
          color: #F2F8EC;
        }

        /* ── 4 Flip-Capsule Digit Instruments ── */
        .cd-grid {
          margin-top: clamp(2rem, 4.5vh, 3.25rem);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 2vw, 1.75rem);
        }

        .cd-capsule {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(1.5rem, 3.2vw, 2.75rem) clamp(0.75rem, 1.5vw, 1.5rem);
          border-radius: clamp(14px, 2vw, 22px);
          background:
            radial-gradient(85% 65% at 50% 15%, rgba(143, 196, 90, 0.1) 0%, transparent 65%),
            linear-gradient(180deg, rgba(26, 52, 33, 0.78) 0%, rgba(12, 26, 16, 0.92) 100%);
          border: 1px solid rgba(143, 196, 90, 0.24);
          box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.42),
            inset 0 1px 1px rgba(255, 255, 255, 0.18),
            inset 0 -1px 2px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          transition: transform 280ms cubic-bezier(0.23, 1, 0.32, 1), border-color 280ms ease, box-shadow 280ms ease;
        }
        .cd-capsule:hover {
          transform: translateY(-4px);
          border-color: rgba(166, 224, 106, 0.45);
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.55),
            0 0 25px rgba(143, 196, 90, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }

        .cd-capsule-crease {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(0, 0, 0, 0.35);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }

        .cd-capsule-tag {
          position: absolute;
          top: 0.65rem;
          right: 0.75rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(166, 224, 106, 0.6);
        }

        .cd-num {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 8vw, 6.2rem);
          line-height: 0.88;
          letter-spacing: -0.03em;
          color: #F4FAEE;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
        }

        .cd-unit {
          margin-top: 0.85rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.7rem, 1.1vw, 0.82rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a6e06a;
        }

        /* ── Footer Metadata & Devfolio CTA ── */
        .cd-foot {
          margin-top: clamp(2.5rem, 5vh, 3.75rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(143, 196, 90, 0.16);
        }

        .cd-when {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .cd-meta-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .cd-meta-icon {
          width: 1rem;
          height: 1rem;
          color: #a6e06a;
          flex-shrink: 0;
        }

        .cd-date {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: clamp(1.05rem, 1.8vw, 1.35rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #E9F1E2;
        }

        .cd-where {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          color: rgba(233, 241, 226, 0.65);
        }

        .cd-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          height: 3.25rem;
          padding-inline: 1.85rem;
          border-radius: var(--radius-pill);
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.98rem;
          font-weight: 600;
          letter-spacing: -0.012em;
          color: #10200f;
          background: linear-gradient(180deg, #F4FAEE 0%, #D5E5C8 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.35),
            0 0 20px rgba(166, 224, 106, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: transform 200ms var(--ease-out), gap 200ms var(--ease-out), box-shadow 200ms ease;
        }
        .cd-cta svg { width: 1rem; height: 1rem; transition: transform 200ms ease; }
        .cd-cta:hover {
          transform: translateY(-2px);
          gap: 0.85rem;
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.45),
            0 0 30px rgba(166, 224, 106, 0.4);
        }
        .cd-cta:active { transform: scale(0.98); }

        @media (max-width: 720px) {
          .cd-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }
          .cd-num { font-size: clamp(3.2rem, 16vw, 4.8rem); }
          .cd-foot { flex-direction: column; align-items: flex-start; }
          .cd-cta { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
