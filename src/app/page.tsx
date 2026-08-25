import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Timeline from "@/components/Timeline";
import Tracks from "@/components/Tracks";
import Prizes from "@/components/Prizes";
import Sponsors from "@/components/Sponsors";
import FAQ from "@/components/FAQ";
import RegisterCTA from "@/components/RegisterCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Timeline />
        <Tracks />
        <Prizes />
        <Sponsors />
        <FAQ />
        <RegisterCTA />
      </main>
      <Footer />
    </>
  );
}
