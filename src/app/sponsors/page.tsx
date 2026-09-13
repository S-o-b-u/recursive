import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Sponsors from "@/components/Sponsors";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Sponsors & Partners",
  description: `Partner with ${EVENT.name} 2026 — support collegiate builders and innovators at GNIT Kolkata ACM Student Chapter's premier hackathon.`,
  keywords: [
    "Recursive Sponsors",
    "ACM Hackathon Partners",
    "GNIT Kolkata ACM Sponsorship",
    "Tech Sponsorship Kolkata",
    "Devfolio Hackathon Partner",
  ],
  alternates: {
    canonical: "/sponsors",
  },
};

export default function SponsorsPage() {
  return (
    <main>
      <PageHeader
        label="Sponsors & Partners"
        title="Help four hundred people build something."
        lede={
          <p>
            Every rupee goes directly to the room: hot meals for the 8-hour sprint, travel grants for teams
            coming from outside Kolkata, hardware prototype kits to borrow, and the non-dilutive prize pool.
          </p>
        }
      />
      <Sponsors detailed showHeader={false} />
      <RegisterCTA />
    </main>
  );
}
