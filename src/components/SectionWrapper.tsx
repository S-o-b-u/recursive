import { ReactNode } from "react";
import Reveal from "./Reveal";
import WarpText from "./ui/WarpText";

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

  const headingColor = tone === "deep" ? "#EFF3EB" : "#16241A";

  return (
    <section id={id} className={`section ${bg} ${className}`}>
      <div className="section-inner">
        {(label || heading || lede) && (
          <Reveal>
            {label && <p className="section-label">{label}</p>}
            {heading && (
              typeof heading === "string" ? (
                <div className="mb-[var(--space-element)]">
                  <WarpText
                    text={heading}
                    align="left"
                    color={headingColor}
                    fontSize="clamp(1.75rem, 3.8vw, 2.75rem)"
                    fontWeight={350}
                    fontFamily="var(--font-display), Georgia, serif"
                    letterSpacing="-0.03em"
                    style={{
                      width: "100%",
                      maxWidth: "40ch",
                      height: "clamp(46px, 5.5vw, 68px)",
                      pointerEvents: "auto",
                    }}
                  />
                </div>
              ) : (
                <h2 className="section-heading">{heading}</h2>
              )
            )}
            {lede && <div className="body-text mb-[var(--space-block)]">{lede}</div>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
