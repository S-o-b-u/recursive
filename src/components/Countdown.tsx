"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { EVENT } from "@/data/hackathon";
import { RevealBlock, RevealHeading } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import FlipClock, { type FlipClockUnit } from "@/components/ui/FlipClock";

function pad(n: number): string {
  return Math.max(0, n).toString().padStart(2, "0");
}

const ZEROED: FlipClockUnit[] = [
  { value: "00", label: "Days" },
  { value: "00", label: "Hours" },
  { value: "00", label: "Minutes" },
  { value: "00", label: "Seconds" },
];

function LiveTimer() {
  const [units, setUnits] = useState<FlipClockUnit[]>(ZEROED);

  useEffect(() => {
    const target = new Date(EVENT.startsAt).getTime();

    const getUnits = () => {
      const diff = Math.max(0, target - Date.now());
      const total = Math.floor(diff / 1000);

      return [
        { value: pad(Math.floor(total / 86400)), label: "Days" },
        { value: pad(Math.floor((total % 86400) / 3600)), label: "Hours" },
        { value: pad(Math.floor((total % 3600) / 60)), label: "Minutes" },
        { value: pad(total % 60), label: "Seconds" },
      ];
    };

    setUnits(getUnits());

    let timeoutId: NodeJS.Timeout;
    const tick = () => {
      setUnits(getUnits());
      const now = Date.now();
      const msUntilNextSecond = 1000 - (now % 1000) + 15;
      timeoutId = setTimeout(tick, msUntilNextSecond);
    };

    const initialDelay = 1000 - (Date.now() % 1000) + 15;
    timeoutId = setTimeout(tick, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  return <FlipClock units={units} />;
}

/**
 * The "gates open in" plaque.
 *
 * Not a pill. Two hairlines run out of the type and dissolve into the page, and
 * each half of the line is introduced by its own mark: a running analog clock
 * for the duration, a calendar with the 8th filled for the date. Both are drawn
 * on the same moss gradient, and the clock trails vapour off its face so it
 * belongs to the same smoky family as the split-flap board below.
 *
 * IDs are per-instance via useId — SVG gradient references are document-global
 * and would otherwise collide with any other gradient on the page.
 */
function GatesPlaque() {
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const g = (name: string) => `cdp-${name}-${uid}`;

  return (
    <div className="cd-plaque">
      <span className="cd-plaque-rule cd-plaque-rule-l" aria-hidden="true" />

      <span className="cd-plaque-core">
        <span className="cd-plaque-eyebrow">
          <span className="cd-dial" aria-hidden="true">
            <span className="cd-dial-smoke">
              <i />
              <i />
              <i />
            </span>

            <svg viewBox="0 0 24 24">
              <defs>
                {/* userSpaceOnUse, not the default objectBoundingBox: a
                    straight <line> has a zero-width or zero-height bbox, and an
                    objectBoundingBox gradient on one degenerates so the element
                    is dropped entirely. The hands and ticks are lines. */}
                <linearGradient
                  id={g("ink")}
                  gradientUnits="userSpaceOnUse"
                  x1="3.5"
                  y1="3"
                  x2="20.5"
                  y2="21"
                >
                  <stop offset="0" stopColor="#8FC45A" />
                  <stop offset="0.5" stopColor="#5C8C3A" />
                  <stop offset="1" stopColor="#2F5527" />
                </linearGradient>
                <radialGradient
                  id={g("face")}
                  gradientUnits="userSpaceOnUse"
                  cx="8.8"
                  cy="7.9"
                  r="15"
                >
                  <stop offset="0" stopColor="rgba(244, 250, 236, 0.95)" />
                  <stop offset="0.65" stopColor="rgba(224, 238, 208, 0.6)" />
                  <stop offset="1" stopColor="rgba(184, 212, 160, 0.28)" />
                </radialGradient>
              </defs>

              <circle
                cx="12"
                cy="12"
                r="9.1"
                fill={`url(#${g("face")})`}
                stroke={`url(#${g("ink")})`}
                strokeWidth="1.6"
              />

              <g
                stroke={`url(#${g("ink")})`}
                strokeWidth="1.15"
                strokeLinecap="round"
                opacity="0.5"
              >
                <line x1="12" y1="4.5" x2="12" y2="6.1" />
                <line x1="19.5" y1="12" x2="17.9" y2="12" />
                <line x1="12" y1="19.5" x2="12" y2="17.9" />
                <line x1="4.5" y1="12" x2="6.1" y2="12" />
              </g>

              <line
                className="cd-dial-hour"
                x1="12"
                y1="12"
                x2="12"
                y2="7.8"
                stroke={`url(#${g("ink")})`}
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <line
                className="cd-dial-min"
                x1="12"
                y1="12"
                x2="15.9"
                y2="12"
                stroke={`url(#${g("ink")})`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="1.05" fill="#2F5527" />
            </svg>
          </span>
          Gates open in
        </span>

        <svg className="cd-plaque-cal" viewBox="0 0 22 22" aria-hidden="true">
          <defs>
            {/* Same reason as the clock: the header rule and the two hanging
                tabs are lines, so this has to be in user space. */}
            <linearGradient
              id={g("cal")}
              gradientUnits="userSpaceOnUse"
              x1="2.5"
              y1="2.5"
              x2="19.5"
              y2="19.5"
            >
              <stop offset="0" stopColor="#8FC45A" />
              <stop offset="0.5" stopColor="#5C8C3A" />
              <stop offset="1" stopColor="#2F5527" />
            </linearGradient>
          </defs>

          <g
            stroke={`url(#${g("cal")})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          >
            <rect x="2.8" y="4.6" width="16.4" height="14.6" rx="2.6" />
            <line x1="2.8" y1="9.2" x2="19.2" y2="9.2" />
            <line x1="7.3" y1="2.6" x2="7.3" y2="6.2" />
            <line x1="14.7" y1="2.6" x2="14.7" y2="6.2" />
          </g>

          {/* the 8th, ringed */}
          <rect
            x="9.2"
            y="11.8"
            width="3.6"
            height="3.6"
            rx="1"
            fill={`url(#${g("cal")})`}
          />
        </svg>

        <time className="cd-plaque-date" dateTime={EVENT.startsAt}>
          October 08, 2026
        </time>
      </span>

      <span className="cd-plaque-rule cd-plaque-rule-r" aria-hidden="true" />
    </div>
  );
}

export default function Countdown() {
  return (
    <section id="countdown" className="cd" aria-label="Hackathon Countdown">
      <div className="cd-inner">
        <RevealBlock y={14}>
          <div className="cd-ornament-wrap">
            <Ornament className="cd-motif" />
          </div>
        </RevealBlock>

        <div className="cd-head-wrap">
          <RevealHeading className="cd-heading" lines={["Countdown to Launch"]} />
        </div>

        <RevealBlock y={14} delay={0.06} className="cd-plaque-block">
          <GatesPlaque />
        </RevealBlock>

        <RevealBlock y={12} delay={0.1}>
          <p className="cd-plaque-sub">
            09:00 IST · {EVENT.venue} · {EVENT.format.split("·")[1]?.trim() ?? EVENT.format}
          </p>
        </RevealBlock>

        {/* ── Split-flap board ── */}
        <RevealBlock y={22} delay={0.14} className="cd-clock-reveal">
          <div className="cd-clock-wrapper">
            <LiveTimer />
          </div>
        </RevealBlock>
      </div>

      {/* ── Valley mask (full uncropped aspect ratio, anchored at the bottom).
             Its last row is #010301, which is what the night section below
             picks up — that is the seam. ── */}
      <div className="cd-valley" aria-hidden="true">
        <Image
          src="/images/valley.png"
          alt=""
          width={2752}
          height={1536}
          className="cd-valley-img"
          priority
        />
      </div>

      <style>{`
        .cd {
          position: relative;
          width: 100%;
          background: transparent;
          color: #111a12;
          padding-top: clamp(3.5rem, 8vh, 6.5rem);
          /* The valley plate is anchored to this edge and is 0.558× the page
             width tall, so this padding is what decides how far up the hills
             the board sits. Below ~26vw the outer groups fall behind the
             shoulders and their labels vanish. */
          padding-bottom: clamp(13rem, 29vw, 40rem);
          overflow: hidden;
          z-index: 1;
        }

        .cd-inner {
          position: relative;
          max-width: 104rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }

        .cd-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1.2rem, 2.4vh, 1.8rem);
        }

        .cd-motif {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .cd-head-wrap {
          width: 100%;
          text-align: center;
        }

        .cd-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.8rem, 6.2vw, 4.8rem);
          line-height: 1.12;
          letter-spacing: -0.028em;
          color: #111a12;
          text-align: center;
        }

        .cd-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        /* ── Gates plaque ── */
        /* .cd-inner is a centred column, so its children shrink to fit. Without
           this the plaque has no free space to hand its flanking rules and they
           collapse to zero width. */
        .cd-plaque-block {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .cd-plaque {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(1rem, 2.8vw, 2.1rem);
          width: min(54rem, 100%);
          margin-top: clamp(1.3rem, 2.8vh, 2.1rem);
        }

        .cd-plaque-rule {
          flex: 1 1 0;
          max-width: 11rem;
          height: 1px;
          background: linear-gradient(90deg,
            rgba(47, 85, 39, 0) 0%,
            rgba(47, 85, 39, 0.4) 78%,
            rgba(47, 85, 39, 0.52) 100%);
        }
        .cd-plaque-rule-r { transform: scaleX(-1); }

        .cd-plaque-core {
          display: inline-flex;
          align-items: center;
          gap: clamp(0.75rem, 1.9vw, 1.25rem);
          flex-wrap: nowrap;
        }

        .cd-plaque-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(0.72rem, 1.05vw, 0.84rem);
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4A6B3E;
          white-space: nowrap;
        }

        /* ── Running clock, with vapour ── */
        .cd-dial {
          position: relative;
          flex: none;
          width: clamp(18px, 1.9vw, 22px);
          height: clamp(18px, 1.9vw, 22px);
          display: block;
        }

        .cd-dial svg {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 1px 2px rgba(24, 46, 16, 0.28));
        }

        /* Hands sweep on a stylised cycle — fast enough to read as running at a
           glance, slow enough not to pull the eye off the headline. */
        .cd-dial-hour,
        .cd-dial-min {
          transform-box: view-box;
          transform-origin: 12px 12px;
        }
        .cd-dial-min  { animation: cd-dial-sweep 12s linear infinite; }
        .cd-dial-hour { animation: cd-dial-sweep 144s linear infinite; }

        @keyframes cd-dial-sweep { to { transform: rotate(360deg); } }

        /* Three puffs lifting off the face, same language as the flap vapour
           on the board below — just scaled to icon size. */
        .cd-dial-smoke {
          position: absolute;
          left: 50%;
          top: 42%;
          width: 1px;
          height: 1px;
          z-index: 0;
          pointer-events: none;
        }

        .cd-dial-smoke i {
          position: absolute;
          left: 0;
          top: 0;
          width: clamp(15px, 1.8vw, 20px);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 60%,
            rgba(150, 198, 104, 0.5) 0%,
            rgba(120, 172, 78, 0.22) 46%,
            rgba(110, 160, 70, 0) 74%);
          filter: blur(3px);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
          animation: cd-dial-puff 5.4s cubic-bezier(0.22, 0.7, 0.32, 1) infinite;
        }
        .cd-dial-smoke i:nth-child(1) { --sx: -76%; animation-delay: 0s; }
        .cd-dial-smoke i:nth-child(2) { --sx: -34%; animation-delay: 1.8s; }
        .cd-dial-smoke i:nth-child(3) { --sx: -58%; animation-delay: 3.6s; }

        @keyframes cd-dial-puff {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          22%  { opacity: 0.62; }
          60%  { opacity: 0.24; }
          100% { opacity: 0; transform: translate(var(--sx), -190%) scale(1.7); }
        }

        /* ── Calendar ── */
        .cd-plaque-cal {
          width: clamp(17px, 1.85vw, 21px);
          height: auto;
          flex: none;
          filter: drop-shadow(0 1px 2px rgba(24, 46, 16, 0.24));
        }

        /* HeadingNow (trial cut) ships no numerals — "08, 2026" comes out as
           .notdef boxes in it. Bebas has them, and it is the same face as the
           flap digits below, so the plaque and the board agree. */
        .cd-plaque-date {
          font-family: var(--font-bebas), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.0rem, 11.3px + 1.304vw, 1.75rem);
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #16281A;
          white-space: nowrap;
        }

        .cd-plaque-sub {
          margin-top: clamp(0.75rem, 1.5vh, 1.1rem);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.85rem, 1.2vw, 1.02rem);
          font-weight: 400;
          letter-spacing: 0.015em;
          color: rgba(47, 66, 44, 0.62);
          text-wrap: balance;
        }

        /* ── Split-flap board ── */
        .cd-clock-reveal {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: clamp(2.5rem, 5vh, 4.25rem);
        }

        .cd-clock-wrapper {
          width: 100%;
          max-width: 98rem;
          display: flex;
          justify-content: center;
        }

        /* ── Valley overlay — uncropped, full width, anchored to bottom ── */
        .cd-valley {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          z-index: 10;
          line-height: 0;
        }

        .cd-valley-img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Black under-plate. The photograph's last band is already #010301, so
           painting the same value behind it is invisible — but it means the
           clipped bottom edge blends against black instead of the page's cloud
           background, which is the other half of the hairline fix. Overshoots
           the edge on all three sides so no fractional row is left uncovered. */
        .cd-valley::after {
          content: "";
          position: absolute;
          left: -1px;
          right: -1px;
          bottom: -2px;
          height: 14%;
          z-index: -1;
          background: linear-gradient(180deg, rgba(1, 3, 1, 0) 0%, #010301 58%);
        }

        @media (max-width: 560px) {
          .cd-plaque { flex-direction: column; gap: 0.85rem; }
          .cd-plaque-rule { width: 5rem; max-width: 5rem; flex: none; }
          .cd-plaque-core { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
