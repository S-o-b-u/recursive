import SectionWrapper from "./SectionWrapper";

const PRIZES = [
  { tier: "Grand Prize", value: "To be announced", description: "Awarded to the project that best embodies the spirit of Recursive — depth, craft, and meaningful impact." },
  { tier: "Runner-Up", value: "To be announced", description: "For exceptional work that demonstrates originality and technical thoughtfulness." },
  { tier: "Best Craft", value: "To be announced", description: "For the project with the most refined execution — code quality, design, and attention to detail." },
  { tier: "Community Choice", value: "To be announced", description: "Voted on by all participants. The project that resonated most with the community." },
];

export default function Prizes() {
  return (
    <SectionWrapper id="prizes">
      <p className="section-label">Prizes</p>
      <h2 className="section-heading">Recognition for what matters.</h2>
      <p className="body-text" style={{ marginBottom: "var(--space-block)" }}>
        We don&apos;t just reward the flashiest demo. Our judging
        values depth of thinking, quality of craft, and the potential
        for real-world impact.
      </p>

      <div className="prizes-list">
        {PRIZES.map((prize, i) => (
          <div key={i} className="prize-item">
            <div className="prize-header">
              <h3 className="prize-tier">{prize.tier}</h3>
              <span className="prize-value">{prize.value}</span>
            </div>
            <p className="prize-desc">{prize.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .prizes-list {
          max-width: 44rem;
        }
        .prize-item {
          padding: var(--space-element) 0 calc(var(--space-element) + 0.25rem);
          border-bottom: var(--border-width) solid var(--color-border);
        }
        .prize-item:last-child {
          border-bottom: none;
        }
        .prize-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }
        .prize-tier {
          font-size: var(--font-size-lg);
          font-weight: 450;
          letter-spacing: var(--tracking-snug);
        }
        .prize-value {
          font-size: var(--font-size-xs);
          color: var(--color-accent-muted);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          font-weight: 450;
        }
        .prize-desc {
          font-size: var(--font-size-base);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
          max-width: 36rem;
        }
      `}</style>
    </SectionWrapper>
  );
}
