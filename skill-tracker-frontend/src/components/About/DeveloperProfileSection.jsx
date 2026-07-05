// DeveloperProfileSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const DeveloperProfileSection = () => {
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
      {/* Background Effects */}
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
            About the Developer
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Profile Card */}
        <div
          ref={cardRef}
          className="group relative rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-target"
          style={{
            background:
              theme === "light"
                ? "rgba(255, 255, 255, 0.7)"
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
          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
            {/* Left Column - Avatar */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 mb-4 group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-4xl font-bold text-cyan-300">
                  PB
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Pankaj Baria
              </h3>
              <p className={`text-sm mt-2 text-center ${themeColors.textSecondary}`}>
                Full Stack Developer | Computer Engineering Student
              </p>
            </div>

            {/* Right Column - Bio and Social */}
            <div className="md:col-span-2">
              <h4 className="text-xl font-bold mb-4 text-cyan-300">About Me</h4>
              <p className={`mb-6 leading-relaxed ${themeColors.textSecondary}`}>
                I am a passionate Full Stack Developer and Computer Engineering
                student who enjoys building modern web applications that solve
                real-world problems. I focus on creating scalable, responsive,
                and user-friendly applications while continuously improving my
                knowledge of software engineering, backend development, AI
                integration, and system design.
              </p>

              <p className={`mb-8 leading-relaxed ${themeColors.textSecondary}`}>
                This Skill Tracker project reflects my passion for combining
                technology with practical learning solutions. The project helps
                learners organize their learning journey, monitor progress, and
                generate AI-powered personalized roadmaps for continuous growth.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/pankajbaria712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 cursor-target"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/pankaj-baria-619253274/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 cursor-target"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://pankaj-portfolio-ivory.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 cursor-target"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.707 11.293l-9-9A1 1 0 0 0 11 2H4a2 2 0 0 0-2 2v7a1 1 0 0 0 .293.707l9 9a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414zM7 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                  </svg>
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperProfileSection;
