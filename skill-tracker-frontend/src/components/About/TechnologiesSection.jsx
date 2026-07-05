// TechnologiesSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const technologies = {
  frontend: ["React", "Vite", "Tailwind CSS", "React Router", "Axios"],
  backend: ["Node.js", "Express.js", "Firebase", "JWT", "REST APIs"],
  other: ["Git", "GitHub", "Vercel", "Render", "MongoDB", "Gemini AI"],
};

const TechnologiesSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    const chips = gsap.utils.toArray(".tech-chip");

    chips.forEach((chip, index) => {
      gsap.fromTo(
        chip,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.05,
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

  const TechCategory = ({ title, techs, color }) => (
    <div className="mb-12">
      <h3 className={`text-xl font-bold mb-4 ${color}`}>{title}</h3>
      <div className="flex flex-wrap gap-3">
        {techs.map((tech, index) => (
          <div
            key={index}
            className="tech-chip group px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 hover:shadow-lg cursor-target transform hover:scale-110"
            style={{
              background:
                theme === "light"
                  ? "rgba(255, 255, 255, 0.6)"
                  : theme === "dark"
                  ? "rgba(40, 40, 40, 0.5)"
                  : "rgba(26, 26, 64, 0.4)",
              borderColor:
                theme === "light"
                  ? "rgba(200, 200, 200, 0.4)"
                  : theme === "dark"
                  ? "rgba(100, 100, 100, 0.4)"
                  : "rgba(139, 92, 246, 0.3)",
            }}
          >
            <span className={`font-medium ${themeColors.textPrimary}`}>{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={`relative px-4 py-24 transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 -right-40 w-96 h-96 ${
            theme === "light"
              ? "bg-blue-200"
              : theme === "dark"
              ? "bg-blue-900"
              : "bg-blue-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Built With Modern Tech
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${themeColors.textSecondary}`}>
            Leveraging the latest technologies for optimal performance and
            user experience
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Frontend */}
          <div
            className="p-8 rounded-xl backdrop-blur-md border transition-all duration-500 hover:shadow-lg"
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
                  : "rgba(139, 92, 246, 0.15)",
            }}
          >
            <TechCategory
              title="Frontend"
              techs={technologies.frontend}
              color="text-cyan-400"
            />
          </div>

          {/* Backend */}
          <div
            className="p-8 rounded-xl backdrop-blur-md border transition-all duration-500 hover:shadow-lg"
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
                  : "rgba(139, 92, 246, 0.15)",
            }}
          >
            <TechCategory
              title="Backend"
              techs={technologies.backend}
              color="text-purple-400"
            />
          </div>
        </div>

        {/* Other Technologies */}
        <div
          className="mt-12 p-8 rounded-xl backdrop-blur-md border transition-all duration-500 hover:shadow-lg"
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
                : "rgba(139, 92, 246, 0.15)",
          }}
        >
          <TechCategory
            title="Platforms & Tools"
            techs={technologies.other}
            color="text-blue-400"
          />
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;
