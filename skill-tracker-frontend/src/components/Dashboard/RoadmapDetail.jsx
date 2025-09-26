// src/components/Dashboard/RoadmapDetail.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  CheckCircle,
  Circle,
} from "lucide-react";

// import API client
import API from "../../utils/api";

/**
 * RoadmapDetail - shows structured roadmap content with back action.
 * Props:
 * - roadmap: { _id, title, content: { introduction, steps, projects, tips }, progress }
 * - onBack: function
 * - onUpdate: optional function(updatedRoadmap) -> parent can update its state
 */
export default function RoadmapDetail({ roadmap, onBack, onUpdate }) {
  const [local, setLocal] = useState(roadmap);

  // sync when prop changes
  useEffect(() => {
    setLocal(roadmap);
  }, [roadmap]);

  if (!local || !local.content) {
    return null;
  }

  const { introduction, steps = [], projects = [], tips = [] } = local.content;

  const toggleStep = async (index) => {
    if (!local || !local._id) return;
    try {
      // optimistic UI: toggle locally first
      const updatedLocal = { ...local, content: { ...local.content } };
      updatedLocal.content = {
        ...local.content,
        steps: local.content.steps.map((s, i) =>
          i === index ? { ...s, completed: !s.completed } : s
        ),
      };
      // recalc progress locally
      const completedCount = updatedLocal.content.steps.filter(
        (s) => s.completed
      ).length;
      updatedLocal.progress = updatedLocal.content.steps.length
        ? Math.round((completedCount / updatedLocal.content.steps.length) * 100)
        : 0;

      setLocal(updatedLocal);

      // call backend to persist
      const res = await API.patch(
        `/roadmaps/${local._id}/steps/${index}/toggle`
      );
      const updatedFromServer = res.data;
      setLocal(updatedFromServer);
      if (typeof onUpdate === "function") onUpdate(updatedFromServer);
    } catch (err) {
      console.error("Failed to toggle step:", err);
      // revert: refetch updated roadmap from backend
      try {
        const fresh = await API.get(`/roadmaps`);
        // try to find one matching id
        const found = fresh.data.find((r) => r._id === local._id);
        if (found) {
          setLocal(found);
          if (typeof onUpdate === "function") onUpdate(found);
        }
      } catch (e) {
        // ignore
      }
    }
  };

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
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {local.title}
          </h2>
          <div className="text-sm text-gray-400 mt-1">
            Progress: {local.progress ?? 0}%
          </div>
        </div>
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
                className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded">
                      <BookOpen size={18} className="text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {step.description}
                  </p>

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
                            <ExternalLink
                              size={14}
                              className="text-purple-400"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => toggleStep(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition
                      ${
                        step.completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                  >
                    {step.completed ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                    {step.completed ? "Completed" : "Mark as done"}
                  </button>

                  <div className="text-xs text-gray-400">
                    {step.completed ? "Done" : "Not done"}
                  </div>
                </div>
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
