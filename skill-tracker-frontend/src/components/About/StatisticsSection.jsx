// StatisticsSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

// Sample statistics - these are placeholder values for demo
const statistics = [
  {
    label: "Projects Built",
    value: "50+",
    icon: "🚀",
    color: "from-cyan-500 to-blue-600",
  },
  {
    label: "Skills Managed",
    value: "1000+",
    icon: "📊",
    color: "from-blue-500 to-purple-600",
  },
  {
    label: "Roadmaps Generated",
    value: "500+",
    icon: "🗺️",
    color: "from-purple-500 to-pink-600",
  },
  {
    label: "Happy Learners",
    value: "100+",
    icon: "😊",
    color: "from-pink-500 to-red-600",
  },
];

const StatisticsSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();
  const [counters, setCounters] = useState({});

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    // Animate counters
    const statCards = gsap.utils.toArray(".stat-card");

    statCards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Counter animation
    statistics.forEach((stat, index) => {
      const targetValue = parseInt(stat.value);
      gsap.fromTo(
        { value: 0 },
        {
          value: targetValue,
          duration: 2,
          ease: "power2.out",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            setCounters((prev) => ({
              ...prev,
              [index]: Math.floor(this.targets()[0].value),
            }));
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
              ? "bg-purple-200"
              : theme === "dark"
              ? "bg-purple-900"
              : "bg-purple-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
        <div
          className={`absolute bottom-1/3 -right-40 w-96 h-96 ${
            theme === "light"
              ? "bg-blue-200"
              : theme === "dark"
              ? "bg-blue-900"
              : "bg-blue-600"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10`}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            By The Numbers
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${themeColors.textSecondary}`}>
            Our impact on the learning community (sample statistics for demonstration)
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="stat-card group relative p-8 rounded-xl backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-target"
              style={{
                background:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.7)"
                    : theme === "dark"
                    ? "rgba(30, 30, 30, 0.4)"
                    : "rgba(26, 26, 64, 0.5)",
                borderColor:
                  theme === "light"
                    ? "rgba(200, 200, 200, 0.3)"
                    : theme === "dark"
                    ? "rgba(100, 100, 100, 0.3)"
                    : "rgba(139, 92, 246, 0.2)",
              }}
            >
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className={`text-4xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {counters[index] || 0}
                  {stat.value.includes("+") ? "+" : ""}
                </div>
                <p className={`font-semibold ${themeColors.textSecondary}`}>
                  {stat.label}
                </p>
              </div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 w-0 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-12 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
          <p className={`text-sm ${themeColors.textSecondary}`}>
            💡 These are sample statistics for demonstration purposes. Real metrics would be updated as the platform grows.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
