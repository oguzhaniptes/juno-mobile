// screens/ProfileScreen.tsx - YENİDEN TASARLANDI
import { View, Text, TouchableOpacity, ActivityIndicator, Image, useColorScheme, Platform } from "react-native";
import { FeedItem } from "@/components/Home/FeedCarousel";
import PostCard from "@/components/Home/PostCard";
import { LayoutProvider } from "@/components/layout";
import Avatar from "@/components/ui/avatar";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { jwtToAddress } from "@mysten/sui/zklogin";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Colors, createComponentStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { authData, ephemeralData, isLoading, signOut } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<[] | null>(null);
  const [userReplies, setUserReplies] = useState<[] | null>(null);

  useEffect(() => {
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
    const getUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/db/user/${authData?.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.sessionToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("--------User data: ", data.data);

          // setUserPosts(data.data.reverse());
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    getUser();
  }, [authData]);

  useEffect(() => {
    const getMyPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/db/user/${authData?.userId}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.sessionToken}`,
          },
        });

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          setUserPosts(data.data.reverse());
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    getMyPost();
  }, [authData]);

  useEffect(() => {
    const getMyReplies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/db/user/${authData?.userId}/replies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.sessionToken}`,
          },
        });

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          setUserReplies(data.data.reverse());
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    getMyReplies();
  }, [authData]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  if (!authData) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <LayoutProvider>
      {/* Profile Header Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
          },
        ]}
      >
        {/* Avatar Section */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          {authData.photoUrl ? (
            <Image
              style={{
                height: 96,
                width: 96,
                borderRadius: 48,
                borderWidth: 4,
                borderColor: colors.primary,
              }}
              src={authData.photoUrl}
            />
          ) : (
            <View
              style={{
                height: 96,
                width: 96,
                borderRadius: 48,
                borderWidth: 4,
                borderColor: colors.primary,
              }}
            >
              <Avatar />
            </View>
          )}

          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: colors.text,
              marginTop: 16,
            }}
          >
            {authData.name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            {authData.mail}
          </Text>

          {userAddress && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 8,
                fontFamily: "monospace",
              }}
            >
              {userAddress.slice(0, 8)}...{userAddress.slice(-6)}
            </Text>
          )}

          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderWidth: 1,
              borderColor: "#EF4444",
            }}
            onPress={signOut}
          >
            <Text
              style={{
                color: "#EF4444",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <StatBox value={1000} label="Score" colors={colors} isDark={isDark} />
          <StatBox value={1000} label="Gold" colors={colors} isDark={isDark} />
          <StatBox value={1000} label="Diamonds" colors={colors} isDark={isDark} />
        </View>

        {/* Info Rows */}
        <View style={{ gap: 12 }}>
          <InfoRow title="Favorite Team" value="Los Angeles Lakers" colors={colors} isDark={isDark} />
          <InfoRow title="Favorite Sport" value="Basketball" colors={colors} isDark={isDark} />
          <ActionRow title="Owned Items" subtitle="View your collectibles" onPress={() => router.push("/")} colors={colors} isDark={isDark} />
          <ActionRow title="Wallet Address" subtitle="Manage wallet" onPress={() => router.push("/")} colors={colors} isDark={isDark} />
        </View>
      </View>

      {/* User Posts Section */}
      {userPosts && userPosts.length > 0 && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            My Posts ({userPosts.length})
          </Text>

          {userPosts.map((post: FeedItem) => (
            <PostCard
              key={post.id}
              isDetail={false}
              content={post.content ?? ""}
              replies_count={post.replies_count}
              likes_count={post.likes_count}
              reposts_count={0}
              author_id={post.author_id}
              author_name={post.author_name}
              created_at={post.created_at}
              id={post.id}
              profile_url={post.profile_url}
              reply_to_id={post.reply_to_id}
              is_liked={post.is_liked}
              is_reposted={false}
              updated_at={post.updated_at}
            />
          ))}
        </View>
      )}

      {/* User Posts Section */}
      {userReplies && userReplies.length > 0 && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            My Replies ({userReplies.length})
          </Text>

          {userReplies.map((post: FeedItem) => (
            <PostCard
              key={post.id}
              isDetail={false}
              content={post.content ?? ""}
              replies_count={post.replies_count}
              likes_count={post.likes_count}
              reposts_count={0}
              author_id={post.author_id}
              author_name={post.author_name}
              created_at={post.created_at}
              id={post.id}
              profile_url={post.profile_url}
              reply_to_id={post.reply_to_id}
              is_liked={post.is_liked}
              is_reposted={false}
              updated_at={post.updated_at}
            />
          ))}
        </View>
      )}
    </LayoutProvider>
  );
}

const StatBox = ({ value, label, colors, isDark }: any) => (
  <View
    style={{
      flex: 1,
      backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <Text
      style={{
        fontSize: 24,
        fontWeight: "800",
        color: colors.text,
      }}
    >
      {value.toLocaleString()}
    </Text>
    <Text
      style={{
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  </View>
);

const InfoRow = ({ title, value, colors, isDark }: any) => (
  <View
    style={{
      backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <Text
      style={{
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
      }}
    >
      {value}
    </Text>
  </View>
);

const ActionRow = ({ title, subtitle, onPress, colors, isDark }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
  </TouchableOpacity>
);
