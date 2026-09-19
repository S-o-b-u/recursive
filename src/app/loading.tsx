/**
 * The route-level Suspense fallback: the very first thing painted on "/".
 *
 * On the home page this is one of three consecutive dark plates the visitor
 * sees before the intro's own artifact animation begins -- this veil, then the
 * page's pending plate once the streamed content is swapped in, then the
 * intro's opening frame once React has hydrated. They used to disagree with
 * each other: this one showed the artifact at 150-240px with alternating
 * wings, the pending plate showed no artifact at all, and the intro then
 * re-entered it from nothing at 210-360px. So the mark animated, vanished for
 * the whole hydration stall, and popped back in at a different size. That is
 * the "stutter when the site loads", and no frame budget fixes it.
 *
 * Now all three plates show the same artifact, at the same size, in the same
 * grade, in the same place. This one breathes gently while the page loads;
 * the pending plate holds it still; the intro picks it up from that held
 * state and brightens it. Nothing pops.
 *
 * The veil also no longer fades in: the page's backdrop is a light cloud
 * plate, so a 250ms fade from transparent was a light-to-dark flash on every
 * load. It paints opaque on the first frame instead.
 */
export default function RootLoading() {
  return (
    <div className="track-loading-veil" aria-live="polite" aria-busy="true">
      <div className="track-loading-mark">
        <img
          src="/images/ui/artifact.png"
          alt="Loading..."
          className="track-artifact"
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
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.48) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 65%);
        }

        /* Must match .intro-artifact-mark in IntroSequence exactly -- same
           clamp, same ratio -- or the mark changes size at the swap. */
        .track-loading-mark {
          position: relative;
          width: clamp(210px, 30vw, 360px);
          aspect-ratio: 744 / 220;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
        }

        /* Same static grade as the intro's artifact. Opacity and transform
           only -- both run on the compositor, so the breath stays smooth
           while the main thread is busy parsing and hydrating underneath. */
        .track-artifact {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(1.2) saturate(1.15) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65));
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          will-change: transform, opacity;
          animation: track-breathe 1.7s ease-in-out infinite alternate;
        }

        @keyframes track-breathe {
          from { opacity: 0.84; transform: scale(0.992); }
          to   { opacity: 1;    transform: scale(1.012); }
        }

        @media (prefers-reduced-motion: reduce) {
          .track-artifact { animation: none; }
        }
      `}</style>
    </div>
  );
}
