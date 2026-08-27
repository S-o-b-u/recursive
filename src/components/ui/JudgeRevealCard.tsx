import type { CSSProperties } from "react";

/**
 * JudgeRevealCard — the "yet to reveal" state for an unconfirmed judge.
 *
 * The Judges board reads as photographs left on a table. Until a judge
 * confirms, their card is a print that hasn't developed: a sage-frosted mount
 * with a thin keyline, a moss bust sunk behind the frost, a soft "?" over the
 * face, and one fern sprig in the corner — RECURSIVE's "not grown yet" cue in
 * place of a hard silhouette-on-black.
 *
 * Motif (silhouette bust + "?") is the one every event "speakers TBA" board on
 * Pinterest converges on; the framed-print treatment echoes 21st.dev editorial
 * empty-state cards. Both re-skinned to the site's botanical palette. Pure
 * CSS/SVG — no client JS — and the <style> dedupes across the six instances.
 */

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** One clean head-and-shoulders bust, no seam. viewBox 0 0 240 262. */
const BUST =
  "M120 40c26 0 47 21 47 47 0 17-9 32-23 40 34 7 60 30 68 62 3 12 4 25 4 39l0 34-186 0 0-34c0-14 1-27 4-39 8-32 34-55 68-62-14-8-23-23-23-40 0-26 21-47 47-47z";

export default function JudgeRevealCard({
  ratio = "4 / 5",
  index = 0,
}: {
  ratio?: string;
  /** Nudges the "?" a few px per card so six of them don't look stamped. */
  index?: number;
}) {
  const qShift = ((index % 3) - 1) * 6; // -6 | 0 | 6
  const gid = `jrc${index}`;

  return (
    <div className="jrc" style={{ aspectRatio: ratio } as CSSProperties}>
      <div className="jrc-plate" aria-hidden="true" />

      <svg className="jrc-figure" viewBox="0 0 240 262" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(45,83,39,0.44)" />
            <stop offset="1" stopColor="rgba(45,83,39,0.14)" />
          </linearGradient>
          <filter id={`${gid}s`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>
        <path d={BUST} fill={`url(#${gid}m)`} filter={`url(#${gid}s)`} />
      </svg>

      <div className="jrc-veil" aria-hidden="true" />

      <div className="jrc-q" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <text x={50 + qShift} y="74" textAnchor="middle">
            ?
          </text>
        </svg>
      </div>

      <div
        className="jrc-grain"
        aria-hidden="true"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      <svg className="jrc-sprig" viewBox="0 0 44 52" aria-hidden="true">
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

      <style href="judge-reveal-card" precedence="default">{`
        .jrc {
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
        /* thin keyline — the edge of a mounted print */
        .jrc::after {
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

        .jrc-plate {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(85% 62% at 50% 26%, rgba(255,255,255,0.55), rgba(255,255,255,0) 72%),
            radial-gradient(130% 120% at 50% 122%, rgba(58,96,40,0.22), rgba(58,96,40,0) 58%);
        }

        .jrc-figure {
          position: absolute;
          left: 50%;
          bottom: -2%;
          width: 78%;
          transform: translateX(-50%);
          transform-origin: 50% 100%;
          animation: jrc-breathe 7s ease-in-out infinite;
          transition: opacity 500ms var(--ease-out);
          will-change: transform, opacity;
        }

        /* the reveal that hasn't happened */
        .jrc-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(240,245,233,0.12) 0%, rgba(200,213,189,0.42) 100%);
          backdrop-filter: blur(3px) saturate(1.15);
          -webkit-backdrop-filter: blur(3px) saturate(1.15);
          transition: opacity 500ms var(--ease-out);
        }

        .jrc-q {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0.46;
          pointer-events: none;
          transition: opacity 500ms var(--ease-out);
        }
        .jrc-q svg {
          width: 34%;
          filter: blur(0.5px);
          transform: translateY(-2%);
        }
        .jrc-q text {
          font-family: var(--font-hiruko), var(--font-display), Georgia, serif;
          font-weight: 700;
          font-size: 78px;
          fill: rgba(38,70,32,0.9);
        }

        .jrc-grain {
          position: absolute;
          inset: 0;
          opacity: 0.55;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .jrc-sprig {
          position: absolute;
          left: 7%;
          bottom: 6.5%;
          width: clamp(24px, 3.4vw, 38px);
          color: var(--color-accent);
          opacity: 0.62;
          transform-origin: 50% 100%;
          transition: opacity 400ms var(--ease-out), transform 500ms var(--ease-out);
          z-index: 6;
        }

        @keyframes jrc-breathe {
          0%, 100% { opacity: 0.92; transform: translateX(-50%) scale(1); }
          50%      { opacity: 1;    transform: translateX(-50%) scale(1.012); }
        }

        @media (prefers-reduced-transparency: reduce) {
          .jrc-veil {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: rgba(205,217,196,0.6);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .jrc-figure { animation: none; }
        }
      `}</style>
    </div>
  );
}
