import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth = !prefersReduced;

    // Do not interfere with browser back/forward (POP) which should preserve scroll
    if (navigationType === "POP") return;

    const headerOffsetRaw = getComputedStyle(document.documentElement).getPropertyValue("--scroll-offset") || "0px";
    const headerOffset = parseInt(headerOffsetRaw.replace("px", "")) || 0;

    // If there's a hash, attempt to scroll to that element
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Use Lenis if available
        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          try {
            window.lenis.scrollTo(el, { offset: -headerOffset, immediate: !smooth });
          } catch (e) {
            el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
            if (headerOffset) window.scrollBy(0, -headerOffset);
          }
        } else {
          el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
          if (headerOffset) window.scrollBy(0, -headerOffset);
        }
      }
      return;
    }

    // No hash -> scroll to top on route change
    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      try {
        window.lenis.scrollTo(0, { immediate: !smooth });
      } catch (e) {
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    }
  }, [location.pathname, location.hash, navigationType]);

  return null;
}
