// src/components/Dashboard/RoadmapSection.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Grid3X3, Trash2 } from "lucide-react";
import ProgressRing from "./ProgressRing";

/**
 * RoadmapSection
 * Props:
 * - roadmaps: array
 * - removeRoadmap(id)
 * - onOpenRoadmap(roadmap) -> open detail
 * - onOpenResourceModal(title) -> open resources modal
 * - onOpenAIModal() -> open AI modal
 * - cardVariants, buttonVariants (optional for animation)
 */
export default function RoadmapSection({
  roadmaps = [],
  removeRoadmap,
  onOpenRoadmap,
  onOpenResourceModal,
  onOpenAIModal,
  cardVariants,
  buttonVariants,
}) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Your Roadmaps</h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <select
              className="w-full sm:w-auto bg-gray-800 text-white rounded-lg border border-gray-700 p-2 pr-8"
              aria-label="Sort roadmaps"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>By Progress</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Generate with AI */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 cursor-pointer flex flex-col items-center justify-center text-center"
          role="button"
          onClick={onOpenAIModal}
        >
          <Sparkles size={36} className="text-purple-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white mt-3">
            Generate with AI
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            Create a personalized roadmap using AI.
          </p>
        </motion.div>

        {/* Browse Templates */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 cursor-pointer flex flex-col items-center justify-center text-center"
          role="button"
        >
          <Grid3X3 size={36} className="text-purple-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white mt-3">
            Browse Templates
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            Choose from pre-made paths.
          </p>
        </motion.div>

        {/* Dynamic Roadmaps */}
        <AnimatePresence>
          {roadmaps.map((rm, i) => (
            <motion.article
              key={rm.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              className="relative p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 cursor-pointer flex flex-col justify-between"
              onClick={() => onOpenRoadmap?.(rm)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeRoadmap?.(rm.id);
                }}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-gray-700 transition"
                aria-label={`Remove ${rm.title}`}
              >
                <Trash2 size={14} />
              </button>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {rm.title}
                </h3>
                <p className="text-gray-400 mt-2 text-sm">{rm.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-400">
                  <div>{rm.date}</div>
                  <div>{rm.goals} goals</div>
                </div>
                <ProgressRing progress={rm.progress} />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
