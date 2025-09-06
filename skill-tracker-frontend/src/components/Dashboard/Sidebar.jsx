// components/Dashboard/Sidebar.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../ThemeProvider";
import { getThemeColors } from "../../utils/themeUtils";
import {
  LayoutDashboard,
  Activity,
  Grid3X3,
  Sparkles,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const EXPANDED_PX = 240; // 16rem
const COLLAPSED_PX = 64; // 4rem

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { name: "Activity", icon: Activity, tab: "activity" },
  { name: "Templates", icon: Grid3X3, tab: "templates" },
];

const RESOURCE_ITEMS = [{ name: "Generate with AI", icon: Sparkles, type: "button" }];

/**
 * Theme-aware sidebar item.
 * - theme: the selected theme string ("light"|"dark"|"system")
 * - resolvedTheme: actual applied theme ("light"|"dark") from getActualTheme()
 * - themeColors: object returned by getThemeColors(theme)
 */
function SidebarItem({
  icon: Icon,
  name,
  isActive,
  isExpanded,
  onClick,
  isLink = false,
  href,
  ariaLabel,
  className = "",
  theme, // selected theme (system | dark | light)
  resolvedTheme, // actual resolved (dark | light)
  themeColors,
}) {
  const Element = isLink ? "a" : "button";

  // Use resolvedTheme for hover text accent (keeps Navbar-like behavior)
  const hoverTextAccent =
    resolvedTheme === "light" ? "hover:text-purple-600" : "hover:text-pink-400";

  const commonClasses = `group relative flex items-center w-full py-3 rounded-lg transition-colors`;
  const expandedClasses = `justify-start px-4`;
  const collapsedClasses = `justify-center px-0`;

  const activeClasses = `${themeColors.dashNavActiveBg || "bg-purple-600"} ${
    themeColors.dashNavActiveText || "text-white"
  }`;

  const inactiveClasses = `${themeColors.dashNavTextColor || "text-gray-300"} ${
    themeColors.dashNavHoverBg || ""
  } ${hoverTextAccent}`;

  // Tooltip bg (when collapsed): choose based on resolved theme
  const tooltipBg = resolvedTheme === "light" ? "bg-gray-800 text-white" : "bg-gray-900 text-white";

  const tooltipId = `${name.toLowerCase().replace(/\s/g, "-")}-tooltip`;

  return (
    <Element
      onClick={onClick}
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel || (isExpanded ? undefined : name)}
      aria-describedby={!isExpanded ? tooltipId : undefined}
      className={`${commonClasses} ${isExpanded ? expandedClasses : collapsedClasses} ${
        isActive ? activeClasses : inactiveClasses
      } ${className}`}
      title={isExpanded ? undefined : name}
    >
      {/* lucide icons use currentColor so text classes apply to icon as well */}
      <Icon size={18} />
      {isExpanded && <span className="ml-3 whitespace-nowrap">{name}</span>}

      {!isExpanded && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute left-full ml-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 whitespace-nowrap pointer-events-none ${tooltipBg}`}
        >
          {name}
        </span>
      )}
    </Element>
  );
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  setIsModalOpen,
  buttonVariants,
  isSidebarExpanded,
  setIsSidebarExpanded,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // IMPORTANT: use both the selected 'theme' and the resolved actual theme.
  // - `theme` may be "system" (we pass this to getThemeColors so system-specific classes are returned)
  // - `resolvedTheme` is "light" or "dark" (used for small behavior/accents)
  const { theme, getActualTheme } = useTheme();
  const resolvedTheme = getActualTheme(); // "light" | "dark"
  const themeColors = getThemeColors(theme); // pass raw `theme` so "system" yields system styles

  // choose a shadow class (theme utils uses different keys across themes)
  const shadowClass = themeColors.dashNavShadow || themeColors.syncShadow || themeColors.shadow || "";

  useEffect(() => {
    const width = isSidebarExpanded ? EXPANDED_PX : COLLAPSED_PX;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [isSidebarExpanded]);

  const animateStyle = { width: isSidebarExpanded ? EXPANDED_PX : COLLAPSED_PX };

  // small helpers
  const toggleHoverText = resolvedTheme === "light" ? "hover:text-purple-600" : "hover:text-white";
  const sectionHeaderColor = resolvedTheme === "light" ? "text-gray-500" : "text-gray-400";
  const headerBorder = themeColors.dashNavBorder || (resolvedTheme === "light" ? "border-gray-200" : "border-gray-800");

  return (
    <motion.aside
      initial={false}
      animate={animateStyle}
      transition={{ duration: 0.39, ease: "easeInOut" }}
      aria-expanded={isSidebarExpanded}
      className={`fixed left-0 top-0 h-screen flex flex-col overflow-hidden border-r ${themeColors.dashNavBg} ${themeColors.dashNavBorder} ${shadowClass}`}
      style={{ minWidth: COLLAPSED_PX }}
    >
      {/* Header */}
      <div className={`flex items-center h-16 border-b ${headerBorder} ${isSidebarExpanded ? "justify-between px-4" : "justify-center px-2"}`}>
        {isSidebarExpanded && (
          <span className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow">
              <Sparkles className="text-white" />
            </div>
            <div className={`text-lg font-semibold whitespace-nowrap ${themeColors.dashNavTextColor || ""}`}>
              Skill Tracker
            </div>
          </span>
        )}

        {/* Collapse/Expand */}
        <button
          onClick={() => setIsSidebarExpanded((s) => !s)}
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`p-2 rounded-full ${themeColors.dashNavTextColor || ""} ${themeColors.dashNavHoverBg || ""} ${toggleHoverText} focus:outline-none`}
          style={!isSidebarExpanded ? { position: "absolute", right: 6, top: 8 } : {}}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col flex-1 mt-4 px-1">
        {/* Back to Home */}
        <Link
          to="/"
          className={`group relative flex items-center w-full py-3 rounded-lg transition-colors ${isSidebarExpanded ? "justify-start px-4" : "justify-center px-0"} ${themeColors.dashNavTextColor || ""} ${themeColors.dashNavHoverBg || ""} ${resolvedTheme === "light" ? "hover:text-purple-600" : "hover:text-pink-400"}`}
          aria-label="Back to Home"
        >
          <ArrowLeft size={18} />
          {isSidebarExpanded && <span className="ml-3 whitespace-nowrap">Back to Home</span>}
        </Link>

        {/* Main nav */}
        <nav className="flex flex-col gap-2 mt-1 px-1" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.tab}
              icon={item.icon}
              name={item.name}
              isActive={activeTab === item.tab}
              isExpanded={isSidebarExpanded}
              onClick={() => setActiveTab(item.tab)}
              theme={theme}
              resolvedTheme={resolvedTheme}
              themeColors={themeColors}
            />
          ))}
        </nav>

        {/* Resources */}
        <div className={`mt-6 ${isSidebarExpanded ? "" : "flex flex-col items-center gap-3"}`}>
          {isSidebarExpanded && (
            <h4 className={`text-xs font-semibold uppercase tracking-widest px-4 mb-2 ${sectionHeaderColor}`}>
              Resources
            </h4>
          )}

          <nav className={`${isSidebarExpanded ? "flex flex-col gap-2 px-1" : "flex flex-col gap-3"}`} aria-label="Resource Links">
            {RESOURCE_ITEMS.map((item, i) => (
              <SidebarItem
                key={i}
                icon={item.icon}
                name={item.name}
                onClick={item.type === "button" ? () => setIsModalOpen(true) : undefined}
                isExpanded={isSidebarExpanded}
                theme={theme}
                resolvedTheme={resolvedTheme}
                themeColors={themeColors}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-2 py-4 border-t ${themeColors.dashNavBorder || ""}`}>
        <SidebarItem
          icon={LogOut}
          name="Logout"
          onClick={async () => {
            try {
              await logout();
              navigate("/");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
          isExpanded={isSidebarExpanded}
          theme={theme}
          resolvedTheme={resolvedTheme}
          themeColors={themeColors}
          className="hover:bg-red-600/10 hover:text-red-400"
        />
      </div>
    </motion.aside>
  );
}
