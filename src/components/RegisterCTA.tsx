import SectionWrapper from "./SectionWrapper";

export default function RegisterCTA() {
  return (
    <SectionWrapper id="register" alternate>
      <div className="cta-layout">
        <p className="section-label">Join Us</p>
        <h2 className="cta-heading">
          Start with a seed.
          <br />
          See what grows.
        </h2>
        <p className="cta-body">
          Applications are open. Whether you have a fully-formed idea or
          just a quiet curiosity, there&apos;s a place for you at Recursive.
        </p>
        <div className="cta-actions">
          <a href="#" className="btn btn-primary">Register Now</a>
          <a href="#" className="btn btn-secondary">Sponsor Us</a>
        </div>
      </div>

      <style>{`
        .cta-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-element);
          padding: var(--space-block) 0;
        }
        .cta-heading {
          font-size: clamp(1.75rem, 4.5vw, 3rem);
          line-height: var(--leading-tight);
          letter-spacing: var(--tracking-tight);
          font-weight: 300;
          max-width: 28rem;
        }
        .cta-body {
          font-size: var(--font-size-lg);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
          max-width: 26rem;
        }
        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
          justify-content: center;
        }
      `}</style>
    </SectionWrapper>
  );
}
