// screens/CommunityDetailScreen.tsx - YENİ TASARIM
import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Image, TouchableOpacity, ScrollView, useColorScheme, Platform, Alert } from "react-native";
import { Colors, createComponentStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface CommunityDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photo_url: string | null;
  max_capacity: number;
  member_count: number;
  owner_id: string;
  is_public: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
  is_joined: boolean;
}

const Community = () => {
  const { id } = useLocalSearchParams();
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = community && community.owner_id === authData?.userId;
  const isJoined = community && community.is_joined;

  const getCommunityDetail = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/community/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Community Detail:", data);
        setCommunity(data.data);
      } else {
        console.log("Error fetching community detail.");
        setCommunity(null);
      }
    } catch (error) {
      console.log("error", error);
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  }, [authData?.sessionToken, id]);

  useEffect(() => {
    getCommunityDetail();
  }, [getCommunityDetail]);

  const handleToggleCommunity = async () => {
    if (!community) {
      Alert.alert("Error", "Community not found.");
      return;
    }

    if (isOwner) {
      Alert.alert("Error you can leave and join your community.");
      return;
    }

    if (!authData?.sessionToken) {
      Alert.alert("Error", "Please login to leave communities");
      return;
    }

    const endpoint = isJoined ? "leave-community" : "join-community";
    try {
      const response = await fetch(`${BASE_URL}/api/db/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.idToken}`,
        },
        body: JSON.stringify({ community_id: community.id }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Alert.alert("Success", result.message);
          getCommunityDetail();
        }
      }
    } catch {
      Alert.alert("Error", "Network error occurred");
    }
  };

  if (loading) {
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
        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 16,
            fontSize: 15,
          }}
        >
          Loading community...
        </Text>
      </View>
    );
  }

  if (!community) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          padding: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginTop: 16,
          }}
        >
          Community not found
        </Text>
      </View>
    );
  }

  return (
    <LayoutProvider hasBottomBar={false}>
      {/* Cover Image */}
      {community.photo_url && (
        <Image
          source={{ uri: community.photo_url }}
          style={{
            width: "100%",
            height: 200,
            marginBottom: -50,
          }}
          resizeMode="cover"
        />
      )}

      {/* Main Content Card */}
      <View
        style={[
          styles.communityDetailCard,
          {
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
          },
        ]}
      >
        {/* Header Info */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.text,
              textAlign: "center",
            }}
          >
            {community.name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            @{community.slug}
          </Text>

          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              gap: 24,
              marginTop: 16,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: colors.text,
                }}
              >
                {community.member_count}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Members
              </Text>
            </View>

            {community.max_capacity > 0 && (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.text,
                  }}
                >
                  {community.max_capacity}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  Max Capacity
                </Text>
              </View>
            )}
          </View>

          {/* Join Button */}
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: community.is_joined ? "rgba(239, 68, 68, 0.1)" : colors.primary,
              borderWidth: community.is_joined ? 1 : 0,
              borderColor: "#EF4444",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              ...Platform.select({
                ios: {
                  shadowColor: community.is_joined ? "#EF4444" : colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
            onPress={handleToggleCommunity}
          >
            <Ionicons name={community.is_joined ? "exit-outline" : "people-outline"} size={20} color={community.is_joined ? "#EF4444" : "#FFFFFF"} />
            <Text
              style={{
                color: community.is_joined ? "#EF4444" : "#FFFFFF",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {isOwner ? "Close Community" : community.is_joined ? "Leave Community" : "Join Community"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        {community.description && (
          <View
            style={{
              padding: 16,
              backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
              borderRadius: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: colors.text,
                lineHeight: 22,
              }}
            >
              {community.description}
            </Text>
          </View>
        )}

        {/* Info Grid */}
        <View style={{ gap: 12 }}>
          <InfoItem icon="globe-outline" label="Visibility" value={community.is_public ? "Public" : "Private"} colors={colors} isDark={isDark} />
          <InfoItem icon="checkmark-circle-outline" label="Approval" value={community.requires_approval ? "Required" : "Not Required"} colors={colors} isDark={isDark} />
          <InfoItem icon="calendar-outline" label="Created" value={new Date(community.created_at).toLocaleDateString()} colors={colors} isDark={isDark} />
        </View>
      </View>

      <View
        style={[
          styles.communityPostsCard,
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
            marginTop: 16,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: colors.text,
          }}
        >
          Live Match Chat
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            backgroundColor: "red",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons name={"basketball"} size={20} color={community.is_joined ? "#EF4444" : "#FFFFFF"} />
          <Text
            style={{
              color: community.is_joined ? "#EF4444" : "#FFFFFF",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Join
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts Section - Placeholder */}
      <View
        style={[
          styles.communityPostsCard,
          {
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
            marginTop: 16,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: colors.text,
            marginBottom: 16,
          }}
        >
          Community Posts
        </Text>
        <View
          style={{
            alignItems: "center",
            paddingVertical: 40,
          }}
        >
          <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
          <Text
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              marginTop: 12,
            }}
          >
            No posts yet
          </Text>
        </View>
      </View>
    </LayoutProvider>
  );
};

const InfoItem = ({ icon, label, value, colors, isDark }: any) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: `${colors.primary}20`,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 12,
          color: colors.textSecondary,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  </View>
);

export default Community;
