// src/utils/themeUtils.js
// Theme utility functions for consistent theming across components
export const getThemeColors = (theme) => {
  switch (theme) {
    case "system":
      return {
        // richer, softer system gradient + subtle glass
        background:
          "bg-gradient-to-br from-[#071024] via-[#2b0f4a] to-[#141228]",
        cardBackground: "backdrop-blur-md bg-white/6 border-white/12",
        textPrimary: "text-white",
        textSecondary: "text-gray-300",
        textAccent: "text-indigo-300",
        border: "border-white/12",
        buttonPrimary:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
        buttonSecondary:
          "bg-transparent border-white/20 text-white/80 hover:bg-white/4",
        shadow: "shadow-[0_10px_40px_rgba(88,47,216,0.18)]",
        accentGradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
        blobColors: {
          primary: "bg-indigo-500/80",
          secondary: "bg-purple-500/80",
          accent: "bg-pink-500/80",
        },
        // Dashboard navbar tuned for system
        dashNavBg:
          "bg-gradient-to-r from-[#071024]/95 via-[#2b0f4a]/90 to-[#141228]/95",
        dashNavBorder: "border-indigo-600/25",
        dashNavShadow: "shadow-[0_8px_30px_rgba(88,47,216,0.16)]",
        dashNavTextColor: "text-white/95",
        dashNavHoverBg: "hover:bg-white/6",
        dashNavActiveBg: "bg-indigo-600/90",
        dashNavActiveText: "text-white",
        dashNavMobileMenuBg:
          "bg-gradient-to-br from-[#071024]/98 via-[#2b0f4a]/95 to-[#141228]/98",
        subtleGlass: "backdrop-blur-sm bg-white/4",
      };

    case "dark":
      return {
        background: "bg-neutral-900",
        cardBackground: "backdrop-blur-sm bg-gray-900/70 border-gray-800/50",
        textPrimary: "text-gray-100",
        textSecondary: "text-gray-300",
        textAccent: "text-purple-300",
        border: "border-gray-800/40",
        buttonPrimary:
          "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
        buttonSecondary:
          "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/60",
        shadow: "shadow-[0_10px_40px_rgba(2,6,23,0.6)]",
        accentGradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
        blobColors: {
          primary: "bg-purple-600/85",
          secondary: "bg-indigo-600/80",
          accent: "bg-sky-500/70",
        },
        // Dashboard navbar tuned for dark
        dashNavBg: "bg-black/95",
        dashNavBorder: "border-gray-800/50",
        dashNavShadow: "shadow-[0_8px_30px_rgba(15,12,41,0.6)]",
        dashNavTextColor: "text-white/92",
        dashNavHoverBg: "hover:bg-white/4",
        dashNavActiveBg: "bg-purple-600",
        dashNavActiveText: "text-white",
        dashNavMobileMenuBg: "bg-black/98",
        subtleGlass: "backdrop-blur-sm bg-white/2",
      };

    case "light":
    default:
      return {
        background: "bg-gradient-to-br from-white to-slate-50", // light, airy base
        cardBackground: "backdrop-blur-sm bg-white/80 border-gray-200/60",
        textPrimary: "text-slate-900",
        textSecondary: "text-gray-600",
        textAccent: "text-indigo-600",
        border: "border-gray-200/60",
        buttonPrimary:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
        buttonSecondary:
          "bg-white/70 border-gray-200 text-gray-800 hover:bg-gray-100",
        shadow: "shadow-[0_10px_40px_rgba(16,24,40,0.08)]",
        accentGradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
        blobColors: {
          primary: "bg-indigo-200",
          secondary: "bg-purple-200",
          accent: "bg-pink-200",
        },
        // Dashboard navbar tuned for light
        dashNavBg: "bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95",
        dashNavBorder: "border-gray-300/30",
        dashNavShadow: "shadow-[0_8px_30px_rgba(99,102,241,0.06)]",
        dashNavTextColor: "text-gray-800/95",
        dashNavHoverBg: "hover:bg-gray-100",
        dashNavActiveBg: "bg-indigo-600",
        dashNavActiveText: "text-white",
        dashNavMobileMenuBg: "bg-white/95",
        subtleGlass: "backdrop-blur-sm bg-white/60",
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
        accentGradient: colors.accentGradient,
        subtleGlass: colors.subtleGlass,
      };

    case "section":
      // make sections slightly more distinctive and modern
      return {
        background:
          theme === "light"
            ? "bg-gray-50"
            : colors.subtleGlass || "bg-transparent",
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        cardBackground: colors.cardBackground,
        border: colors.border,
        blobColors: colors.blobColors,
        buttonPrimary: colors.buttonPrimary,
        accentGradient: colors.accentGradient,
      };

    case "card":
      return {
        background: colors.cardBackground,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        border: colors.border,
        shadow: colors.shadow,
        accentGradient: colors.accentGradient,
      };

    // Dashboard Navbar specific theme properties (polished)
    case "dashboardNavbar":
      return {
        headerBg: colors.dashNavBg,
        headerBorder: colors.dashNavBorder,
        headerShadow: colors.dashNavShadow || colors.shadow,
        linkTextColor: colors.dashNavTextColor,
        linkHoverBg: colors.dashNavHoverBg,
        linkActiveBg: colors.dashNavActiveBg,
        linkActiveText: colors.dashNavActiveText,
        mobileMenuBg: colors.dashNavMobileMenuBg,
        mobileMenuBorder: colors.dashNavBorder,
        subtleGlass: colors.subtleGlass,
      };

    default:
      return colors;
  }
};
