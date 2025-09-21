"use client";

import React from "react";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

const lineVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: "easeInOut",
    },
  }),
};

interface SlidersVerticalProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const SlidersVertical = ({
  width = 20,
  height = 20,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: SlidersVerticalProps) => {
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
        <motion.line
          x1="4"
          x2="4"
          y1="21"
          y2="14"
          variants={lineVariants}
          animate={controls}
          custom={0}
        />
        <motion.line
          x1="4"
          x2="4"
          y1="10"
          y2="3"
          variants={lineVariants}
          animate={controls}
          custom={1}
        />
        <motion.line
          x1="12"
          x2="12"
          y1="21"
          y2="12"
          variants={lineVariants}
          animate={controls}
          custom={2}
        />
        <motion.line
          x1="12"
          x2="12"
          y1="8"
          y2="3"
          variants={lineVariants}
          animate={controls}
          custom={3}
        />
        <motion.line
          x1="20"
          x2="20"
          y1="21"
          y2="16"
          variants={lineVariants}
          animate={controls}
          custom={4}
        />
        <motion.line
          x1="20"
          x2="20"
          y1="12"
          y2="3"
          variants={lineVariants}
          animate={controls}
          custom={5}
        />
        <motion.line
          x1="2"
          x2="6"
          y1="14"
          y2="14"
          variants={lineVariants}
          animate={controls}
          custom={6}
        />
        <motion.line
          x1="10"
          x2="14"
          y1="8"
          y2="8"
          variants={lineVariants}
          animate={controls}
          custom={7}
        />
        <motion.line
          x1="18"
          x2="22"
          y1="16"
          y2="16"
          variants={lineVariants}
          animate={controls}
          custom={8}
        />
      </svg>
    </div>
  );
};

export { SlidersVertical };
