"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * If anything on the stage throws, Next.js would otherwise replace the page
 * with its own error screen: a white page with one line of small text, which
 * on a smartboard across the room reads as "the site went blank". Instead,
 * stay dark, say what happened (so it can be reported), and reload by itself.
 * Reloads are counted per tab, so a fault that survives a reload stops after
 * a few tries rather than flashing forever.
 *
 * Inline styles only: this has to render even if the stylesheet is what failed.
 */
const RELOAD_IN_S = 8;
const MAX_RELOADS = 3;
const WINDOW_MS = 2 * 60 * 1000;
const KEY = "recursive:stage-error-reloads";

function reloadsSoFar(): number[] {
  try {
    const now = Date.now();
    return (JSON.parse(sessionStorage.getItem(KEY) || "[]") as number[]).filter((t) => now - t < WINDOW_MS);
  } catch {
    return [];
  }
}

export default function HiddenError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [left, setLeft] = useState(RELOAD_IN_S);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    console.error("[stage] crashed:", error);
    if (reloadsSoFar().length >= MAX_RELOADS) setAuto(false);
  }, [error]);

  useEffect(() => {
    if (!auto) return undefined;
    if (left <= 0) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify([...reloadsSoFar(), Date.now()]));
      } catch {}
      window.location.reload();
      return undefined;
    }
    const t = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(t);
  }, [auto, left]);

  const button: CSSProperties = {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "#fff",
    font: "600 14px system-ui, sans-serif",
    cursor: "pointer",
  };

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: "#0A0D0A",
        color: "#e4e4e7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 24,
        textAlign: "center",
        font: "15px system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>The countdown hit a problem</div>
      <div>{auto ? `Reloading in ${left} s…` : "It failed again after reloading. Reload when ready."}</div>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" style={button} onClick={() => window.location.reload()}>
          Reload now
        </button>
        <button type="button" style={button} onClick={() => reset()}>
          Try without reloading
        </button>
      </div>
      <code style={{ marginTop: 10, maxWidth: 720, fontSize: 12, color: "#a1a1aa", wordBreak: "break-word" }}>
        {error?.message || String(error)}
        {error?.digest ? ` (digest ${error.digest})` : ""}
      </code>
    </div>
  );
}
