import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Schedule",
  description: `The full ${EVENT.duration} schedule for ${EVENT.name}, ${EVENT.dates}.`,
};

export default function SchedulePage() {
  return (
    <main>
      <PageHeader
        label="Schedule"
        title="Thirty-six hours, hour by hour."
        lede={
          <p>
            All times are IST. Workshops are optional and recorded. The only two
            immovable moments are the opening ceremony and the submission deadline —
            everything else bends around your build.
          </p>
        }
      />
      <Timeline />
      <RegisterCTA />
    </main>
  );
}
