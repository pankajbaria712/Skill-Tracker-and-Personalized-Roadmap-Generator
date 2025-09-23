// src/components/Navbar.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseClient";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false); // 🔹 new state for mobile dropdown
  const lastScrollY = useRef(window.scrollY);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup

  const { theme, setTheme, getActualTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [user] = useAuthState(auth);

  const isDark = getActualTheme() === "dark";

  // Close theme dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownOpen && !event.target.closest(".theme-dropdown")) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeDropdownOpen]);

  // Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setThemeDropdownOpen(false);
    setMobileThemeOpen(false); // close mobile dropdown after selecting
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon size={18} />;
      case "light":
        return <Sun size={18} />;
      case "system":
      default:
        return <Monitor size={18} />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "dark":
        return "Dark";
      case "light":
        return "Light";
      case "system":
      default:
        return "System";
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      setShowLogoutPopup(true); // Show popup

      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowLogoutPopup(false);
      }, 3000);

      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Pages we want in the nav
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Templates", path: "/TemplatesPage" },
    { name: "Activity", path: "/ActivityPage" },
    { name: "About", path: "/AboutPage" },
  ];

  return (
    <>
      {/* Animation keyframes for the logout popup */}
      <style>
        {`
          @keyframes logoutPopupAnim {
            0% { opacity: 0; transform: translateY(-8px) scale(0.98); }
            8% { opacity: 1; transform: translateY(0) scale(1); }
            85% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-8px) scale(0.98); }
          }
          .logout-popup-anim {
            animation: logoutPopupAnim 3s cubic-bezier(.22,.8,.14,1) forwards;
          }
        `}
      </style>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <nav
          className={`mx-auto max-w-7xl flex items-center justify-between px-2 py-4
            backdrop-blur-xl border-b rounded-b-2xl shadow-lg transition-all duration-300
            ${
              theme === "system"
                ? "bg-gradient-to-r from-[#0f0c29]/90 via-[#302b63]/80 to-[#24243e]/90 border-purple-400/30 shadow-[0_0_25px_rgba(107,63,255,0.4)]"
                : theme === "dark"
                ? "bg-black/95 border-gray-800/50 shadow-[0_0_25px_rgba(0,0,0,0.6)]"
                : "bg-gradient-to-r from-white/90 via-gray-50/80 to-white/90 border-gray-300/30 shadow-[0_0_25px_rgba(156,163,175,0.4)]"
            }`}
        >
          {/* Logo with animation */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-0 px-0"
          >
            <DotLottieReact
              src="https://lottie.host/b1f39a90-827e-480d-99f1-f3361f4354d3/Q8GGKMZXNG.lottie"
              autoplay
              loop
              style={{ width: 110, height: 40 }}
            />
            <span
              className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800"
              }`}
            >
              SkillTracker
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-purple-600 dark:text-pink-400 underline"
                    : theme === "system" || theme === "dark"
                    ? "text-white/90 hover:text-pink-400"
                    : "text-gray-700/90 hover:text-purple-600"
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Theme Dropdown (Desktop) */}
            <div className="relative theme-dropdown">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  theme === "system" || theme === "dark"
                    ? "bg-white/10 hover:bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-purple-600 text-gray-700 hover:text-white"
                }`}
                aria-label="Theme selector"
              >
                {getThemeIcon()}
                <span>{getThemeLabel()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    themeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {themeDropdownOpen && (
                <div
                  className={`absolute top-full right-0 mt-2 w-40 backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
                    theme === "system"
                      ? "bg-[#0f0c29]/90 border-purple-400/30"
                      : theme === "dark"
                      ? "bg-black/90 border-gray-700/50"
                      : "bg-white/90 border-gray-300/30"
                  }`}
                >
                  <button
                    onClick={() => handleThemeChange("light")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Sun size={16} />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Moon size={16} />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Monitor size={16} />
                    <span className="text-sm">System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/SignIn")}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border-2 font-medium transition-all"
              >
                <div
                  className="inline-flex h-12 items-center justify-center px-6
    bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#070e41] dark:to-[#263381]
    text-black dark:text-white transition duration-500 group-hover:-translate-y-[150%]"
                >
                  Sign In
                </div>
                <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
                  <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-purple-600 dark:bg-purple-600 transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                  <span className="z-10">Sign In</span>
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-all duration-200 ${
              theme === "system" || theme === "dark"
                ? "bg-white/10 hover:bg-purple-600 text-white"
                : "bg-gray-100 hover:bg-purple-600 text-gray-700 hover:text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            className={`md:hidden absolute top-full left-0 w-full backdrop-blur-lg px-4 py-4 space-y-2 transition-all duration-300 ${
              theme === "system"
                ? "bg-gradient-to-br from-[#0f0c29]/95 via-[#302b63]/90 to-[#24243e]/95 border-t border-purple-400/30"
                : theme === "dark"
                ? "bg-black/98 border-t border-gray-800/50"
                : "bg-white/95 border-t border-gray-300/30"
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileOpen(false);
                }}
                className={`block w-full text-left font-medium py-2 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-purple-600 dark:text-pink-400 underline"
                    : theme === "system" || theme === "dark"
                    ? "text-white/90 hover:text-pink-400"
                    : "text-gray-700/90 hover:text-purple-600"
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Mobile Theme Dropdown */}
            <div className="mt-4">
              <button
                onClick={() => setMobileThemeOpen(!mobileThemeOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors duration-200
                    bg-gray-100 dark:bg-white/10 hover:bg-purple-600 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  {getThemeIcon()}
                  <span>{getThemeLabel()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    mobileThemeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileThemeOpen && (
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Sun size={16} />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Moon size={16} />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    <Monitor size={16} />
                    <span className="text-sm">System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold mt-2"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/SignIn");
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Logout popup (animated minimalistic) */}
      {showLogoutPopup && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 logout-popup-anim px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-white font-medium shadow-lg"
        >
          👋 You have been logged out successfully!
        </div>
      )}
    </>
  );
}
