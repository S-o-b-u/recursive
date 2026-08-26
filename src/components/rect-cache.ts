/**
 * Cached bounding rect for pointer maths.
 *
 * Reading getBoundingClientRect() inside a pointermove handler forces layout on
 * every mouse event, which is exactly the kind of thing that turns a smooth
 * cursor effect into a stuttering one. Cache it and refresh only when the page
 * actually moves: scroll, resize, or the element itself changing size.
 */
export interface RectCache {
  readonly current: DOMRect;
  refresh(): void;
  destroy(): void;
}

export function createRectCache(element: Element): RectCache {
  let rect = element.getBoundingClientRect();

  const refresh = () => {
    rect = element.getBoundingClientRect();
  };

  // capture: true so scrolling containers (not just the window) invalidate too.
  window.addEventListener("scroll", refresh, { passive: true, capture: true });
  window.addEventListener("resize", refresh, { passive: true });

  const observer = new ResizeObserver(refresh);
  observer.observe(element);

  return {
    get current() {
      return rect;
    },
    refresh,
    destroy() {
      window.removeEventListener("scroll", refresh, { capture: true });
      window.removeEventListener("resize", refresh);
      observer.disconnect();
    },
  };
}
