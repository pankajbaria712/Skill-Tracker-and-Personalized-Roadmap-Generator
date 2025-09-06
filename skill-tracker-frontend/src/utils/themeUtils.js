// src/utils/themeUtils.js
// Theme utility functions for consistent theming across components
export const getThemeColors = (theme) => {
  switch (theme) {
    case "system":
      return {
        background:
          "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
        cardBackground: "bg-white/10",
        textPrimary: "text-white",
        textSecondary: "text-gray-300",
        textAccent: "text-purple-400",
        border: "border-white/20",
        buttonPrimary: "bg-gradient-to-br from-indigo-600 to-purple-700",
        buttonSecondary:
          "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800",
        shadow: "shadow-[0_0_25px_rgba(107,63,255,0.4)]",
        blobColors: {
          primary: "bg-purple-500",
          secondary: "bg-blue-500",
          accent: "bg-pink-500",
        },
        // NEW: Specific classes for dashboard navbar within 'system' theme
        dashNavBg:
          "bg-gradient-to-r from-[#0f0c29]/90 via-[#302b63]/80 to-[#24243e]/90",
        dashNavBorder: "border-purple-400/30",
        dashNavShadow: "shadow-[0_0_25px_rgba(107,63,255,0.4)]",
        dashNavTextColor: "text-white/90",
        dashNavHoverBg: "hover:bg-white/10", // Similar to homepage button hover
        dashNavActiveBg: "bg-purple-600", // Standard active link
        dashNavActiveText: "text-white", // Standard active text
        dashNavMobileMenuBg:
          "bg-gradient-to-br from-[#0f0c29]/95 via-[#302b63]/90 to-[#24243e]/95",
      };

    case "dark":
      return {
        background: "bg-black",
        cardBackground: "bg-gray-900/80",
        textPrimary: "text-white",
        textSecondary: "text-gray-300",
        textAccent: "text-purple-400",
        border: "border-gray-700/50",
        buttonPrimary: "bg-gradient-to-br from-purple-600 to-indigo-700",
        buttonSecondary:
          "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800",
        shadow: "shadow-[0_0_25px_rgba(0,0,0,0.6)]",
        blobColors: {
          primary: "bg-purple-600",
          secondary: "bg-blue-600",
          accent: "bg-indigo-600",
        },
        // NEW: Specific classes for dashboard navbar within 'dark' theme
        dashNavBg: "bg-black/95",
        dashNavBorder: "border-gray-800/50",
        syncShadow: "shadow-[0_0_25px_rgba(0,0,0,0.6)]", // Use syncShadow as shadow is a common key
        dashNavTextColor: "text-white/90",
        dashNavHoverBg: "hover:bg-white/10",
        dashNavActiveBg: "bg-purple-600",
        dashNavActiveText: "text-white",
        dashNavMobileMenuBg: "bg-black/98",
      };

    case "light":
    default:
      return {
        background: "bg-white",
        cardBackground: "bg-gray-50/80",
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-600",
        textAccent: "text-purple-600",
        border: "border-gray-200/50",
        buttonPrimary: "bg-gradient-to-br from-purple-600 to-indigo-600",
        buttonSecondary:
          "bg-transparent border-gray-400 text-gray-700 hover:bg-gray-100",
        shadow: "shadow-[0_0_25px_rgba(156,163,175,0.3)]",
        blobColors: {
          primary: "bg-purple-200",
          secondary: "bg-blue-200",
          accent: "bg-indigo-200",
        },
        // NEW: Specific classes for dashboard navbar within 'light' theme
        dashNavBg: "bg-gradient-to-r from-white/90 via-gray-50/80 to-white/90",
        dashNavBorder: "border-gray-300/30",
        syncShadow: "shadow-[0_0_25px_rgba(156,163,175,0.4)]", // Use syncShadow as shadow is a common key
        dashNavTextColor: "text-gray-700/90",
        dashNavHoverBg: "hover:bg-gray-100",
        dashNavActiveBg: "bg-purple-500",
        dashNavActiveText: "text-white",
        dashNavMobileMenuBg: "bg-white/95",
      };
  }
};

export const getComponentTheme = (theme, componentType) => {
  const colors = getThemeColors(theme);

  switch (componentType) {
    case "hero":
      return {
        background: colors.background,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        buttonPrimary: colors.buttonPrimary,
        buttonSecondary: colors.buttonSecondary,
        blobColors: colors.blobColors,
      };

    case "section":
      return {
        background: theme === "light" ? "bg-gray-50" : "bg-transparent",
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        cardBackground: colors.cardBackground,
        border: colors.border,
        blobColors: colors.blobColors,
        buttonPrimary: colors.buttonPrimary,
      };

    case "card":
      return {
        background: colors.cardBackground,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        border: colors.border,
        shadow: colors.shadow,
      };

    // NEW: Dashboard Navbar specific theme properties
    case "dashboardNavbar":
      return {
        headerBg: colors.dashNavBg,
        headerBorder: colors.dashNavBorder,
        headerShadow: colors.syncShadow, // Using syncShadow for clarity
        linkTextColor: colors.dashNavTextColor,
        linkHoverBg: colors.dashNavHoverBg,
        linkActiveBg: colors.dashNavActiveBg,
        linkActiveText: colors.dashNavActiveText,
        mobileMenuBg: colors.dashNavMobileMenuBg,
        mobileMenuBorder: colors.dashNavBorder, // Reusing header border for mobile menu
      };

    default:
      return colors;
  }
};
