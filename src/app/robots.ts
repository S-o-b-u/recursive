import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/hidden"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/hidden"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/hidden"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
