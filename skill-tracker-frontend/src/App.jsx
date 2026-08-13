import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";
import TemplatesPage from "./pages/TemplatesPage";
import ActivityPage from "./pages/ActivityPage";
import AboutPage from "./pages/AboutPage";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Lenis from "lenis";
import ScrollManager from "./components/ScrollManager";
import ScrollToTop from "./components/ScrollToTop";
import Preloader from "./components/Preloader";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize global smooth scrolling with Lenis unless user prefers reduced motion
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced && !window.lenis) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        // allow Lenis to handle anchor links
        anchors: true,
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      window.lenis = lenis;
    }

    // Simulate loading duration for preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds preloader

    return () => {
      // Cleanup on unmount
      if (window.lenis) {
        try {
          window.lenis.destroy();
        } catch (e) {}
        window.lenis = null;
      }
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <Preloader />;

  return (
    <>
      <ThemeProvider>
        <ScrollManager />
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <ActivityPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />

            {/* Protected route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>

      <Analytics />
    </>
  );
}

export default App;
