import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TemplateCard({ template, variant = "roadmap" }) {
  const navigate = useNavigate();

  const cardStyles = {
    roadmap: "bg-white dark:bg-gray-800",
    growth: "bg-blue-50 dark:bg-gray-800/80",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/templates/${template.id}`)}
      className={`${cardStyles[variant]} rounded-lg shadow-md hover:shadow-lg cursor-pointer overflow-hidden`}
    >
      <img
        src={template.thumbnail}
        alt={template.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {template.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-500 dark:text-gray-400">
            ⏳ {template.duration}
          </span>
          <span className="flex items-center text-gray-500 dark:text-gray-400">
            📚 {template.skillCount} skills
          </span>
        </div>
        {template.difficulty && (
          <span
            className={`
            mt-3 inline-block px-2 py-1 text-xs rounded-full
            ${
              template.difficulty === "Beginner"
                ? "bg-green-100 text-green-800"
                : template.difficulty === "Intermediate"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {template.difficulty}
          </span>
        )}
      </div>
    </motion.div>
  );
}
