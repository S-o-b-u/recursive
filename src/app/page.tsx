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
    <main>
      <IntroSequence />
      <Hero />
      <About />
      <Countdown />
      <Themes />
      <Judges />
      <SponsorWall />
      <ACM />
    </main>
  );
}
