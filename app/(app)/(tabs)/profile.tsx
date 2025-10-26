import { FeedItem } from "@/components/Home/FeedCarousel";
import PostCard from "@/components/Home/PostCard";
import { LayoutProvider } from "@/components/layout";
import Avatar from "@/components/ui/avatar";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { jwtToAddress } from "@mysten/sui/zklogin";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { authData, ephemeralData, isLoading, signOut } = useSession();
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const [userPosts, setUserPosts] = useState<[] | null>(null);

  useEffect(() => {
    console.log("👤 ProfileScreen authData:", authData);
    console.log("👤 ProfileScreen ephemeralData:", ephemeralData);
    if (authData) {
      const address = jwtToAddress(authData.idToken, authData.salt);
      setUserAddress(address);
    }
  }, [authData, ephemeralData]);

  useEffect(() => {
    if (!isLoading && !authData && !ephemeralData) {
      router.push("/sign-in");
    }
  }, [authData, ephemeralData, isLoading, router]);

  useEffect(() => {
    const getMyPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/db/user-posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserPosts(data.data.reverse());
        } else {
          console.log("Error.");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    getMyPost();
  }, [authData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!authData) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <LayoutProvider>
      <View style={styles.profileContentBox}>
        <View style={styles.profileDetailsRow}>
          {authData.photoUrl ? <Image style={{ height: 64, width: 64 }} src={authData.photoUrl} /> : <Avatar />}
          {/* <Avatar></Avatar> */}
          <View style={styles.infoWrapper}>
            <View style={styles.userInfoTopRow}>
              <View style={styles.textWrapper}>
                <Text style={styles.displayNameText}>{authData.name}</Text>
                <Text style={styles.usernameText}>{authData.mail}</Text>
                <Text style={styles.usernameText}>{authData.userId}</Text>
                <Text style={styles.joinedText}>{userAddress}</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={{ color: "#EF4444", marginTop: 12 }} onPress={signOut}>
                Sign Out
              </Text>
            </TouchableOpacity>
            <View style={styles.statsGrid}>
              <StatBox value={1000} label="Score" />
              <StatBox value={1000} label="Gold" />
              <StatBox value={1000} label="Diamonds" />
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoRow title="Favorite Team" value="Los Angeles Lakers" />
          <InfoRow title="Favorite Sport" value="Basketball" />
          <ActionRow title="Owned Items" subtitle="View your collectibles" onPress={() => router.push("/")} />
          <ActionRow title="Wallet Address" subtitle="Manage wallet" onPress={() => router.push("/")} />
        </View>
      </View>
      <View style={{ marginTop: 10, elevation: 8 }}>
        {userPosts &&
          userPosts.map((post: FeedItem) => (
            <PostCard
              key={post.id}
              content={post.content ?? "a"}
              comments_count={post.comments_count}
              likes_count={post.likes_count}
              share_count={0}
              author_id={post.author_id}
              author_name={post.author_name}
              created_at={post.created_at}
              id={post.id}
              profile_url={post.profile_url}
              reply_to_id={post.reply_to_id}
              is_liked={post.is_liked}
              updated_at={post.updated_at}
            ></PostCard>
          ))}
      </View>
    </LayoutProvider>
  );
}

const StatBox = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoRow = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoRowTitle}>{title}</Text>
    <Text style={styles.infoRowValue}>{value}</Text>
  </View>
);

const ActionRow = ({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionRow}>
    <View>
      <Text style={styles.infoRowTitle}>{title}</Text>
      <Text style={styles.infoRowValue}>{subtitle}</Text>
    </View>
    <Text style={styles.arrowText}>→</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#4B5563",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  contentPadding: {
    padding: 16,
  },

  headerBox: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    color: "#4B5563",
    marginTop: 4,
  },

  profileContentBox: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24, // p-6
  },
  profileDetailsRow: {
    justifyContent: "center",
    alignItems: "center",

    gap: 24, // gap-6
  },
  infoWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoTopRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    alignItems: "center",
  },

  displayNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  usernameText: {
    fontSize: 14,
    color: "#2563EB",
  },
  joinedText: {
    fontSize: 12,
    color: "#6B7280",
  },

  statsGrid: {
    flexDirection: "row",

    marginTop: 24,
    gap: 16,
  },
  statBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  infoGrid: {
    marginTop: 32, // mt-8

    gap: 16,
  },
  infoRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
  },
  infoRowTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 4,
  },

  actionRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowText: {
    fontSize: 24,
    color: "#9CA3AF",
  },
});
