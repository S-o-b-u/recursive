"use client";

import React, { useEffect, useRef, useState, CSSProperties } from "react";

const FOLD_MS = 260;
const DROP_MS = 300;
const FLIP_MS = FOLD_MS + DROP_MS + 60;

/**
 * Single Flip Digit (0-9 or letter)
 */
function SingleFlipDigit({
  digit,
  cardWidth,
  cardHeight,
}: {
  digit: string;
  cardWidth: string;
  cardHeight: string;
}) {
  const shown = useRef(digit);
  const [flip, setFlip] = useState<{ from: string; to: string; k: number } | null>(null);

  useEffect(() => {
    if (shown.current === digit) return;
    const from = shown.current;
    shown.current = digit;
    setFlip((f) => ({ from, to: digit, k: (f?.k ?? 0) + 1 }));
    const t = setTimeout(() => setFlip(null), FLIP_MS);
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <div
      className="yt-digit-box relative select-none"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {/* ── Static Top & Bottom Halves ── */}
      <div className="yt-half yt-top">
        <span className="yt-numeral">{digit}</span>
      </div>
      <div className="yt-half yt-bottom">
        <span className="yt-numeral">{flip ? flip.from : digit}</span>
      </div>

      {/* ── 3D Folding Animation ── */}
      {flip && (
        <div key={flip.k} className="yt-anim">
          <div className="yt-flap yt-flap-fold">
            <span className="yt-numeral">{flip.from}</span>
          </div>
          <div className="yt-flap yt-flap-drop">
            <span className="yt-numeral">{flip.to}</span>
          </div>
          <div className="yt-cast-shadow" />
        </div>
      )}

      {/* Horizontal Seam Line */}
      <div className="yt-seam" />
    </div>
  );
}

/**
 * A Pair Card (e.g. holds "08", "59", "47") in a single rounded block
 * Matching the exact look of https://youtu.be/7_vp-dzMilA
 */
function FlipBlockPair({
  value,
  label,
  isLunch = false,
}: {
  value: string; // 2 characters, e.g. "08"
  label: string;
  isLunch?: boolean;
}) {
  const chars = value.padStart(2, "0").slice(-2).split("");

  return (
    <div className="flex flex-col items-center">
      {/* The Unified Rounded Card Block */}
      <div
        className={`yt-card-block relative flex items-center justify-center rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 shadow-2xl transition-all duration-500 ${
          isLunch
            ? "border border-amber-500/40 shadow-[0_12px_36px_rgba(245,158,11,0.25)]"
            : "border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
        }`}
        style={{
          background: isLunch
            ? "linear-gradient(180deg, #23160a 0%, #160c04 100%)"
            : "linear-gradient(180deg, #181918 0%, #0e0f0e 100%)",
        }}
      >
        {/* Subtle center notch pins on outer left and right */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-3 bg-black rounded-r-md z-20 opacity-80" />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-3 bg-black rounded-l-md z-20 opacity-80" />

        {/* The Two Digits inside the Card */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <SingleFlipDigit
            digit={chars[0]}
            cardWidth="var(--yt-d-w)"
            cardHeight="var(--yt-d-h)"
          />
          <SingleFlipDigit
            digit={chars[1]}
            cardWidth="var(--yt-d-w)"
            cardHeight="var(--yt-d-h)"
          />
        </div>
      </div>

      {/* Label under card */}
      <span
        className={`mt-2.5 text-[11px] sm:text-xs font-mono font-medium tracking-[0.2em] uppercase select-none transition-colors ${
          isLunch ? "text-amber-300" : "text-white/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function MinimalFlipClock({
  hours,
  minutes,
  seconds,
  isLunch = false,
  lunchMinutes,
  lunchSeconds,
  showLunchCountdown = true,
}: {
  hours: string;
  minutes: string;
  seconds: string;
  isLunch?: boolean;
  lunchMinutes?: string;
  lunchSeconds?: string;
  showLunchCountdown?: boolean;
}) {
  return (
    <div className="yt-flip-root flex items-center justify-center">
      {isLunch && showLunchCountdown && lunchMinutes && lunchSeconds ? (
        /* Lunch Time Countdown: [ Minutes ] [ Seconds ] */
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
          <FlipBlockPair value={lunchMinutes} label="Lunch Mins" isLunch />
          <div className="flex flex-col gap-2 pb-6 opacity-40">
            <span className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-amber-400" />
            <span className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-amber-400" />
          </div>
          <FlipBlockPair value={lunchSeconds} label="Lunch Secs" isLunch />
        </div>
      ) : (
        /* 8-Hour Countdown: [ Hours ] [ Minutes ] [ Seconds ] */
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          <FlipBlockPair value={hours} label="Hours" isLunch={isLunch} />
          <div className="hidden xs:flex flex-col gap-2 pb-6 opacity-35">
            <span className="w-1 sm:w-2 h-1 sm:h-2 rounded-full bg-white" />
            <span className="w-1 sm:w-2 h-1 sm:h-2 rounded-full bg-white" />
          </div>
          <FlipBlockPair value={minutes} label="Minutes" isLunch={isLunch} />
          <div className="hidden xs:flex flex-col gap-2 pb-6 opacity-35">
            <span className="w-1 sm:w-2 h-1 sm:h-2 rounded-full bg-white" />
            <span className="w-1 sm:w-2 h-1 sm:h-2 rounded-full bg-white" />
          </div>
          <FlipBlockPair value={seconds} label="Seconds" isLunch={isLunch} />
        </div>
      )}

      <style jsx global>{`
        .yt-flip-root {
          /* Responsive sizing: each digit card scales cleanly */
          --yt-d-w: clamp(2.4rem, 6.2vw, 4.4rem);
          --yt-d-h: calc(var(--yt-d-w) * 1.48);
          --yt-r: clamp(8px, 1.4vw, 14px);
        }

        .yt-digit-box {
          position: relative;
          perspective: 600px;
          border-radius: var(--yt-r);
          overflow: hidden;
          background: #111111;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .yt-half,
        .yt-flap {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .yt-top,
        .yt-flap-fold {
          top: 0;
          align-items: flex-start;
          border-radius: var(--yt-r) var(--yt-r) 0 0;
          background: linear-gradient(180deg, #1c1d1c 0%, #131413 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .yt-bottom,
        .yt-flap-drop {
          bottom: 0;
          align-items: flex-end;
          border-radius: 0 0 var(--yt-r) var(--yt-r);
          background: linear-gradient(180deg, #0e0f0e 0%, #151615 100%);
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.7);
        }

        .yt-numeral {
          display: block;
          width: 100%;
          height: var(--yt-d-h);
          font-family: var(--font-bebas), "Bebas Neue", sans-serif;
          font-weight: 400;
          font-size: calc(var(--yt-d-w) * 1.15);
          line-height: var(--yt-d-h);
          text-align: center;
          color: #ffffff;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.75);
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          -webkit-font-smoothing: antialiased;
          transform: translate3d(0, 0, 0);
        }

        /* ── The Center Crease / Seam ── */
        .yt-seam {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          margin-top: -0.5px;
          background: rgba(0, 0, 0, 0.85);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.12);
          z-index: 10;
          pointer-events: none;
        }

        /* ── 3D Animation Layer ── */
        .yt-anim {
          position: absolute;
          inset: 0;
          display: block;
          perspective: 600px;
          transform-style: preserve-3d;
          z-index: 5;
        }

        .yt-flap-fold {
          z-index: 4;
          transform-origin: 50% 100%;
          animation: yt-fold ${FOLD_MS}ms cubic-bezier(0.4, 0, 0.7, 1) forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .yt-flap-drop {
          z-index: 6;
          transform-origin: 50% 0%;
          opacity: 0;
          animation: yt-drop ${DROP_MS}ms cubic-bezier(0.16, 0.95, 0.3, 1) ${FOLD_MS}ms forwards;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .yt-cast-shadow {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
          pointer-events: none;
          z-index: 3;
          animation: yt-shadow ${FOLD_MS}ms ease-out forwards;
        }

        @keyframes yt-fold {
          0% {
            transform: translate3d(0, 0, 0) rotateX(0deg);
            opacity: 1;
          }
          99% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 0, 0) rotateX(-90deg);
            opacity: 0;
          }
        }

        @keyframes yt-drop {
          0% {
            transform: translate3d(0, 0, 0) rotateX(90deg);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 0, 0) rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes yt-shadow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
