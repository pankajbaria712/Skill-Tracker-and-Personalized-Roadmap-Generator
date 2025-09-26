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
  onOpenResourceModal,
  onOpenAIModal,
  cardVariants,
  buttonVariants,
  onUpdateRoadmap, // ✅ new prop: parent passes callback to update roadmap progress in list
}) {
  const { getActualTheme } = useTheme();
  const resolvedTheme = getActualTheme(); // "light" | "dark"

  const cardBg =
    resolvedTheme === "light"
      ? "bg-white border-gray-200 text-gray-800"
      : "bg-gray-800 border-gray-700 text-white";

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2
          className={`text-2xl font-bold ${
            resolvedTheme === "light" ? "text-gray-900" : "text-white"
          }`}
        >
          Your Roadmaps
        </h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <select
              className={`w-full sm:w-auto rounded-lg border p-2 pr-8 ${
                resolvedTheme === "light"
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-gray-800 text-white border-gray-700"
              }`}
              aria-label="Sort roadmaps"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>By Progress</option>
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                resolvedTheme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>

          <motion.button
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Generate with AI */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className={`${cardBg} rounded-2xl shadow-xl border cursor-pointer flex flex-col items-center justify-center text-center p-6`}
          role="button"
          onClick={onOpenAIModal}
        >
          <Sparkles size={36} className="text-purple-400" />
          <h3 className="text-lg sm:text-xl font-bold mt-3">
            Generate with AI
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create a personalized roadmap using AI.
          </p>
        </motion.div>

        {/* Browse Templates */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className={`${cardBg} rounded-2xl shadow-xl border cursor-pointer flex flex-col items-center justify-center text-center p-6`}
          role="button"
        >
          <Grid3X3 size={36} className="text-purple-400" />
          <h3 className="text-lg sm:text-xl font-bold mt-3">
            Browse Templates
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Choose from pre-made paths.
          </p>
        </motion.div>

        {/* User Roadmaps */}
        <AnimatePresence>
          {roadmaps.map((rm) => (
            <motion.article
              key={rm._id || rm.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              className={`${cardBg} relative rounded-2xl shadow-xl border cursor-pointer flex flex-col justify-between p-6`}
              onClick={() =>
                onOpenRoadmap?.(rm, (updated) => onUpdateRoadmap?.(updated))
              }
            >
              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeRoadmap?.(rm._id || rm.id);
                }}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label={`Remove ${rm.title}`}
              >
                <Trash2 size={14} />
              </button>

              {/* Title + Description */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  {rm.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {rm.description || "No description provided."}
                </p>
              </div>

              {/* Footer: Date + Goals + Progress */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    {rm.date
                      ? rm.date
                      : new Date(rm.createdAt).toLocaleDateString()}
                  </div>
                  <div>{rm.content?.steps?.length || rm.goals || 0} goals</div>
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
