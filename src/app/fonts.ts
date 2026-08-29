import localFont from "next/font/local";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";

/** Bebas Neue face for numbers across the website. */
export const bebasNeue = localFont({
  src: "../../public/fonts/BebasNeue-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-bebas",
});

/** HeadingNow face for all headings across every page. */
export const headingNow = localFont({
  src: "../../public/fonts/HeadingNowTrial-45Medium.ttf",
  weight: "500",
  style: "normal",
  display: "swap",
  variable: "--font-heading",
});

/** Display face for the wordmark and big display. */
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

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const hiruko = localFont({
  src: "../../public/fonts/HirukoBlackAlternate.ttf",
  weight: "900",
  style: "normal",
  display: "swap",
  variable: "--font-hiruko",
});
