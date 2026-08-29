"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/data/hackathon";
import { RevealBlock, RevealHeading, RuleDraw } from "@/components/ui/reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { FlipDiskMatrix } from "@/components/ui/flip-disk-matrix";

/**
 * Symmetrical Botanical Flourish for Countdown.
 */
function BotanicalCountdownMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M80 4C80 4 76 13 66 16C56 18 42 14 32 19C24 23 20 31 12 33C7 34 3 32 0 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 4C80 4 84 13 94 16C104 18 118 14 128 19C136 23 140 31 148 33C153 34 157 32 160 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 0V12M80 0C77 3 74 6 74 9C74 12 77 13 80 13C83 13 86 12 86 9C86 6 83 3 80 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="20" r="1.8" fill="currentColor" />
      <circle cx="80" cy="27" r="1.3" fill="currentColor" />
      <circle cx="80" cy="33" r="1" fill="currentColor" />
    </svg>
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function Countdown() {
  const [timeString, setTimeString] = useState<string>("00:00:00");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(EVENT.startsAt).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      if (days > 0) {
        // Format: "39:14:22" — days:hours:minutes (fits 8 chars = 47 cols)
        setTimeString(`${pad(days)}:${pad(hours)}:${pad(minutes)}`);
      } else {
        // Format: "08:14:22" — hours:minutes:seconds
        setTimeString(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="countdown" className="cd" aria-label="Hackathon Countdown">
      <div className="cd-inner">
        {/* ── Botanical Flourish ── */}
        <RevealBlock y={14}>
          <div className="cd-ornament-wrap">
            <BotanicalCountdownMotif className="cd-motif" />
          </div>
        </RevealBlock>

        {/* ── Centered Heading ── */}
        <div className="cd-head-wrap">
          <RevealHeading
            className="cd-heading"
            lines={["Countdown to Launch"]}
          />
        </div>

        {/* ── Static "GATES OPEN IN" Badge — stable, never re-renders on tick ── */}
        <RevealBlock y={14} delay={0.06}>
          <div className="cd-badge-wrap">
            <div className="cd-live-badge">
              <span className="cd-live-dot" />
              <span className="cd-live-text">
                GATES OPEN IN · OCTOBER 08, 2026
              </span>
            </div>
          </div>
        </RevealBlock>

        {/* ── Electromechanical Flip-Disk Matrix Display ── */}
        <RevealBlock y={22} delay={0.1} className="cd-matrix-reveal">
          <div className="cd-matrix-wrapper">
            <FlipDiskMatrix
              displayText={mounted ? timeString : "00:00:00"}
              cols={53}
              rows={11}
            />
          </div>
        </RevealBlock>

        {/* ── Legend: what each pair of digits means ── */}
        <RevealBlock y={10} delay={0.14}>
          <div className="cd-legend">
            <span className="cd-legend-item">Days</span>
            <span className="cd-legend-sep">:</span>
            <span className="cd-legend-item">Hours</span>
            <span className="cd-legend-sep">:</span>
            <span className="cd-legend-item">Minutes</span>
          </div>
        </RevealBlock>

        {/* ── Bottom Section Specs & CTA ── */}
        <RevealBlock y={16} delay={0.16}>
          <RuleDraw className="cd-rule-bottom" />
          <div className="cd-foot">
            <div className="cd-specs">
              <span className="cd-spec-item">{EVENT.duration}</span>
              <span className="cd-spec-dot">✦</span>
              <span className="cd-spec-item">{EVENT.format}</span>
              <span className="cd-spec-dot">✦</span>
              <span className="cd-spec-item">{EVENT.teamSize}</span>
            </div>

            <LiquidMetalButton
              label="Register on Devfolio"
              href={EVENT.devfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              width={195}
              height={44}
            />
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .cd {
          position: relative;
          width: 100%;
          background: transparent;
          color: #111a12;
          padding-top: clamp(6rem, 14vh, 10rem);
          padding-bottom: clamp(2rem, 5vh, 4rem);
          overflow: hidden;
          z-index: 1;
        }

        .cd-inner {
          position: relative;
          max-width: 86rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cd-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(1rem, 2vh, 1.5rem);
        }

        .cd-motif {
          width: clamp(110px, 14vw, 150px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .cd-head-wrap {
          width: 100%;
          text-align: center;
        }

        .cd-heading {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 5.2vw, 4rem);
          line-height: 1.15;
          letter-spacing: -0.028em;
          color: #111a12;
          text-align: center;
        }

        .cd-heading .rh-line {
          display: flex;
          justify-content: center;
        }

        .cd-badge-wrap {
          display: flex;
          justify-content: center;
          margin-top: clamp(0.75rem, 1.5vh, 1.25rem);
        }

        .cd-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(47, 85, 39, 0.18);
          box-shadow: 0 4px 14px rgba(22, 45, 26, 0.05);
        }

        .cd-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5C8C3A;
          box-shadow: 0 0 0 3px rgba(92, 140, 58, 0.25);
          animation: cd-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes cd-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        .cd-live-text {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #2F5527;
          text-transform: uppercase;
        }

        /* ── Electromechanical Matrix Board ── */
        .cd-matrix-reveal {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: clamp(2.5rem, 5vh, 4rem);
        }

        .cd-matrix-wrapper {
          width: 100%;
          max-width: 60rem;
          display: flex;
          justify-content: center;
        }

        /* ── Days : Hours : Minutes Legend ── */
        .cd-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-top: clamp(0.75rem, 1.5vh, 1.25rem);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5C6E50;
        }

        .cd-legend-item {
          min-width: 5.5rem;
          text-align: center;
        }

        .cd-legend-sep {
          width: 1.5rem;
          text-align: center;
          opacity: 0;
        }

        /* ── Bottom Info Bar ── */
        .cd-rule-bottom {
          width: 100%;
          max-width: 72rem;
          background: rgba(47, 85, 39, 0.16);
          margin-top: clamp(2.5rem, 5vh, 4rem);
        }

        .cd-foot {
          margin-top: 1.25rem;
          width: 100%;
          max-width: 72rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .cd-specs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.6rem 0.8rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.82rem;
          font-weight: 550;
          letter-spacing: 0.01em;
          color: #2F5527;
        }

        .cd-spec-item {
          /* Plain text — no capsule, no background, no border */
        }

        .cd-spec-dot {
          font-size: 0.65rem;
          color: #8FC45A;
        }
      `}</style>
    </section>
  );
}
