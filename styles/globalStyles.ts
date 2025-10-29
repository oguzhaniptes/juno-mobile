// styles/globalStyles.ts
import { StyleSheet, Platform } from "react-native";
import { Colors } from "./theme";

export const createGlobalStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 16,
      marginHorizontal: 20,
      marginBottom: 54,
      // backgroundColor: colors.background,
    },
    safeAreaView: {
      marginBottom: 24,
      // backgroundColor: colors.background,
    },

    themedView: {
      marginTop: 4,
      paddingHorizontal: 24,
      marginBottom: 120,
      backgroundColor: "transparent",
    },

    glassCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: isDark ? colors.primary : "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.5 : 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 12,
        },
      }),
    },

    glassCardSmall: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: isDark ? colors.primary : "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },

    gradientOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.6,
    },

    blurEffect: {
      backgroundColor: colors.surface,
      backdropFilter: "blur(10px)",
    },
  });
};
