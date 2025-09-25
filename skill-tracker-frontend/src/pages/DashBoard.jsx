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

// ✅ import your backend API client
import API from "../utils/api";

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

  // Roadmaps (start empty, fetch from backend)
  const [roadmaps, setRoadmaps] = useState([]);

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

  // ✅ Fetch saved roadmaps on mount
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await API.get("/roadmaps");
        setRoadmaps(res.data);
      } catch (err) {
        setError("Failed to load roadmaps: " + err.message);
      }
    };
    fetchRoadmaps();
  }, []);

  // ✅ Call backend to generate + save roadmap
  const generateRoadmapWithAI = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await API.post("/roadmaps/generate", {
        title: roadmapTitle,
        proficiency,
      });
      setRoadmaps((prev) => [...prev, res.data]);
      setIsRoadmapModalOpen(false);
      setRoadmapTitle("");
      setProficiency(50);
    } catch (err) {
      setError("Failed to generate roadmap: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Delete roadmap via backend
  const removeRoadmap = async (id) => {
    try {
      await API.delete(`/roadmaps/${id}`);
      setRoadmaps((r) => r.filter((rm) => rm._id !== id));
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

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
