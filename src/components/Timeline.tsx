import SectionWrapper from "./SectionWrapper";

const MILESTONES = [
  { date: "January 15", title: "Applications Open", description: "Registration opens for teams and individuals." },
  { date: "February 20", title: "Team Formation Mixer", description: "An online event to meet potential teammates and explore ideas." },
  { date: "March 1", title: "Opening Ceremony", description: "Keynotes, theme reveal, and the official start of building." },
  { date: "March 1–2", title: "Building Phase", description: "36 hours of focused work with access to mentors, workshops, and quiet spaces." },
  { date: "March 2", title: "Presentations", description: "Teams present their work to a panel of judges and fellow participants." },
  { date: "March 2", title: "Closing & Awards", description: "Winners announced, community celebration, and reflections." },
];

export default function Timeline() {
  return (
    <SectionWrapper id="timeline">
      <p className="section-label">Timeline</p>
      <h2 className="section-heading">How it unfolds.</h2>

      <div className="timeline-list">
        <div className="timeline-line" aria-hidden="true" />

        {MILESTONES.map((m, i) => (
          <div key={i} className="timeline-item">
            <div
              className={`timeline-dot ${i === 0 ? "timeline-dot--active" : ""}`}
              aria-hidden="true"
            />
            <p className="timeline-date">{m.date}</p>
            <h3 className="timeline-title">{m.title}</h3>
            <p className="timeline-desc">{m.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .timeline-list {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 1.75rem;
          max-width: 36rem;
        }
        .timeline-line {
          position: absolute;
          left: 3px;
          top: 6px;
          bottom: 6px;
          width: var(--border-width);
          background-color: var(--color-border);
        }
        .timeline-item {
          position: relative;
          padding-bottom: var(--space-block);
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -1.55rem;
          top: 5px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--color-border);
        }
        .timeline-dot--active {
          background-color: var(--color-accent);
        }
        .timeline-date {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }
        .timeline-title {
          font-size: var(--font-size-lg);
          font-weight: 450;
          letter-spacing: var(--tracking-snug);
          margin-bottom: 0.2rem;
        }
        .timeline-desc {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }
      `}</style>
    </SectionWrapper>
  );
}
