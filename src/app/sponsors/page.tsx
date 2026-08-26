import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Sponsors from "@/components/Sponsors";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Sponsors",
  description: `Partner with ${EVENT.name} — sponsorship tiers and what your money pays for.`,
};

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
              <h2 className="text-[var(--font-size-2xl)] font-light tracking-[var(--tracking-snug)]">
                Want a custom package?
              </h2>
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
