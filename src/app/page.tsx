import IntroSequence from "@/components/IntroSequence";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ACM from "@/components/ACM";
import Countdown from "@/components/Countdown";
import Themes from "@/components/Themes";
import Judges from "@/components/Judges";
import SponsorWall from "@/components/SponsorWall";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1910] text-[#f3f8ee] overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300">
      <IntroSequence />
      <Hero />
      <About />
      <ACM />
      <Countdown />
      <Themes />
      <Judges />
      <SponsorWall />
    </main>
  );
}
