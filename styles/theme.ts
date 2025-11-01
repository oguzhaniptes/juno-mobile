import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#8B5CF6",
    secondary: "#EC4899",
    tertiary: "#F59E0B",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#F8F9FA",
    backgroundGradientStart: "#FFFFFF",
    backgroundGradientEnd: "#F3F4F6",
    surface: "rgba(255, 255, 255, 0.7)",
    surfaceBlur: "rgba(255, 255, 255, 0.9)",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "rgba(229, 231, 235, 0.5)",
    cardBg: "rgba(255, 255, 255, 0.95)", // Android için daha opak
    cardBgSolid: "#FFFFFF", // Android elevation için solid versiyon
    gradient: ["#8B5CF6", "#EC4899", "#F59E0B"],
    shadow: "rgba(0, 0, 0, 0.1)",
    overlayBg: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    primary: "#A78BFA",
    secondary: "#F472B6",
    tertiary: "#FBBF24",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#0F0A1E",
    backgroundGradientStart: "#1A0B2E",
    backgroundGradientEnd: "#16213E",
    surface: "rgba(30, 20, 50, 0.7)",
    surfaceBlur: "rgba(30, 20, 50, 0.9)",
    text: "#F9FAFB",
    textSecondary: "#D1D5DB",
    border: "rgba(139, 92, 246, 0.3)",
    cardBg: "rgba(30, 20, 50, 0.95)", // Android için daha opak
    cardBgSolid: "#1E1432", // Android elevation için solid versiyon
    gradient: ["#8B5CF6", "#EC4899", "#F59E0B"],
    shadow: "rgba(139, 92, 246, 0.3)",
    overlayBg: "rgba(15, 10, 30, 0.7)",
  },
};

export const Gradients = {
  primary: ["#8B5CF6", "#EC4899"],
  secondary: ["#EC4899", "#F59E0B"],
  accent: ["#3B82F6", "#8B5CF6"],
  success: ["#10B981", "#34D399"],
  purple: ["#6366F1", "#8B5CF6", "#A855F7"],
  challenge: ["#7C3AED", "#EC4899"],
  live: ["#EF4444", "#F97316"],
};

// Helper function for card shadows
export const createCardShadow = (isDark: boolean, colors: any, intensity: "light" | "medium" | "heavy" = "medium") => {
  const elevations = {
    light: Platform.OS === "android" ? 4 : 8,
    medium: Platform.OS === "android" ? 6 : 12,
    heavy: Platform.OS === "android" ? 8 : 16,
  };

  const shadowRadii = {
    light: 12,
    medium: 16,
    heavy: 20,
  };

  const shadowOpacities = {
    light: isDark ? 0.3 : 0.08,
    medium: isDark ? 0.4 : 0.12,
    heavy: isDark ? 0.5 : 0.15,
  };

  return Platform.select({
    ios: {
      shadowColor: isDark ? colors.primary : "#000",
      shadowOffset: { width: 0, height: elevations[intensity] / 2 },
      shadowOpacity: shadowOpacities[intensity],
      shadowRadius: shadowRadii[intensity],
    },
    android: {
      elevation: elevations[intensity],
      // Android için solid backgroundColor gerekli
    },
  });
};
