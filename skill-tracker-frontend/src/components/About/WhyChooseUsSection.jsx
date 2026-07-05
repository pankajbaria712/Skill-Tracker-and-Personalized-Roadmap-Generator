// WhyChooseUsSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  "Track learning progress",
  "Stay consistent",
  "Build career-ready skills",
  "Learn with structured roadmaps",
  "Visualize achievements",
  "Stay motivated",
];

const WhyChooseUsSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    const items = gsap.utils.toArray(".benefit-item");

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/3 -left-40 w-96 h-96 ${
            theme === "light"
              ? "bg-blue-300"
              : theme === "dark"
              ? "bg-blue-900"
              : "bg-blue-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
        <div
          className={`absolute bottom-1/4 -right-40 w-96 h-96 ${
            theme === "light"
              ? "bg-purple-300"
              : theme === "dark"
              ? "bg-purple-900"
              : "bg-purple-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Why Choose Skill Tracker?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${themeColors.textSecondary}`}>
            Unlock your potential with our comprehensive learning platform
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-item group flex items-start gap-4 p-6 rounded-xl backdrop-blur-md transition-all duration-500 hover:shadow-lg cursor-target"
              style={{
                background:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.6)"
                    : theme === "dark"
                    ? "rgba(40, 40, 40, 0.4)"
                    : "rgba(26, 26, 64, 0.4)",
                border:
                  theme === "light"
                    ? "1px solid rgba(200, 200, 200, 0.3)"
                    : theme === "dark"
                    ? "1px solid rgba(100, 100, 100, 0.3)"
                    : "1px solid rgba(139, 92, 246, 0.15)",
              }}
            >
              {/* Checkmark Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className={`font-semibold text-lg ${themeColors.textPrimary}`}>
                  {benefit}
                </p>
              </div>

              {/* Hover Line */}
              <div className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 p-8 rounded-2xl backdrop-blur-xl border"
          style={{
            background:
              theme === "light"
                ? "rgba(255, 255, 255, 0.5)"
                : theme === "dark"
                ? "rgba(30, 30, 30, 0.3)"
                : "rgba(26, 26, 64, 0.3)",
            borderColor:
              theme === "light"
                ? "rgba(200, 200, 200, 0.3)"
                : theme === "dark"
                ? "rgba(100, 100, 100, 0.3)"
                : "rgba(139, 92, 246, 0.2)",
          }}
        >
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Real Progress. Real Results.
          </h3>
          <p className={`text-lg leading-relaxed ${themeColors.textSecondary}`}>
            Every learner is unique, and so is their path to mastery. Our AI learns
            your pace, style, and goals to create a truly personalized experience.
            Track every milestone, celebrate every win, and transform your learning
            journey into a sustainable habit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
