import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FAQ from "@/components/FAQ";
import VenueLocation from "@/components/VenueLocation";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description: `Find answers to common questions about ${EVENT.name} 2026: registration on Devfolio, team size, venue location at GNIT Kolkata, eligibility, and rules. Organized by GNIT Kolkata ACM.`,
  keywords: [
    "Recursive FAQ",
    "ACM Hackathon Questions",
    "GNIT Hackathon FAQ",
    "Devfolio Registration",
    "Hackathon Kolkata Rules",
  ],
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <main>
      <PageHeader
        label="FAQ"
        title="Questions people actually ask."
        lede={
          <p>
            If it is not here,{" "}
            <a
              href={EVENT.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[var(--color-accent)] decoration-1 underline-offset-4"
            >
              Discord
            </a>{" "}
            is faster than email.
          </p>
        }
      />
      <FAQ showHeader={false} />
      <VenueLocation />
      <RegisterCTA />
    </main>
  );
}
