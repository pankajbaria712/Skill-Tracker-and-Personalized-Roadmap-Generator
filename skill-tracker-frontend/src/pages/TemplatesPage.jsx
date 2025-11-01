import React, { useState, useEffect, useMemo } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

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
        if (mounted)
          setError(
            e?.response?.data?.message || e?.message || "Failed to load"
          );
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

  const featured = filtered[0] || templates[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                AI Roadmap Templates
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Discover curated learning roadmaps generated with AI. Search and
                filter to find your next path.
              </p>
            </div>
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-3 text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Template
            </button>
          </div>
        </header>

        {/* Controls */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates, skills, categories..."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 shadow-sm outline-none transition focus:border-indigo-500"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 shadow-sm outline-none transition focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            Loading templates...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-8 text-center text-gray-600 dark:text-gray-400">
            No templates found. Try a different search or category.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tpl) => (
              <article
                key={tpl._id || `${tpl.title}-${tpl.category}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md transition hover:shadow-xl"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {tpl.bannerImage ? (
                    <img
                      src={tpl.bannerImage}
                      alt={tpl.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {tpl.title}
                    </h3>
                    <span className="rounded-full bg-indigo-600/15 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30">
                      {tpl.category || "General"}
                    </span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {tpl.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(tpl.skills || []).slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-gray-100 dark:bg-gray-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Featured Banner */}
        {featured && (
          <section className="mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-fuchsia-600/20"></div>
              <div className="grid items-stretch gap-0 md:grid-cols-2">
                <div className="relative h-60 w-full md:h-full">
                  {featured.bannerImage ? (
                    <img
                      src={featured.bannerImage}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="relative p-8">
                  <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                      Featured Template
                    </h2>
                    <p className="mt-2 max-w-prose text-gray-700 dark:text-gray-300">
                      {featured.title} — {featured.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(featured.skills || []).slice(0, 8).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-700 dark:text-indigo-200 ring-1 ring-indigo-400/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Create Template Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => (!creating ? setOpenCreate(false) : null)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Template
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Provide details and we’ll generate a banner automatically.
                </p>
              </div>
              <form
                className="px-6 py-5 space-y-4"
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
                    const { data } = await API.post(
                      `/templates/generate`,
                      payload,
                      {
                        timeout: 60000,
                        headers: { "Content-Type": "application/json" },
                      }
                    );
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 outline-none"
                    placeholder="e.g., Frontend Developer Roadmap"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 outline-none"
                    placeholder="Brief summary of what this roadmap covers"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <input
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 outline-none"
                      placeholder="e.g., Web Development"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills (comma-separated)
                    </label>
                    <input
                      value={form.skills}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, skills: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-indigo-500 outline-none"
                      placeholder="HTML, CSS, JavaScript"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 px-6 py-4 -mx-6">
                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => setOpenCreate(false)}
                    className="rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-60"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
