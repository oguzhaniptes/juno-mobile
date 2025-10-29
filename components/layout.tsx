import { type PropsWithChildren } from "react";
import { ScrollView, useColorScheme, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { Colors, createGlobalStyles } from "@/styles";
import Background from "./background";

type LayoutProviderProps = PropsWithChildren & {
  hasBottomBar?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function LayoutProvider({ children, refreshing, onRefresh, hasBottomBar = true }: LayoutProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const globalStyles = createGlobalStyles(isDark, hasBottomBar);
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Background isDark={isDark} />
      <SafeAreaView style={globalStyles.safeAreaView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} /> : undefined}
        >
          <ThemedView style={globalStyles.themedView}>{children}</ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
