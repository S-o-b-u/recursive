import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

/** Display face for the wordmark and big headings. */
export const display = localFont({
  src: "../../public/fonts/MADEOkineSansPERSONALUSE-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const hiruko = localFont({
  src: "../../public/fonts/HirukoBlackAlternate.ttf",
  weight: "900",
  style: "normal",
  display: "swap",
  variable: "--font-hiruko",
});
