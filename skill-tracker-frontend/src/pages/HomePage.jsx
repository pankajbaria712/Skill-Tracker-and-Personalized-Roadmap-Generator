// src/pages/HomePage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import Footer from "../components/home/Footer";
import ProblemSection from "../components/home/ProblemSection";
import TestimonialSection from "../components/home/TestimonialSection";
import CallToActionSection from "../components/home/CallToActionSection";
import { useTheme } from "../components/ThemeProvider";
import TargetCursor from "../components/Animations/TargetCursor/TargetCursor";
import ScrollVelocity from "../components/Animations/ScrollVelocity/ScrollVelocity";

export default function HomePage() {
  const { theme, getActualTheme } = useTheme();
  const velocity = 100;
  // Get the actual theme that should be applied
  const isDark = getActualTheme() === "dark";

  // Get background based on theme
  const getBackground = () => {
    if (theme === "system") {
      return "bg-[#18153f]";
    } else if (theme === "dark") {
      return "bg-black";
    } else {
      return "bg-white";
    }
  };

  // Get text color based on theme
  const getTextColor = () => {
    if (theme === "system" || theme === "dark") {
      return "text-white";
    } else {
      return "text-gray-900";
    }
  };

  return (
    <div
      className={`relative  ${getBackground()} ${getTextColor()} transition-all duration-500`}
    >
      <TargetCursor />

      {/* If Navbar is fixed/sticky, keep it OUTSIDE the scroll container */}
      <Navbar />

      {/* Main Content Container */}
      <div className="relative" id="scroll-container">
        <HeroSection />
        <ScrollVelocity
          texts={["React Bits", "Scroll Down"]}
          velocity={velocity}
          className="custom-scroll-text"
        />
        <ProblemSection />

        <FeaturesSection />
        <TestimonialSection />
        <CallToActionSection />
        <Footer />
      </div>
    </div>
  );
}
