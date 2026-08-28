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
}: {
  id?: string;
  label?: string;
  heading?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  tone?: "default" | "alt" | "deep";
}) {
  return (
    <section
      id={id}
      className={`section bg-[#0d1910] text-[#f3f8ee] relative overflow-hidden ${className}`}
      style={{
        background: "radial-gradient(130% 90% at 50% 30%, #162e1c 0%, #0d1910 100%)",
        backgroundColor: "#0d1910",
      }}
    >
      <div className="section-inner relative z-10">
        {(label || heading || lede) && (
          <Reveal>
            {label && (
              <p className="section-label text-[#a6e06a] font-mono tracking-widest text-xs uppercase mb-3">
                {label}
              </p>
            )}
            {heading && (
              typeof heading === "string" ? (
                <div className="mb-4">
                  <WarpText
                    text={heading}
                    align="left"
                    color="#f3f8ee"
                    fontSize="clamp(1.85rem, 4vw, 3rem)"
                    fontWeight={800}
                    fontFamily="var(--font-hiruko), var(--font-display), sans-serif"
                    letterSpacing="-0.025em"
                    style={{
                      width: "100%",
                      maxWidth: "40ch",
                      height: "clamp(48px, 6vw, 72px)",
                      pointerEvents: "auto",
                    }}
                  />
                </div>
              ) : (
                <h2 className="font-hiruko font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#f3f8ee] max-w-[32ch] mb-4">
                  {heading}
                </h2>
              )
            )}
            {lede && (
              <div className="font-sans text-base sm:text-lg text-[#8da488] max-w-[55ch] mb-10 leading-relaxed">
                {lede}
              </div>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

