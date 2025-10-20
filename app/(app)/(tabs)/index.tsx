import { useRouter } from "expo-router";
import ProfileHeader from "@/components/Home/ProfileHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import LiveMatchesCarousel from "@/components/Home/LiveMatchesCarousel";
import { feedItems, liveMatches } from "@/mock";
import { renderFeedItem } from "@/components/Home/FeedCarousel";
import { FlatList, View, StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <FlatList
        data={feedItems}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 8, paddingHorizontal: 24, backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <ProfileHeader />

            <Text style={styles.feedTitle}>Active Matches</Text>

            {liveMatches && <LiveMatchesCarousel liveMatches={liveMatches} navigation={router} />}

            <Text style={styles.feedTitle}>Feed</Text>
          </View>
        )}
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Henüz gösterilecek içerik yok.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  feedList: {
    // flex: 1,
    // padding: 16,
    backgroundColor: "#F3F4F6",
  },
  headerContainer: {
    gap: 12,
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  footerSpace: {
    height: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  separator: {
    height: 16,
    // backgroundColor: "#ffbaba75",
  },
});
