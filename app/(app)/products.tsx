import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";

interface ProductPageProps {
  propName: string;
}

export default function ProductPage({ propName }: ProductPageProps) {
  const router = useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Products
        </ThemedText>
        <ThemedText onPress={() => router.push("/product/1")}>
          Product 1
        </ThemedText>
        <ThemedText onPress={() => router.push("/product/2")}>
          Product 2
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
