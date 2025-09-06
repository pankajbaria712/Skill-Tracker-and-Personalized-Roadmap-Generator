// unchanged imports...
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

// Temporary emoji icons for theme testing
const problems = [
  {
    icon: "⚙️", // SlidersVertical
    title: "Lacks the Full Picture",
    text: "AI gives quick answers, but no clear learning map. You're unsure what's next or how concepts connect.",
  },
  {
    icon: "📊", // ChartNoAxes
    title: "Forgets Your Progress",
    text: "AI doesn't remember what you've learned. Each session is a fresh start, wasting your time.",
  },
  {
    icon: "🚀", // Rocket
    title: "No Motivation Boost",
    text: "AI offers no milestones or encouragement. It's hard to stay motivated without celebrating wins.",
  },
  {
    icon: "😤", // Annoyed
    title: "Loses Focus in Details",
    text: "Deep dives with AI can lose the main goal. Learning feels scattered, not part of a clear path.",
  },
];

const ProblemSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    const boxes = gsap.utils.toArray(".problem-box");

    boxes.forEach((box, i) => {
      const direction = i % 2 === 0 ? -100 : 100;

      gsap.fromTo(
        box,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: box,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        `.timeline-icon-${i}`,
        { scale: 0.8, opacity: 0.3 },
        {
          scale: 1.2,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    gsap.fromTo(
      ".solution-box",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: ".solution-box",
          start: "top 85%",
          end: "top 60%",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".intro-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".intro-card",
          start: "top 90%",
        },
      }
    );

    gsap.fromTo(
      ".timeline-line-fill",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`px-4 py-20 scroll-mt-20 snap-y snap-mandatory transition-all duration-500 ${themeColors.background}`}
      style={{ minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Side Image and Intro */}
        <div className="intro-card w-full md:w-1/2 space-y-6 snap-start">
          <span
            className={`cursor-target text-sm px-3 py-1 rounded-full inline-block font-medium transition-all duration-500 ${
              theme === "system"
                ? "bg-[#292f73] text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            The AI Learning Gap
          </span>
          <h2
            className={`text-3xl font-bold leading-tight transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Generic AI: Roadblocks to Mastery
          </h2>
          <p
            className={`transition-colors duration-500 ${themeColors.textSecondary}`}
          >
            AI chatbots offer instant info, but for mastering skills, they often
            lack the needed structure, progress tracking, and motivation. Here's
            why:
          </p>
          <div className="overflow-hidden rounded-lg max-h-[520px] relative group shadow-lg">
            <img
              src="/card01.png"
              alt="Frustrated learner"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          <button
            className={`cursor-target mt-4 text-white py-2 px-5 rounded-lg font-semibold transition-all ${themeColors.buttonPrimary}`}
          >
            Get Your Learning Path →
          </button>
        </div>

        {/* Right Side Cards with Timeline */}
        <div className="relative w-full md:w-1/2 pl-8">
          <div className="timeline-line-container absolute left-4 top-0 bottom-0 w-[2px] hidden md:block">
            <div
              className={`timeline-line-fill w-full h-full origin-top scale-y-0 transition-colors duration-500 ${
                theme === "system"
                  ? "bg-[#8e81ff]"
                  : theme === "dark"
                  ? "bg-purple-400"
                  : "bg-purple-600"
              }`}
            ></div>
          </div>

          {problems.map((problem, index) => (
            <div
              className="flex items-start gap-4 problem-box mb-10 snap-start cursor-target"
              key={index}
            >
              <div
                className={`cursor-target timeline-icon-${index} hidden md:flex justify-center items-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                  theme === "system"
                    ? "border-[#8e81ff] text-[#8e81ff] bg-[#0b0b1f] hover:bg-[#26245d]"
                    : theme === "dark"
                    ? "border-purple-400 text-purple-400 bg-gray-900 hover:bg-gray-800"
                    : "border-purple-600 text-purple-600 bg-purple-50 hover:bg-purple-100"
                }`}
              >
                <span className="text-sm">{problem.icon}</span>
              </div>

              <div
                className={`cursor-target transition-all rounded-xl p-5 shadow-md w-full ${
                  theme === "system"
                    ? "bg-[#1a1a36] hover:bg-[#222255]"
                    : theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-1 transition-colors duration-500 ${themeColors.textPrimary}`}
                >
                  {problem.title}
                </h3>
                <p
                  className={`text-sm transition-colors duration-500 ${themeColors.textSecondary}`}
                >
                  {problem.text}
                </p>
              </div>
            </div>
          ))}

          <div
            className={`solution-box mt-16 p-6 rounded-xl shadow-lg snap-start cursor-target transition-all duration-500 ${
              theme === "system"
                ? "bg-[#2c2c6e] border-2 border-[#7f5fff]"
                : theme === "dark"
                ? "bg-gray-700 border-2 border-purple-500"
                : "bg-purple-50 border-2 border-purple-300"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-2 transition-colors duration-500 ${themeColors.textPrimary}`}
            >
              ✅ Roadmap Tracker: The Solution
            </h3>
            <p
              className={`text-sm transition-colors duration-500 ${themeColors.textSecondary}`}
            >
              Unlike AI alone, <strong>Roadmap Tracker</strong> offers
              step-by-step guidance, remembers your progress, and boosts
              motivation for true skill mastery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
