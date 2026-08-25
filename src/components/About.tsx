import SectionWrapper from "./SectionWrapper";

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="about-layout">
        <div className="about-text">
          <p className="section-label">About</p>
          <h2 className="section-heading">What is Recursive?</h2>
          <div className="about-body">
            <p className="body-text">
              Recursive is a hackathon built around a single observation:
              the most complex systems in nature emerge from the simplest
              rules repeating themselves.
            </p>
            <p className="body-text">
              A fern unfolds from a fractal. A neural pathway strengthens
              through repetition. A conversation deepens through
              iteration. We believe the best ideas work the same way —
              they start small, branch outward, and evolve into something
              no one could have predicted.
            </p>
            <p className="body-text">
              This isn't a hackathon about building fast and breaking
              things. It's about depth, craft, and the quiet power of
              revisiting an idea until it blooms.
            </p>
          </div>
        </div>

        <div className="about-image" aria-hidden="true">
          <span>Image</span>
        </div>
      </div>

      <style>{`
        .about-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-block);
        }
        .about-body {
          display: flex;
          flex-direction: column;
          gap: var(--space-element);
        }
        .about-image {
          aspect-ratio: 3 / 4;
          background-color: var(--color-bg-alt);
          border: var(--border-width) solid var(--color-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-image span {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
        @media (min-width: 769px) {
          .about-layout {
            grid-template-columns: 1.4fr 1fr;
            align-items: start;
            gap: clamp(3rem, 6vw, 5rem);
          }
        }
      `}</style>
    </SectionWrapper>
  );
}
