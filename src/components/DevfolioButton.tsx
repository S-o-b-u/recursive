"use client";

import { useEffect, useRef } from "react";
import { EVENT } from "@/data/hackathon";

export interface DevfolioButtonProps {
  slug?: string;
  theme?: "light" | "dark" | "dark-inverted";
  className?: string;
  style?: React.CSSProperties;
}

/** Minimal escape for a value interpolated into a double-quoted HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function DevfolioButton({
  slug = EVENT.devfolioSlug || "recursiveacm",
  theme = EVENT.devfolioTheme || "light",
  className = "",
  style,
}: DevfolioButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Devfolio's SDK dynamically transforms the .apply-button container into
   * an <iframe>. When the SDK script in layout.tsx executes before or during
   * initial page hydration, React's reconciler would otherwise observe an
   * <iframe> where it expected a <div> and throw a Hydration Mismatch error.
   *
   * By rendering .apply-button via dangerouslySetInnerHTML + suppressHydrationWarning:
   * 1. The server renders the exact <div class="apply-button"> for Devfolio's crawler.
   * 2. React treats the inner DOM as externally managed and does not diff the child iframe.
   * 3. For client-side route transitions, this effect ensures the SDK script is present.
   */
  useEffect(() => {
    if (containerRef.current?.querySelector("iframe")) return;

    const existing = document.querySelector(
      'script[src="https://apply.devfolio.co/v2/sdk.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://apply.devfolio.co/v2/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`devfolio-button-wrapper ${className}`.trim()}
      suppressHydrationWarning
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        width: "312px",
        maxWidth: "100%",
        ...style,
      }}
      dangerouslySetInnerHTML={{
        // Both values are constants from EVENT today and no call site overrides
        // them, so nothing attacker-controlled reaches this. But they are props:
        // the day someone wires a slug in from a query param, this becomes an
        // HTML injection with no other guard in front of it. Escaping costs
        // nothing and removes the question.
        __html: `<div class="apply-button" data-hackathon-slug="${attr(slug)}" data-button-theme="${attr(theme)}" style="height:44px;width:312px"></div>`,
      }}
    />
  );
}