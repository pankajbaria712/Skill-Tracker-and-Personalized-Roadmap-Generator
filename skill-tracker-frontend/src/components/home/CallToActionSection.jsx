// CallToActionSection.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

gsap.registerPlugin(ScrollTrigger);

const CallToActionSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "section");

  useEffect(() => {
    // Animate the background blobs on scroll, continuing the theme
    gsap.to(".cta-blob-purple", {
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

    gsap.to(".cta-blob-blue", {
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

    // Animate the title and button
    gsap.fromTo(
      [titleRef.current, buttonRef.current],
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.2, // Stagger the title and button animation
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
      className={`relative px-4 py-20 overflow-hidden transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Blobs for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          className={`cta-blob-purple absolute top-[10%] left-[5%] w-72 h-72 ${
            themeColors.blobColors?.primary || "bg-purple-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
        <div
          className={`cta-blob-blue absolute bottom-[10%] right-[5%] w-72 h-72 ${
            themeColors.blobColors?.secondary || "bg-blue-500"
          } rounded-full mix-blend-screen filter blur-3xl opacity-10 lg:w-96 lg:h-96 animation-delay-2000 transition-all duration-500`}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Heading and Subtitle */}
        <h2
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl"
        >
          Ready to Master Your Learning Journey?
        </h2>
        <p
          className={`text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 transition-colors duration-500 ${themeColors.textSecondary}`}
        >
          Sign up today to get your personalized learning roadmap, track your
          progress, and stay motivated on your path to true skill mastery.
        </p>

        {/* Call to Action Button */}
        <button
          ref={buttonRef}
          className={`cursor-target inline-block text-white py-4 px-12 rounded-full font-semibold transition-all shadow-lg text-lg ${themeColors.buttonPrimary}`}
        >
          Start Now →
        </button>
      </div>
    </section>
  );
};

export default CallToActionSection;
