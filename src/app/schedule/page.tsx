import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Schedule & Timeline",
  description: `The complete 8-hour schedule for ${EVENT.name} on ${EVENT.dates} at Guru Nanak Institute of Technology, Kolkata. Organized by GNIT Kolkata ACM Student Chapter.`,
  keywords: [
    "Recursive Schedule",
    "ACM Hackathon Schedule",
    "GNIT Hackathon Timeline",
    "Kolkata Hackathon 2026 Schedule",
  ],
  alternates: {
    canonical: "/schedule",
  },
};

export default function SchedulePage() {
  return (
    <main>
      <PageHeader
        label="Schedule"
        title="Eight hours, start to stage."
        lede={
          <p>
            All times are IST. The only two immovable moments are the opening ceremony
            and the submission deadline — everything else bends around your build.
          </p>
        }
      />
      <Timeline showHeader={false} />
      <RegisterCTA />
    </main>
  );
}
