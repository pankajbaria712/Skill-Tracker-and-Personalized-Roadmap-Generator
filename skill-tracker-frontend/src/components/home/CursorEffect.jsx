// src/components/CursorEffect.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define a beautiful palette of colors for the particles
const particleColors = [
  "#FF6B6B", // Reddish
  "#4ECDC4", // Teal
  "#47B8E0", // Sky Blue
  "#F7DC6F", // Gold
  "#A2D9CE", // Mint Green
  "#BB8FCE", // Lavender
  "#FF9F1C", // Orange
];

export default function CursorEffect() {
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0); // Use ref for mutable ID counter without re-renders

  const handleMouseMove = useCallback((e) => {
    // Only generate particles if the mouse is moving reasonably fast to avoid too many
    // (You can adjust this threshold or remove if you want particles for every pixel moved)

    const newParticle = {
      id: particleIdRef.current++, // Unique ID for each particle
      x: e.clientX, // Mouse X coordinate
      y: e.clientY, // Mouse Y coordinate
      color: particleColors[Math.floor(Math.random() * particleColors.length)], // Random color from palette
    };

    setParticles((prev) => [...prev, newParticle]);

    // Set a timeout to remove the particle after its animation duration
    // This cleans up the DOM and prevents performance issues
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1500); // Particle stays visible for 1.5 seconds
  }, []); // useCallback memoizes the function to prevent unnecessary re-renders

  useEffect(() => {
    // Attach the mousemove listener to the document
    // We want this effect to apply anywhere the mouse moves on the page for a global feel
    document.addEventListener("mousemove", handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]); // Re-run effect if handleMouseMove changes (which it won't with useCallback)

  return (
    // This container is absolutely positioned and covers the entire screen.
    // pointer-events-none is CRUCIAL so it doesn't block clicks/interactions with elements beneath it.
    <div className="absolute inset-0 pointer-events-none z-[999]">
      {" "}
      {/* High z-index to be on top */}
      <AnimatePresence>
        {" "}
        {/* AnimatePresence handles exit animations for removed components */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            // Initial state: starts small and fully opaque
            initial={{ opacity: 1, scale: 0.5 }}
            // Animation state: fades out, grows, and drifts slightly upwards/sideways
            animate={{
              opacity: 0,
              scale: 1.5, // Particle grows
              y: p.y - 50, // Drifts 50px upwards
              x: p.x + (Math.random() - 0.5) * 60, // Drifts randomly left/right up to 30px
            }}
            // Exit state: ensures it smoothly disappears
            exit={{ opacity: 0, scale: 0 }}
            // Transition properties for the animation
            transition={{
              duration: 1.5, // Total animation duration
              ease: "easeOut", // Easing function for smoother movement
            }}
            // Inline styles for particle appearance and positioning
            style={{
              position: "fixed", // Position relative to the viewport
              left: p.x,
              top: p.y,
              width: 15, // Size of the particle
              height: 15,
              borderRadius: "50%", // Make it circular
              backgroundColor: p.color, // Apply the random color
              filter: "blur(3px)", // Apply a subtle blur for a softer look
              transform: "translate(-50%, -50%)", // Center the particle on the cursor
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
