// MissionSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const { theme } = useTheme();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative px-4 py-24 transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${
            theme === "light"
              ? "bg-purple-200"
              : theme === "dark"
              ? "bg-purple-900"
              : "bg-purple-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Card with Glassmorphism Effect */}
        <div
          ref={cardRef}
          className={`relative p-8 md:p-12 rounded-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl group overflow-hidden ${
            theme === "light"
              ? "bg-white/80 border border-gray-200/50 shadow-lg"
              : theme === "dark"
              ? "bg-gray-900/40 border border-gray-700/50 shadow-xl"
              : "bg-[#1a1a40]/60 border border-purple-500/20 shadow-2xl"
          }`}
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative z-10">
            <p
              className={`text-lg md:text-xl leading-relaxed ${themeColors.textPrimary}`}
            >
              Our mission is to make learning more{" "}
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                structured
              </span>
              ,{" "}
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                personalized
              </span>
              , and{" "}
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                goal-oriented
              </span>
              . Instead of feeling overwhelmed by endless tutorials, learners
              receive a clear roadmap tailored to their goals, helping them stay
              focused and motivated on their path to mastery.
            </p>

            {/* Icons Row */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className={`font-semibold ${themeColors.textSecondary}`}>
                  Structured Learning
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className={`font-semibold ${themeColors.textSecondary}`}>
                  AI-Personalized
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className={`font-semibold ${themeColors.textSecondary}`}>
                  Goal-Oriented
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
