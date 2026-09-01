import { EVENT } from "@/data/hackathon";
import Reveal from "./Reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Lock } from "lucide-react";

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
          <div className="cta-actions">
            <div className="cta-locked-wrap" title="Registration currently locked · Revealing soon">
              <LiquidMetalButton
                label="Register on Devfolio"
                width={190}
                height={46}
                iconPosition="right"
                icon={
                  <Lock
                    size={15}
                    style={{
                      color: "#ffffff",
                      stroke: "#ffffff",
                      marginLeft: "2px",
                      display: "inline-block",
                      verticalAlign: "middle",
                      filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4))",
                    }}
                    aria-hidden="true"
                  />
                }
              />
            </div>
            <LiquidMetalButton
              label="Join Discord"
              href={EVENT.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              width={145}
              height={46}
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
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .cta-heading {
          margin: 1rem 0 0;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.5rem, 3.5vw, 2.25rem);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: var(--color-text);
        }
        .cta-body {
          margin: 1rem 0 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          font-weight: 400;
          line-height: 1.6;
          color: var(--color-text-secondary);
          max-width: 32rem;
          margin-inline: auto;
        }
        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        }
        .cta-locked-wrap {
          display: inline-flex;
          position: relative;
          cursor: not-allowed;
          opacity: 0.9;
          transition: opacity 180ms ease;
        }
        .cta-locked-wrap:hover {
          opacity: 1;
        }
        .cta-locked-wrap * {
          pointer-events: none;
        }
        .cta-hill {
          position: absolute;
          left: -3%;
          right: -3%;
          bottom: -2%;
          height: clamp(16rem, 34vw, 28rem);
          z-index: 1;
          background-image: url("/images/valley.png");
          background-size: cover;
          background-position: center 78%;
          background-repeat: no-repeat;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
