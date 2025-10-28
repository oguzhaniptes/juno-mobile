import { View, Text, StyleSheet, Image, Alert, Pressable, Modal, TouchableOpacity, TextInput, GestureResponderEvent } from "react-native"; // Modal ve TouchableOpacity eklendi
import Avatar from "@/components/ui/avatar";
import InteractionButtons from "@/components/InteractionButtons";
import { BASE_URL } from "@/constants";
import { useState } from "react";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { timeAgo } from "@/utils";

interface PostCardProps {
  author_id: string;
  author_name: string | null;
  comments_count: number;
  content: string;
  created_at: string;
  id: string;
  likes_count: number;
  profile_url: string | null;
  reply_to_id: string | null;
  updated_at: string | null;
  image_url?: string;
  is_liked: boolean;
  is_reposted: boolean;
  reposts_count?: number;
  onPostDeleted?: (postId: string) => void;
}

const PostCard = ({
  author_id,
  author_name,
  comments_count,
  content,
  created_at,
  id,
  likes_count,
  profile_url,
  reply_to_id,
  updated_at,
  image_url,
  is_liked,
  is_reposted,
  reposts_count = 100,
  onPostDeleted, // Yeni prop
}: PostCardProps) => {
  const { authData } = useSession();
  const postTime = timeAgo(created_at);
  const [liked, setLiked] = useState(is_liked);
  const [resposted, setResposted] = useState(is_reposted);
  const [isModalVisible, setIsModalVisible] = useState(false); // Yeni state
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false); // ✨ YENİ: Yorum modalı
  const [commentText, setCommentText] = useState(""); // ✨ YENİ: Yorum metni state'i

  const isPostOwner = author_id === authData?.userId;

  const onCardPress = (id: string) => {
    try {
      router.push(`/post/${id}`);
    } catch (error) {
      console.log("error", error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({
          post_id: id,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        if (data.message === "Post liked successfully") {
          Alert.alert("Success", "Like successfully!");
          setLiked(true);
        } else if ((data.message = "Post unliked successfully")) {
          Alert.alert("Success", "Unlile successfully!");
          setLiked(false);
        }
      } else {
        Alert.alert("Error", data.message || "Failed to like post");
      }
    } catch (error) {
      console.error("Like post error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const toggleRepost = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/repost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({
          post_id: id,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        if (data.message === "Post reposted successfully") {
          Alert.alert("Success", "Repost successfully!");
          setResposted(true);
        } else if ((data.message = "Post unreposted successfully")) {
          Alert.alert("Success", "ReRepost successfully!");
          setResposted(false);
        }
      } else {
        Alert.alert("Error", data.message || "Failed to like post");
      }
    } catch (error) {
      console.error("Like post error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const handleDeletePost = async () => {
    setIsModalVisible(false); // Modalı kapat

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
              onPostDeleted?.(id);
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

  const handleSendComment = async (e: GestureResponderEvent) => {
    e.preventDefault(); // Form submit'ini engelle

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

      const data = await response.json();

      if (data.success) {
        Alert.alert("Yorumunuz eklendi!");
      } else {
        Alert.alert(data.message || "Yorum eklenemedi.");
      }
      setCommentText("");
      setIsCommentModalVisible(false);
    } catch (error) {
      console.error("Comment post error:", error);
      Alert.alert("Yorum gönderilirken ağ hatası oluştu.");
    }
  };

  // Yorum butonuna tıklama işleyicisi
  const handleCommentButton = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Kartın tıklanmasını engelle
    setIsCommentModalVisible(true);
  };

  const handleRouteProfile = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Kartın tıklanmasını engelle
    router.push(`/user/${author_id}`);
  };

  return (
    <Pressable style={styles.cardContainer} onPress={() => onCardPress(id)}>
      <View style={styles.authorSection}>
        <View style={styles.authorInfoRow}>
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={handleRouteProfile}>{profile_url ? <Image style={styles.avatarImage} source={{ uri: profile_url }} /> : <Avatar />}</Pressable>

            <Pressable onPress={handleRouteProfile} style={{ justifyContent: "flex-start" }}>
              <View style={styles.authorTextColumn}>
                <View style={styles.nameAndTimeRow}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {author_name || "Anonymous"}
                  </Text>

                  <Text style={styles.timeText}>• {postTime}</Text>
                </View>

                <Text style={styles.nicknameText} numberOfLines={1}>
                  @{author_id.slice(0, 10)}
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={() => setIsModalVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.postContentContainer}>
          <Text style={styles.postContentText}>{content}</Text>
        </View>
      </View>

      {image_url && <Image source={{ uri: image_url }} style={styles.postImage} resizeMode="cover" />}

      <InteractionButtons
        isUserLiked={liked}
        isUserReposted={resposted}
        handleLike={toggleLike}
        handleRepost={toggleRepost}
        handleComment={(e: GestureResponderEvent) => handleCommentButton(e)}
        likes={likes_count}
        comments={comments_count}
        reposts={reposts_count}
        viewAnaltics={0}
      />

      {/* BOTTOM SHEET MODAL */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
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
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={isCommentModalVisible} onRequestClose={() => setIsCommentModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setIsCommentModalVisible(false)}>
          <View style={styles.commentModalContent} onTouchStart={() => {}}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Yorum Yaz</Text>

            <TextInput
              style={styles.commentInput}
              placeholder="Yorumunuzu buraya yazın..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={commentText}
              onChangeText={setCommentText}
            />

            <View style={styles.commentActionRow}>
              <TouchableOpacity style={styles.commentCloseButton} onPress={() => setIsCommentModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Kapat</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.commentSendButton, commentText.trim() === "" && { opacity: 0.5 }]} onPress={handleSendComment} disabled={commentText.trim() === ""}>
                <Text style={styles.commentSendButtonText}>Gönder</Text>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  authorSection: {
    marginBottom: 16,
  },

  authorInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  avatarImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 8,
  },

  authorTextColumn: {
    flex: 1,
    justifyContent: "flex-start",
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

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
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

  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },

  // Yeni Stil: Modal (Bottom Sheet) Stilleri
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Modalı alta yasla
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Yarı saydam arka plan
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    width: "100%",
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
  modalOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2", // Açık kırmızı arka plan
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  modalOptionTextDanger: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444", // Kırmızı metin
  },
  modalCloseButton: {
    backgroundColor: "#F3F4F6", // Gri arka plan
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

  commentModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: "100%",
    maxHeight: "60%",
  },
  commentInput: {
    minHeight: 100,
    maxHeight: 200,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#1F2937",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  commentActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  commentSendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  commentSendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  commentCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
});

export default PostCard;
