"use client";

import { useEffect } from "react";
import { EVENT } from "@/data/hackathon";

export interface DevfolioButtonProps {
  slug?: string;
  theme?: "light" | "dark" | "dark-inverted";
  className?: string;
  style?: React.CSSProperties;
}

export default function DevfolioButton({
  slug = EVENT.devfolioSlug || "recursiveacm",
  theme = EVENT.devfolioTheme || "light",
  className = "",
  style,
}: DevfolioButtonProps) {
  /**
   * Devfolio's official React SDK loading pattern (from their documentation):
   * https://guide.devfolio.co/docs/guide/apply-with-devfolio-integration
   *
   * The SDK script is also injected as a plain <script> in the root layout
   * <head> so it appears in SSR HTML and is visible to Devfolio's verification
   * crawler. This useEffect ensures the SDK re-initialises if the component
   * mounts in a client-side navigation context where the head script may have
   * already executed without seeing this button element.
   */
  useEffect(() => {
    // Skip if SDK script is already present in the document (injected by layout)
    const existing = document.querySelector(
      'script[src="https://apply.devfolio.co/v2/sdk.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={`devfolio-button-wrapper ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        width: "312px",
        maxWidth: "100%",
        ...style,
      }}
    >
      <div
        className="apply-button"
        data-hackathon-slug={slug}
        data-button-theme={theme}
        style={{ height: "44px", width: "312px" }}
      />
    </div>
  );
}