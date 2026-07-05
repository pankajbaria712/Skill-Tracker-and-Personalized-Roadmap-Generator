// LearningPhilosophySection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const LearningPhilosophySection = () => {
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const { theme } = useTheme();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
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
      className={`relative px-4 py-32 transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-1/4 w-80 h-80 ${
            theme === "light"
              ? "bg-cyan-200"
              : theme === "dark"
              ? "bg-cyan-900"
              : "bg-cyan-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-80 h-80 ${
            theme === "light"
              ? "bg-purple-200"
              : theme === "dark"
              ? "bg-purple-900"
              : "bg-purple-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse`}
        ></div>
      </div>

      {/* Quote Card */}
      <div
        ref={quoteRef}
        className="max-w-4xl mx-auto relative z-10 text-center"
      >
        {/* Decorative Quote Marks */}
        <div className="mb-8">
          <svg
            className="w-16 h-16 mx-auto text-cyan-400 opacity-30"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-2.5-7-2.5-3.5 0-7 1.5-7 4v11c0 2 1 4 3 5 1 0 1.5-1 1.5-1s-1.5-4-1.5-6V6c1 1 2 2 5 2 3.5 0 7-1 7-4V5c0 1-2 4-7 4s-7-2-7-2v2c0 4 3 6 5 6m12 0c3 0 7-1 7-8V5c0-1.25-4.716-2.5-7-2.5-3.5 0-7 1.5-7 4v11c0 2 1 4 3 5 1 0 1.5-1 1.5-1s-1.5-4-1.5-6V6c1 1 2 2 5 2 3.5 0 7-1 7-4V5c0 1-2 4-7 4s-7-2-7-2v2c0 4 3 6 5 6z" />
          </svg>
        </div>

        {/* Quote Text */}
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight ${
            theme === "light"
              ? "text-gray-900"
              : theme === "dark"
              ? "text-white"
              : "text-white"
          }`}
        >
          Learning isn't about completing courses. It's about consistently
          building{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            skills that create opportunities
          </span>
          .
        </h2>

        {/* Attribution */}
        <p className={`text-xl md:text-2xl ${themeColors.textSecondary}`}>
          — Skill Tracker Philosophy
        </p>

        {/* Supporting Statement */}
        <div
          className={`mt-12 p-8 rounded-xl backdrop-blur-md border transition-all duration-500 hover:shadow-lg ${
            theme === "light"
              ? "bg-white/40 border-gray-300/30"
              : theme === "dark"
              ? "bg-gray-900/30 border-gray-700/30"
              : "bg-[#1a1a40]/40 border-purple-500/20"
          }`}
        >
          <p className={`text-lg leading-relaxed ${themeColors.textSecondary}`}>
            We believe that true mastery comes from{" "}
            <span className="font-semibold text-cyan-400">consistency</span>,
            {" "}
            <span className="font-semibold text-cyan-400">focus</span>, and a
            {" "}
            <span className="font-semibold text-cyan-400">clear roadmap</span>.
            That's why we built Skill Tracker—to help you transform your
            learning goals into tangible, measurable progress.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LearningPhilosophySection;
