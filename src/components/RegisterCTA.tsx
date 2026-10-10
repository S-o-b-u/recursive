import { EVENT } from "@/data/hackathon";
import Reveal from "./Reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import DevfolioButton from "@/components/DevfolioButton";

/**
 * Registration CTA — no glass card wrapper, clean typographic layout
 * floating directly on the cloud background with LiquidMetalButtons.
 */
export default function RegisterCTA() {
  return (
    <section id="register" className="cta-scene">
      <div className="cta-inner">
        <Reveal>
          <p className="cta-eyebrow">
            {EVENT.seats} seats · {EVENT.dates}
          </p>
          <h2 className="cta-heading">
            The hill is quiet right now.
            <br />
            Come make some noise.
          </h2>
          <p className="cta-body">
            Registration is free and takes about two minutes. Bring a team or
            find one when you arrive.
          </p>

          {/* ── Event Concluded Status Divider ("---") ── */}
          <div className="cta-status-divider-wrap" aria-label="Event Concluded · Applications Closed">
            <span className="cta-status-line" aria-hidden="true" />
            <div className="cta-status-badge">
              <svg
                className="cta-status-lock-icon"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="cta-status-pill-text">Applications Closed · Event Ended</span>
            </div>
            <span className="cta-status-line" aria-hidden="true" />
          </div>

          <div className="cta-actions">
            <DevfolioButton locked={true} />
            <LiquidMetalButton
              label="Join Discord"
              href={EVENT.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              width={132}
              height={44}
            />
          </div>
        </Reveal>
      </div>

      {/* Scenery band — the same hill, reused as a closing motif. */}
      <div className="cta-hill" aria-hidden="true" />

      <style>{`
        .cta-scene {
          position: relative;
          overflow: hidden;
          padding-top: var(--space-section);
          padding-bottom: clamp(14rem, 30vw, 24rem);
          background: transparent;
        }
        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 46rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
          text-align: center;
        }
        .cta-eyebrow {
          margin: 0;
          font-family: var(--font-label), var(--font-geist-mono), monospace;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .cta-heading {
          margin: 1rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.5rem, 3.5vw, 2.25rem);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.035em;
          word-spacing: -0.01em;
          color: var(--color-text);
        }
        .cta-body {
          margin: 1rem 0 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: -0.01em;
          color: var(--color-text-secondary);
          max-width: 32rem;
          margin-inline: auto;
        }

        .cta-status-divider-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          max-width: 26rem;
          margin: 1.6rem auto 0;
          user-select: none;
        }
        .cta-status-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }
        .cta-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.28rem 0.85rem;
          border-radius: 999px;
          background: rgba(18, 30, 20, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.14);
          color: #e5ece1;
          white-space: nowrap;
        }
        .cta-status-lock-icon {
          width: 11px;
          height: 11px;
          color: #a4e884;
          flex-shrink: 0;
        }
        .cta-status-pill-text {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #e2ede0;
        }

        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
        }

        .cta-hill {
          position: absolute;
          left: -3%;
          right: -3%;
          bottom: -2%;
          height: clamp(16rem, 34vw, 28rem);
          z-index: 1;
          background-image: url("/images/bg/valley.webp");
          background-size: cover;
          background-position: center 78%;
          background-repeat: no-repeat;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
