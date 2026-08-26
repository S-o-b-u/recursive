import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Sponsors from "@/components/Sponsors";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Sponsors",
  description: `Partner with ${EVENT.name} — sponsorship tiers and what your money pays for.`,
};

import WarpText from "@/components/ui/WarpText";

export default function SponsorsPage() {
  return (
    <main>
      <PageHeader
        label="Sponsors"
        title="Help four hundred people build something."
        lede={
          <p>
            Every rupee goes to the room: food for the weekend, travel grants for teams
            coming from outside the city, hardware to borrow, and the prize pool. We
            publish a breakdown after the event.
          </p>
        }
      />
      <Sponsors detailed />

      <section className="section pt-0">
        <div className="section-inner">
          <div className="glass glass-strong glass-sheen flex flex-wrap items-center justify-between gap-5 p-8">
            <div>
              <WarpText
                text="Want a custom package?"
                align="left"
                color="#16241A"
                fontSize="clamp(1.4rem, 2.8vw, 1.85rem)"
                fontWeight={300}
                fontFamily="var(--font-display), Georgia, serif"
                letterSpacing="-0.02em"
                style={{
                  width: "100%",
                  maxWidth: "28ch",
                  height: "clamp(36px, 4.5vw, 50px)",
                  pointerEvents: "auto",
                }}
              />
              <p className="mt-1.5 text-[var(--color-text-secondary)]">
                Workshops, API bounties, mentor tables — tell us what you need.
              </p>
            </div>
            <a href={`mailto:${EVENT.email}`} className="btn btn-primary">
              Email the team
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
