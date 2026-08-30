"use client";

import { SPONSOR_TIERS, EVENT } from "@/data/hackathon";
import Ornament from "@/components/ui/Ornament";

const ALLOCATION = [
  {
    pct: "40%",
    label: "Fuel & Workspace",
    desc: "36 hours of hot meals, endless specialty coffee, quiet rest zones, and high-speed dedicated network lines.",
  },
  {
    pct: "25%",
    label: "Direct Cash Prizes",
    desc: "Empowering winners with non-dilutive grant money to continue developing their projects beyond the weekend.",
  },
  {
    pct: "20%",
    label: "Travel Grants",
    desc: "Reimbursing train and bus travel for student builders travelling from outside Kolkata (300km+).",
  },
  {
    pct: "15%",
    label: "Hardware & Lab Rigs",
    desc: "ESP32s, sensor arrays, test benches, and loaner kits so hardware teams can build without friction.",
  },
];

const CUSTOM_OFFERINGS = [
  {
    title: "Dedicated API Bounty",
    desc: "Sponsor a custom prize track for teams that integrate your SDK, API, or protocol into their hack.",
  },
  {
    title: "Hands-on Technical Workshop",
    desc: "Host a 45-minute live builder workshop on Day 1 to teach participants how to build with your tools.",
  },
  {
    title: "Hardware Lab Sponsorship",
    desc: "Provide microcontrollers, dev kits, or test sensors directly into the hands of 400 eager engineers.",
  },
  {
    title: "Mentor & Judge Presence",
    desc: "Send your senior engineers and founders to sit on mentor rounds, review architectures, and judge finals.",
  },
];

export default function Sponsors({ detailed = true }: { detailed?: boolean }) {
  return (
    <section id="sponsors-tiers" className="sp-section" aria-label="Sponsorship Tiers and Packages">
      <div className="sp-inner">
        {/* ── Section Motif ── */}
        <div className="sp-ornament-wrap">
          <Ornament className="sp-motif" />
        </div>

        <div className="sp-header">
          <span className="sp-eyebrow">PARTNERSHIP TIERS</span>
          <h2 className="sp-title">Empower the builders on the hill.</h2>
          <p className="sp-subtitle">
            Every rupee of sponsorship goes directly toward the event: feeding four hundred builders, funding travel grants, and providing hardware rigs. We publish a full breakdown after the hackathon.
          </p>
        </div>

        {/* ── Tiers Grid ── */}
        <div className="sp-grid">
          {SPONSOR_TIERS.map((tier, i) => {
            const isCanopy = tier.tier === "Canopy";
            const isGrove = tier.tier === "Grove";

            return (
              <article
                key={tier.tier}
                className={`sp-tier-card ${isCanopy ? "sp-tier-featured" : ""}`}
              >
                {isCanopy && (
                  <div className="sp-featured-badge">
                    <span>Title Partner · 1 Slot</span>
                  </div>
                )}

                <div className="sp-tier-head">
                  <div>
                    <span className="sp-tier-level">{tier.tier} Tier</span>
                    <h3 className="sp-tier-price">{tier.price}</h3>
                  </div>
                  <div className="sp-tier-glyph" aria-hidden="true">
                    {isCanopy ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ) : isGrove ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="sp-tier-divider" />

                <h4 className="sp-perks-title">What&rsquo;s included</h4>
                <ul className="sp-perks-list">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="sp-perk-item">
                      <svg viewBox="0 0 24 24" className="sp-check-icon" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="sp-tier-footer">
                  <a
                    href={`mailto:${EVENT.email}?subject=${tier.tier}%20Sponsorship%20Enquiry%20%E2%80%94%20${EVENT.name}`}
                    className={`sp-enquire-btn ${isCanopy ? "sp-enquire-primary" : ""}`}
                  >
                    <span>Enquire {tier.tier} Tier</span>
                    <svg viewBox="0 0 24 24" className="sp-btn-arrow" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Transparent Capital Allocation ── */}
        <div className="sp-alloc-wrap">
          <div className="sp-alloc-header">
            <span className="sp-eyebrow">TRANSPARENCY</span>
            <h3 className="sp-alloc-title">Where the funds go</h3>
            <p className="sp-alloc-subtitle">Every sponsorship dollar directly subsidizes student participants and room costs.</p>
          </div>

          <div className="sp-alloc-grid">
            {ALLOCATION.map((item) => (
              <div key={item.label} className="sp-alloc-card">
                <div className="sp-alloc-pct">{item.pct}</div>
                <h4 className="sp-alloc-name">{item.label}</h4>
                <p className="sp-alloc-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Custom Opportunities ── */}
        <div className="sp-custom-wrap">
          <div className="sp-custom-header">
            <span className="sp-eyebrow">CUSTOM PACKAGES &amp; IN-KIND</span>
            <h3 className="sp-custom-title">Looking for specific integration?</h3>
          </div>

          <div className="sp-custom-grid">
            {CUSTOM_OFFERINGS.map((offer) => (
              <div key={offer.title} className="sp-custom-card">
                <h4 className="sp-custom-name">{offer.title}</h4>
                <p className="sp-custom-desc">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sp-section {
          position: relative;
          width: 100%;
          padding: clamp(3rem, 6vh, 5rem) var(--padding-x) clamp(5rem, 10vh, 8rem);
          color: #111a12;
        }

        .sp-inner {
          max-width: var(--max-width);
          margin-inline: auto;
        }

        .sp-ornament-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .sp-motif {
          width: clamp(160px, 18vw, 220px);
          height: auto;
          color: #2F5527;
          opacity: 0.85;
        }

        .sp-header {
          text-align: center;
          max-width: 48rem;
          margin-inline: auto;
          margin-bottom: clamp(3rem, 6vh, 4.5rem);
        }

        .sp-eyebrow {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem;
          font-weight: 550;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4A6B3E;
        }

        .sp-title {
          margin-top: 0.6rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #111a12;
        }

        .sp-subtitle {
          margin-top: 1rem;
          font-size: clamp(0.95rem, 1.2vw, 1.1rem);
          line-height: 1.6;
          color: #3b5038;
        }

        /* ── Tier Grid ── */
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.5vw, 2rem);
          align-items: stretch;
        }

        @media (max-width: 960px) {
          .sp-grid {
            grid-template-columns: 1fr;
            max-width: 32rem;
            margin-inline: auto;
          }
        }

        .sp-tier-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: clamp(1.75rem, 2.8vw, 2.4rem);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(47, 85, 39, 0.14);
          box-shadow:
            0 2px 10px rgba(18, 38, 16, 0.04),
            0 16px 36px -12px rgba(18, 38, 16, 0.08),
            inset 0 1px 2px rgba(255, 255, 255, 0.85);
          transition: transform 260ms var(--ease-out), box-shadow 260ms var(--ease-out), border-color 260ms ease;
        }

        .sp-tier-card:hover {
          transform: translateY(-4px);
          border-color: rgba(92, 140, 58, 0.38);
          box-shadow:
            0 4px 14px rgba(18, 38, 16, 0.06),
            0 24px 48px -12px rgba(18, 38, 16, 0.12),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
        }

        .sp-tier-featured {
          border-color: #5C8C3A;
          background: rgba(255, 255, 255, 0.72);
          box-shadow:
            0 0 0 2px rgba(92, 140, 58, 0.28),
            0 20px 44px -10px rgba(18, 38, 16, 0.14),
            inset 0 1px 3px rgba(255, 255, 255, 0.95);
        }

        .sp-featured-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.22rem 0.85rem;
          border-radius: var(--radius-pill);
          background: #2F5527;
          color: #EBF5E4;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(47, 85, 39, 0.28);
        }

        .sp-tier-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .sp-tier-level {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4A6B3E;
        }

        .sp-tier-price {
          margin-top: 0.35rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2rem, 3.2vw, 2.6rem);
          font-weight: 500;
          line-height: 1;
          color: #111a12;
        }

        .sp-tier-glyph {
          width: 2.3rem;
          height: 2.3rem;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #2F5527;
          background: rgba(255, 255, 255, 0.65);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9);
          flex-shrink: 0;
        }

        .sp-tier-glyph svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .sp-tier-divider {
          width: 100%;
          height: 1px;
          background: rgba(47, 85, 39, 0.12);
          margin: 1.35rem 0;
        }

        .sp-perks-title {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4A6B3E;
          margin-bottom: 0.85rem;
        }

        .sp-perks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1 1 auto;
        }

        .sp-perk-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #1e331c;
        }

        .sp-check-icon {
          width: 1rem;
          height: 1rem;
          color: #5C8C3A;
          flex-shrink: 0;
          margin-top: 0.16rem;
        }

        .sp-tier-footer {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(47, 85, 39, 0.12);
        }

        .sp-enquire-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.68rem 1.35rem;
          border-radius: var(--radius-pill);
          background: rgba(47, 85, 39, 0.09);
          border: 1px solid rgba(47, 85, 39, 0.2);
          color: #1e331c;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;
        }

        .sp-enquire-btn:hover {
          background: rgba(47, 85, 39, 0.16);
          border-color: rgba(47, 85, 39, 0.35);
          transform: translateY(-1px);
        }

        .sp-enquire-primary {
          background: #1B2E16;
          border-color: transparent;
          color: #F4F8EE;
        }

        .sp-enquire-primary:hover {
          background: #25401F;
        }

        .sp-btn-arrow {
          width: 0.9rem;
          height: 0.9rem;
          transition: transform 180ms ease;
        }

        .sp-enquire-btn:hover .sp-btn-arrow {
          transform: translateX(3px);
        }

        /* ── Allocation Section ── */
        .sp-alloc-wrap {
          margin-top: clamp(4.5rem, 9vh, 7rem);
        }

        .sp-alloc-header {
          text-align: center;
          max-width: 42rem;
          margin-inline: auto;
          margin-bottom: 2.5rem;
        }

        .sp-alloc-title {
          margin-top: 0.5rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 500;
          color: #111a12;
        }

        .sp-alloc-subtitle {
          margin-top: 0.6rem;
          font-size: 0.96rem;
          color: #3b5038;
        }

        .sp-alloc-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 880px) {
          .sp-alloc-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .sp-alloc-grid {
            grid-template-columns: 1fr;
          }
        }

        .sp-alloc-card {
          padding: 1.5rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(47, 85, 39, 0.12);
          backdrop-filter: blur(12px);
        }

        .sp-alloc-pct {
          font-family: var(--font-bebas), var(--font-heading), sans-serif;
          font-size: 2.4rem;
          line-height: 1;
          color: #2F5527;
        }

        .sp-alloc-name {
          margin-top: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #111a12;
        }

        .sp-alloc-desc {
          margin-top: 0.4rem;
          font-size: 0.84rem;
          line-height: 1.55;
          color: #3b5038;
        }

        /* ── Custom Offerings ── */
        .sp-custom-wrap {
          margin-top: clamp(4rem, 8vh, 6rem);
        }

        .sp-custom-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .sp-custom-title {
          margin-top: 0.5rem;
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 500;
          color: #111a12;
        }

        .sp-custom-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 760px) {
          .sp-custom-grid {
            grid-template-columns: 1fr;
          }
        }

        .sp-custom-card {
          padding: 1.6rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.48);
          border: 1px solid rgba(47, 85, 39, 0.14);
          backdrop-filter: blur(12px);
        }

        .sp-custom-name {
          font-size: 1.05rem;
          font-weight: 600;
          color: #111a12;
        }

        .sp-custom-desc {
          margin-top: 0.45rem;
          font-size: 0.88rem;
          line-height: 1.58;
          color: #3b5038;
        }
      `}</style>
    </section>
  );
}
