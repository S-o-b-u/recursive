import { EVENT, COLLEGE, FAQS, VENUE } from "@/data/hackathon";
import { SITE_URL } from "@/lib/site";

/**
 * JSON-LD is injected as raw text, so a "</script>" appearing inside any string
 * would close the block early and spill the rest of the graph into the document
 * as markup. JSON.stringify does not escape "<". Every value here is authored
 * copy today, but copy gets edited by people who are not thinking about this.
 */
function ldJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}

export default function JsonLd() {
  const siteUrl = SITE_URL;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Hackathon",
    name: `${EVENT.name} 2026 — ACM Hackathon`,
    alternateName: [
      "RECURSIVE",
      "Recursive",
      "Recursive ACM",
      "Recursive Hackathon",
      "GNIT Kolkata ACM Hackathon",
      "GNIT ACM Hackathon",
      "recu",
      "recursiveacm",
    ],
    description: `${EVENT.name} 2026 is an 8-hour premier national hackathon organized by the ${COLLEGE.chapter} at ${COLLEGE.college}, ${COLLEGE.city}. Builders compete across AI & Intelligent Systems, Web3 & Blockchain, FinTech, HealthTech, CyberSecurity, and Open Innovation.`,
    startDate: EVENT.startsAt,
    endDate: "2026-10-08T17:00:00+05:30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: `${COLLEGE.college} (${COLLEGE.collegeShort})`,
      address: {
        "@type": "PostalAddress",
        streetAddress: VENUE.streetAddress,
        addressLocality: VENUE.locality,
        addressRegion: VENUE.region,
        postalCode: VENUE.postalCode,
        addressCountry: VENUE.country,
      },
      // Coordinates were missing entirely. Google resolves an address string on
      // its own, but "Guru Nanak Institute of ..." is ambiguous on this road --
      // the dental and pharmacy institutes share the campus - and an explicit
      // geo removes the guess for map placement and local results.
      geo: {
        "@type": "GeoCoordinates",
        latitude: VENUE.lat,
        longitude: VENUE.lng,
      },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${VENUE.lat},${VENUE.lng}`,
    },
    image: [
      `${siteUrl}/images/hero/hero_poster_v3.jpg`,
      `${siteUrl}/college_logo/gnitacm.png`,
      `${siteUrl}/images/brand/logo.png`,
    ],
    organizer: {
      "@type": "Organization",
      name: COLLEGE.chapter,
      alternateName: [
        "ACM GNIT",
        "GNIT ACM",
        "GNIT Kolkata ACM",
        "ACM Student Chapter",
        "Association for Computing Machinery Student Chapter",
      ],
      url: "https://gnitkolkata.acm.org/",
      sameAs: [
        "https://gnitkolkata.acm.org/",
        EVENT.devfolioUrl,
        EVENT.discordUrl,
      ],
    },
    offers: {
      "@type": "Offer",
      url: EVENT.devfolioUrl,
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01T00:00:00+05:30",
    },
    performer: {
      "@type": "Organization",
      name: COLLEGE.chapter,
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COLLEGE.chapter,
    alternateName: [
      "GNIT Kolkata ACM",
      "GNIT ACM",
      "ACM GNIT",
      "ACM Student Chapter",
      "GNIT Kolkata ACM Student Chapter",
      "GNIT ACM Student Chapter",
      "Association for Computing Machinery GNIT Chapter",
    ],
    url: "https://gnitkolkata.acm.org/",
    logo: `${siteUrl}/college_logo/gnitacm.png`,
    sameAs: [
      "https://gnitkolkata.acm.org/",
      EVENT.devfolioUrl,
      EVENT.discordUrl,
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "Association for Computing Machinery",
      alternateName: "ACM",
      url: "https://www.acm.org",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RECURSIVE — ACM Hackathon",
    alternateName: [
      "Recursive",
      "Recursive ACM",
      "RECURSIVE 2026",
      "recu",
      "recursiveacm",
      "GNIT Kolkata ACM Hackathon",
      "GNIT ACM Hackathon",
    ],
    url: siteUrl,
    description: `Official portal for ${EVENT.name} 2026, premier hackathon organized by ${COLLEGE.chapter}.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(websiteSchema) }}
      />
    </>
  );
}

/**
 * FAQ structured data, kept out of <JsonLd> on purpose.
 *
 * <JsonLd> renders from the root layout, so it is on every route; Google
 * requires FAQPage markup to describe questions that are actually visible on
 * the page carrying it, and marking up an FAQ on /prizes would be exactly the
 * mismatch that gets structured data ignored site-wide. So this is rendered by
 * the FAQ components themselves -- the markup and the visible list come from
 * the same FAQS array, and cannot drift apart.
 *
 * This is the highest-leverage schema on the site: an FAQ rich result expands
 * the entry in the SERP well beyond a plain blue link.
 */
export function FaqJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson(faqSchema) }}
    />
  );
}
