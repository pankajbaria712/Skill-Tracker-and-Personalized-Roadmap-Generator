// src/pages/Dashboard.jsx
import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Sparkles } from "lucide-react";

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

import { useTheme } from "../components/ThemeProvider";

// ✅ backend API client
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
  const resolvedTheme = getActualTheme();

  // Navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Roadmaps
  const [roadmaps, setRoadmaps] = useState([]);

  // Roadmap modals
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [proficiency, setProficiency] = useState(50);
  const [error, setError] = useState(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedRoadmapTitle, setSelectedRoadmapTitle] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // ✅ Username state
  const [username, setUsername] = useState("Learner");

  // Sidebar persistence
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

  // ✅ Fetch saved roadmaps
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

  // ✅ Fetch current user name properly
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const uid = localStorage.getItem("uid");

        if (!token && !uid) return;

        const res = await API.get(uid ? `/auth/me?uid=${uid}` : "/auth/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.data?.user) {
          const { firstName, lastName } = res.data.user;
          setUsername(`${firstName} ${lastName || ""}`.trim());
        }
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    }
    fetchUser();
  }, []);

  // ✅ AI Roadmap generation
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

  // ✅ Delete roadmap
  const removeRoadmap = async (id) => {
    try {
      await API.delete(`/roadmaps/${id}`);
      setRoadmaps((r) => r.filter((rm) => rm._id !== id));
      if (selectedRoadmap && selectedRoadmap._id === id) {
        setSelectedRoadmap(null);
      }
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  // ✅ Update roadmap state
  const updateRoadmapInState = (updated) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r))
    );
    if (selectedRoadmap && selectedRoadmap._id === updated._id) {
      setSelectedRoadmap(updated);
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

            {/* 🎉 Welcome Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,1) 0%, rgba(59,130,246,1) 100%)",
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Hi, {username} 👋</h3>
                    <p className="text-sm opacity-90">
                      Ready to conquer your next skill today?
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsRoadmapModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm shadow-md bg-white text-purple-600"
                >
                  <Sparkles size={18} />
                  <span>Start New Roadmap</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {selectedRoadmap ? (
                <RoadmapDetail
                  key="detail"
                  roadmap={selectedRoadmap}
                  onBack={() => setSelectedRoadmap(null)}
                  onUpdate={updateRoadmapInState}
                />
              ) : isGenerating ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Loader2 size={40} className="animate-spin text-purple-200" />
                  <p className="mt-4 text-white/80">
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
                    onUpdateRoadmap={updateRoadmapInState}
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
      {isDesktop && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsModalOpen={setIsRoadmapModalOpen}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
        />
      )}
      <div className="flex-1 flex flex-col" style={layoutStyle}>
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
