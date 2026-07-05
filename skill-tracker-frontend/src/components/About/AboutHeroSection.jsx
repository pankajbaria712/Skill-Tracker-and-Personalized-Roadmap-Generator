// AboutHeroSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const AboutHeroSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    // Animate blobs
    gsap.to(blobRef1.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(blobRef2.current, {
      rotation: -360,
      duration: 25,
      repeat: -1,
      ease: "none",
    });

    // Animate content on load
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden transition-all duration-500 ${themeColors.background}`}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={blobRef1}
          className={`absolute top-20 -left-40 w-80 h-80 ${
            theme === "light"
              ? "bg-blue-300"
              : theme === "dark"
              ? "bg-blue-600"
              : "bg-blue-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-20 lg:w-96 lg:h-96`}
        ></div>
        <div
          ref={blobRef2}
          className={`absolute -bottom-40 right-0 w-80 h-80 ${
            theme === "light"
              ? "bg-purple-300"
              : theme === "dark"
              ? "bg-purple-600"
              : "bg-purple-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-20 lg:w-96 lg:h-96`}
        ></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl"
        >
          Empowering Every Learner with Personalized Growth
        </h1>

        <p
          ref={subtitleRef}
          className={`text-xl sm:text-2xl md:text-xl font-light max-w-3xl mx-auto mb-10 transition-colors duration-500 ${themeColors.textSecondary}`}
        >
          Skill Tracker is an AI-powered learning companion that helps
          developers and students track their skills, monitor progress, and
          generate personalized learning roadmaps for continuous improvement.
        </p>

        <div
          ref={buttonRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Start Your Learning Journey
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>

          <button
            onClick={() => navigate("/")}
            className={`px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 ${themeColors.textSecondary}`}
          >
            Explore Features
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
