// src/components/Dashboard/DashboardNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Grid3X3,
  Sparkles,
  Menu,
  X,
  User,
  Settings,
  Home,
} from "lucide-react";
import { useTheme } from "../ThemeProvider"; // Assuming correct path
import { getComponentTheme } from "../../utils/themeUtils"; // Assuming correct path

/**
 * Navbar - top navigation for the dashboard, adopting the main homepage's theme.
 * It's fixed at the top and ensures page content starts below it.
 */
const NAV_ITEMS = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Activity", icon: Activity, path: "/activity" },
  { name: "Templates", icon: Grid3X3, path: "/templates" },
];

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme(); // No need for toggleTheme here
  const location = useLocation();

  // Get theme-specific classes for the DashboardNavbar component
  const dashNavbarTheme = getComponentTheme(theme, "dashboardNavbar");

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Determine the correct focus ring offset based on the actual theme applied to the header
  const getFocusRingOffset = () => {
    if (theme === "light") {
      // Light theme has a light background
      return "focus:ring-offset-white";
    }
    // Dark and System themes (which resolve to dark) have dark backgrounds
    return "focus:ring-offset-gray-900";
  };
  const focusRingOffsetClass = getFocusRingOffset();

  // Base classes for all links, will be extended
  const baseLinkClasses = `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${focusRingOffsetClass}`;

  // NavLink allows for built-in active class handling
  const getNavLinkClasses = ({ isActive }) =>
    `${baseLinkClasses} ${
      isActive
        ? `${dashNavbarTheme.linkActiveBg || "bg-purple-600"} ${
            dashNavbarTheme.linkActiveText || "text-white"
          }`
        : `${dashNavbarTheme.linkTextColor || "text-gray-300"} ${
            dashNavbarTheme.linkHoverBg || "hover:bg-gray-700"
          }`
    }`;

  const getMobileNavLinkClasses = ({ isActive }) =>
    `${baseLinkClasses} w-full ${
      isActive
        ? `${dashNavbarTheme.linkActiveBg || "bg-purple-600"} ${
            dashNavbarTheme.linkActiveText || "text-white"
          }`
        : `${dashNavbarTheme.linkTextColor || "text-gray-300"} ${
            dashNavbarTheme.linkHoverBg || "hover:bg-gray-700"
          }`
    }`;

  const getDesktopIconLinkClasses = ({ isActive }) =>
    `${baseLinkClasses} p-2 ${
      isActive
        ? `${dashNavbarTheme.linkActiveBg || "bg-purple-600"} ${
            dashNavbarTheme.linkActiveText || "text-white"
          }`
        : `${dashNavbarTheme.linkTextColor || "text-gray-300"} ${
            dashNavbarTheme.linkHoverBg || "hover:bg-gray-700"
          }`
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b rounded-b-2xl ${dashNavbarTheme.headerBg} ${dashNavbarTheme.headerBorder} ${dashNavbarTheme.headerShadow} transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Logo and App Name - Dynamically styled for brand consistency */}
          <Link
            to="/home"
            className={`flex items-center gap-2 hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${focusRingOffsetClass}`}
            aria-label="Go to Home"
          >
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" aria-hidden="true" />
            </div>
            <div
              className={`text-md font-semibold whitespace-nowrap transition-colors duration-300 ${
                theme === "system" || theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800"
              }`}
            >
              Skill Tracker
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={getNavLinkClasses}
                end={item.path === "/home"} // `end` prop for exact matching on home link
              >
                <item.icon size={16} aria-hidden="true" />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}

            {/* User, Settings for Desktop */}
            <NavLink
              to="/profile"
              className={getDesktopIconLinkClasses}
              aria-label="Profile"
            >
              <User size={16} aria-hidden="true" />
            </NavLink>
            <NavLink
              to="/settings"
              className={getDesktopIconLinkClasses}
              aria-label="Settings"
            >
              <Settings size={16} aria-hidden="true" />
            </NavLink>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label={
                open ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={open}
              className={`p-2 rounded-lg ${
                dashNavbarTheme.linkHoverBg || "hover:bg-gray-700"
              } ${dashNavbarTheme.linkTextColor || "text-gray-300"}`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Conditionally Rendered) */}
      {open && (
        <div
          className={`md:hidden ${dashNavbarTheme.mobileMenuBg} ${dashNavbarTheme.mobileMenuBorder}`}
        >
          <nav className="px-4 py-3 space-y-2" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={getMobileNavLinkClasses}
                end={item.path === "/home"}
              >
                <item.icon size={18} aria-hidden="true" />
                <span className="text-base">{item.name}</span>
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className={getMobileNavLinkClasses}
              aria-label="Profile"
            >
              <User size={18} aria-hidden="true" />
              <span className="text-base">Profile</span>
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className={getMobileNavLinkClasses}
              aria-label="Settings"
            >
              <Settings size={18} aria-hidden="true" />
              <span className="text-base">Settings</span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
