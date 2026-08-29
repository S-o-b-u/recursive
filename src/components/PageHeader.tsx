import { ReactNode } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import WarpText from "./ui/WarpText";

/**
 * Sub-page header. Opens on the same deep-forest tone the hero pushes into, then
 * hands back to daylight — so every page reads as one continuous scene.
 */
export default function PageHeader({
  label,
  title,
  lede,
}: {
  label: string;
  title: string;
  lede?: ReactNode;
}) {
  return (
    <header className="ph">
      <div className="ph-hill" aria-hidden="true" />
      <div className="ph-inner">
        <Reveal>
          <Link href="/" className="ph-back">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back home
          </Link>
          <p className="ph-label">{label}</p>
          <div className="my-2">
            <WarpText
              text={title}
              align="left"
              color="#EFF3EB"
              fontSize="clamp(2.5rem, 6.5vw, 4.8rem)"
              fontWeight={300}
              fontFamily="var(--font-display), Georgia, serif"
              letterSpacing="-0.035em"
              style={{
                width: "100%",
                maxWidth: "30ch",
                height: "clamp(60px, 8vw, 100px)",
                pointerEvents: "auto",
              }}
            />
          </div>
          {lede && <div className="ph-lede">{lede}</div>}
        </Reveal>
      </div>

      <style>{`
        .ph {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding-top: clamp(7.5rem, 17vh, 11.5rem);
          padding-bottom: clamp(4.5rem, 11vw, 8rem);
          color: #EFF3EB;
          background:
            radial-gradient(120% 80% at 50% 0%, #16281A 0%, rgba(16, 27, 18, 0) 60%),
            linear-gradient(180deg, #101B12 0%, #101B12 58%, var(--color-bg) 100%);
        }
        /* Hill silhouette from the hero scene, sunk into the dark. */
        .ph-hill {
          position: absolute;
          left: -4%;
          right: -4%;
          bottom: -14%;
          height: 78%;
          z-index: -1;
          background-image: url("/foreground.png");
          background-size: cover;
          background-position: center bottom;
          opacity: 0.2;
          mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
          -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
        }
        .ph-inner {
          position: relative;
          z-index: 1;
          max-width: var(--max-width);
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }
        .ph-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: var(--font-size-xs);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--color-accent-bright);
          padding: 0.4rem 0.85rem 0.4rem 0.65rem;
          border-radius: var(--radius-pill);
          background: rgba(232, 241, 224, 0.07);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.14),
            0 4px 18px rgba(0, 0, 0, 0.28);
          transition: transform 180ms var(--ease-out);
        }
        .ph-back:hover { transform: translateX(-2px); }
        .ph-label {
          margin-top: 1.75rem;
          font-size: var(--font-size-xs);
          font-weight: 550;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          color: var(--color-accent-bright);
        }
        .ph-title {
          margin-top: 0.6rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.5rem, 6.5vw, 4.5rem);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: -0.03em;
        }
        .ph-lede {
          margin-top: 1.25rem;
          max-width: 42rem;
          font-size: var(--font-size-lg);
          font-weight: 300;
          line-height: var(--leading-relaxed);
          color: rgba(232, 241, 224, 0.68);
        }
      `}</style>
    </header>
  );
}
