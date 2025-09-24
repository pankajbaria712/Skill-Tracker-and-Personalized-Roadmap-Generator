// SkillTrackerProgressPreloader.jsx
import React, { useEffect, useState } from "react";

const SkillTrackerProgressPreloader = ({ onLoaded }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress gradually
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onLoaded, 800); // fade-out duration
          return 100;
        }
        return prev + 1; // increase progress
      });
    }, 25); // 25ms for smooth increment (~2.5s total)

    return () => clearInterval(interval);
  }, [onLoaded]);

  // Circle stroke calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-800 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Circular Progress */}
      <svg width="120" height="120" className="mb-6">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(137,0,255,0.2)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgb(137,0,255)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-75"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="20"
          fontWeight="bold"
          fill="rgb(137,0,255)"
        >
          {progress}%
        </text>
      </svg>

      {/* Bouncing Dots */}
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full shadow-lg animate-bounce-delay${
              i + 1
            }`}
            style={{ backgroundColor: "rgb(137,0,255)" }}
          ></span>
        ))}
      </div>
      {/* Loading Text */}
      <p
        className="font-semibold animate-pulse"
        style={{ color: "rgb(137,0,255)" }}
      >
        Loading Your Skills...
      </p>
      {/* Animations */}
      <style>
        {`
          @keyframes bounce-delay1 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes bounce-delay2 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes bounce-delay3 {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .animate-bounce-delay1 { animation: bounce-delay1 1.4s infinite ease-in-out; }
          .animate-bounce-delay2 { animation: bounce-delay2 1.4s 0.2s infinite ease-in-out; }
          .animate-bounce-delay3 { animation: bounce-delay3 1.4s 0.4s infinite ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default SkillTrackerProgressPreloader;
