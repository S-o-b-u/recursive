import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Prizes from "@/components/Prizes";
import RegisterCTA from "@/components/RegisterCTA";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: "Prizes",
  description: `Prize pool and judging criteria for ${EVENT.name}.`,
};

const CRITERIA = [
  { name: "Originality", note: "Have we seen this before? Does it take a real risk?" },
  { name: "Technical depth", note: "What did you actually build in the time you had?" },
  { name: "Craft", note: "Does it feel finished — the details, the edges, the polish?" },
  { name: "Story", note: "Can you make a stranger care in two minutes?" },
];

import WarpText from "@/components/ui/WarpText";

export default function PrizesPage() {
  return (
    <main>
      <PageHeader
        label="Prizes"
        title="What you can win, and how it is decided."
        lede={
          <p>
            Four criteria, weighted equally. Judges see every project at the expo; the
            top six present on the main stage before the final call.
          </p>
        }
      />
      <Prizes detailed />

      <section className="section pt-0">
        <div className="section-inner">
          <div className="mb-6">
            <WarpText
              text="Judging criteria"
              align="left"
              color="#16241A"
              fontSize="clamp(1.375rem, 14.96px + 1.957vw, 2.5rem)"
              fontWeight={350}
              fontFamily="var(--font-display), Georgia, serif"
              letterSpacing="-0.03em"
              style={{
                width: "100%",
                maxWidth: "30ch",
                height: "clamp(35px, 23.65px + 3.152vw, 64px)",
                pointerEvents: "auto",
              }}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {CRITERIA.map((c) => (
              <div key={c.name} className="glass glass-sheen p-6">
                <p className="text-[var(--font-size-lg)] font-light tracking-[var(--tracking-snug)]">
                  {c.name}
                </p>
                <p className="mt-1.5 text-[length:var(--font-size-sm)] text-[color:var(--color-text-secondary)]">
                  {c.note}
                </p>
                <p className="mt-4 eyebrow text-[var(--color-accent)]">25%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RegisterCTA />
    </main>
  );
}
