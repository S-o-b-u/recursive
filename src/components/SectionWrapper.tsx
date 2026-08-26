import { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Shared section chrome: id anchor, rhythm, label + heading, optional lede.
 */
export default function SectionWrapper({
  id,
  label,
  heading,
  lede,
  children,
  className = "",
  tone = "default",
}: {
  id?: string;
  label?: string;
  heading?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  tone?: "default" | "alt" | "deep";
}) {
  const bg =
    tone === "alt"
      ? "bg-[var(--color-bg-alt)]"
      : tone === "deep"
        ? "bg-[var(--color-bg-deep)] text-[#EFF3EB]"
        : "";

  return (
    <section id={id} className={`section ${bg} ${className}`}>
      <div className="section-inner">
        {(label || heading || lede) && (
          <Reveal>
            {label && <p className="section-label">{label}</p>}
            {heading && <h2 className="section-heading">{heading}</h2>}
            {lede && <div className="body-text mb-[var(--space-block)]">{lede}</div>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
