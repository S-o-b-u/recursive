import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, geistMono, hiruko, dmSans, headingNow, bebasNeue } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SITE_URL } from "@/lib/site";
import { EVENT, COLLEGE } from "@/data/hackathon";
import JsonLd from "@/components/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a140c",
};

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${EVENT.name} 2026 — ACM Hackathon | ${COLLEGE.collegeShort} Kolkata`,
    template: `%s | ${EVENT.name} — ACM Hackathon 2026`,
  },
  description: `${EVENT.name} 2026 is the flagship national hackathon organized by the ${COLLEGE.chapter} at ${COLLEGE.college}, ${COLLEGE.city}. An 8-hour sprint across AI & Intelligent Systems, Web3 & Blockchain, FinTech, HealthTech, CyberSecurity, and Open Innovation. Register now on Devfolio.`,
  keywords: [
    "ACM",
    "ACM Student Chapter",
    "GNIT ACM",
    "GNIT Kolkata ACM",
    "GNIT Kolkata ACM Student Chapter",
    "ACM Hackathon",
    "ACM India",
    "Association for Computing Machinery",
    "Recursive",
    "Recursive 2026",
    "Recursive ACM",
    "Recursive Hackathon",
    "recu",
    "recursiveacm",
    "Guru Nanak Institute of Technology",
    "GNIT",
    "GNIT Kolkata",
    "Hackathon Kolkata",
    "Kolkata Hackathon 2026",
    "Devfolio Hackathon",
    "Web3 Hackathon",
    "AI Hackathon",
    "FinTech Hackathon",
    "Student Hackathon India",
    "Tech Fest GNIT",
    "Coding Competition Kolkata",
  ],
  authors: [
    {
      name: COLLEGE.chapter,
      url: "https://gnitkolkata.acm.org/",
    },
    { name: COLLEGE.college, url: "https://gnit.ac.in/" },
  ],
  creator: COLLEGE.chapter,
  publisher: COLLEGE.college,
  applicationName: `${EVENT.name} 2026`,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${EVENT.name} 2026 — ACM Hackathon | ${COLLEGE.collegeShort} Kolkata`,
    description: `${EVENT.name} 2026 is the premier hackathon hosted by ${COLLEGE.chapter} at ${COLLEGE.college}. Build something that matters across 6 cutting-edge tracks.`,
    url: "/",
    siteName: `${EVENT.name} — ACM Hackathon`,
    locale: "en_US",
    type: "website",
    images: [
      {
        // A purpose-built 1200x630 card. The previous entries declared sizes
        // neither file had -- hero_poster.jpg is 1280x704, and the chapter logo
        // is 900x298, not the 1200x630 it claimed. Scrapers lay out the preview
        // from these numbers, so a wrong one produces a letterboxed or cropped
        // share card on WhatsApp, where most of this event's links get passed
        // around.
        url: "/images/brand/og-card.jpg",
        width: 1200,
        height: 630,
        alt: `${EVENT.name} 2026 — ACM Hackathon at ${COLLEGE.collegeShort}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${EVENT.name} 2026 — ACM Hackathon | ${COLLEGE.collegeShort} Kolkata`,
    description: `Flagship national hackathon organized by ${COLLEGE.chapter} at ${COLLEGE.college}. 8 hours, 6 tracks, real prizes.`,
    images: ["/images/brand/og-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${display.variable} ${hiruko.variable} ${dmSans.variable} ${headingNow.variable} ${bebasNeue.variable}`}
    >
      <body>
        <JsonLd />
        {/* The intro's opening frame is this still. It is the very first thing
            the document paints (see the pending plate in IntroSequence), so it
            has to be decodable by then -- otherwise a reload shows a slab of
            flat black while a 75KB JPEG downloads. React hoists this into
            <head>; the App Router does not want one written by hand. */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero_poster.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/bg/cloud.jpg"
        />
        <div className="fixed-cloud-plate" aria-hidden="true" />
        <SmoothScroll>
          <Navigation />
          {children}
          <Footer />
        </SmoothScroll>

        <PageTransition />

        {/*
          Devfolio SDK — injected as a literal <script> via dangerouslySetInnerHTML
          so the tag appears in the server-rendered HTML body and is visible to
          Devfolio's verification crawler, which fetches raw HTML without executing
          JS. Positioned after children so DOM elements are parsed before initial execution.
        */}
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<script defer src="https://apply.devfolio.co/v2/sdk.js"></script>',
          }}
        />
      </body>
    </html>
  );
}
