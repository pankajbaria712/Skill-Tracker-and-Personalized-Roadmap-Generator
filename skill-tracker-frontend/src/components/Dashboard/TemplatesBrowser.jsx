// src/components/Dashboard/TemplatesBrowser.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * TemplatesBrowser - simple responsive grid presentation.
 */
export default function TemplatesBrowser({ cardVariants }) {
  const templates = [
    {
      title: "Frontend Developer",
      desc: "A comprehensive path for modern web development.",
    },
    {
      title: "Machine Learning Engineer",
      desc: "From basic statistics to deep learning frameworks.",
    },
    {
      title: "UX/UI Designer",
      desc: "Master the principles of user-centric design.",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="space-y-6 p-4 sm:p-6"
      aria-labelledby="templates-title"
    >
      <h2 id="templates-title" className="text-2xl font-bold text-white">
        Templates Browser
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <motion.div
            key={t.title}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                /* open, if needed */
              }
            }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {t.title}
            </h3>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
