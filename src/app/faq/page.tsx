import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FAQ from "@/components/FAQ";
import VenueLocation from "@/components/VenueLocation";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers about eligibility, cost, teams, and judging at ${EVENT.name}.`,
};

export default function FaqPage() {
  return (
    <main>
      <PageHeader
        label="FAQ"
        title="Everything you asked us last year."
        lede={<p>If it is not here, Discord is faster than email.</p>}
      />
      <FAQ />
      <VenueLocation />
      <RegisterCTA />
    </main>
  );
}
