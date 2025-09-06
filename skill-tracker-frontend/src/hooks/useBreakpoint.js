// src/hooks/useBreakpoint.js
import { useState, useEffect } from "react";

/**
 * useBreakpoint
 * Returns current width and simple booleans for common breakpoints.
 */
export default function useBreakpoint() {
  const getWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 1200;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isDesktop: width >= 768,
  };
}
