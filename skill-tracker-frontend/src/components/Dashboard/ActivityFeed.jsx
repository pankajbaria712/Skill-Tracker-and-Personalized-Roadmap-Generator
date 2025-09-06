// src/components/Dashboard/ActivityFeed.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * ActivityFeed - simple presentational list.
 * Keep this purely presentational so you can inject dynamic data later.
 */
export default function ActivityFeed({ cardVariants }) {
  const activities = [
    'Completed "Introduction to React" in Data Analytics roadmap.',
    'Generated a new roadmap for "Crack System Design Interviews".',
    'Viewed "Frontend Developer" template.',
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="space-y-6 p-4 sm:p-6"
      aria-labelledby="activity-title"
    >
      <h2 id="activity-title" className="text-2xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-700">
        <ul className="space-y-3 text-gray-300">
          {activities.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 text-purple-400">•</span>
              <p className="text-sm sm:text-base">{a}</p>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
