import type { Metadata } from "next";
import "./globals.css";
import { display, geist, geistMono, hiruko, dmSans, headingNow, bebasNeue } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GradualBlur from "@/components/ui/GradualBlur";
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
      className={`${geist.variable} ${geistMono.variable} ${display.variable} ${hiruko.variable} ${dmSans.variable} ${headingNow.variable} ${bebasNeue.variable}`}
    >
      <body>
        <SmoothScroll>
          <Navigation />
          {children}
          <Footer />
        </SmoothScroll>

        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          zIndex={0}
        />
      </body>
    </html>
  );
}
