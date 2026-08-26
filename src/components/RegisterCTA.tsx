import { EVENT } from "@/data/hackathon";
import Reveal from "./Reveal";

export default function RegisterCTA() {
  return (
    <section id="register" className="cta-scene">
      <div className="cta-inner">
        <Reveal>
          <div className="glass glass-strong glass-sheen cta-card">
            <p className="eyebrow text-[var(--color-accent)]">
              {EVENT.seats} seats · {EVENT.dates}
            </p>
            <h2 className="cta-heading">
              The hill is quiet right now.
              <br />
              Come make some noise.
            </h2>
            <p className="body-text mx-auto text-center">
              Registration is free and takes about two minutes. Bring a team or find one
              when you arrive.
            </p>
            <div className="cta-actions">
              <a
                href={EVENT.devfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Register on Devfolio
                <svg viewBox="0 0 24 24" className="btn-icon" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={EVENT.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass"
              >
                Join Discord
              </a>
            </div>
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
          background: linear-gradient(180deg, var(--color-bg) 0%, #dbe8cf 55%, #cfe2c0 100%);
        }
        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 46rem;
          margin-inline: auto;
          padding-inline: var(--padding-x);
        }
        .cta-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          padding: clamp(2rem, 5vw, 3.25rem);
          text-align: center;
        }
        .cta-heading {
          font-size: clamp(1.6rem, 4.2vw, 2.75rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: var(--tracking-tight);
        }
        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 0.6rem;
        }
        .cta-hill {
          position: absolute;
          left: -3%;
          right: -3%;
          bottom: -2%;
          height: clamp(16rem, 34vw, 28rem);
          z-index: 1;
          background-image: url("/foreground.png");
          background-size: cover;
          background-position: center 78%;
          background-repeat: no-repeat;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
