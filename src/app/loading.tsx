export default function RootLoading() {
  return (
    <div className="track-loading-veil" aria-live="polite" aria-busy="true">
      <div className="track-loading-mark">
        <img
          src="/images/ui/artifact.png"
          alt=""
          className="track-artifact-base track-artifact-center"
          draggable={false}
        />
        <img
          src="/images/ui/artifact.png"
          alt=""
          className="track-artifact-base track-artifact-left"
          draggable={false}
        />
        <img
          src="/images/ui/artifact.png"
          alt="Loading..."
          className="track-artifact-base track-artifact-right"
          draggable={false}
        />
      </div>

      <style>{`
        .track-loading-veil {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          pointer-events: none;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.42) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 62%);
          animation: track-veil-fadein 0.25s ease-out forwards;
        }

        .track-loading-mark {
          position: relative;
          width: clamp(150px, 22vw, 240px);
          aspect-ratio: 744 / 220;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
        }

        .track-artifact-base {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          /* Original botanical green — rich, natural, matches site ornament */
          filter: brightness(1.16) saturate(1.1);
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Center anchor: subtle constant presence at the pivot */
        .track-artifact-center {
          -webkit-mask-image: radial-gradient(ellipse 24% 65% at 50% 50%, black 30%, transparent 100%);
          mask-image: radial-gradient(ellipse 24% 65% at 50% 50%, black 30%, transparent 100%);
          opacity: 0.72;
        }

        /* Dramatic split fade: Left wing alternates from 100% to 0% */
        .track-artifact-left {
          -webkit-mask-image: linear-gradient(to right, black 0%, black 38%, transparent 58%);
          mask-image: linear-gradient(to right, black 0%, black 38%, transparent 58%);
          animation: track-split-left 1.05s ease-in-out infinite alternate;
        }

        /* Dramatic split fade: Right wing alternates from 0% to 100% */
        .track-artifact-right {
          -webkit-mask-image: linear-gradient(to right, transparent 42%, black 62%, black 100%);
          mask-image: linear-gradient(to right, transparent 42%, black 62%, black 100%);
          animation: track-split-right 1.05s ease-in-out infinite alternate;
        }

        @keyframes track-veil-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes track-split-left {
          0% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(0.98);
          }
        }

        @keyframes track-split-right {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .track-loading-veil { display: none; }
          .track-artifact-left, .track-artifact-right {
            animation: none;
            opacity: 0.85;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .track-artifact-center { display: none; }
        }
      `}</style>
    </div>
  );
}
