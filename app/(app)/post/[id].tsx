import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { authData } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false); // Post silme modalı
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false); // Yorum silme/işlem modalı
  const [selectedCommentId, setSelectedCommentId] = useState(null); // Silinecek yorumun ID'si

  // Mock data/fonksiyonları kullanarak authData.userId'yi kontrol et
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
        console.log("post", data.data);
        setPost(data.data);
      } else {
        console.log("Error.");
      }

      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }, [authData?.idToken, id]);

  useEffect(() => {
    getPostDetail();
  }, [authData?.idToken, getPostDetail, id]);

  const handleDeleteComment = async () => {
    if (!selectedCommentId || !authData) return;

    try {
      const response = await fetch(`${BASE_URL}/api/db/comment/${selectedCommentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.idToken}`, // ✅ JWT token
        },
        // body: JSON.stringify({

        // }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Post deleted successfully!");
        setIsCommentModalVisible(false);
        getPostDetail();
      } else {
        Alert.alert("Error", data.message || "Failed to Post deleted");
      }
    } catch (error) {
      console.error("Post deleted error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
    }
  };

  const handleOpenCommentMenu = (commentId: string, commentUserId: string) => {
    // Sadece yorumun sahibiyseniz menüyü aç
    if (commentUserId === authData?.userId) {
      setSelectedCommentId(commentId);
      setIsCommentModalVisible(true);
    } else {
      Alert.alert("Yetkisiz İşlem", "Sadece kendi yorumlarınızı silebilirsiniz.");
    }
  };

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

  return (
    <LayoutProvider>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Gönderi Detay Sayfası</Text>
      <Text style={{ marginTop: 10 }}>Gönderi ID: {id}</Text>
      <Text>{post?.content}</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Beğenenler</Text>
      {post &&
        post?.likes &&
        post?.likes.map((like: any) => {
          return (
            <View key={like.user_id} style={{ borderColor: "black", borderWidth: 1, padding: 5, marginBottom: 5 }}>
              <Text>ID: {like.user_id}</Text>
              <Text>Adı: {like.user_name}</Text>
            </View>
          );
        })}

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Yorumlar</Text>
      {post &&
        post?.comments &&
        post?.comments.map((comment: any) => {
          const isCommentOwner = comment.user_id === authData?.userId;
          return (
            <View key={comment.id} style={[styles.commentCard, { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }]}>
              <View style={{ flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{comment.user_name || "Bilinmeyen Kullanıcı"}</Text>
                <Text>{comment.content}</Text>
              </View>

              {/* ✨ YORUM SİLME BUTONU */}
              {isCommentOwner && (
                <Pressable onPress={() => handleOpenCommentMenu(comment.id, comment.user_id)} style={{ padding: 5 }}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                </Pressable>
              )}
            </View>
          );
        })}

      {/* 1. POST SİLME/MENÜ MODALI (isMenuModalVisible) */}
      <Modal animationType="slide" transparent={true} visible={isMenuModalVisible} onRequestClose={() => setIsMenuModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setIsMenuModalVisible(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={() => {
              /* Yayılımı kesmek için */
            }}
          >
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Gönderi Seçenekleri</Text>

            {/* SİLME SEÇENEĞİ */}
            {isPostOwner && (
              <TouchableOpacity
                style={styles.modalOptionButton}
                onPress={() => {
                  /* Silme işlemini burada bağlayın */
                }}
              >
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

      {/* ✨ 2. YORUM SİLME MODALI (isCommentModalVisible) */}
      {selectedCommentId && (
        <Modal animationType="slide" transparent={true} visible={isCommentModalVisible} onRequestClose={() => setIsCommentModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={() => setIsCommentModalVisible(false)}>
            <Pressable
              style={styles.modalContent}
              onPress={() => {
                /* Yayılımı kesmek için */
              }}
            >
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Yorum Seçeneği</Text>

              <TouchableOpacity style={styles.modalOptionButton} onPress={handleDeleteComment}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text style={styles.modalOptionTextDanger}>Yorumu Sil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsCommentModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>İptal</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </LayoutProvider>
  );
}

const styles = StyleSheet.create({
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
});
