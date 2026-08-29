"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EVENT } from "@/data/hackathon";
import { RevealBlock, RevealHeading } from "@/components/ui/reveal";
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

function LiveTimer() {
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
        setTimeString(`${pad(days)}:${pad(hours)}:${pad(minutes)}`);
      } else {
        setTimeString(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <FlipDiskMatrix
      displayText={mounted ? timeString : "00:00:00"}
      cols={53}
      rows={11}
    />
  );
}

export default function Countdown() {
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

        {/* ── "GATES OPEN IN" Badge ── */}
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
            <LiveTimer />
          </div>
        </RevealBlock>

        {/* ── Legend: what each pair of digits means ── */}
        <RevealBlock y={10} delay={0.14}>
          <div className="cd-legend">
            <span className="cd-legend-item">DAYS</span>
            <span className="cd-legend-sep">:</span>
            <span className="cd-legend-item">HOURS</span>
            <span className="cd-legend-sep">:</span>
            <span className="cd-legend-item">MINUTES</span>
          </div>
        </RevealBlock>
      </div>

      {/* ── Valley Mask Overlay (Full uncropped natural aspect ratio anchored at bottom) ── */}
      <div className="cd-valley" aria-hidden="true">
        <Image
          src="/valley.png"
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
          padding-top: clamp(6rem, 14vh, 10rem);
          padding-bottom: clamp(11rem, 19vw, 24rem);
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
          z-index: 1;
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
          margin-top: clamp(2rem, 4vh, 3.5rem);
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
      `}</style>
    </section>
  );
}
