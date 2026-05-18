"use client";

import { useEffect } from "react";

/**
 * Mounts once and watches every [data-reveal] in the document. When an
 * element scrolls into the viewport, sets data-reveal="in" which triggers
 * the CSS transition defined in globals.css. Self-contained, no per-component
 * wiring needed.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.setAttribute("data-reveal", "in"));
      return;
    }

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (el.getAttribute("data-reveal") === "in") return;
        observer.observe(el);
      });
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
