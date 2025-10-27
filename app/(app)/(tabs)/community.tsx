import { CommunityCard, SectionHeader } from "@/components/Community/CommunityCard";
import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, TextInput, ScrollView, Switch, Alert, ActivityIndicator } from "react-native";

// Backend'den gelen community yapısı
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
  const [showAllUserCommunities, setShowAllUserCommunities] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    max_capacity: "",
    photo_url: "",
    is_public: true,
    requires_approval: false,
  });

  // Tüm communityleri çek
  const fetchCommunities = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/db/communities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization header ekleyin gerekirse
          Authorization: `Bearer ${authData?.idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("COMMUNITY --------------", data);
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

  // Yeni community oluştur
  const createCommunity = async () => {
    // Validasyon
    if (!formData.name.trim()) {
      Alert.alert("Error", "Community name is required");
      return;
    }
    if (!formData.slug.trim()) {
      Alert.alert("Error", "Slug is required");
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
          // Authorization header ekleyin gerekirse
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCommunity: Community = await response.json();
        console.log("New com", newCommunity);

        Alert.alert("Success", "Community created successfully!");

        // Form'u temizle
        setFormData({
          name: "",
          slug: "",
          description: "",
          max_capacity: "",
          photo_url: "",
          is_public: true,
          requires_approval: false,
        });

        // Modal'ı kapat
        setModalVisible(false);

        // Listeyi yenile
        fetchCommunities();
      } else {
        const error = await response.text();
        Alert.alert("Error", `Failed to create community: ${error}`);
      }
    } catch (error) {
      console.error("Create error:", error);
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
    const actionText = isJoined ? "leave" : "join";

    try {
      const response = await fetch(`${BASE_URL}/api/db/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.idToken}`,
        },
        body: JSON.stringify({
          community_id: communityId,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          Alert.alert("Success", result.message || `Successfully ${actionText}ed the community!`);
          // Listeyi yenile
          fetchCommunities();
        } else {
          Alert.alert("Error", result.message || `Failed to ${actionText} community`);
        }
      } else {
        const error = await response.text();
        Alert.alert("Error", error || `Failed to ${actionText} community`);
      }
    } catch (error) {
      console.error(`${actionText} error:`, error);
      Alert.alert("Error", "Network error occurred");
    }
  };

  // Slug otomatik oluştur
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // const maxInitialCount = 5;
  // const displayedUserCommunities = showAllUserCommunities ? communities : communities.slice(0, maxInitialCount);

  return (
    <LayoutProvider>
      <View style={styles.headerContainer}>
        <Text style={styles.pageMainTitle}>Communities</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {fetchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView>
          {/* --- 1. Your Communities Section --- */}
          {communities.length > 0 && (
            <View>
              <SectionHeader title={`Your communities (${communities.length})`} showAll={showAllUserCommunities} onToggle={() => setShowAllUserCommunities((v) => !v)} />

              <View style={styles.gridContainer}>
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
                    onPress={() => console.log(`View ${c.name}`, c)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {!fetchLoading && communities.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No communities yet</Text>
              <Text style={styles.emptyStateText}>Create your first community to get started!</Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.emptyStateButtonText}>Create Community</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Create Community Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Community</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Community Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Community Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData({ ...formData, name: text });
                    // Auto-generate slug
                    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
                      setFormData({ ...formData, name: text, slug: generateSlug(text) });
                    }
                  }}
                  placeholder="Enter community name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Slug */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Slug *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.slug}
                  onChangeText={(text) => setFormData({ ...formData, slug: text })}
                  placeholder="community-slug"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
                <Text style={styles.helperText}>URL-friendly identifier</Text>
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your community..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Photo URL */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Cover Photo URL</Text>
                <TextInput
                  style={styles.input}
                  value={formData.photo_url}
                  onChangeText={(text) => setFormData({ ...formData, photo_url: text })}
                  placeholder="https://example.com/photo.jpg"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              {/* Max Capacity */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Max Capacity</Text>
                <TextInput
                  style={styles.input}
                  value={formData.max_capacity}
                  onChangeText={(text) => setFormData({ ...formData, max_capacity: text })}
                  placeholder="Leave empty for unlimited"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              {/* Is Public Switch */}
              <View style={styles.switchGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Public Community</Text>
                  <Text style={styles.helperText}>Anyone can discover and join</Text>
                </View>
                <Switch
                  value={formData.is_public}
                  onValueChange={(value) => setFormData({ ...formData, is_public: value })}
                  trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                  thumbColor={formData.is_public ? "#2563EB" : "#F3F4F6"}
                />
              </View>

              {/* Requires Approval Switch */}
              <View style={styles.switchGroup}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Requires Approval</Text>
                  <Text style={styles.helperText}>Join requests need approval</Text>
                </View>
                <Switch
                  value={formData.requires_approval}
                  onValueChange={(value) => setFormData({ ...formData, requires_approval: value })}
                  trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                  thumbColor={formData.requires_approval ? "#2563EB" : "#F3F4F6"}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)} disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={createCommunity} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Create Community</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LayoutProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pageMainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  createButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  section: {
    marginBottom: 32,
  },
  gridContainer: {
    flexDirection: "column",
    gap: 16,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.25, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
