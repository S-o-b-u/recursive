import type { Metadata } from "next";
import "./globals.css";
import { display, geistMono, hiruko, dmSans, headingNow, bebasNeue } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GradualBlur from "@/components/ui/GradualBlur";
import PageTransition from "@/components/PageTransition";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: {
    default: `${EVENT.name} — ${EVENT.tagline}`,
    template: `%s | ${EVENT.name}`,
  },
  description: `${EVENT.name} is a ${EVENT.duration} hackathon inspired by the relationship between recursion and organic growth. ${EVENT.dates}. ${EVENT.format}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${display.variable} ${hiruko.variable} ${dmSans.variable} ${headingNow.variable} ${bebasNeue.variable}`}
    >
      <body>
        <SmoothScroll>
          <Navigation />
          {children}
          <Footer />
        </SmoothScroll>

        <PageTransition />

        <GradualBlur
          target="page"
          position="bottom"
          height="5rem"
          strength={1.6}
          divCount={3}
          curve="bezier"
          exponential
          opacity={0.95}
          zIndex={0}
        />
      </body>
    </html>
  );
}
