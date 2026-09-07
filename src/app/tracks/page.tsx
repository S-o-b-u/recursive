import type { Metadata } from "next";
import Themes from "@/components/Themes";
import Tracks from "@/components/Tracks";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Tracks & Themes",
  description: `Explore the 6 innovation tracks at ${EVENT.name} 2026: AI & Intelligent Systems, Web3 & Blockchain, FinTech, HealthTech, CyberSecurity, and Open Innovation. Hosted by GNIT ACM.`,
  keywords: [
    "Recursive Tracks",
    "ACM Hackathon Themes",
    "Web3 Blockchain Hackathon",
    "AI Hackathon Kolkata",
    "FinTech Hackathon",
    "GNIT ACM",
    "Recursive Hackathon Tracks",
  ],
  alternates: {
    canonical: "/tracks",
  },
};

export default function TracksPage() {
  return (
    <main className="night" style={{ minHeight: "100vh", paddingTop: "clamp(3.5rem, 7vh, 5.5rem)" }}>
      <Themes />
      {/* The full briefs for all six tracks. <Themes> is a carousel and only
          ever has one brief in the DOM, so before this the page server-rendered
          about a thousand characters -- one track's worth -- while the other
          five existed only as carousel captions. Now that the per-track routes
          are gone this is the only place that copy lives, for readers and for
          crawlers alike. */}
      <Tracks />
    </main>
  );
}
