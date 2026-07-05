// AboutCTASection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const AboutCTASection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    // Animate blobs
    gsap.to(blobRef1.current, {
      rotation: 360,
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

    gsap.to(blobRef2.current, {
      rotation: -360,
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

    // Animate content
    gsap.fromTo(
      [titleRef.current, descRef.current, buttonsRef.current],
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.2,
        ease: "power3.out",
        duration: 1,
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
      className={`relative px-4 py-24 overflow-hidden transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Blobs for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          ref={blobRef1}
          className={`absolute top-[10%] left-[5%] w-72 h-72 ${
            theme === "light"
              ? "bg-purple-300"
              : theme === "dark"
              ? "bg-purple-600"
              : "bg-purple-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
        <div
          ref={blobRef2}
          className={`absolute bottom-[10%] right-[5%] w-72 h-72 ${
            theme === "light"
              ? "bg-blue-300"
              : theme === "dark"
              ? "bg-blue-600"
              : "bg-blue-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 animation-delay-2000 transition-all duration-500`}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Heading */}
        <h2
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl"
        >
          Start Building Your Future Today
        </h2>

        {/* Description */}
        <p
          ref={descRef}
          className={`text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 transition-colors duration-500 ${themeColors.textSecondary}`}
        >
          Track your skills, build personalized AI roadmaps, and stay motivated
          throughout your learning journey. Join a community of learners
          dedicated to continuous growth.
        </p>

        {/* Call to Action Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 cursor-target"
          >
            Get Started Now
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className={`px-8 md:px-10 py-4 md:py-5 border-2 border-cyan-400 text-cyan-400 font-bold text-lg rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 cursor-target ${
              theme === "light" ? "hover:bg-cyan-300" : ""
            }`}
          >
            Explore Dashboard
          </button>

          <a
            href="#"
            className={`px-8 md:px-10 py-4 md:py-5 border-2 font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 cursor-target ${
              theme === "light"
                ? "border-gray-400 text-gray-600 hover:bg-gray-100"
                : theme === "dark"
                ? "border-gray-600 text-gray-400 hover:bg-gray-800"
                : "border-purple-400 text-purple-300 hover:bg-purple-500/20"
            }`}
          >
            Learn More
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-16 p-6 md:p-8 rounded-xl backdrop-blur-md border"
          style={{
            background:
              theme === "light"
                ? "rgba(255, 255, 255, 0.4)"
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
          <p className={`text-sm md:text-base ${themeColors.textSecondary}`}>
            ✨ Join hundreds of learners already transforming their educational
            journey with personalized AI-driven roadmaps and intelligent skill
            tracking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutCTASection;
