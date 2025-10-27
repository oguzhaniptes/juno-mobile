import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, TextInput, ScrollView } from "react-native";
import Avatar from "@/components/ui/avatar";
import InteractionButtons from "@/components/InteractionButtons"; // Kullanılacak
import { timeAgo } from "@/utils"; // timeAgo fonksiyonunu utils/time'dan import ettiğinizi varsayıyorum

// --- Post Detail Types (Rust modelinizden geldiği varsayılır) ---
interface UserInteractionInfo {
  user_id: string;
  user_name: string | null;
  profile_url: string | null;
  created_at: string;
}

interface CommentInfo {
  id: string;
  user_id: string;
  user_name: string | null;
  profile_url: string | null;
  content: string;
  created_at: string;
  updated_at: string | null;
}

interface PostDetail {
  author_id: string;
  author_name: string | null;
  content: string;
  id: string;
  profile_url: string | null;
  likes_count: number;
  reposts_count: number;
  comments_count: number;
  is_liked: boolean;
  is_reposted: boolean;
  likes: UserInteractionInfo[];
  reposts: UserInteractionInfo[];
  comments: CommentInfo[];
  created_at: string;
  // Diğer alanlar...
}
// -----------------------------------------------------------------

// --- YENİ BİLEŞEN: Kullanıcı listesi için basit kart ---
const UserCard = ({ user }: { user: UserInteractionInfo }) => (
  <View style={styles.userCard}>
    {user.profile_url ? <Image style={styles.avatarImage} source={{ uri: user.profile_url }} /> : <Avatar />}
    <Text style={styles.nameText}>{user.user_name || "Anonymous"}</Text>
  </View>
);
// --------------------------------------------------------

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { authData } = useSession();
  const [post, setPost] = useState<PostDetail | null>(null); // Tip PostDetail olarak ayarlandı
  const [loading, setLoading] = useState(true);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isListModalVisible, setIsListModalVisible] = useState(false); // Yeni: Beğenen/Repost edenler modalı
  const [listModalType, setListModalType] = useState<"likes" | "reposts" | null>(null); // Modal içeriği
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isLikedState, setIsLikedState] = useState(false); // is_liked'ı local state'te tut
  const [isRepostedState, setIsRepostedState] = useState(false); // is_reposted'ı local state'te tut

  // Gönderi yüklenince state'leri ayarla
  useEffect(() => {
    if (post) {
      setIsLikedState(post.is_liked);
      setIsRepostedState(post.is_reposted);
    }
  }, [post]);

  const isPostOwner = post && post.author_id === authData?.userId;

  const getPostDetail = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/post/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.data);
      } else {
        console.log("Error fetching post detail.");
        setPost(null);
      }
    } catch (error) {
      console.log("error", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [authData?.idToken, id]);

  useEffect(() => {
    getPostDetail();
  }, [getPostDetail]);

  // --- YENİ ETKİLEŞİM FONKSİYONLARI ---

  const toggleLike = async () => {
    // toggleLike mantığınızı PostCard'dan buraya taşıyın ve post state'ini güncelleyin
    try {
      const response = await fetch(`${BASE_URL}/api/db/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await response.json();

      if (data.success) {
        // State'i güncelle ve detayları yeniden çek (veya optimistik güncelleme yap)
        setIsLikedState((prev) => !prev);
        getPostDetail();
      } else {
        Alert.alert("Hata", data.message || "Beğeni/Beğeni Kaldırma başarısız.");
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Hata", "Ağ hatası.");
    }
  };

  const toggleRepost = async () => {
    // toggleRepost mantığınızı buraya taşıyın
    try {
      const response = await fetch(`${BASE_URL}/api/db/repost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await response.json();

      if (data.success) {
        setIsRepostedState((prev) => !prev);
        getPostDetail();
      } else {
        Alert.alert("Hata", data.message || "Repost/Unrepost başarısız.");
      }
    } catch (error) {
      Alert.alert("Hata", "Ağ hatası.");
    }
  };

  const handleOpenUserListModal = (type: "likes" | "reposts") => {
    setListModalType(type);
    setIsListModalVisible(true);
  };

  const handleSendComment = async () => {
    if (commentText.trim() === "") {
      Alert.alert("Lütfen bir yorum yazın.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/db/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({
          post_id: id,
          content: commentText.trim(),
        }),
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Yorumunuz eklendi!");
        setCommentText("");
        getPostDetail(); // Yorum eklendikten sonra listeyi yenile
      } else {
        const data = await response.json();
        Alert.alert("Hata", data.message || "Yorum eklenemedi.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Hata", "Yorum gönderilirken ağ hatası oluştu. ");
    }
  };

  const handleDeletePost = async () => {
    setIsMenuModalVisible(false); // Modalı kapat

    Alert.alert("Gönderiyi Sil", "Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/db/post/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authData?.idToken}`,
              },
            });

            const data = await response.json();

            if (response.ok) {
              Alert.alert("Başarılı", "Gönderi başarıyla silindi.");
              // Silme başarılı olduğunda üst bileşene haber ver
              // onPostDeleted?.(id);
            } else {
              Alert.alert("Hata", data.message || "Gönderi silinemedi.");
            }
          } catch (error) {
            console.error("Delete post error:", error);
            Alert.alert("Hata", "Ağ hatası. Lütfen tekrar deneyin.");
          }
        },
      },
    ]);
  };

  const handleDeleteComment = async () => {
    if (!selectedCommentId || !authData) return;

    // Alert ile onay almayı unutmayın!

    try {
      const response = await fetch(`${BASE_URL}/api/db/comment/${selectedCommentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.idToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Yorum başarıyla silindi.");
        setIsCommentModalVisible(false);
        getPostDetail();
      } else {
        Alert.alert("Hata", data.message || "Yorum silinemedi");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Hata", "Ağ hatası.");
    } finally {
      setSelectedCommentId(null);
    }
  };

  const handleOpenCommentMenu = (commentId: string, commentUserId: string) => {
    if (commentId && commentUserId === authData?.userId) {
      setSelectedCommentId(commentId);
      setIsCommentModalVisible(true);
    } else {
      Alert.alert("Yetkisiz İşlem", "Sadece kendi yorumlarınızı silebilirsiniz.");
    }
  };

  // --- YÜKLEME VE HATA EKRANLARI ---

  if (loading) {
    return (
      <LayoutProvider>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
        <Text style={{ textAlign: "center", marginTop: 10 }}>Gönderi yükleniyor...</Text>
      </LayoutProvider>
    );
  }

  if (!post) {
    return (
      <LayoutProvider>
        <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>Gönderi bulunamadı veya bir hata oluştu.</Text>
      </LayoutProvider>
    );
  }

  // --- RENDER FONKSİYONU ---

  return (
    <LayoutProvider>
      <View style={styles.cardContainer}>
        <View style={styles.authorSection}>
          <View style={styles.authorInfoRow}>
            {post.profile_url ? <Image style={styles.avatarImage} source={{ uri: post.profile_url }} /> : <Avatar />}

            <View style={styles.authorTextColumn}>
              <View style={styles.nameAndTimeRow}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {post.author_name || "Anonymous"}
                </Text>
                <Text style={styles.timeText}>• {timeAgo(post.created_at)}</Text>
              </View>

              <Text style={styles.nicknameText} numberOfLines={1}>
                @{post.author_id.slice(0, 10)}
              </Text>
            </View>

            <Pressable onPress={() => setIsMenuModalVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
            </Pressable>
          </View>

          <View style={styles.postContentContainer}>
            <Text style={styles.postContentText}>{post.content}</Text>
          </View>
        </View>

        {/* Post Detayında görsel varsa buraya eklenebilir (API'dan image_url geliyorsa) */}
        {/* image_url && <Image source={{ uri: image_url }} style={styles.postImage} resizeMode="cover" /> */}

        {/* ETKİLEŞİM BUTONLARI */}
        <InteractionButtons
          isUserLiked={isLikedState}
          isUserReposted={isRepostedState}
          handleLike={toggleLike}
          handleRepost={toggleRepost}
          handleComment={() => {}} // Yorum modalı açma logic'i direkt yorum alanına bağlanabilir
          likes={post.likes_count}
          comments={post.comments_count}
          reposts={post.reposts_count}
          viewAnaltics={0}
        />
      </View>

      {/* BOTTOM SHEET MODAL */}
      <Modal animationType="slide" transparent={true} visible={isMenuModalVisible} onRequestClose={() => setIsMenuModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setIsMenuModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Gönderi Seçenekleri</Text>

            {/* SİLME SEÇENEĞİ */}
            {isPostOwner && (
              <TouchableOpacity style={styles.modalOptionButton} onPress={handleDeletePost}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text style={styles.modalOptionTextDanger}>Gönderiyi Sil</Text>
              </TouchableOpacity>
            )}

            {/* İPTAL BUTONU */}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsMenuModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* BEĞENENLER / REPOST EDENLER SAYACI (Tıklanabilir) */}
      <View style={styles.countsContainer}>
        <TouchableOpacity onPress={() => handleOpenUserListModal("reposts")}>
          <Text style={styles.countLinkText}>
            <Text style={{ fontWeight: "bold" }}>{post.reposts_count}</Text> Reposts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOpenUserListModal("likes")}>
          <Text style={styles.countLinkText}>
            <Text style={{ fontWeight: "bold" }}>{post.likes_count}</Text> Likes
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* YORUM EKLEME ALANI */}
      <View style={styles.commentInputContainer}>
        <TextInput style={styles.commentInput} placeholder="Bir yorum yazın..." placeholderTextColor="#9CA3AF" value={commentText} onChangeText={setCommentText} multiline={true} />
        <TouchableOpacity style={[styles.commentSendButton, commentText.trim() === "" && { opacity: 0.5 }]} onPress={handleSendComment} disabled={commentText.trim() === ""}>
          <Text style={styles.commentSendButtonText}>Yorum Yap</Text>
        </TouchableOpacity>
      </View>

      {/* YORUMLAR LİSTESİ */}
      <Text style={styles.commentHeader}>Yorumlar ({post.comments_count})</Text>
      {post.comments.map((comment: CommentInfo) => {
        const isCommentOwner = comment.user_id === authData?.userId;
        return (
          <View key={comment.id} style={styles.commentCard}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Avatar />
              <Text style={{ fontWeight: "bold", marginLeft: 8 }}>{comment.user_name || "Bilinmeyen Kullanıcı"}</Text>
              <Text style={styles.timeText}>• {timeAgo(comment.created_at)}</Text>
            </View>
            <View style={styles.commentContentRow}>
              <Text style={{ flex: 1 }}>{comment.content}</Text>
              {isCommentOwner && (
                <Pressable onPress={() => handleOpenCommentMenu(comment.id, comment.user_id)} style={{ padding: 5 }}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                </Pressable>
              )}
            </View>
          </View>
        );
      })}

      {/* 1. POST SİLME MODALI */}
      {/* ... (Post Silme Modalınız aynı kalır) ... */}

      {/* 2. YORUM SİLME MODALI */}
      {/* ... (Yorum Silme Modalınız aynı kalır) ... */}

      {/* 3. KULLANICI LİSTESİ MODALI (Beğenenler/Repost Edenler) */}
      <Modal animationType="slide" transparent={true} visible={isListModalVisible} onRequestClose={() => setIsListModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setIsListModalVisible(false)}>
          <Pressable style={styles.listModalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{listModalType === "likes" ? "Beğenenler" : "Repost Edenler"}</Text>

            <ScrollView style={{ maxHeight: 400 }}>
              {(listModalType === "likes" ? post?.likes : post?.reposts)?.map((user: UserInteractionInfo) => (
                <UserCard key={user.user_id} user={user} />
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsListModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </LayoutProvider>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },

  // ... (Mevcut stiller)
  authorSection: {
    marginBottom: 16,
  },

  authorInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  authorTextColumn: {
    flex: 1,
    justifyContent: "center",
  },
  nameAndTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 4,
  },
  nicknameText: {
    fontSize: 12,
    color: "#6B7280",
  },

  timeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  postContentContainer: {
    width: "100%",
    marginTop: 8,
  },
  postContentText: {
    color: "#374151",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },

  // Counts Section
  countsContainer: {
    flexDirection: "row",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  countLinkText: {
    fontSize: 15,
    color: "#4B5563",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },

  // Comment Input Styles
  commentInputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 10,
  },
  commentInput: {
    height: 60,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#1F2937",
    textAlignVertical: "top",
    marginBottom: 10,
  },
  commentSendButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  commentSendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Comments List Styles
  commentHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  commentCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  commentContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  // User Card for Modal
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
  },
  listModalContent: {
    // Kullanıcı listesi için daha kısa modal
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: "100%",
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
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
  modalOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  modalOptionTextDanger: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
