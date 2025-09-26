// src/components/Dashboard/RoadmapSection.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Grid3X3, Trash2 } from "lucide-react";
import ProgressRing from "./ProgressRing";
import { useTheme } from "../ThemeProvider";

export default function RoadmapSection({
  roadmaps = [],
  removeRoadmap,
  onOpenRoadmap,
  onOpenAIModal,
  cardVariants,
  buttonVariants,
  onUpdateRoadmap,
}) {
  const { getActualTheme } = useTheme();
  const resolvedTheme = getActualTheme(); // "light" | "dark"

  // 🎨 Theme based styles
  const textPrimary =
    resolvedTheme === "light" ? "text-gray-900" : "text-white";
  const textSecondary =
    resolvedTheme === "light" ? "text-gray-600" : "text-gray-400";

  const cardBase =
    resolvedTheme === "light"
      ? "bg-white border-gray-200 shadow-md"
      : "bg-gray-800 border-gray-700 shadow-xl";

  const hoverBg =
    resolvedTheme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700";

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Your Roadmaps</h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              className={`w-full sm:w-auto rounded-lg border p-2 pr-8 ${cardBase} ${textPrimary}`}
              aria-label="Sort roadmaps"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>By Progress</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>

          {/* Create button */}
          <motion.button
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-lg"
            style={{
              background:
                "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(236,72,153,1) 100%)",
            }}
            whileHover={buttonVariants?.hover || { scale: 1.03 }}
          >
            <Sparkles size={18} />
            <span>Create Roadmap</span>
          </motion.button>
        </div>
      </div>

      {/* Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Generate with AI */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className={`${cardBase} rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center p-6 transition ${hoverBg}`}
          role="button"
          onClick={onOpenAIModal}
        >
          <Sparkles size={36} className="text-purple-500" />
          <h3 className={`text-lg sm:text-xl font-bold mt-3 ${textPrimary}`}>
            Generate with AI
          </h3>
          <p className={`mt-2 text-sm ${textSecondary}`}>
            Create a personalized roadmap using AI.
          </p>
        </motion.div>

        {/* Browse Templates */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className={`${cardBase} rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center p-6 transition ${hoverBg}`}
          role="button"
        >
          <Grid3X3 size={36} className="text-purple-500" />
          <h3 className={`text-lg sm:text-xl font-bold mt-3 ${textPrimary}`}>
            Browse Templates
          </h3>
          <p className={`mt-2 text-sm ${textSecondary}`}>
            Choose from pre-made learning paths.
          </p>
        </motion.div>

        {/* Dynamic Roadmaps */}
        <AnimatePresence>
          {roadmaps.map((rm) => (
            <motion.article
              key={rm._id || rm.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              className={`${cardBase} relative rounded-2xl border cursor-pointer flex flex-col justify-between p-6 transition ${hoverBg}`}
              onClick={() =>
                onOpenRoadmap?.(rm, (updated) => onUpdateRoadmap?.(updated))
              }
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeRoadmap?.(rm._id || rm.id);
                }}
                className={`absolute top-3 right-3 p-1 rounded-full text-gray-400 ${hoverBg}`}
                aria-label={`Remove ${rm.title}`}
              >
                <Trash2 size={14} />
              </button>

              {/* Title + Description */}
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold leading-snug line-clamp-1 ${textPrimary}`}
                >
                  {rm.title}
                </h3>
                <p className={`mt-2 text-sm line-clamp-2 ${textSecondary}`}>
                  {rm.content?.introduction ||
                    "No introduction available for this roadmap."}
                </p>
              </div>

              {/* Footer: Date + Steps + Progress */}
              <div className="mt-4 flex items-center justify-between">
                <div className={`text-xs sm:text-sm ${textSecondary}`}>
                  <div>
                    {rm.createdAt
                      ? new Date(rm.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                  <div>{rm.content?.steps?.length || 0} steps</div>
                </div>
                <ProgressRing progress={rm.progress || 0} />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
