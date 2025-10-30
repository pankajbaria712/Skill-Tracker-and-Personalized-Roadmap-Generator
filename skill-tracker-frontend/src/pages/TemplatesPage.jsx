// src/pages/Templates.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TemplateCard from "../components/Template Page/TemplateCard";
import LoadingSpinner from "../components/Template Page/LoadingSpinner";
import CreateTemplateModal from "../components/Template Page/CreateTemplateModal";

export default function Templates() {
  // State management
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter templates by type
  const roadmapTemplates = templates.filter((t) => t.type === "roadmap");
  const growthTemplates = templates.filter((t) => t.type === "growth");
  const featuredTemplate = templates.find((t) => t.featured);

  // Fetch templates data
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/templates");
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API error ${response.status}: ${text}`);
        }

        if (!contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Expected JSON but received: ${text.slice(0, 400)}`);
        }

        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Filter logic
  const filterTemplates = (templates) => {
    return templates.filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Add create template function
  const handleCreateTemplate = async (templateData) => {
    try {
      const response = await fetch("http://localhost:5000/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Create failed: ${response.status} ${text}`);
      }

      const newTemplate = await response.json();
      // append to local state so UI updates immediately
      setTemplates((prev) => [newTemplate, ...prev]);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 text-center max-w-5xl mx-auto px-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
          Explore Learning Templates
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Ready-to-use skill paths and roadmaps for every developer level.
        </p>
      </motion.div>

      {/* Search & Filter Section */}
      <div className="mt-8 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
            <option value="datascience">Data Science</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Roadmap Templates Section */}
      <section className="mt-12 max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          🚀 Roadmap Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterTemplates(roadmapTemplates).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* Skill Growth Plans Section */}
      <section className="mt-12 max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📈 Skill Growth Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterTemplates(growthTemplates).map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              variant="growth"
            />
          ))}
        </div>
      </section>

      {/* Featured Template Banner */}
      {featuredTemplate && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 max-w-5xl mx-auto px-6 mb-12"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h3 className="text-3xl font-bold mb-4">
              🔥 {featuredTemplate.title}
            </h3>
            <p className="text-xl mb-6">{featuredTemplate.description}</p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Use Template
            </button>
          </div>
        </motion.section>
      )}

      {/* Add Create Template button after the header section */}
      <div className="mt-8 max-w-5xl mx-auto px-6 flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Create Template
        </button>
      </div>

      {/* Add Modal component */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTemplate}
      />
    </div>
  );
}
