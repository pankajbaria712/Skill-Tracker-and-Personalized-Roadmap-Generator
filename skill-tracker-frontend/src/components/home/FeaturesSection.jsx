// FeatureSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

// ✅ Icon imports
import SlidersVertical from "../icons/SlidersVertical";
import ChartNoAxes from "../icons/ChartNoAxes";
import CheckCheck from "../icons/CheckCheck";
import Rocket from "../icons/Rocket";
import Annoyed from "../icons/Annoyed";

// ✅ Features list
const features = [
  {
    icon: SlidersVertical,
    title: "Goal-Oriented Pathways",
    text: "Forget scattered learning. Get a clear, step-by-step roadmap tailored to your specific mastery goals.",
    problemSolved: "Lacks the Full Picture",
  },
  {
    icon: ChartNoAxes,
    title: "Intelligent Progress Tracking",
    text: "Our AI remembers every concept you've mastered, ensuring seamless continuity and personalized next steps.",
    problemSolved: "Forgets Your Progress",
  },
  {
    icon: CheckCheck,
    title: "Milestone Motivation",
    text: "Celebrate every win! Unlock achievements and visualize your progress, keeping your motivation high.",
    problemSolved: "No Motivation Boost",
  },
  {
    icon: Rocket,
    title: "Focused Deep Dives",
    text: "Explore complex topics with AI that keeps you aligned with your core learning objectives.",
    problemSolved: "Loses Focus in Details",
  },
  {
    icon: Annoyed,
    title: "Personalized AI Tutoring",
    text: "Get real-time, context-aware assistance tailored to your learning style, whenever you need it.",
  },
];

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    const featureBoxes = gsap.utils.toArray(".feature-box");

    featureBoxes.forEach((box) => {
      gsap.fromTo(
        box,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    gsap.fromTo(
      ".feature-intro",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        duration: 1,
        scrollTrigger: {
          trigger: ".feature-intro",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.to(".feature-blob-purple", {
      rotation: 360,
      x: "-=50",
      y: "+=50",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".feature-blob-blue", {
      rotation: -360,
      x: "+=50",
      y: "-=50",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative px-4 py-20 overflow-hidden transition-all duration-500 ${themeColors.background}`}
    >
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          className={`feature-blob-purple absolute top-[10%] left-[5%] w-72 h-72 ${
            themeColors.blobColors?.primary || "bg-purple-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
        <div
          className={`feature-blob-blue absolute bottom-[10%] right-[5%] w-72 h-72 ${
            themeColors.blobColors?.secondary || "bg-blue-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Intro */}
        <div className="feature-intro text-center mb-16 max-w-3xl mx-auto">
          <span
            className={`cursor-target text-sm px-3 py-1 rounded-full inline-block font-medium mb-4 transition-all duration-500 ${
              theme === "system"
                ? "bg-[#292f73] text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            Our Solution
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl">
            Unlock True Mastery with Roadmap Tracker
          </h2>
          <p
            className={`text-lg md:text-xl font-light transition-colors duration-500 ${themeColors.textSecondary}`}
          >
            Beyond generic AI, our platform provides the structure, insights,
            and motivation you need to genuinely master any skill.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-box hover:bg-opacity-80 transition-all duration-300 rounded-xl p-8 shadow-lg flex flex-col items-start text-left cursor-target transition-all duration-500 ${
                theme === "system"
                  ? "bg-[#1a1a36] hover:bg-[#222255]"
                  : theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {/* ✅ Render icon properly */}
              <div
                className={`text-4xl p-2 rounded-full border-2 flex-shrink-0 transition-all duration-500 ${
                  theme === "system"
                    ? "text-[#8e81ff] border-[#8e81ff] bg-[#0b0b1f]"
                    : theme === "dark"
                    ? "text-purple-400 border-purple-400 bg-gray-900"
                    : "text-purple-600 border-purple-600 bg-purple-50"
                }`}
              >
                <feature.icon />
              </div>

              <h3
                className={`text-2xl font-semibold mb-3 transition-colors duration-500 ${themeColors.textPrimary}`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-base leading-relaxed transition-colors duration-500 ${themeColors.textSecondary}`}
              >
                {feature.text}
              </p>
              {feature.problemSolved && (
                <p
                  className={`text-sm mt-2 italic transition-colors duration-500 ${
                    theme === "system"
                      ? "text-gray-400"
                      : theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-600"
                  }`}
                >
                  (Solves: {feature.problemSolved})
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <button
            className={`cursor-target mt-4 text-white py-3 px-8 rounded-full font-semibold transition-all shadow-lg text-lg ${themeColors.buttonPrimary}`}
          >
            Start Your Personalized Roadmap Today →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
