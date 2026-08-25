import SectionWrapper from "./SectionWrapper";

const SPONSOR_TIERS = [
  { tier: "Title Partners", count: 2, height: "5.5rem", minCol: "200px" },
  { tier: "Associate Partners", count: 4, height: "4.5rem", minCol: "160px" },
  { tier: "Community Partners", count: 6, height: "3.5rem", minCol: "120px" },
];

export default function Sponsors() {
  return (
    <SectionWrapper id="sponsors" alternate>
      <p className="section-label">Partners</p>
      <h2 className="section-heading">Built with support.</h2>
      <p className="body-text" style={{ marginBottom: "var(--space-block)" }}>
        Recursive is made possible by organizations that believe in
        nurturing the next generation of thoughtful builders.
      </p>

      <div className="sponsors-tiers">
        {SPONSOR_TIERS.map((tier) => (
          <div key={tier.tier} className="sponsor-tier">
            <p className="sponsor-tier-label">{tier.tier}</p>
            <div
              className="sponsor-grid"
              style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${tier.minCol}, 1fr))` }}
            >
              {Array.from({ length: tier.count }).map((_, i) => (
                <div
                  key={i}
                  className="sponsor-placeholder"
                  style={{ height: tier.height }}
                >
                  <span>Logo</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .sponsors-tiers {
          display: flex;
          flex-direction: column;
          gap: var(--space-block);
        }
        .sponsor-tier-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          margin-bottom: var(--space-element);
        }
        .sponsor-grid {
          display: grid;
          gap: var(--space-element);
        }
        .sponsor-placeholder {
          background-color: var(--color-bg);
          border: var(--border-width) solid var(--color-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sponsor-placeholder span {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
      `}</style>
    </SectionWrapper>
  );
}
