import { useRouter } from "expo-router";
import ProfileHeader from "@/components/Home/ProfileHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import LiveMatchesCarousel from "@/components/Home/LiveMatchesCarousel";
import { liveMatches } from "@/mock";
import { renderFeedItem } from "@/components/Home/FeedCarousel";
import { FlatList, View, Text, RefreshControl, useColorScheme } from "react-native";
import CreatePost from "@/components/Home/CreatePost";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { Colors, createComponentStyles, createGlobalStyles } from "@/styles";
import Background from "@/components/background";

export default function HomeScreen() {
  const { authData } = useSession();
  const router = useRouter();
  const [feed, setFeed] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const globalStyles = createGlobalStyles(isDark);
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const getFeed = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFeed(data.data);
      } else {
        console.log("Error.");
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [authData?.idToken]);

  useEffect(() => {
    getFeed();
  }, [getFeed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getFeed();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient Background */}
      <Background isDark={isDark} />

      <SafeAreaView style={globalStyles.safeAreaView}>
        <FlatList
          data={feed}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id.toString()}
          style={{
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
          ListHeaderComponent={() => (
            <View style={{ gap: 8, marginBottom: 16, marginTop: 8 }}>
              <ProfileHeader />
              {liveMatches && <LiveMatchesCarousel liveMatches={liveMatches} navigation={router} />}

              <Text style={styles.sectionTitle}>Feed</Text>
              <CreatePost
                onPostCreated={() => {
                  getFeed();
                }}
                onCancel={() => {}}
              />
            </View>
          )}
          ListFooterComponent={<View style={{ height: 80 }} />}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 50,
              }}
            >
              <Text style={{ color: colors.textSecondary }}>No content available yet.</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
