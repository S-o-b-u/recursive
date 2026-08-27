import type { CSSProperties } from "react";

/**
 * SponsorRevealCard — the "yet to reveal" state for an unsigned sponsor slot.
 *
 * Same language as <JudgeRevealCard>: a sage-frosted mount with a thin keyline,
 * grain, and one fern sprig in the corner — but where the judge card sinks a
 * bust behind the frost, this one sinks an empty brand tile (a rounded frame
 * with the recursive mark) and floats a soft "?" over it. Pure CSS/SVG, no
 * client JS; the <style> dedupes across instances.
 */

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function SponsorRevealCard({
  ratio = "16 / 9",
  index = 0,
}: {
  ratio?: string;
  /** Nudges the "?" a few px per card so eight of them don't look stamped. */
  index?: number;
}) {
  const qShift = ((index % 3) - 1) * 6; // -6 | 0 | 6
  const gid = `spc${index}`;

  return (
    <div className="spc" style={{ aspectRatio: ratio } as CSSProperties}>
      <div className="spc-plate" aria-hidden="true" />

      <svg className="spc-figure" viewBox="0 0 240 160" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(45,83,39,0.4)" />
            <stop offset="1" stopColor="rgba(45,83,39,0.12)" />
          </linearGradient>
          <filter id={`${gid}s`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        <g fill="none" stroke={`url(#${gid}m)`} filter={`url(#${gid}s)`} strokeWidth="7">
          <rect x="66" y="34" width="108" height="92" rx="18" />
          {/* recursive mark, sunk into the tile */}
          <g strokeWidth="8" strokeLinecap="round">
            <line x1="120" y1="60" x2="120" y2="100" />
            <line x1="100" y1="80" x2="140" y2="80" />
            <line x1="106" y1="66" x2="134" y2="94" />
            <line x1="106" y1="94" x2="134" y2="66" />
          </g>
        </g>
      </svg>

      <div className="spc-veil" aria-hidden="true" />

      <div className="spc-q" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <text x={50 + qShift} y="74" textAnchor="middle">
            ?
          </text>
        </svg>
      </div>

      <div
        className="spc-grain"
        aria-hidden="true"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      <svg className="spc-sprig" viewBox="0 0 44 52" aria-hidden="true">
        <path
          d="M22 51C22 40 22 27 25 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M23 34C14 33 8 26 7 17C16 17 23 24 23 34Z" fill="currentColor" />
        <path d="M24 24C33 22 37 15 38 6C29 6 24 14 24 24Z" fill="currentColor" />
        <path d="M25 13C22 9 22 4 24 0C27 3 27 9 25 13Z" fill="currentColor" />
      </svg>

      <style href="sponsor-reveal-card" precedence="default">{`
        .spc {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: var(--radius-lg);
          isolation: isolate;
          background:
            radial-gradient(120% 78% at 50% 4%, #f0f5e9 0%, rgba(240,245,233,0) 52%),
            linear-gradient(170deg, #e3ead9 0%, #c8d5bd 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 0 0 1px rgba(47,85,39,0.16),
            0 16px 38px -22px rgba(22,45,26,0.5);
        }
        .spc::after {
          content: "";
          position: absolute;
          inset: 9px;
          border-radius: 13px;
          box-shadow:
            0 0 0 1px rgba(45,83,39,0.16),
            inset 0 1px 0 rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 5;
        }

        .spc-plate {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(85% 62% at 50% 26%, rgba(255,255,255,0.55), rgba(255,255,255,0) 72%),
            radial-gradient(130% 120% at 50% 122%, rgba(58,96,40,0.2), rgba(58,96,40,0) 58%);
        }

        .spc-figure {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 62%;
          transform: translate(-50%, -50%);
          transform-origin: 50% 50%;
          animation: spc-breathe 7s ease-in-out infinite;
          transition: opacity 500ms var(--ease-out);
          will-change: transform, opacity;
        }

        .spc-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(240,245,233,0.12) 0%, rgba(200,213,189,0.42) 100%);
          backdrop-filter: blur(3px) saturate(1.15);
          -webkit-backdrop-filter: blur(3px) saturate(1.15);
          transition: opacity 500ms var(--ease-out);
        }

        .spc-q {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0.46;
          pointer-events: none;
          transition: opacity 500ms var(--ease-out);
        }
        .spc-q svg {
          width: 26%;
          filter: blur(0.5px);
          transform: translateY(-2%);
        }
        .spc-q text {
          font-family: var(--font-hiruko), var(--font-display), Georgia, serif;
          font-weight: 700;
          font-size: 78px;
          fill: rgba(38,70,32,0.9);
        }

        .spc-grain {
          position: absolute;
          inset: 0;
          opacity: 0.55;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .spc-sprig {
          position: absolute;
          left: 6%;
          bottom: 8%;
          width: clamp(22px, 3vw, 34px);
          color: var(--color-accent);
          opacity: 0.6;
          transform-origin: 50% 100%;
          z-index: 6;
        }

        @keyframes spc-breathe {
          0%, 100% { opacity: 0.92; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.015); }
        }

        @media (prefers-reduced-transparency: reduce) {
          .spc-veil {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: rgba(205,217,196,0.6);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spc-figure { animation: none; }
        }
      `}</style>
    </div>
  );
}
