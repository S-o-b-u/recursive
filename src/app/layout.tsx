import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "RECURSIVE — Where Ideas Branch, Evolve, and Bloom",
  description:
    "RECURSIVE is a hackathon inspired by the relationship between recursion and organic growth. A simple rule repeats, branches, evolves — and creates something beautiful.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
