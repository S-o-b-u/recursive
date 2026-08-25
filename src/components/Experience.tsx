import SectionWrapper from "./SectionWrapper";

const THEMES = [
  {
    title: "Depth Over Speed",
    description:
      "We value ideas that have been revisited, refined, and reconsidered. A project that iterates thoughtfully will always outshine one that merely ships fast.",
  },
  {
    title: "Organic Complexity",
    description:
      "Start with a seed — a small, elegant concept — and let it grow through layers of exploration. The most compelling solutions emerge from simple beginnings.",
  },
  {
    title: "Cross-Pollination",
    description:
      "The best work happens at the edges between disciplines. We encourage teams that blend engineering with art, science with storytelling, logic with intuition.",
  },
];

export default function Experience() {
  return (
    <SectionWrapper id="experience" alternate>
      <p className="section-label">The Experience</p>
      <h2 className="section-heading">
        Not your typical hackathon.
      </h2>
      <p className="body-text" style={{ marginBottom: "var(--space-block)" }}>
        Recursive is designed around three guiding principles that shape
        every part of the event — from mentorship to judging to the way
        we think about what&apos;s worth building.
      </p>

      <div className="experience-grid">
        {THEMES.map((theme, i) => (
          <div key={i} className="experience-card">
            <span className="experience-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="experience-title">{theme.title}</h3>
            <p className="experience-desc">{theme.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .experience-grid {
          display: grid;
          gap: 1px;
          background-color: var(--color-border);
          border: var(--border-width) solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .experience-card {
          padding: clamp(1.5rem, 3vw, 2.5rem);
          background-color: var(--color-bg);
        }
        .experience-number {
          font-size: var(--font-size-xs);
          color: var(--color-accent-muted);
          letter-spacing: var(--tracking-wider);
          display: block;
          margin-bottom: 1rem;
        }
        .experience-title {
          font-size: var(--font-size-xl);
          font-weight: 450;
          letter-spacing: var(--tracking-snug);
          margin-bottom: 0.6rem;
        }
        .experience-desc {
          font-size: var(--font-size-base);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
        }
        @media (min-width: 769px) {
          .experience-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </SectionWrapper>
  );
}
