import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Route,
  TrendingUp,
  ShieldCheck,
  UserCog,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

function getActivityIcon(category, type) {
  if (category === "skills" || type === "skill_added" || type === "skill_updated") {
    return BookOpen;
  }
  if (category === "roadmaps" || type === "roadmap_deleted") {
    return Route;
  }
  if (category === "progress" || type === "roadmap_progress_updated") {
    return TrendingUp;
  }
  if (category === "goals") {
    return Target;
  }
  if (category === "auth") {
    return ShieldCheck;
  }
  if (category === "profile") {
    return UserCog;
  }
  if (category === "ai") {
    return Sparkles;
  }
  return Zap;
}

function getCategoryLabel(category) {
  switch (category) {
    case "skills":
      return "Skills";
    case "roadmaps":
      return "Roadmaps";
    case "progress":
      return "Progress";
    case "goals":
      return "Goals";
    case "auth":
      return "Authentication";
    case "profile":
      return "Profile";
    case "ai":
      return "AI";
    default:
      return "Other";
  }
}

function formatRelativeTime(dateString) {
  const value = new Date(dateString);
  if (Number.isNaN(value.getTime())) return "just now";

  const diffInSeconds = Math.floor((Date.now() - value.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ActivityCard({ activity }) {
  const { getActualTheme } = useTheme();
  const isDark = getActualTheme() === "dark";
  const Icon = getActivityIcon(activity.category, activity.type);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-2xl border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 sm:p-5 ${
        isDark
          ? "border-white/10 bg-[#0f172a]/80 shadow-[0_15px_50px_rgba(0,0,0,0.28)] hover:border-purple-400/30"
          : "border-gray-200/80 bg-white/90 hover:border-purple-300/70"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />

      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isDark
              ? "bg-gradient-to-br from-purple-500/20 to-pink-500/15 text-purple-200"
              : "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700"
          }`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {activity.title}
              </h3>
              <p className={`mt-1 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {activity.description || "A meaningful milestone in your learning journey."}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                isDark
                  ? "bg-white/10 text-slate-200"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {getCategoryLabel(activity.category)}
            </span>
          </div>

          <div className={`mt-3 flex flex-wrap items-center gap-3 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <span>{new Date(activity.createdAt).toLocaleString()}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            <span>{formatRelativeTime(activity.createdAt)}</span>
          </div>

          {(activity.metadata?.skillName || activity.metadata?.roadmapTitle) && (
            <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-sm ${isDark ? "border-white/10 bg-white/10 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
              {activity.metadata?.skillName || activity.metadata?.roadmapTitle}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
