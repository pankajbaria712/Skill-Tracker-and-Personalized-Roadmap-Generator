// AboutFeaturesSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

// Icon imports (reuse existing icons)
import SlidersVertical from "../icons/SlidersVertical";
import ChartNoAxes from "../icons/ChartNoAxes";
import CheckCheck from "../icons/CheckCheck";
import Rocket from "../icons/Rocket";
import Annoyed from "../icons/Annoyed";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: SlidersVertical,
    title: "AI-Powered Roadmap Generation",
    text: "Generate personalized learning roadmaps powered by advanced AI algorithms.",
  },
  {
    icon: ChartNoAxes,
    title: "Skill Progress Tracking",
    text: "Monitor your learning progress with visual charts and detailed analytics.",
  },
  {
    icon: CheckCheck,
    title: "Interactive Dashboard",
    text: "Manage your skills and view your roadmap in one beautiful dashboard.",
  },
  {
    icon: Rocket,
    title: "Personalized Learning Paths",
    text: "Get learning recommendations tailored to your current level and goals.",
  },
  {
    icon: Annoyed,
    title: "Authentication & Secure Data",
    text: "Your data is secure with Firebase authentication and encryption.",
  },
  {
    icon: SlidersVertical,
    title: "Responsive Design",
    text: "Access your learning journey on any device with our mobile-first design.",
  },
];

const AboutFeaturesSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    const featureCards = gsap.utils.toArray(".feature-card-about");

    featureCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative px-4 py-24 transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 right-10 w-80 h-80 ${
            theme === "light"
              ? "bg-cyan-200"
              : theme === "dark"
              ? "bg-cyan-900"
              : "bg-cyan-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${themeColors.textSecondary}`}>
            Everything you need to master your learning journey
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="feature-card-about group relative p-6 rounded-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-target"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(255, 255, 255, 0.8)"
                      : theme === "dark"
                      ? "rgba(30, 30, 30, 0.4)"
                      : "rgba(26, 26, 64, 0.5)",
                  border:
                    theme === "light"
                      ? "1px solid rgba(200, 200, 200, 0.3)"
                      : theme === "dark"
                      ? "1px solid rgba(100, 100, 100, 0.3)"
                      : "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
                  </div>

                  <h3 className={`text-xl font-bold mb-3 ${themeColors.textPrimary}`}>
                    {feature.title}
                  </h3>

                  <p className={`text-sm leading-relaxed ${themeColors.textSecondary}`}>
                    {feature.text}
                  </p>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 w-0 group-hover:w-full transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutFeaturesSection;
