// src/pages/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import AboutHeroSection from "../components/About/AboutHeroSection";
import MissionSection from "../components/About/MissionSection";
import AboutFeaturesSection from "../components/About/AboutFeaturesSection";
import WhyChooseUsSection from "../components/About/WhyChooseUsSection";
import DeveloperProfileSection from "../components/About/DeveloperProfileSection";
import TechnologiesSection from "../components/About/TechnologiesSection";
// import StatisticsSection from "../components/About/StatisticsSection";
import LearningPhilosophySection from "../components/About/LearningPhilosophySection";
import AboutCTASection from "../components/About/AboutCTASection";
import { useTheme } from "../components/ThemeProvider";
import TargetCursor from "../components/Animations/TargetCursor/TargetCursor";
import ScrollVelocity from "../components/Animations/ScrollVelocity/ScrollVelocity";

export default function AboutPage() {
  const { theme } = useTheme();

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
      className={`relative ${getBackground()} ${getTextColor()} transition-all duration-500`}
    >
      <TargetCursor />
      <Navbar />

      <div className="relative" id="scroll-container">
        <AboutHeroSection />

        <ScrollVelocity
          texts={["Track Skills", "Learn Better", "Grow Faster"]}
          velocity={100}
          className="custom-scroll-text"
        />

        <MissionSection />
        <AboutFeaturesSection />
        <WhyChooseUsSection />
        <DeveloperProfileSection />
        <TechnologiesSection />
        <LearningPhilosophySection />
        <AboutCTASection />
        <Footer />
      </div>
    </div>
  );
}
