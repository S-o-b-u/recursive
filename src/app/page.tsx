import IntroSequence from "@/components/IntroSequence";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ACM from "@/components/ACM";
import Countdown from "@/components/Countdown";
import Themes from "@/components/Themes";
import Judges from "@/components/Judges";
import SponsorStage from "@/components/SponsorStage";

export default function Home() {
  return (
    <main>
      <IntroSequence />
      <Hero />
      <About />
      <Countdown />

      {/* Everything from here down is night. The valley plate that closes the
          countdown fades to #010301 on its last row, so `.night` picks up
          exactly where the image leaves off and the seam disappears. */}
      <div className="night">
        <Themes />
        <Judges />
      </div>

      {/* The way back out. A window opens on the black field and what is behind
          it is the sky — the sponsors sit inside it, on cloud. By the time the
          window fills the viewport it is painting the same pixels as the page
          backdrop, so ACM below simply continues on that background. */}
      <SponsorStage />
      <ACM />
    </main>
  );
}
