// src/components/Dashboard/RoadmapDetail.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

/**
 * RoadmapDetail - shows structured roadmap content with back action.
 * Props:
 * - roadmap: { title, content: { introduction, steps, projects, tips } }
 * - onBack: function
 */
export default function RoadmapDetail({ roadmap, onBack }) {
  if (!roadmap || !roadmap.content) {
    return null;
  }

  const {
    introduction,
    steps = [],
    projects = [],
    tips = [],
  } = roadmap.content;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.36 }}
      className="p-4 sm:p-6"
    >
      {/* Header */}
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

      <div className="space-y-8">
        {/* Introduction */}
        {introduction && (
          <section className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Introduction</h3>
            <p className="text-gray-300 text-sm">{introduction}</p>
          </section>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-white">Core Steps</h3>
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded">
                    <BookOpen size={18} className="text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{step.title}</h4>
                </div>
                <p className="text-gray-300 text-sm mb-3">{step.description}</p>

                {/* Resources */}
                {step.resources?.length > 0 && (
                  <ul className="space-y-2 text-gray-300">
                    {step.resources.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <ChevronRight size={16} className="text-purple-400" />
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {r.title}
                          <ExternalLink size={14} className="text-purple-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Projects</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {projects.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-purple-400 mt-1" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <section className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <Lightbulb size={18} className="text-yellow-400" /> Tips
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              {tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-purple-400 mt-1" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </motion.article>
  );
}
