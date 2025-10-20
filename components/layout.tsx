import { type PropsWithChildren } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { GlobalStyles } from "@/styles";

export function LayoutProvider({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={GlobalStyles.safeAreaView}>
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
