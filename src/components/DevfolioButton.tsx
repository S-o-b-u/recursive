"use client";

import { useEffect, useRef, useState } from "react";
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
  const slotRef = useRef<HTMLDivElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const directDevfolioUrl =
    EVENT.devfolioUrl || `https://${slug}.devfolio.co`;

  /**
   * Devfolio's SDK dynamically transforms the .apply-button container into
   * an <iframe>. In Next.js App Router (streaming SSR, route transitions, and client hydration):
   *
   * 1. If the SDK script executes before the component mounts or during client route transitions,
   *    Devfolio's one-time IIFE fails to find .apply-button and dies permanently.
   * 2. If an adblocker blocks Devfolio's SDK, or if network connectivity is slow, the button would
   *    otherwise be an invisible, empty 44px gap.
   *
   * Solution:
   * 1. Render an authentic, native Devfolio button immediately as the base layer. It is immediately
   *    visible, interactive, and opens the hackathon's verified Devfolio page.
   * 2. Keep the official <div class="apply-button"> inside the slot for Devfolio's crawler verification.
   * 3. Dynamically re-trigger the Devfolio SDK on mount / route transition if no iframe exists yet.
   * 4. Once the Devfolio iframe is ready, it smoothly activates on top and provides the in-page modal.
   */
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    // Check if iframe already exists in this slot
    if (slot.querySelector("iframe")) {
      setIframeReady(true);
      return;
    }

    // Observer to detect when Devfolio transforms the element into an iframe
    const observer = new MutationObserver(() => {
      if (slot.querySelector("iframe")) {
        setIframeReady(true);
      }
    });
    observer.observe(slot, { childList: true, subtree: true });

    // Listen to Devfolio's postMessage notifications
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "BUTTON_IFRAME_LOADED") {
        setIframeReady(true);
      }
    };
    window.addEventListener("message", onMessage);

    // Function to ensure Devfolio SDK executes
    const ensureSDK = () => {
      if (slot.querySelector("iframe")) {
        setIframeReady(true);
        return;
      }

      // Ensure the placeholder exists inside the slot if React re-render removed it
      if (!slot.querySelector(".apply-button")) {
        const placeholder = document.createElement("div");
        placeholder.className = "apply-button";
        placeholder.setAttribute("data-hackathon-slug", slug);
        placeholder.setAttribute("data-button-theme", theme);
        placeholder.style.height = "44px";
        placeholder.style.width = "312px";
        slot.appendChild(placeholder);
      }

      // Remove any stale script tags so browser executes a fresh run
      const existingScript = document.querySelector(
        'script[src="https://apply.devfolio.co/v2/sdk.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Inject fresh Devfolio SDK script
      const script = document.createElement("script");
      script.src = "https://apply.devfolio.co/v2/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    // Run SDK initialization
    const timer = setTimeout(ensureSDK, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [slug, theme]);

  return (
    <div
      ref={containerRef}
      className={`devfolio-button-wrapper ${className}`.trim()}
      suppressHydrationWarning
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        height: "44px",
        width: "312px",
        maxWidth: "100%",
        ...style,
      }}
    >
      {/* ── Native Devfolio Fallback: Always visible instantly, never empty or broken ── */}
      <a
        href={directDevfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="devfolio-fallback-button"
        aria-label="Apply with Devfolio"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: theme === "dark" ? "#27333f" : "#3770ff",
          borderRadius: "4px",
          color: "#ffffff",
          fontFamily: "'Nunito Sans', var(--font-dm-sans), system-ui, sans-serif",
          fontSize: "18px",
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(55, 112, 255, 0.32)",
          transition: "background-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
          zIndex: 1,
          pointerEvents: iframeReady ? "none" : "auto",
        }}
      >
        <svg
          className="devfolio-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 115.46 123.46"
          fill="#ffffff"
          width="22"
          height="22"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M115.46 68a55.43 55.43 0 0 1-50.85 55.11S28.12 124 16 123a12.6 
              12.6 0 0 1-10.09-7.5 15.85 15.85 0 0 0 5.36 1.5c4 .34 10.72.51 20.13.51 
              13.82 0 28.84-.38 29-.38h.26a60.14 60.14 0 0 0 54.72-52.47c.05 1.05.08 
              2.18.08 3.34z"
          />
          <path
            d="M110.93 55.87A55.43 55.43 0 0 1 60.08 111s-36.48.92-48.58-.12C5 110.29.15 
              104.22 0 97.52l.2-83.84C.38 7 5.26.94 11.76.41c12.11-1 48.59.12 48.59.12a55.41 
              55.41 0 0 1 50.58 55.34z"
          />
        </svg>
        <span>Apply with Devfolio</span>
      </a>

      {/* ── Devfolio SDK Target Slot: Houses the official crawler div & transformed iframe ── */}
      <div
        ref={slotRef}
        className="devfolio-sdk-slot"
        suppressHydrationWarning
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: iframeReady ? 1 : 0,
          pointerEvents: iframeReady ? "auto" : "none",
          transition: "opacity 180ms ease",
        }}
        dangerouslySetInnerHTML={{
          __html: `<div class="apply-button" data-hackathon-slug="${attr(slug)}" data-button-theme="${attr(theme)}" style="height:44px;width:312px"></div>`,
        }}
      />

      <style jsx global>{`
        .devfolio-button-wrapper:hover .devfolio-fallback-button {
          background-color: #2b61eb !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(55, 112, 255, 0.45) !important;
        }
        .devfolio-button-wrapper:active .devfolio-fallback-button {
          transform: scale(0.98);
        }
        .devfolio-button-iframe {
          max-width: 100% !important;
          border-radius: 4px !important;
        }
        .devfolio-sdk-slot iframe {
          max-width: 100% !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
}