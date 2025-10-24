import { useRouter } from "expo-router";
import ProfileHeader from "@/components/Home/ProfileHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import LiveMatchesCarousel from "@/components/Home/LiveMatchesCarousel";
import { liveMatches } from "@/mock";
import { renderFeedItem } from "@/components/Home/FeedCarousel";
import { FlatList, View, StyleSheet, Text, RefreshControl } from "react-native";
import { GlobalStyles } from "@/styles";
import CreatePost from "@/components/Home/CreatePost";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";

export default function HomeScreen() {
  const router = useRouter();
  const [feed, setFeed] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getFeed = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("respon", response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFeed(data.data.reverse());
      } else {
        console.log("Error.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Pull to refresh fonksiyonu
  const onRefresh = async () => {
    setRefreshing(true);
    await getFeed();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={GlobalStyles.safeAreaView}>
      <FlatList
        data={feed}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ paddingHorizontal: 24, backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} tintColor="#007AFF" />}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.feedTitle}>Active Matches</Text>
            {liveMatches && <LiveMatchesCarousel liveMatches={liveMatches} navigation={router} />}
            <Text style={styles.feedTitle}>Feed</Text>
            <CreatePost
              onPostCreated={() => {
                getFeed();
              }}
              onCancel={() => {}}
            />
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
    backgroundColor: "#F3F4F6",
  },
  headerContainer: {
    gap: 12,
    marginBottom: 12,
    marginTop: 12,
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
  },
});
