"use client";

import { useEffect, useRef } from "react";
import { EVENT } from "@/data/hackathon";

export interface DevfolioButtonProps {
  slug?: string;
  theme?: "light" | "dark" | "dark-inverted";
  className?: string;
  style?: React.CSSProperties;
}

// Module-level manager to coordinate script loading across multiple buttons
// and avoid duplicate SDK injections or console errors in Next.js / React 19.
let activeButtonsCount = 0;
let scriptElement: HTMLScriptElement | null = null;
let scriptLoadTimer: ReturnType<typeof setTimeout> | null = null;

function registerAndLoadScript() {
  activeButtonsCount++;

  if (scriptLoadTimer) clearTimeout(scriptLoadTimer);

  // Debounce slightly so all simultaneous button elements on the page exist in the DOM
  scriptLoadTimer = setTimeout(() => {
    // If a script element was already injected, remove it first so re-evaluation scans new elements
    if (scriptElement && document.body.contains(scriptElement)) {
      document.body.removeChild(scriptElement);
      scriptElement = null;
    }

    const pending = document.querySelectorAll(".apply-button");
    if (pending.length === 0) return;

    const script = document.createElement("script");
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    scriptElement = script;
  }, 40);
}

function unregisterAndCleanup() {
  activeButtonsCount = Math.max(0, activeButtonsCount - 1);

  if (scriptLoadTimer) clearTimeout(scriptLoadTimer);

  scriptLoadTimer = setTimeout(() => {
    if (activeButtonsCount === 0) {
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
        scriptElement = null;
      }
      const overlay = document.getElementById("devfolio-overlay-container");
      if (overlay) overlay.remove();
    }
  }, 100);
}

export default function DevfolioButton({
  slug = EVENT.devfolioSlug || "recursive",
  theme = EVENT.devfolioTheme || "light",
  className = "",
  style,
}: DevfolioButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container contents
    container.innerHTML = "";

    // Create the exact Devfolio apply-button element according to the official integration guide
    const btn = document.createElement("div");
    btn.className = "apply-button";
    btn.setAttribute("data-hackathon-slug", slug);
    btn.setAttribute("data-button-theme", theme);
    btn.style.height = "44px";
    btn.style.width = "312px";
    container.appendChild(btn);

    registerAndLoadScript();

    return () => {
      unregisterAndCleanup();
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [slug, theme]);

  return (
    <div
      ref={containerRef}
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
    />
  );
}
