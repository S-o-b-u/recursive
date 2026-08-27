/**
 * SponsorVeil — the "not revealed yet" layer over the sponsor wall.
 *
 * The actual blur lives on the cards themselves (`.sp-wall` gets `filter:
 * blur()` while sealed, in SponsorWall) — the same content-side rack-focus the
 * intro uses, so there's no blurred-rectangle edge. This component only adds a
 * whisper of tint to unify the field and prints "YET TO REVEAL" across it.
 *
 * Pure CSS, no client JS; the <style> dedupes. Render as the last child of a
 * `position: relative` wrapper.
 */

export default function SponsorVeil({ label = "YET TO REVEAL" }: { label?: string }) {
  return (
    <div className="sp-veil" aria-hidden="true">
      <div className="sp-veil-tint" />
      <div className="sp-veil-word">
        <span>{label}</span>
      </div>

      <style href="sponsor-veil" precedence="default">{`
        .sp-veil {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          display: grid;
          place-items: center;
        }

        /* No backdrop-filter — just a soft wash that fades out well before the
           edges, so there is no rectangle to see. */
        .sp-veil-tint {
          position: absolute;
          inset: -6%;
          background: radial-gradient(70% 62% at 50% 48%,
            rgba(233, 239, 226, 0.5) 0%,
            rgba(233, 239, 226, 0.28) 46%,
            rgba(233, 239, 226, 0) 82%);
        }

        .sp-veil-word {
          position: relative;
          z-index: 2;
          padding: 0 6%;
          text-align: center;
          animation: sp-veil-word 7s ease-in-out infinite;
        }
        .sp-veil-word span {
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: clamp(1.7rem, 6.4vw, 4.4rem);
          line-height: 1;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #1f3a1c;
          -webkit-text-stroke: 1px #1f3a1c;
          text-shadow:
            0 2px 0 rgba(255, 255, 255, 0.5),
            0 0 26px rgba(240, 245, 233, 0.8),
            0 0 60px rgba(240, 245, 233, 0.55);
        }

        @keyframes sp-veil-word {
          0%, 100% { transform: translateY(-2px); opacity: 0.92; }
          50%      { transform: translateY(2px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sp-veil-word { animation: none; }
        }
      `}</style>
    </div>
  );
}
