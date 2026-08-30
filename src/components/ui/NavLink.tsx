"use client";

import Link from "next/link";
import {
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

/**
 * NavLink — a nav item with a Register-button-flavoured hover: a liquid outline
 * that lights up and spins around the pill (animated conic-gradient border) and
 * ripples like liquid (SVG turbulence displacement, filter `#nav-wave` defined
 * once in Navigation). Click adds a quick faster spin plus a ripple from the
 * pointer.
 *
 * Hover / focus are tracked in state (class `is-hovered`) rather than left to
 * CSS `:hover` alone, so the same effect fires for pointer, keyboard, and the
 * brand mark. Falls back to a plain outline where `@property` / SVG filters
 * aren't supported, and goes static under prefers-reduced-motion.
 *
 * Pass `label` for a plain text item, or `children` (+ `className`) to wrap
 * arbitrary content such as the brand mark.
 */

import { triggerScrollExpand } from "@/lib/scroll-expand";

type Ripple = { x: number; y: number; id: number };

export default function NavLink({
  href,
  label,
  children,
  className = "nav-link",
  ariaLabel,
}: {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const elRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    setTapped(true);
    window.setTimeout(() => setTapped(false), 520);

    const el = elRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const rip = { x: e.clientX - r.left, y: e.clientY - r.top, id: idRef.current++ };
      setRipples((p) => [...p, rip]);
      window.setTimeout(
        () => setRipples((p) => p.filter((x) => x.id !== rip.id)),
        640,
      );
    }

    // Direct Automatic Scroll Expand on navbar item click
    const isSamePage = typeof window !== "undefined" && (
      href.startsWith("#") ||
      (href.startsWith("/#") && window.location.pathname === "/") ||
      (href === "/" && window.location.pathname === "/")
    );

    if (isSamePage) {
      const hash = href === "/" ? "#hero" : href.startsWith("/#") ? href.slice(1) : href;
      const target = document.querySelector<HTMLElement>(hash) || (hash === "#hero" ? document.body : null);
      if (target) {
        e.preventDefault();
        triggerScrollExpand(target);
        if (hash !== "#hero") window.history.pushState(null, "", hash);
        else window.history.pushState(null, "", "/");
      }
    }
  };

  const cls = [
    className,
    hovered ? "is-hovered" : "",
    tapped ? "is-tapped" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      ref={elRef}
      href={href}
      aria-label={ariaLabel}
      className={cls}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e: FocusEvent) => {
        if (e.currentTarget.matches(":focus-visible")) setHovered(true);
      }}
      onBlur={() => setHovered(false)}
    >
      <span className="nav-link-body">
        {children ?? <span className="nav-link-txt">{label}</span>}
      </span>
      <span className="nav-link-ring" aria-hidden="true" />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="nav-link-ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
          aria-hidden="true"
        />
      ))}
    </Link>
  );
}
