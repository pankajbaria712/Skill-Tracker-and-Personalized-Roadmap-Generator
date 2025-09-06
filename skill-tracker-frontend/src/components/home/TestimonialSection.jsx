// TestimonialSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

// A reusable Star SVG component with gradient styling to match the theme
const StarIcon = ({ fillGradientId = "star-gradient" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="url(#star-gradient)"
    stroke="url(#star-gradient)"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-star-half stroke-none"
  >
    <defs>
      <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M9.66 2.652c.8-.98 2.37-1.12 3.32-.34L18.42 6c.95.78 1.43 2.06 1.13 3.25-.3.8-.84 1.5-1.5 2L14 14l-2.4 2.5a2 2 0 0 1-3.2 0L6 14l-3-2.5c-.66-.5-1.2-1.2-1.5-2-.3-.8-.1-1.6.4-2.4l4.24-3.32c.98-.8 2.12-.9 3.02-.32zM12 21v-8l-4.4-3.75a1 1 0 0 1-.5-1.25l1.6-4.5c.2-.5.5-.9.9-1.2l4.8-4c.4-.3.9-.4 1.4-.2l5 1.2a1.5 1.5 0 0 1 1.1 1.7l-1.5 4.5a1.5 1.5 0 0 1-1.3 1.2L12 21z" />
  </svg>
);

const testimonials = [
  {
    quote:
      "Roadmap Tracker completely changed how I approach learning new skills. The personalized paths and progress tracking kept me motivated and on track. I finally feel like I'm making real progress.",
    name: "Alex Johnson",
    title: "Software Engineer",
  },
  {
    quote:
      "As a product manager, I need to learn quickly and efficiently. This tool's focused deep-dives saved me countless hours of sifting through scattered information. Highly recommended!",
    name: "Maria Rodriguez",
    title: "Product Manager",
  },
  {
    quote:
      "I've tried numerous learning platforms, but none remembered my progress like Roadmap Tracker. It's like having a personal AI tutor that knows exactly what I need next.",
    name: "Ben Carter",
    title: "Freelance Designer",
  },
  {
    quote:
      "The milestone system is genius! It turned the grind of learning into a rewarding game. I'm actually excited to learn again.",
    name: "Sarah Chen",
    title: "Data Analyst",
  },
];

const TestimonialSection = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    // Animate the main heading and subheading
    gsap.fromTo(
      ".testimonial-intro",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        duration: 1,
        scrollTrigger: {
          trigger: ".testimonial-intro",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate the testimonial cards
    gsap.fromTo(
      ".testimonial-card",
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.8,
        stagger: 0.2, // Stagger the animation for each card
        scrollTrigger: {
          trigger: ".testimonial-cards-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`px-4 py-20 overflow-hidden transition-all duration-500 ${themeColors.background}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Intro */}
        <div className="testimonial-intro text-center mb-16 max-w-3xl mx-auto">
          <span
            className={`cursor-target text-sm px-3 py-1 rounded-full inline-block font-medium mb-4 transition-all duration-500 ${
              theme === "system"
                ? "bg-[#292f73] text-white"
                : theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            Success Stories
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl">
            Don't Just Take Our Word For It
          </h2>
          <p
            className={`text-lg md:text-xl font-light transition-colors duration-500 ${themeColors.textSecondary}`}
          >
            Hear from people who have achieved their learning goals with our
            personalized and motivating platform.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="testimonial-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card transition-all duration-300 rounded-xl p-6 shadow-lg flex flex-col cursor-target h-full transition-all duration-500 ${
                theme === "system"
                  ? "bg-[#1a1a36] hover:bg-[#222255]"
                  : theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p
                className={`text-base italic leading-relaxed mb-4 flex-grow transition-colors duration-500 ${themeColors.textSecondary}`}
              >
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <p
                  className={`font-semibold transition-colors duration-500 ${themeColors.textPrimary}`}
                >
                  {testimonial.name}
                </p>
                <p
                  className={`text-sm transition-colors duration-500 ${
                    theme === "system"
                      ? "text-gray-400"
                      : theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-600"
                  }`}
                >
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* This is an optional CTA that could lead to a full testimonials page */}
        <div className="text-center mt-20">
          <button
            className={`cursor-target mt-4 text-white py-3 px-8 rounded-full font-semibold transition-all shadow-lg text-lg ${themeColors.buttonPrimary}`}
          >
            Read More Stories →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
