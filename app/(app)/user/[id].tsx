import { View, Text, StyleSheet, Image, ActivityIndicator, Pressable, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useSession } from "@/provider/AuthProvider";
import { BASE_URL } from "@/constants";
import { LayoutProvider } from "@/components/layout";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/ui/avatar";

interface UserProfileData {
  id: string;
  name: string | null;
  mail: string | null;
  photo: string | null;
  followers_count: number;
  following_count: number;
  silver_amount: number;
  gold_amount: number;
  is_following: boolean | null;
  is_followed_by_me: boolean | null;
}

// Yeni: Takipçi listesi için veri yapısı
interface UserFollowInfo {
  user_id: string;
  user_name: string | null;
  profile_url: string | null;
  followed_at: string | null;
}

// Yeni: Modal içeriği tipi
type ModalContentType = "followers" | "following" | null;

const User = () => {
  const { id: userId } = useLocalSearchParams();
  const { authData } = useSession();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowingState, setIsFollowingState] = useState<boolean | null>(null);

  // Yeni Modal State'leri
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [followList, setFollowList] = useState<UserFollowInfo[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const isMyProfile = authData?.userId === userId;

  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (authData?.idToken) {
        headers["Authorization"] = `Bearer ${authData.idToken}`;
      }

      const response = await fetch(`${BASE_URL}/api/db/user/${userId}`, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
          setIsFollowingState(data.data.is_following);
        } else {
          Alert.alert("Hata", data.message || "Kullanıcı bilgileri alınamadı.");
          setUser(null);
        }
      } else {
        const errorData = await response.json();
        Alert.alert("Hata", errorData.message || "Kullaci bulunamadı veya bir hata oluştu.");
        setUser(null);
      }
    } catch (error) {
      console.log("errr", error);

      Alert.alert("Hata", "Ağ hatasi. Lütfen tekrar deneyin.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [authData?.idToken, userId]);

  const fetchFollowList = useCallback(
    async (type: ModalContentType) => {
      if (!userId || !type) return;

      setListLoading(true);
      setFollowList([]);

      try {
        const endpoint = type === "followers" ? "followers" : "following";
        const response = await fetch(`${BASE_URL}/api/db/${endpoint}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          console.log("datataaaa", data.data);
          if (data.success && data.data) {
            setFollowList(data.data);
          } else {
            setFollowList([]);
          }
        } else {
          Alert.alert("Hata", `Liste (${type}) alinamadi.`);
        }
      } catch (error) {
        console.log("errr", error);

        Alert.alert("Hata", "Takip listesini alirken ağ hatasi oluştu.");
      } finally {
        setListLoading(false);
      }
    },
    [userId, authData?.idToken]
  );

  const handleStatPress = (type: ModalContentType) => {
    setModalContent(type);
    setIsModalVisible(true);
    fetchFollowList(type);
  };

  const handleFollowToggle = async () => {
    if (!authData?.idToken) {
      Alert.alert("Giriş Yapmalısınız", "Takip etmek veya takibi bırakmak için lütfen giriş yapın.");
      return;
    }

    if (!user) return;

    const endpoint = isFollowingState ? "unfollow" : "follow";
    const method = "POST";

    try {
      const response = await fetch(`${BASE_URL}/api/db/${endpoint}/${user.id}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.idToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsFollowingState(!isFollowingState);
        Alert.alert("Başarılı", data.message);

        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              followers_count: isFollowingState ? prevUser.followers_count - 1 : prevUser.followers_count + 1,
            };
          }
          return prevUser;
        });
      } else {
        Alert.alert("Hata", data.message || `Takip/Takip bırakma işlemi başarısız.`);
      }
    } catch (error) {
      console.log("errr", error);

      Alert.alert("Hata", "Ağ hatası. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const renderFollowerItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        setIsModalVisible(false);
        router.push(`/user/${item.id}`);
      }}
      key={item.id}
    >
      {item.photo ? <Image source={{ uri: item.photo }} style={styles.listAvatar} /> : <Avatar />}
      <View style={styles.listTextContainer}>
        <Text style={styles.listName} numberOfLines={1}>
          {item.name || "Anonim"}
        </Text>
        <Text style={styles.listHandle}>@{item.id}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color="#9CA3AF" />
    </Pressable>
  );

  const renderModalContent = () => {
    const title = modalContent === "followers" ? "Takipçiler" : "Takip Edilenler";
    const listData = followList;

    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{title}</Text>

        {listLoading ? (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 20 }} />
        ) : listData.length === 0 ? (
          <Text style={styles.emptyListText}>{modalContent === "followers" ? "Hiç takipçisi yok." : "Kimseyi takip etmiyor."}</Text>
        ) : (
          <FlatList
            data={listData}
            renderItem={renderFollowerItem}
            keyExtractor={(item) => item.user_id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
          <Text style={styles.modalCloseButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <LayoutProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
        </View>
      </LayoutProvider>
    );
  }

  if (!user) {
    return (
      <LayoutProvider>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Kullanıcı bulunamadı veya bir hata oluştu.</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>Geri Dön</ThemedText>
          </TouchableOpacity>
        </View>
      </LayoutProvider>
    );
  }

  const userBio = "Full-stack developer | React Native & Rust enthusiast. Building awesome things at Centrum Labs";

  return (
    <LayoutProvider>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {user.photo ? <Image source={{ uri: user.photo }} style={styles.profileImage} /> : <Avatar />}

          {!isMyProfile && authData?.idToken && (
            <TouchableOpacity style={[styles.followButton, isFollowingState ? styles.unfollowButton : styles.followButtonActive]} onPress={handleFollowToggle}>
              <Text style={isFollowingState ? styles.unfollowButtonText : styles.followButtonText}>{isFollowingState ? "Takibi Bırak" : "Takip Et"}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ThemedText style={styles.userName}>{user.name || "Anonim Kullanıcı"}</ThemedText>
        <Text style={styles.userHandle}>@{user.name ? user.name.toLowerCase().replace(/\s/g, "") : user.id.slice(0, 8)}</Text>
        <Text style={styles.userBio}>{userBio}</Text>

        <View style={styles.statsContainer}>
          <Pressable onPress={() => handleStatPress("followers")}>
            <Text style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers_count}</Text> Takipçi
            </Text>
          </Pressable>
          <Pressable onPress={() => handleStatPress("following")}>
            <Text style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following_count}</Text> Takip Edilen
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Coin Bilgileri</ThemedText>
        </View>
        <View style={styles.coinInfoContainer}>
          <View style={styles.coinCard}>
            <Ionicons name="diamond-outline" size={24} color="#C0C0C0" />
            <Text style={styles.coinAmount}>{user.silver_amount} Silver</Text>
          </View>
          <View style={styles.coinCard}>
            <Ionicons name="star-outline" size={24} color="#FFD700" />
            <Text style={styles.coinAmount}>{user.gold_amount} Gold</Text>
          </View>
        </View>
      </View>

      {/* TAKİP/TAKİP EDİLEN MODALI */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <Pressable style={styles.modalOverlayPressable} onPress={() => setIsModalVisible(false)}>
          <Pressable style={styles.modalContentWrapper} onPress={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </Pressable>
        </Pressable>
      </Modal>
    </LayoutProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 120,
    backgroundColor: "#F9FAFB",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  followButton: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  followButtonActive: {
    backgroundColor: "#1D9BF0",
    borderColor: "#1D9BF0",
  },
  unfollowButton: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  unfollowButtonText: {
    color: "#1F2937",
    fontWeight: "bold",
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  userBio: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 20,
  },
  statItem: {
    fontSize: 16,
    color: "#6B7280",
  },
  statNumber: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  sectionHeader: {
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 10,
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  coinInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  coinCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  coinAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 8,
  },

  // MODAL STYLES (Based on the example)
  modalOverlayPressable: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContentWrapper: {
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },

  // LIST STYLES
  listContainer: {
    marginBottom: 40,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  listHandle: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#6B7280",
  },
});

export default User;
