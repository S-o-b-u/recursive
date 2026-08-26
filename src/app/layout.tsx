import type { Metadata } from "next";
import "./globals.css";
import { display, geist, geistMono } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { EVENT } from "@/data/hackathon";

export const metadata: Metadata = {
  title: {
    default: `${EVENT.name} — ${EVENT.tagline}`,
    template: `%s · ${EVENT.name}`,
  },
  description: `${EVENT.name} is a ${EVENT.duration} hackathon inspired by the relationship between recursion and organic growth. ${EVENT.dates}. ${EVENT.format}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${display.variable}`}
    >
      <body>
        <SmoothScroll>
          <Navigation />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
