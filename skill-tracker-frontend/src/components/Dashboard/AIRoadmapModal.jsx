// src/components/Dashboard/AIRoadmapModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2 } from "lucide-react";

/**
 * AIRoadmapModal
 * Props: isModalOpen, setIsModalOpen, generateRoadmapWithAI, isGenerating,
 * roadmapTitle, setRoadmapTitle, proficiency, setProficiency
 */
export default function AIRoadmapModal({
  isModalOpen,
  setIsModalOpen,
  generateRoadmapWithAI,
  isGenerating,
  roadmapTitle,
  setRoadmapTitle,
  proficiency,
  setProficiency,
}) {
  const close = () => setIsModalOpen(false);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          role="dialog"
        >
          <motion.div
            initial={{ y: 16, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="bg-[#0b1221] rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-2xl font-bold text-white">
                Generate Roadmap with AI
              </h3>
              <button
                onClick={close}
                className="text-gray-400 hover:text-white p-2 rounded"
                aria-label="Close generate roadmap modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-sm text-gray-400 block">
                Roadmap Title
              </label>
              <input
                value={roadmapTitle}
                onChange={(e) => setRoadmapTitle(e.target.value)}
                placeholder="e.g., Mastering React.js"
                className="w-full bg-gray-900 rounded-lg p-3 text-white border border-gray-700 focus:outline-none"
              />

              <label className="text-sm text-gray-400 block">
                Proficiency:{" "}
                <span className="text-white font-semibold">{proficiency}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full h-2"
                aria-label="Proficiency"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={close}
                className="px-4 py-2 rounded-lg text-white border border-gray-700 hover:bg-gray-800"
                disabled={isGenerating}
              >
                Cancel
              </button>

              <button
                onClick={generateRoadmapWithAI}
                disabled={isGenerating || !roadmapTitle.trim()}
                className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(236,72,153,1) 100%)",
                }}
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span>{isGenerating ? "Generating..." : "Generate"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
