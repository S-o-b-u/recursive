import React from "react";

/**
 * Ornament — botanical section divider rendered above section headings.
 * Uses /images/artifact.png across all pages and sections.
 */
export default function Ornament({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "night";
}) {
  return (
    <img
      src="/images/artifact.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`orn orn-${tone} ${className}`.trim()}
      style={{
        display: "block",
        objectFit: "contain",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}
