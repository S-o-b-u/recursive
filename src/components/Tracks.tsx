import SectionWrapper from "./SectionWrapper";

const TRACKS = [
  { number: "01", title: "Sustainable Systems", description: "Build tools, platforms, or frameworks that address environmental sustainability — from energy optimization to circular economy models." },
  { number: "02", title: "Knowledge & Learning", description: "Reimagine how people learn, share, and preserve knowledge. Think beyond traditional ed-tech — consider community memory, oral history, and collaborative understanding." },
  { number: "03", title: "Health & Wellbeing", description: "Create solutions that support physical, mental, or community health. We value approaches that are thoughtful, accessible, and grounded in real needs." },
  { number: "04", title: "Open Track", description: "Pursue any problem that matters to you. The open track exists for ideas that don't fit neatly into a category but deserve to be explored." },
];

export default function Tracks() {
  return (
    <SectionWrapper id="tracks" alternate>
      <p className="section-label">Tracks</p>
      <h2 className="section-heading">Choose your direction.</h2>
      <p className="body-text" style={{ marginBottom: "var(--space-block)" }}>
        Each track is a starting point, not a constraint. We encourage
        teams to interpret these themes broadly and follow their curiosity.
      </p>

      <div className="tracks-grid">
        {TRACKS.map((track) => (
          <div key={track.number} className="track-card">
            <span className="track-number">{track.number}</span>
            <h3 className="track-title">{track.title}</h3>
            <p className="track-desc">{track.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .tracks-grid {
          display: grid;
          gap: 1px;
          background-color: var(--color-border);
          border: var(--border-width) solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .track-card {
          padding: clamp(1.5rem, 3vw, 2.5rem);
          background-color: var(--color-bg);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .track-number {
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          letter-spacing: var(--tracking-wider);
          font-weight: 500;
        }
        .track-title {
          font-size: var(--font-size-xl);
          font-weight: 450;
          letter-spacing: var(--tracking-snug);
        }
        .track-desc {
          font-size: var(--font-size-base);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
        }
        @media (min-width: 769px) {
          .tracks-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </SectionWrapper>
  );
}
