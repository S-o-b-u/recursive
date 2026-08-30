import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Sponsors from "@/components/Sponsors";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Sponsors",
  description: `Partner with ${EVENT.name} — sponsorship tiers and what your money pays for.`,
};

export default function SponsorsPage() {
  return (
    <main>
      <PageHeader
        label="Sponsors & Partners"
        title="Help four hundred people build something."
        lede={
          <p>
            Every rupee goes directly to the room: hot meals for 36 hours, travel grants for teams
            coming from outside Kolkata, hardware prototype kits to borrow, and the non-dilutive prize pool.
          </p>
        }
      />
      <Sponsors detailed />
      <RegisterCTA />
    </main>
  );
}
