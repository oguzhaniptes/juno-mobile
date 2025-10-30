// screens/CommunityListScreen.tsx - YENİDEN TASARLANDI
import { CommunityCard } from "@/components/Community/CommunityCard";
import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Switch, Alert, ActivityIndicator, useColorScheme, Platform } from "react-native";
import { router } from "expo-router";
import { Colors, createComponentStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photo_url: string | null;
  max_capacity: number;
  member_count: number;
  owner_id: number;
  is_public: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
  is_joined: boolean;
}

export default function CommunityPage() {
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  // const [showAllUserCommunities, setShowAllUserCommunities] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    max_capacity: "",
    photo_url: "",
    is_public: true,
    requires_approval: false,
  });

  const fetchCommunities = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/db/communities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommunities(data.data);
      } else {
        Alert.alert("Error", "Failed to fetch communities");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Network error occurred");
    } finally {
      setFetchLoading(false);
    }
  }, [authData?.idToken]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunities();
    setRefreshing(false);
  };

  const createCommunity = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      Alert.alert("Error", "Name and slug are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
        photo_url: formData.photo_url || null,
        is_public: formData.is_public,
        requires_approval: formData.requires_approval,
      };

      const response = await fetch(`${BASE_URL}/api/db/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Community created successfully!");
        setFormData({
          name: "",
          slug: "",
          description: "",
          max_capacity: "",
          photo_url: "",
          is_public: true,
          requires_approval: false,
        });
        setModalVisible(false);
        fetchCommunities();
      } else {
        const error = await response.text();
        Alert.alert("Error", `Failed to create community: ${error}`);
      }
    } catch (e) {
      console.error("Create error:", e);
      Alert.alert("Error", "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId: string, isJoined: boolean) => {
    if (!authData?.idToken) {
      Alert.alert("Error", "Please login to join communities");
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
        body: JSON.stringify({ community_id: communityId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Alert.alert("Success", result.message);
          fetchCommunities();
        }
      }
    } catch {
      Alert.alert("Error", "Network error occurred");
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <LayoutProvider refreshing={refreshing} onRefresh={onRefresh}>
      <View>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.text,
            }}
          >
            Communities
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              ...Platform.select({
                ios: {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {fetchLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 60,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {communities.length > 0 ? (
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.text,
                  }}
                >
                  Your Communities ({communities.length})
                </Text>

                {communities.map((c) => (
                  <CommunityCard
                    key={c.id}
                    name={c.name}
                    members={c.member_count}
                    isJoined={c.is_joined}
                    max_member={c.max_capacity}
                    description={c.description || "No description"}
                    cover={c.photo_url || undefined}
                    onJoin={() => handleJoinCommunity(c.id, c.is_joined)}
                    onPress={() => router.push(`/community/${c.id}`)}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 60,
                }}
              >
                <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.text,
                    marginTop: 16,
                  }}
                >
                  No communities yet
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Create your first community to get started!
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Create Community Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.cardBgSolid,
                maxHeight: "90%",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create Community</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Form Fields */}
              <View style={{ gap: 16 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Community Name *
                  </Text>
                  <TextInput
                    style={[
                      styles.commentInputField,
                      {
                        minHeight: 48,
                        backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
                      },
                    ]}
                    value={formData.name}
                    onChangeText={(text) => {
                      setFormData({ ...formData, name: text });
                      if (!formData.slug || formData.slug === generateSlug(formData.name)) {
                        setFormData({ ...formData, name: text, slug: generateSlug(text) });
                      }
                    }}
                    placeholder="Enter community name"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Slug *
                  </Text>
                  <TextInput
                    style={[
                      styles.commentInputField,
                      {
                        minHeight: 48,
                        backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
                      },
                    ]}
                    value={formData.slug}
                    onChangeText={(text) => setFormData({ ...formData, slug: text })}
                    placeholder="community-slug"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Description
                  </Text>
                  <TextInput
                    style={[styles.commentInputField, { minHeight: 100 }]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Describe your community..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      Public Community
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      Anyone can discover and join
                    </Text>
                  </View>
                  <Switch
                    value={formData.is_public}
                    onValueChange={(value) => setFormData({ ...formData, is_public: value })}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      Requires Approval
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      Join requests need approval
                    </Text>
                  </View>
                  <Switch
                    value={formData.requires_approval}
                    onValueChange={(value) => setFormData({ ...formData, requires_approval: value })}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  {
                    flex: 1,
                    backgroundColor: colors.surface,
                  },
                ]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.commentSubmitButton,
                  {
                    flex: 1,
                    backgroundColor: colors.primary,
                  },
                  loading && { opacity: 0.5 },
                ]}
                onPress={createCommunity}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.commentSubmitText}>Create</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LayoutProvider>
  );
}
