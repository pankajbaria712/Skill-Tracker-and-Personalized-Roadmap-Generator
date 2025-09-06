// src/pages/Dashboard.jsx
import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CreditCard, Loader2 } from "lucide-react";

import useBreakpoint from "../hooks/useBreakpoint";
import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/DashboardNavbar";
import RoadmapSection from "../components/Dashboard/RoadmapSection";
import AIRoadmapModal from "../components/Dashboard/AIRoadmapModal";
import ActivityFeed from "../components/Dashboard/ActivityFeed";
import TemplatesBrowser from "../components/Dashboard/TemplatesBrowser";
import AIResourceModal from "../components/Dashboard/AIResourceModal";
import RoadmapDetail from "../components/Dashboard/RoadmapDetail";
import TargetCursor from "../components/Animations/TargetCursor/TargetCursor";

// theme
import { useTheme } from "../components/ThemeProvider";

const cardVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.36 } },
};

const EXPANDED_PX = 240;
const COLLAPSED_PX = 64;
const STORAGE_KEY = "sidebarExpanded";

export default function Dashboard() {
  const { isDesktop, isMobile } = useBreakpoint();
  const { theme, getActualTheme } = useTheme();
  const resolvedTheme = getActualTheme(); // "light" | "dark"

  // Navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Roadmaps
  const [roadmaps, setRoadmaps] = useState([
    {
      id: 1,
      title: "Fashion Design Learning Roadmap",
      description:
        "A structured 12-week roadmap to get started with fashion design.",
      date: "Aug 7, 2025",
      goals: 6,
      progress: 65,
    },
    {
      id: 2,
      title: "Data Analytics with Python",
      description:
        "A structured learning path to mastering data analytics using Python.",
      date: "Aug 7, 2025",
      goals: 12,
      progress: 80,
    },
    {
      id: 3,
      title: "Crack System Design Interviews",
      description: "Roadmap for system design interviews.",
      date: "Aug 8, 2025",
      goals: 8,
      progress: 25,
    },
  ]);

  // Roadmap creation & modals
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [proficiency, setProficiency] = useState(50);
  const [error, setError] = useState(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedRoadmapTitle, setSelectedRoadmapTitle] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Sidebar state persistence
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const val = stored !== null ? JSON.parse(stored) : true;
      setIsSidebarExpanded(val);
      document.documentElement.style.setProperty(
        "--sidebar-width",
        `${val ? EXPANDED_PX : COLLAPSED_PX}px`
      );
    } catch {
      document.documentElement.style.setProperty(
        "--sidebar-width",
        `${EXPANDED_PX}px`
      );
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isSidebarExpanded));
    } catch {}
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${isSidebarExpanded ? EXPANDED_PX : COLLAPSED_PX}px`
    );
  }, [isSidebarExpanded]);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const generateRoadmapWithAI = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `
  Generate a learning roadmap for: ${roadmapTitle}. Proficiency: ${proficiency}.
  Return the result as JSON in this format:
  {
    "sections": [
      { "title": "Section Title", "subtopics": ["Subtopic 1", "Subtopic 2"] }
    ]
  }
  `;
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API error: " + response.status);
      }

      const data = await response.json();
      const roadmapText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No roadmap generated.";

      // Try to parse JSON from the response
      let parsedContent = { sections: [] };
      try {
        const jsonStart = roadmapText.indexOf("{");
        const jsonEnd = roadmapText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = roadmapText.substring(jsonStart, jsonEnd + 1);
          parsedContent = JSON.parse(jsonString);
        }
      } catch (e) {
        parsedContent = {
          sections: [{ title: "Roadmap", subtopics: [roadmapText] }],
        };
      }

      const goalsCount = parsedContent.sections.reduce(
        (acc, s) => acc + (s.subtopics ? s.subtopics.length : 0),
        0
      );

      const newRoadmap = {
        id: Date.now(),
        title: roadmapTitle,
        description: "Roadmap generated by Gemini AI.",
        date: new Date().toLocaleDateString(),
        goals: goalsCount,
        progress: 0,
        generatedContent: parsedContent,
      };

      setRoadmaps((prev) => [...prev, newRoadmap]);
      setIsRoadmapModalOpen(false);
      setRoadmapTitle("");
      setProficiency(50);
    } catch (err) {
      setError("Failed to generate roadmap: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeRoadmap = (id) =>
    setRoadmaps((r) => r.filter((rm) => rm.id !== id));
  const openResourceModalFor = (title) => {
    setSelectedRoadmapTitle(title);
    setIsResourceModalOpen(true);
  };
  const openRoadmapDetail = (rm) => setSelectedRoadmap(rm);

  const mainVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.36 } },
  };

  const layoutStyle = {
    marginLeft: isDesktop ? `var(--sidebar-width)` : 0,
    paddingTop: isMobile ? "56px" : 0,
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <TargetCursor />

            {/* Welcome Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl p-4 sm:p-6 border
                ${
                  resolvedTheme === "light"
                    ? "bg-white border-gray-200 text-gray-800"
                    : "bg-gray-800 border-gray-700 text-white"
                }
              `}
            >
              <div className="flex items-start md:items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    resolvedTheme === "light"
                      ? "bg-purple-500/10 text-purple-600"
                      : "bg-purple-500/10 text-white"
                  }
                `}
                >
                  <User size={26} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Hello, Pankaj!
                  </h3>
                  <p
                    className={`text-sm ${
                      resolvedTheme === "light"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    Welcome back to your learning journey.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`${
                    resolvedTheme === "light" ? "text-gray-800" : "text-white"
                  } flex items-center gap-2`}
                >
                  <CreditCard size={16} />
                  <span className="text-sm">10 Credits</span>
                </div>
                <button
                  className="px-3 py-2 rounded-full font-semibold text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(236,72,153,1) 100%)",
                  }}
                >
                  Purchase Credits
                </button>
              </div>
            </motion.div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {selectedRoadmap ? (
                <RoadmapDetail
                  key="detail"
                  roadmap={selectedRoadmap}
                  onBack={() => setSelectedRoadmap(null)}
                />
              ) : isGenerating ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Loader2 size={40} className="animate-spin text-purple-400" />
                  <p
                    className={`mt-4 ${
                      resolvedTheme === "light"
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  >
                    Generating your personalized roadmap...
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  className="text-red-500 text-center py-8"
                >
                  {error}
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard-view"
                  initial="hidden"
                  animate="visible"
                  variants={mainVariants}
                  className="space-y-6"
                >
                  <RoadmapSection
                    roadmaps={roadmaps}
                    removeRoadmap={removeRoadmap}
                    onOpenRoadmap={openRoadmapDetail}
                    onOpenResourceModal={openResourceModalFor}
                    onOpenAIModal={() => setIsRoadmapModalOpen(true)}
                    cardVariants={cardVariants}
                  />

                  <ActivityFeed />

                  <TemplatesBrowser
                    onUseTemplate={(template) => {
                      setRoadmapTitle(template.title);
                      setProficiency(50);
                      setIsRoadmapModalOpen(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      default:
        return (
          <div
            className={`p-6 ${
              resolvedTheme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Content for tab: {activeTab}
          </div>
        );
    }
  };

  // 🔹 Full page background (light/dark/system)
  const getDashboardBg = () => {
    if (theme === "system") {
      return "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]";
    }
    return resolvedTheme === "light" ? "bg-gray-50" : "bg-black";
  };

  return (
    <div
      className={`${getDashboardBg()} min-h-screen flex transition-colors duration-300`}
    >
      {/* Sidebar for desktop */}
      {isDesktop && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsModalOpen={setIsRoadmapModalOpen}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
        />
      )}
      {/* Main area */}
      <div className="flex-1 flex flex-col" style={layoutStyle}>
        {/* Navbar for mobile */}
        {isMobile && (
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
          />
        )}

        <main className="p-4 sm:p-6 flex-1">{renderDashboardContent()}</main>
      </div>

      {/* Modals */}
      <AIRoadmapModal
        isModalOpen={isRoadmapModalOpen}
        setIsModalOpen={setIsRoadmapModalOpen}
        generateRoadmapWithAI={generateRoadmapWithAI}
        isGenerating={isGenerating}
        roadmapTitle={roadmapTitle}
        setRoadmapTitle={setRoadmapTitle}
        proficiency={proficiency}
        setProficiency={setProficiency}
        onGenerate={generateRoadmapWithAI}
      />
      <AIResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        roadmapTitle={selectedRoadmapTitle}
      />
    </div>
  );
}
