import { useLayoutEffect, type RefObject } from "react";

/** Reveals major sections once, without making their content depend on animation. */
export function useScrollReveal(
  rootRef: RefObject<HTMLElement | null>,
  refreshKey: string,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      for (const node of nodes) node.dataset.revealState = "visible";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.revealState = "visible";
          observer.unobserve(element);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -24px 0px" },
    );

    for (const node of nodes) {
      if (node.dataset.revealState === "visible") continue;
      node.dataset.revealState = "pending";
      observer.observe(node);
    }

    function revealFocused(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      const node = event.target.closest<HTMLElement>(
        "[data-scroll-reveal][data-reveal-state='pending']",
      );
      if (!node || !root?.contains(node)) return;
      node.dataset.revealInstant = "true";
      node.dataset.revealState = "visible";
      observer.unobserve(node);
    }

    root.addEventListener("focusin", revealFocused);
    return () => {
      root.removeEventListener("focusin", revealFocused);
      observer.disconnect();
    };
  }, [rootRef, refreshKey]);
}
