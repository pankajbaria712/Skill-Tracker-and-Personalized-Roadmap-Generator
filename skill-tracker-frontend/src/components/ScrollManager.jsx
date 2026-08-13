import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    function updateOffset() {
      try {
        const header = document.querySelector("header");
        const height = header ? Math.ceil(header.getBoundingClientRect().height) : 72;
        document.documentElement.style.setProperty("--scroll-offset", `${height}px`);
      } catch (e) {
        document.documentElement.style.setProperty("--scroll-offset", `72px`);
      }
    }

    updateOffset();
    // update on resize
    window.addEventListener("resize", updateOffset, { passive: true });

    // observe header size changes (e.g., responsive nav)
    const header = document.querySelector("header");
    let ro;
    if (header && window.ResizeObserver) {
      ro = new ResizeObserver(updateOffset);
      ro.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateOffset);
      if (ro && header) ro.unobserve(header);
    };
  }, []);

  return null;
}
