/**
 * Starts and stops the nav's SMIL turbulence animations on demand.
 *
 * The two <animate> elements under #nav-wave / #nav-wave-txt drive a
 * feTurbulence baseFrequency -- the ripple a nav item shows while hovered or
 * tapped. That attribute is not CSS-animatable, so SMIL is the only way to
 * do it. But an SMIL animation with repeatCount="indefinite" ticks on every
 * frame from page load, whether or not any element is being filtered: the
 * document never goes idle, and Chrome schedules a frame for it forever.
 * (DevTools flags exactly this as "consider CSS animations".)
 *
 * So they are declared begin="indefinite" and run only while at least one
 * nav item is hovered or mid-tap. Ref-counted, because two items can be in
 * those states at once (a tap ripple outlives the pointer leaving).
 */
let holders = 0;

const animations = () =>
  typeof document === "undefined"
    ? []
    : Array.from(
        document.querySelectorAll<SVGAnimateElement>(
          "#nav-wave animate, #nav-wave-txt animate",
        ),
      );

export function acquireNavWave() {
  holders += 1;
  if (holders !== 1) return;
  for (const a of animations()) {
    try {
      a.beginElement();
    } catch {}
  }
}

export function releaseNavWave() {
  holders = Math.max(0, holders - 1);
  if (holders !== 0) return;
  for (const a of animations()) {
    try {
      a.endElement();
    } catch {}
  }
}
