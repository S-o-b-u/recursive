import type { Metadata } from "next";
import "./globals.css";
import { display, geistMono, hiruko, dmSans, headingNow, bebasNeue } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: {
    default: `${EVENT.name} — ${EVENT.tagline}`,
    template: `%s | ${EVENT.name}`,
  },
  description: `${EVENT.name} is a ${EVENT.duration} hackathon inspired by the relationship between recursion and organic growth. ${EVENT.dates}. ${EVENT.format}.`,
  icons: {
    icon: "/images/tabicon.png",
    shortcut: "/images/tabicon.png",
    apple: "/images/tabicon.png",
  },
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
      </body>
    </html>
  );
}
