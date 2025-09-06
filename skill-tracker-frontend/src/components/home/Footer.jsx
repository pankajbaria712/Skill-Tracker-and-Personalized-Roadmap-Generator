// Footer.jsx
import React from "react";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

const Footer = () => {
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "section");

  return (
    <footer
      className={`py-12 px-4 border-t transition-all duration-500 ${
        theme === "system"
          ? "bg-[#070030] text-gray-400 border-[#1a1a36]"
          : theme === "dark"
          ? "bg-black text-gray-400 border-gray-800"
          : "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Tagline Section */}
        <div className="col-span-1">
          <h3
            className={`text-2xl font-bold mb-2 cursor-target transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Roadmap Tracker
          </h3>
          <p
            className={`text-sm transition-colors duration-500 ${themeColors.textSecondary}`}
          >
            Master your learning journey with personalized, AI-driven roadmaps
            and progress tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h4
            className={`font-semibold mb-4 transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="col-span-1">
          <h4
            className={`font-semibold mb-4 transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div className="col-span-1">
          <h4
            className={`font-semibold mb-4 transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Legal
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              >
                Terms of Service
              </a>
            </li>
          </ul>
          <h4
            className={`font-semibold mt-8 mb-4 transition-colors duration-500 ${themeColors.textPrimary}`}
          >
            Follow Us
          </h4>
          <div className="flex space-x-4">
            {/* Social Media Icons (placeholders) */}
            <a
              href="#"
              className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              aria-label="Twitter"
            >
              {/* Twitter Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c-.2 2.3-.4 4.6-.7 6.9-.5 1.5-1.1 2.9-2 4.3-1.3 1.9-3.2 3.4-5.3 4.2-2.3.9-4.8.8-7.1-.1-2.2-1-4.2-2.7-5.9-4.7C-2 15-2 11.2-2 7.5S-2 4-2 4l-.6.7c1.3 1.1 3 2 4.9 2.5 1.9.5 3.9.4 5.8-.2 1.9-.6 3.7-1.7 5.1-3.2C13.8 3.5 16.5 2 19 2c1.7.1 3.4.6 4.9 1.5.3 0 0 .1 0 0l-2.1.9c-.6.2-1.3.4-2 .4h-.1C18 3 17 3.2 16 3.6c-2.8 1.1-5.1 3.3-6.5 6.1s-1.8 5.7-.9 8.6c.3.9.7 1.8 1.2 2.6.5.8 1.1 1.5 1.8 2.1.8.6 1.7 1.1 2.6 1.4 1 .3 2.1.4 3.1.2s2-.3 2.9-.8c.9-.5 1.7-1.1 2.4-1.9.7-.8 1.3-1.8 1.7-2.8.4-1.2.6-2.5.6-3.8V8.6l1.2-1.2v.3c.7 1.8 1.1 3.8 1.1 5.8 0 2-.4 4-1.2 5.9s-1.8 3.5-3.3 4.9c-1.5 1.3-3.2 2.4-5.2 3.1s-4.1 1-6.1.6c-2-.4-3.8-1.4-5.4-2.8-1.6-1.4-2.8-3.2-3.6-5.2s-1.1-4.2-.8-6.4c.2-2.2.9-4.3 2-6.1l.6-1z" />
              </svg>
            </a>
            <a
              href="#"
              className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              aria-label="LinkedIn"
            >
              {/* LinkedIn Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
              </svg>
            </a>
            <a
              href="#"
              className={`hover:text-opacity-100 transition-colors duration-200 cursor-target ${themeColors.textSecondary}`}
              aria-label="Github"
            >
              {/* Github Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22s-4 4-7.5 0c-1.5-2.5-2.5-5.5-2.5-8 0-4.5 3-7.5 7.5-7.5s7.5 3 7.5 7.5c0 2.5-1 5.5-2.5 8" />
                <path d="M22 15v1a4 4 0 0 1-4 4h-1a2 2 0 0 0-2 2v1h-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2h-1a4 4 0 0 1-4-4v-1h-1a1 1 0 0 1-1-1v-2c0-.5.5-1 1-1h1v-1a2 2 0 0 0-2-2c-.5-1-1-2-1-3a2 2 0 0 1 1-2c0-.5 0-.5 1-1c0-.5 1-1 2-1s2-.5 2-1c.5-1.5 1-2.5 1-3.5a3 3 0 0 1 3-3 2 2 0 0 1 2 2c0 1 0 2 1 3s1.5 2.5 2 3.5a2 2 0 0 0 2 2c1 1 2 2 2 3a2 2 0 0 1 1 2v1c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1h-1a4 4 0 0 1-4 4h-1a2 2 0 0 0-2 2v1h-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2h-1a4 4 0 0 1-4-4v-1z" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="5" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className={`text-center text-sm mt-12 pt-8 border-t transition-all duration-500 ${
          theme === "system"
            ? "border-[#1a1a36]"
            : theme === "dark"
            ? "border-gray-800"
            : "border-gray-200"
        }`}
      >
        <p
          className={`transition-colors duration-500 ${themeColors.textSecondary}`}
        >
          &copy; {new Date().getFullYear()} Roadmap Tracker. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
