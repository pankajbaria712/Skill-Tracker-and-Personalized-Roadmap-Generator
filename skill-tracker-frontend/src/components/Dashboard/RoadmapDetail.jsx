// src/components/Dashboard/RoadmapDetail.jsx
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";

/**
 * RoadmapDetail - shows structured roadmap content with back action.
 * Props:
 * - roadmap: { title, generatedContent: { sections: [ { title, subtopics } ] } }
 * - onBack: function
 */
export default function RoadmapDetail({ roadmap, onBack }) {
  if (!roadmap || !roadmap.generatedContent) {
    return null;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.36 }}
      className="p-4 sm:p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full text-white bg-gray-800 hover:bg-gray-700 transition"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {roadmap.title}
        </h2>
      </div>

      <div className="space-y-6">
        {roadmap.generatedContent.sections.map((s, idx) => (
          <section
            key={idx}
            className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
            aria-labelledby={`section-${idx}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded">
                <BookOpen size={18} className="text-purple-400" />
              </div>
              <h3
                id={`section-${idx}`}
                className="text-lg font-bold text-white"
              >
                {s.title}
              </h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              {s.subtopics.map((sub, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-purple-400 mt-1" />
                  <div className="text-sm">{sub}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </motion.article>
  );
}
