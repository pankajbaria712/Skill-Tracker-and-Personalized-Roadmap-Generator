// src/components/Dashboard/ProgressRing.jsx
import React from "react";

/**
 * ProgressRing
 * Renders a compact circular progress indicator + percent label.
 *
 * Props:
 * - progress: number (0-100)
 * - size: px (default 52)
 * - stroke: stroke width (default 6)
 * - className: extra tailwind classes
 */
export default function ProgressRing({
  progress = 0,
  size = 52,
  stroke = 6,
  className = "",
}) {
  const p = Math.max(0, Math.min(100, progress));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (p / 100) * circumference;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="pr-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#pr-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="ml-2 text-sm font-semibold text-white tabular-nums">
        {Math.round(p)}%
      </div>
    </div>
  );
}
