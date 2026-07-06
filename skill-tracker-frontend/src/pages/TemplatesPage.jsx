import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Plus,
  Compass,
  Layers3,
  Wand2,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeProvider";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
  });
  const { getActualTheme } = useTheme();
  const isDark = getActualTheme() === "dark";

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const { data } = await API.get(`/templates`, {
          timeout: 20000,
        });
        if (mounted) setTemplates(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) {
          setError(
            e?.response?.data?.message || e?.message || "Failed to load"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category).filter(Boolean));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [templates]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return templates.filter((t) => {
      const matchesCategory =
        selectedCategory === "all" || t.category === selectedCategory;
      const hay = `${t.title || ""} ${t.description || ""} ${
        t.category || ""
      } ${(t.skills || []).join(" ")}`.toLowerCase();
      const matchesQuery = q.length === 0 || hay.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [templates, searchTerm, selectedCategory]);

  const featured = filtered.find((t) => t.featured) || filtered[0] || templates[0];

  const stats = useMemo(() => {
    const totalTemplates = templates.length;
    const featuredTemplates = templates.filter((t) => t.featured).length;
    const skillCount = templates.reduce((sum, tpl) => {
      const skills = Array.isArray(tpl.skills) ? tpl.skills : [];
      return sum + skills.length;
    }, 0);

    return {
      totalTemplates,
      featuredTemplates,
      skillCount,
      categoriesCount: Math.max(categories.length - 1, 0),
    };
  }, [templates, categories]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#07111f] via-[#111827] to-[#1f2937] text-white"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-sky-100 text-slate-900"
      }`}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10 ${
            isDark
              ? "border-white/10 bg-white/10 backdrop-blur-xl"
              : "border-gray-200/80 bg-white/80 backdrop-blur-xl"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.24),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_35%)]" />
          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${
                    isDark
                      ? "border-purple-400/20 bg-purple-400/10 text-purple-200"
                      : "border-purple-200 bg-purple-50 text-purple-700"
                  }`}
                >
                  <Sparkles size={16} />
                  AI roadmap library
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Discover polished learning paths that feel built for you.
                </h1>
                <p
                  className={`mt-3 text-base leading-7 sm:text-lg ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Browse templates from your community, search by skill or category,
                  and create your own roadmap blueprint in seconds.
                </p>
              </div>

              <button
                onClick={() => setOpenCreate(true)}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-semibold transition-all ${
                  isDark
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20 hover:brightness-110"
                    : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/20 hover:brightness-110"
                }`}
              >
                <Plus size={18} />
                Create template
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { label: "Templates", value: stats.totalTemplates },
                { label: "Categories", value: stats.categoriesCount },
                { label: "Featured", value: stats.featuredTemplates },
                { label: "Skills Covered", value: stats.skillCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border p-4 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-black/20"
                      : "border-gray-200 bg-slate-50"
                  }`}
                >
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section
          className={`mt-8 rounded-[1.5rem] border p-4 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:p-6 ${
            isDark
              ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl"
              : "border-gray-200/80 bg-white/80 backdrop-blur-xl"
          }`}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                          : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg"
                        : isDark
                          ? "bg-white/10 text-slate-300 hover:bg-white/20"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {category === "all" ? "All templates" : category}
                  </button>
                );
              })}
            </div>

            <label
              className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
                isDark
                  ? "border-white/10 bg-black/20 text-slate-300"
                  : "border-gray-200 bg-slate-50 text-slate-700"
              }`}
            >
              <Search size={16} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates"
                className={`w-full bg-transparent text-sm outline-none sm:w-56 ${
                  isDark
                    ? "text-white placeholder:text-slate-400"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </label>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`h-72 animate-pulse rounded-[1.5rem] border ${
                  isDark
                    ? "border-white/10 bg-white/10"
                    : "border-gray-200 bg-white"
                }`}
              />
            ))}
          </div>
        ) : error ? (
          <div
            className={`mt-8 rounded-[1.5rem] border p-8 text-center shadow-[0_10px_35px_rgba(15,23,42,0.08)] ${
              isDark
                ? "border-red-400/20 bg-red-500/10 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                isDark ? "bg-red-400/10" : "bg-red-100"
              }`}
            >
              <TrendingUp size={22} />
            </div>
            <p className="mt-4 text-lg font-semibold">We hit a snag loading your templates.</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${
                isDark ? "bg-white/10 hover:bg-white/20" : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className={`mt-8 rounded-[1.5rem] border p-8 text-center shadow-[0_10px_35px_rgba(15,23,42,0.08)] ${
              isDark
                ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl"
                : "border-gray-200/80 bg-white/80 backdrop-blur-xl"
            }`}
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                isDark ? "bg-purple-500/10 text-purple-200" : "bg-purple-100 text-purple-700"
              }`}
            >
              <Compass size={24} />
            </div>
            <h2 className="mt-4 text-xl font-semibold">No templates match this view yet.</h2>
            <p className={`mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Try another search term or open a different category.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 overflow-hidden rounded-[1.75rem] border shadow-[0_15px_45px_rgba(15,23,42,0.12)] ${
                  isDark
                    ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl"
                    : "border-gray-200/80 bg-white/80 backdrop-blur-xl"
                }`}
              >
                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative h-72 w-full lg:h-full">
                    {featured.bannerImage ? (
                      <img
                        src={featured.bannerImage}
                        alt={featured.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center ${
                          isDark ? "bg-slate-900" : "bg-slate-100"
                        }`}
                      >
                        <Compass size={32} className={isDark ? "text-slate-500" : "text-slate-400"} />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  </div>
                  <div className="relative p-6 sm:p-8 lg:p-10">
                    <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
                    <div className="relative">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${isDark ? "bg-purple-400/10 text-purple-200" : "bg-purple-50 text-purple-700"}`}>
                        <Wand2 size={16} />
                        Featured template
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                        {featured.title}
                      </h2>
                      <p className={`mt-3 text-base leading-7 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {featured.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(featured.skills || []).slice(0, 8).map((skill) => (
                          <span
                            key={skill}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isDark
                                ? "bg-white/10 text-slate-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                          <Layers3 size={16} />
                          {(featured.skills || []).length} skills
                        </span>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                          <Compass size={16} />
                          {featured.category || "General"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tpl) => (
                <motion.article
                  key={tpl._id || `${tpl.title}-${tpl.category}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className={`group overflow-hidden rounded-[1.5rem] border shadow-[0_10px_35px_rgba(15,23,42,0.08)] ${
                    isDark
                      ? "border-white/10 bg-[#0f172a]/70 backdrop-blur-xl"
                      : "border-gray-200/80 bg-white/80 backdrop-blur-xl"
                  }`}
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {tpl.bannerImage ? (
                      <img
                        src={tpl.bannerImage}
                        alt={tpl.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                        <Compass size={26} className={isDark ? "text-slate-600" : "text-slate-400"} />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {tpl.category || "General"}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">{tpl.title}</h3>
                      {tpl.featured ? (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isDark ? "bg-purple-400/10 text-purple-200" : "bg-purple-50 text-purple-700"}`}>
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className={`line-clamp-3 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {tpl.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(tpl.skills || []).slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            isDark
                              ? "bg-white/10 text-slate-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {(tpl.skills || []).length} skills
                      </span>
                      <button className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-cyan-300" : "text-indigo-600"}`}>
                        Explore
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </main>

      {openCreate && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => (!creating ? setOpenCreate(false) : null)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-2xl overflow-hidden rounded-[1.75rem] border shadow-2xl ${
                isDark
                  ? "border-white/10 bg-slate-950/90"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className={`border-b px-6 py-5 ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-500">
                  <Wand2 size={16} />
                  Build your own blueprint
                </div>
                <h3 className="mt-2 text-xl font-semibold">Create a new template</h3>
                <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Share the outline and we’ll generate a polished template card for your library.
                </p>
              </div>

              <form
                className="space-y-4 px-6 py-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (creating) return;
                  setCreating(true);
                  try {
                    const payload = {
                      title: form.title.trim(),
                      description: form.description.trim(),
                      category: form.category.trim(),
                      skills: form.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    };
                    const { data } = await API.post(`/templates/generate`, payload, {
                      timeout: 60000,
                      headers: { "Content-Type": "application/json" },
                    });
                    setTemplates((prev) => [data, ...prev]);
                    setOpenCreate(false);
                    setForm({
                      title: "",
                      description: "",
                      category: "",
                      skills: "",
                    });
                  } catch (e) {
                    alert(
                      e?.response?.data?.message ||
                        e?.message ||
                        "Failed to create template"
                    );
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                <div>
                  <label className={`mb-1 block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Title
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={`w-full rounded-2xl border px-3 py-2.5 outline-none transition focus:border-purple-500 ${
                      isDark
                        ? "border-white/10 bg-slate-900 text-white"
                        : "border-gray-200 bg-white text-slate-900"
                    }`}
                    placeholder="e.g., Frontend Developer Roadmap"
                  />
                </div>
                <div>
                  <label className={`mb-1 block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={`w-full rounded-2xl border px-3 py-2.5 outline-none transition focus:border-purple-500 ${
                      isDark
                        ? "border-white/10 bg-slate-900 text-white"
                        : "border-gray-200 bg-white text-slate-900"
                    }`}
                    placeholder="Brief summary of what this roadmap covers"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={`mb-1 block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Category
                    </label>
                    <input
                      required
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className={`w-full rounded-2xl border px-3 py-2.5 outline-none transition focus:border-purple-500 ${
                        isDark
                          ? "border-white/10 bg-slate-900 text-white"
                          : "border-gray-200 bg-white text-slate-900"
                      }`}
                      placeholder="e.g., Web Development"
                    />
                  </div>
                  <div>
                    <label className={`mb-1 block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Skills (comma-separated)
                    </label>
                    <input
                      value={form.skills}
                      onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                      className={`w-full rounded-2xl border px-3 py-2.5 outline-none transition focus:border-purple-500 ${
                        isDark
                          ? "border-white/10 bg-slate-900 text-white"
                          : "border-gray-200 bg-white text-slate-900"
                      }`}
                      placeholder="HTML, CSS, JavaScript"
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-end gap-3 border-t px-6 py-4 ${isDark ? "border-white/10" : "border-gray-200"}`}>
                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => setOpenCreate(false)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
                  >
                    {creating && (
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
