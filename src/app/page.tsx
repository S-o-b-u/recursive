import Hero from "@/components/Hero";
import About from "@/components/About";
import Tracks from "@/components/Tracks";
import Timeline from "@/components/Timeline";
import Prizes from "@/components/Prizes";
import Sponsors from "@/components/Sponsors";
import FAQ from "@/components/FAQ";
import RegisterCTA from "@/components/RegisterCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Tracks />
      <Timeline compact />
      <Prizes />
      <Sponsors />
      <FAQ />
      <RegisterCTA />
    </main>
  );
}
