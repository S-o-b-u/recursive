import localFont from "next/font/local";
import { Geist_Mono, DM_Sans } from "next/font/google";

/** Bebas Neue face for numbers across the website. */
export const bebasNeue = localFont({
  src: "../../public/fonts/BebasNeue-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-bebas",
});

/** HeadingNow face for all headings across every page. Excludes watermarked digits 0-9 so they cleanly fall back to DM Sans. */
export const headingNow = localFont({
  src: "../../public/fonts/HeadingNowTrial-45Medium.ttf",
  weight: "500",
  style: "normal",
  display: "swap",
  variable: "--font-heading",
  adjustFontFallback: false,
  fallback: ["var(--font-dm-sans)", "sans-serif"],
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0000-002F, U+003A-10FFFF",
    },
  ],
});

/** Display face for the wordmark and big display. */
export const display = localFont({
  src: "../../public/fonts/MADEOkineSansPERSONALUSE-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
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

/** Hiruko Black Alternate face for the RECURSIVE wordmark and display branding. */
export const hiruko = localFont({
  src: "../../public/fonts/HirukoBlackAlternate.ttf",
  weight: "900",
  style: "normal",
  display: "swap",
  variable: "--font-hiruko",
});
