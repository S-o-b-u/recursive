import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, geistMono, hiruko, dmSans, headingNow, bebasNeue } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { EVENT } from "@/data/hackathon";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a140c",
};

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
        {/* The intro's opening frame is this still. It is the very first thing
            the document paints (see the pending plate in IntroSequence), so it
            has to be decodable by then -- otherwise a reload shows a slab of
            flat black while a 75KB JPEG downloads. React hoists this into
            <head>; the App Router does not want one written by hand. */}
        <link
          rel="preload"
          as="image"
          href="/images/hero_poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/cloud.jpg"
        />
        <div className="fixed-cloud-plate" aria-hidden="true" />
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
