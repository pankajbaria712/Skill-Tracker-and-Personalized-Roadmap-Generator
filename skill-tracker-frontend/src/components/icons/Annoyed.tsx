"use client";

import React from "react";
import { motion, useAnimation } from "motion/react";
import type { Variants } from "motion/react";

interface AnnoyedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const circleVariants: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

const mouthVariants: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0.3, 1],
    opacity: [0.5, 1],
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const eyeVariants: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 0.8, 1],
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      repeat: 1,
    },
  },
};

const Annoyed = ({
  width = 32,
  height = 32,
  strokeWidth = 2,
  stroke = "#00f8fd",
  ...props
}: AnnoyedProps) => {
  const controls = useAnimation();

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          variants={circleVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="M8 15h8"
          variants={mouthVariants}
          animate={controls}
          initial="normal"
        />
        <motion.g variants={eyeVariants} animate={controls} initial="normal">
          <path d="M8 9h2" />
          <path d="M14 9h2" />
        </motion.g>
      </svg>
    </div>
  );
};

export default Annoyed;
