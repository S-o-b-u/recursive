import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Tracks from "@/components/Tracks";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Tracks",
  description: `The four tracks at ${EVENT.name} — one for each chair on the hill.`,
};

export default function TracksPage() {
  return (
    <main>
      <PageHeader
        label="Tracks"
        title="Four seats, four directions."
        lede={
          <p>
            A track is a lean, not a leash. Submit under the one your project is closest
            to — judges score against that track&rsquo;s criteria, and every track has
            its own prize. Still undecided on the day? Talk to a mentor before the
            checkpoint demos.
          </p>
        }
      />
      <Tracks detailed />
      <RegisterCTA />
    </main>
  );
}
