"use client";

import SectionWrapper from "./SectionWrapper";

const QUESTIONS = [
  { question: "Who can participate?", answer: "Recursive is open to students, professionals, and independent builders of all skill levels. You can participate as an individual or as a team of up to four people." },
  { question: "Do I need a team to register?", answer: "No. You can register as an individual and form or join a team during our Team Formation Mixer event. We'll help you find collaborators whose skills and interests complement yours." },
  { question: "Is there a participation fee?", answer: "No. Recursive is free to attend. We provide the venue, meals, and mentorship. You bring the ideas." },
  { question: "What should I bring?", answer: "Your laptop, charger, and anything you need to be comfortable for 36 hours — a change of clothes, toiletries, a pillow if you plan to rest. We'll handle everything else." },
  { question: "How is judging structured?", answer: "Projects are evaluated on depth of thinking, quality of execution, potential impact, and how well the idea was iterated during the event. We prioritize craft over complexity." },
  { question: "Can I work on a pre-existing project?", answer: "All work must begin at the hackathon. You're welcome to come with an idea or a direction in mind, but code, designs, and prototypes should be created during the event." },
  { question: "Will there be mentors?", answer: "Yes. We'll have mentors available throughout the event — engineers, designers, researchers, and domain experts who can help you think through problems and refine your approach." },
];

export default function FAQ() {
  return (
    <SectionWrapper id="faq">
      <p className="section-label">FAQ</p>
      <h2 className="section-heading">Common questions.</h2>

      <div className="faq-list">
        {QUESTIONS.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-summary">
              {item.question}
              <span className="faq-icon" aria-hidden="true">+</span>
            </summary>
            <p className="faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>

      <style>{`
        .faq-list {
          max-width: 44rem;
        }
        .faq-item {
          border-bottom: var(--border-width) solid var(--color-border);
        }
        .faq-summary {
          padding: var(--space-element) 0;
          cursor: pointer;
          font-size: var(--font-size-lg);
          font-weight: 450;
          letter-spacing: var(--tracking-snug);
          color: var(--color-text);
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .faq-summary::-webkit-details-marker {
          display: none;
        }
        .faq-icon {
          font-size: var(--font-size-lg);
          color: var(--color-text-tertiary);
          font-weight: 300;
          flex-shrink: 0;
          line-height: 1;
          transition: transform 200ms var(--ease-out);
        }
        details[open] .faq-icon {
          transform: rotate(45deg);
        }
        .faq-answer {
          padding-bottom: var(--space-element);
          font-size: var(--font-size-base);
          line-height: var(--leading-relaxed);
          color: var(--color-text-secondary);
          max-width: 36rem;
        }
      `}</style>
    </SectionWrapper>
  );
}
