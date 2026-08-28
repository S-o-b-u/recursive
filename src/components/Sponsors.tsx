"use client";

import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";
import { SPONSORS, SPONSOR_TIERS, EVENT } from "@/data/hackathon";

const TIER_STYLES = [
  {
    bg: "#f4f8f1", // Canopy tier
    borderColor: "rgba(92, 140, 58, 0.35)",
    tagColor: "#274c1f",
    bulletColor: "#3a6830",
    shadow: "0 16px 40px rgba(25, 45, 20, 0.1)",
  },
  {
    bg: "#f7f2e8", // Understory tier
    borderColor: "rgba(180, 140, 90, 0.35)",
    tagColor: "#6c4114",
    bulletColor: "#844f19",
    shadow: "0 16px 40px rgba(45, 30, 15, 0.1)",
  },
  {
    bg: "#f0f5f9", // Seedling tier
    borderColor: "rgba(100, 140, 180, 0.35)",
    tagColor: "#1d456b",
    bulletColor: "#25537f",
    shadow: "0 16px 40px rgba(20, 35, 55, 0.1)",
  },
];

export default function Sponsors({ detailed = false }: { detailed?: boolean }) {
  return (
    <SectionWrapper
      id="sponsors"
      label="Sponsors"
      heading={<>Grown with help from people who build things.</>}
      lede={
        <p>
          Sponsorship pays for food, travel grants, and prizes — not for a logo wall.
          Three tiers, named after what a forest needs.{" "}
          <a
            href={`mailto:${EVENT.email}`}
            className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4 text-emerald-800 font-medium"
          >
            Talk to us
          </a>
          .
        </p>
      }
      tone="alt"
    >
      {/* Handcrafted Logo Badges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
        {SPONSORS.map((s, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <div className="sponsor-logo-scrap">
              <span className="font-mono text-sm font-medium tracking-wide text-emerald-950/60">
                {s.name}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {detailed && (
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SPONSOR_TIERS.map((tier, i) => {
            const style = TIER_STYLES[i % TIER_STYLES.length];
            return (
              <Reveal key={tier.tier} delay={i * 0.08}>
                <div
                  className="sponsor-tier-card"
                  style={{
                    backgroundColor: style.bg,
                    borderColor: style.borderColor,
                    boxShadow: style.shadow,
                  }}
                >
                  <div className="sponsor-tier-tape" aria-hidden="true" />

                  <header className="border-b border-black/8 pb-4">
                    <span
                      className="sponsor-tier-tag"
                      style={{ color: style.tagColor }}
                    >
                      {tier.tier}
                    </span>
                    <p className="sponsor-tier-price">
                      {tier.price}
                    </p>
                  </header>

                  <ul className="space-y-2.5 pt-2 text-sm text-[#3b503e]">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span
                          aria-hidden
                          className="sponsor-tier-bullet"
                          style={{ backgroundColor: style.bulletColor }}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`mailto:${EVENT.email}?subject=${tier.tier} sponsorship — ${EVENT.name}`}
                    className="sponsor-enquire-btn mt-auto"
                  >
                    Enquire for {tier.tier}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      <style>{`
        /* ── Handcrafted Sponsor Logo Scrap ── */
        .sponsor-logo-scrap {
          display: grid;
          place-items: center;
          height: 6rem;
          padding: 1rem;
          background: #fbfdf9;
          border-radius: 12px;
          border: 1px dashed rgba(47, 85, 39, 0.28);
          box-shadow: 0 4px 12px rgba(20, 35, 20, 0.05);
          text-align: center;
          transition: transform 250ms ease, border-color 250ms ease;
        }
        .sponsor-logo-scrap:hover {
          transform: translateY(-3px);
          border-color: rgba(92, 140, 58, 0.5);
        }

        /* ── Tactile Tier Dossier ── */
        .sponsor-tier-card {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          gap: 1.25rem;
          padding: clamp(1.75rem, 4vw, 2.25rem);
          border-radius: 16px;
          border: 1px solid;
          color: #152417;
          transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .sponsor-tier-card:hover {
          transform: translateY(-5px);
        }

        .sponsor-tier-tape {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 48px;
          height: 17px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .sponsor-tier-tag {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sponsor-tier-price {
          margin-top: 0.35rem;
          font-family: var(--font-hiruko), var(--font-display), sans-serif;
          font-weight: 900;
          font-size: 1.85rem;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #122214;
        }

        .sponsor-tier-bullet {
          margin-top: 0.45em;
          width: 6px;
          height: 6px;
          border-radius: 50% 45% 55% 48% / 48% 54% 46% 52%;
          flex-shrink: 0;
        }

        .sponsor-enquire-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.75rem;
          padding-inline: 1.25rem;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(47, 85, 39, 0.22);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #274c1f;
          transition: all 200ms ease;
        }
        .sponsor-enquire-btn:hover {
          background: #eef5e8;
          border-color: rgba(92, 140, 58, 0.4);
          transform: translateY(-2px);
        }
      `}</style>
    </SectionWrapper>
  );
}
