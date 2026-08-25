import HeroCanvasSequence from './HeroCanvasSequence';

export default function Hero() {
  return (
    <section id="hero" className="hero-root">
      <HeroCanvasSequence>
        <div className="section-inner hero-content">
          {/* Overline */}
          <p className="section-label" style={{ marginBottom: 0 }}>
            Hackathon · 2026
          </p>

          {/* Title — light weight, massive, the word IS the identity */}
          <h1 className="hero-title">Recursive</h1>

          {/* Tagline */}
          <p className="body-text hero-tagline">
            A simple rule repeats. Branches. Evolves.
            <br />
            Eventually, it creates something beautiful.
          </p>

          {/* Date & Location */}
          <p className="hero-meta">
            March 2026 · Kolkata, India
          </p>

          {/* CTAs */}
          <div className="hero-actions">
            <a href="#register" className="btn btn-primary">
              Register Now
            </a>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </HeroCanvasSequence>

      <style>{`
        .hero-root {
          /* min-height handled by HeroCanvasSequence */
          position: relative;
        }
        .hero-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 2.5vw, 2rem);
          padding-top: 4rem;
          padding-bottom: 4rem;
          /* Ensure text is above the canvas */
          position: relative;
          z-index: 20;
          /* Add a subtle text shadow so it remains legible over the canvas artwork */
          text-shadow: 0 4px 24px rgba(250, 249, 246, 0.8);
        }
        .hero-title {
          font-weight: 300;
          font-style: normal;
        }
        .hero-tagline {
          font-size: var(--font-size-xl);
          max-width: 30rem;
        }
        .hero-meta {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }
      `}</style>
    </section>
  );
}
