import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RECURSIVE 2026 — ACM Hackathon",
    short_name: "RECURSIVE ACM",
    description:
      "RECURSIVE 2026 is the premier hackathon hosted by GNIT Kolkata ACM Student Chapter at Guru Nanak Institute of Technology, Kolkata.",
    start_url: "/",
    display: "standalone",
    background_color: "#010301",
    theme_color: "#0a140c",
    icons: [
      // Declare the real sizes. "any" is accepted but tells the browser
      // nothing, and Chrome wants to see a >=192px icon before it will treat
      // the site as installable.
      { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
