import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Sparkles, ArrowRight, CalendarRange, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import ActivityCard from "../components/Activity/ActivityCard";
import ActivitySkeleton from "../components/Activity/ActivitySkeleton";
import API from "../utils/api";
import { useTheme } from "../components/ThemeProvider";
import { useNavigate } from "react-router-dom";

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Skills", value: "skills" },
  { label: "Roadmaps", value: "roadmaps" },
  { label: "Progress", value: "progress" },
  { label: "Goals", value: "goals" },
  { label: "Authentication", value: "auth" },
  { label: "Profile", value: "profile" },
  { label: "AI", value: "ai" },
  { label: "Other", value: "other" },
];

function groupActivities(activities) {
  const buckets = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "Last Month": [],
    Older: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(startOfToday);
  startOfMonth.setMonth(startOfMonth.getMonth() - 1);

  activities.forEach((activity) => {
    const createdAt = new Date(activity.createdAt);
    if (createdAt >= startOfToday) {
      buckets.Today.push(activity);
    } else if (createdAt >= startOfYesterday) {
      buckets.Yesterday.push(activity);
    } else if (createdAt >= startOfWeek) {
      buckets["This Week"].push(activity);
    } else if (createdAt >= startOfMonth) {
      buckets["Last Month"].push(activity);
    } else {
      buckets.Older.push(activity);
    }
  });

  return Object.entries(buckets).filter(([, value]) => value.length > 0);
}

export default function ActivityPage({ embedded = false }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const { theme, getActualTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = getActualTheme() === "dark";
  const isSystem = theme === "system";

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get("/activities");
        setActivities(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your activity timeline right now.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();
    let next = [...activities];

    if (filter !== "all") {
      next = next.filter((activity) => activity.category === filter);
    }

    if (term) {
      next = next.filter((activity) => {
        const haystack = [
          activity.title,
          activity.description,
          activity.metadata?.skillName,
          activity.metadata?.roadmapTitle,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    next.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

    return next;
  }, [activities, filter, search, sortOrder]);

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const skillsAdded = activities.filter((activity) => activity.category === "skills").length;
    const roadmapsGenerated = activities.filter((activity) => activity.type === "roadmap_generated").length;
    const completedGoals = activities.filter((activity) => activity.type === "goal_completed").length;
    return { totalActivities, skillsAdded, roadmapsGenerated, completedGoals };
  }, [activities]);

  const grouped = useMemo(() => groupActivities(filteredActivities), [filteredActivities]);
  const pageShellClass = embedded
    ? "w-full"
    : `min-h-screen transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-slate-900"}`;
  const contentClass = embedded
    ? "mx-auto w-full max-w-6xl px-0 py-0"
    : "mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8";

  if (loading) {
    return (
      <div className={pageShellClass}>
        {!embedded && <Navbar />}
        <div className={contentClass}>
          <div className={`rounded-2xl border p-6 shadow-[0_15px_50px_rgba(15,23,42,0.08)] sm:p-8 ${isDark ? "border-white/10 bg-white/10 backdrop-blur-xl" : "border-gray-200/80 bg-white/80 backdrop-blur-xl"}`}>
            <div className={`mb-6 h-8 w-48 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            <div className={`mb-4 h-4 w-72 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`h-24 rounded-2xl ${isDark ? "bg-white/10" : "bg-slate-100"}`} />
              ))}
            </div>
            <div className="mt-8">
              <ActivitySkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageShellClass}>
      {!embedded && <Navbar />}
      <main className={contentClass}>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden rounded-2xl border p-6 shadow-[0_15px_50px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10 ${isDark ? "border-white/10 bg-white/10 backdrop-blur-xl" : "border-gray-200/80 bg-white/80 backdrop-blur-xl"}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${isDark ? "border-purple-400/20 bg-purple-400/10 text-purple-200" : "border-purple-200 bg-purple-50 text-purple-700"}`}>
                  <Sparkles size={16} />
                  Activity Timeline
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Follow your complete learning journey.
                </h1>
                <p className={`mt-3 text-base leading-7 sm:text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  Discover the milestones, roadmaps, and progress updates that tell the story of how you grow every day.
                </p>
              </div>
              <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-slate-50"}`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarRange size={16} />
                  <span>Live from your learning data</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { label: "Total Activities", value: stats.totalActivities },
                { label: "Skills Added", value: stats.skillsAdded },
                { label: "Roadmaps Generated", value: stats.roadmapsGenerated },
                { label: "Goals Completed", value: stats.completedGoals },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-white/10 bg-white/10" : "border-gray-200 bg-slate-50"}`}>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className={`mt-8 rounded-2xl border p-4 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:p-6 ${isDark ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl" : "border-gray-200/80 bg-white/80 backdrop-blur-xl"}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all ${filter === option.value ? (isDark ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg") : isDark ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className={`flex items-center gap-2 rounded-full border px-3 py-2 ${isDark ? "border-white/10 bg-black/20 text-slate-300" : "border-gray-200 bg-slate-50 text-slate-700"}`}>
                <Search size={16} />
                <input
                  aria-label="Search activities"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search activity"
                  className={`w-full bg-transparent text-sm outline-none sm:w-48 ${isDark ? "text-white placeholder:text-slate-400" : "text-slate-900 placeholder:text-slate-400"}`}
                />
              </label>
              <select
                aria-label="Sort activities"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`rounded-full border px-3 py-2 text-sm outline-none ${isDark ? "border-white/10 bg-black/20 text-slate-200" : "border-gray-200 bg-slate-50 text-slate-700"}`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </section>

        {error ? (
          <div className={`mt-8 rounded-2xl border p-8 text-center shadow-[0_10px_35px_rgba(15,23,42,0.08)] ${isDark ? "border-red-400/20 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? "bg-red-400/10" : "bg-red-100"}`}>
              <TrendingUp size={22} />
            </div>
            <p className="mt-4 text-lg font-semibold">We hit a snag loading your activity feed.</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-slate-900 text-white hover:bg-slate-700"}`}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 rounded-2xl border p-8 text-center shadow-[0_10px_35px_rgba(15,23,42,0.08)] ${isDark ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl" : "border-gray-200/80 bg-white/80 backdrop-blur-xl"}`}
          >
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-purple-500/10 text-purple-200" : "bg-purple-100 text-purple-700"}`}>
              <Sparkles size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">No Activities Yet</h2>
            <p className={`mx-auto mt-3 max-w-xl text-base leading-7 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Start tracking skills, generate AI-powered roadmaps, and complete milestones to build your activity timeline.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          </motion.section>
        ) : (
          <div className="mt-8 space-y-8">
            {grouped.map(([bucket, items]) => (
              <section key={bucket}>
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{bucket}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {items.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {items.map((activity) => (
                    <ActivityCard key={activity._id} activity={activity} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
