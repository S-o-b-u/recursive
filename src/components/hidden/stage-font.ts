import { Inter_Tight } from "next/font/google";

/**
 * The grotesque of the wordmark's "SHIFT-8" / "HACKATHON" lines, for the stage's
 * text. Loaded here rather than in the root layout so only /hidden pays for it.
 */
export const stageSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-stage",
  display: "swap",
});
