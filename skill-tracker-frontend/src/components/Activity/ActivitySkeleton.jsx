import React from "react";
import { useTheme } from "../ThemeProvider";

export default function ActivitySkeleton() {
  const { getActualTheme } = useTheme();
  const isDark = getActualTheme() === "dark";

  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse overflow-hidden rounded-2xl border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-5 ${
            isDark
              ? "border-white/10 bg-[#0f172a]/80"
              : "border-gray-200/80 bg-white/90"
          }`}
        >
          <div className="flex gap-3">
            <div className={`h-11 w-11 rounded-2xl ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            <div className="flex-1 space-y-3">
              <div className={`h-4 w-2/3 rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              <div className={`h-3 w-full rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              <div className={`h-3 w-4/5 rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
