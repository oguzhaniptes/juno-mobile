import { type PropsWithChildren } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";

export function LayoutProvider({ children }: PropsWithChildren) {
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.themedView}>{children}</ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  themedView: {
    marginTop: 8,
    paddingHorizontal: 24,
    marginBottom: 54,
    backgroundColor: "transparent",
  },
});
