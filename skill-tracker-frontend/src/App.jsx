import React, { useEffect, useState } from "react"; // Added useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";
import TemplatesPage from "./pages/TemplatesPage";
import ActivityPage from "./pages/ActivityPage";
import AboutPage from "./pages/AboutPage";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute"; // NEW
import Lenis from "lenis";
import Preloader from "./components/Preloader"; // <-- Added Preloader import

function App() {
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Initialize global smooth scrolling if not already initialized
    if (!window.lenis) {
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
        window.lenis.destroy();
        window.lenis = null;
      }
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <Preloader />; // Show preloader while loading

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/TemplatesPage" element={<TemplatesPage />} />
          <Route path="/ActivityPage" element={<ActivityPage />} />
          <Route path="/AboutPage" element={<AboutPage />} />

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
  );
}

export default App;
