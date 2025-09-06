// src/components/Dashboard/AIResourceModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Link as LinkIcon, BookOpen } from "lucide-react";

/**
 * AIResourceModal
 * - isModalOpen (bool), setIsModalOpen(fn), roadmapTitle (string)
 *
 * This component keeps local generation state. It expects the environment key
 * if you re-enable API calls.
 */
export default function AIResourceModal({
  isModalOpen,
  setIsModalOpen,
  roadmapTitle = "",
}) {
  const [resources, setResources] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateResources = async () => {
    setIsGenerating(true);
    setResources([]);
    setError(null);

    try {
      // NOTE: Keep actual API call here if you want; for safety we leave the stub.
      // Simulate generation (replace with real API call in production).
      await new Promise((r) => setTimeout(r, 700));
      const demo = [
        {
          title: "Official React Docs",
          description: "Comprehensive guide to React fundamentals.",
          url: "https://reactjs.org/",
        },
        {
          title: "Frontend Masters - Advanced React",
          description: "Deep-dive courses and hands-on projects.",
          url: "https://frontendmasters.com/",
        },
      ];
      setResources(demo);
    } catch (err) {
      setError("Failed to generate resources. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const close = () => {
    setIsModalOpen(false);
    setResources([]);
    setError(null);
    setIsGenerating(false);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.98, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 24 }}
            className="bg-[#0b1221] rounded-2xl p-4 sm:p-6 max-w-xl w-full border border-gray-700"
          >
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  AI-Powered Resources
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Resources for{" "}
                  <span className="font-semibold">{roadmapTitle}</span>
                </p>
              </div>

              <button
                onClick={close}
                className="text-gray-400 hover:text-white p-2 rounded focus:outline-none"
                aria-label="Close resources modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <button
                onClick={generateResources}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
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
                <span>
                  {isGenerating ? "Generating..." : "Generate Resources"}
                </span>
              </button>
            </div>

            {isGenerating && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin text-purple-400" size={28} />
              </div>
            )}

            {error && (
              <div className="text-red-400 text-center py-2">{error}</div>
            )}

            {!isGenerating && resources.length > 0 && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
                  >
                    <div className="p-2 rounded bg-purple-500/20">
                      <BookOpen size={18} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white">
                        {res.title}
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">
                        {res.description}
                      </p>
                    </div>
                    <LinkIcon size={16} className="text-gray-400" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
