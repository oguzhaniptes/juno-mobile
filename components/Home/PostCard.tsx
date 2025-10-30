// components/PostCard.tsx - YENİDEN TASARLANDI
import { View, Text, Image, Alert, Pressable, TouchableOpacity, TextInput, GestureResponderEvent, useColorScheme, Platform } from "react-native";
import Avatar from "@/components/ui/avatar";
import InteractionButtons from "@/components/InteractionButtons";
import { BASE_URL } from "@/constants";
import { useState } from "react";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { timeAgo } from "@/utils";
import { createComponentStyles, Colors } from "@/styles";
import AppModal from "@/components/ui/AppModal";

interface PostCardProps {
  isDetail: boolean;
  author_id: string;
  author_name: string | null;
  replies_count: number;
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
  isDetail,
  author_id,
  author_name,
  replies_count,
  content,
  created_at,
  id,
  likes_count,
  profile_url,
  image_url,
  is_liked,
  is_reposted,
  reposts_count = 0,
  onPostDeleted,
}: PostCardProps) => {
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const postTime = timeAgo(created_at);
  const [liked, setLiked] = useState(is_liked);
  const [reposted, setResposted] = useState(is_reposted);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isPostOwner = author_id === authData?.userId;

  const onCardPress = (id: string) => {
    if (isDetail) return;
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
        body: JSON.stringify({ post_id: id }),
      });

      const data = await response.json();
      if (data.success) {
        setLiked(!liked);
        Alert.alert("Success", liked ? "Unliked successfully!" : "Liked successfully!");
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
        body: JSON.stringify({ post_id: id }),
      });

      const data = await response.json();
      if (data.success) {
        setResposted(!reposted);
        Alert.alert("Success", reposted ? "Unreposted successfully!" : "Reposted successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to repost");
      }
    } catch (error) {
      console.error("Repost error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const handleDeletePost = async () => {
    setIsModalVisible(false);
    Alert.alert("Gönderiyi Sil", "Bu gönderiyi silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
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
              Alert.alert("Başarılı", "Gönderi silindi.");
              onPostDeleted?.(id);
            } else {
              Alert.alert("Hata", data.message || "Gönderi silinemedi.");
            }
          } catch (error) {
            console.error("Delete post error:", error);
            Alert.alert("Hata", "Ağ hatası.");
          }
        },
      },
    ]);
  };

  const handleSendComment = async (e: GestureResponderEvent) => {
    e.preventDefault();
    if (commentText.trim() === "") {
      Alert.alert("Lütfen bir yorum yazın.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/db/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
        body: JSON.stringify({
          reply_to_id: id,
          content: commentText.trim(),
          post_type: "standard",
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

  const handleCommentButton = (e: GestureResponderEvent) => {
    if (isDetail) return;

    e.stopPropagation();
    setIsCommentModalVisible(true);
  };

  const handleRouteProfile = (e: GestureResponderEvent) => {
    e.stopPropagation();
    router.push(`/user/${author_id}`);
  };

  return (
    <Pressable style={[styles.postCard, { backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg }]} onPress={() => onCardPress(id)}>
      {/* Author Section */}
      <View style={styles.postAuthorSection}>
        <View style={styles.postAuthorRow}>
          <Pressable onPress={handleRouteProfile}>
            <Avatar size={"md"} imageUrl={profile_url} />
          </Pressable>

          <View style={styles.postAuthorInfo}>
            <View style={styles.postNameRow}>
              <Text style={styles.postAuthorName} numberOfLines={1}>
                {author_name || "Anonymous"}
              </Text>
              <Text style={styles.postTime}>• {postTime}</Text>
            </View>
            <Text style={styles.postUsername} numberOfLines={1}>
              @{author_id.slice(0, 10)}
            </Text>
          </View>

          <TouchableOpacity style={styles.postMenuButton} onPress={() => setIsModalVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.postContentSection}>
        <Text style={[styles.postContent, { color: colors.text }]}>{content}</Text>
      </View>

      {/* Image if exists */}
      {image_url && <Image source={{ uri: image_url }} style={styles.postImage} resizeMode="cover" />}

      {/* Interaction Buttons */}
      <InteractionButtons
        isUserLiked={liked}
        isUserReposted={reposted}
        handleLike={toggleLike}
        handleRepost={toggleRepost}
        handleComment={handleCommentButton}
        likes={likes_count}
        comments={replies_count}
        reposts={reposts_count}
        viewAnaltics={0}
      />

      {/* Menu Modal */}
      <AppModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Gönderi Seçenekleri</Text>
        {isPostOwner && (
          <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeletePost}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text style={styles.modalDeleteText}>Gönderiyi Sil</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: colors.surface }]} onPress={() => setIsModalVisible(false)}>
          <Text style={[styles.modalCancelText, { color: colors.text }]}>İptal</Text>
        </TouchableOpacity>
      </AppModal>

      {/* Comment Modal */}
      <AppModal visible={isCommentModalVisible} onClose={() => setIsCommentModalVisible(false)}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Yorum Yaz</Text>
        <TextInput
          style={[
            styles.commentInput,
            {
              backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Yorumunuzu buraya yazın..."
          placeholderTextColor={colors.textSecondary}
          multiline
          value={commentText}
          onChangeText={setCommentText}
        />
        <View style={styles.commentActions}>
          <TouchableOpacity style={[styles.commentCancelButton, { backgroundColor: colors.surface }]} onPress={() => setIsCommentModalVisible(false)}>
            <Text style={[styles.commentCancelText, { color: colors.text }]}>Kapat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commentSendButton, { backgroundColor: colors.primary }, commentText.trim() === "" && { opacity: 0.5 }]}
            onPress={handleSendComment}
            disabled={commentText.trim() === ""}
          >
            <Text style={styles.commentSendText}>Gönder</Text>
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </AppModal>
    </Pressable>
  );
};

export default PostCard;
