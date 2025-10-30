// screens/PostDetailScreen.tsx - YENİDEN TASARLANDI
import { LayoutProvider } from "@/components/layout";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput, ScrollView, useColorScheme, Platform } from "react-native";
import Avatar from "@/components/ui/avatar";
import { timeAgo } from "@/utils";
import { Colors, createComponentStyles } from "@/styles";
import PostCard from "@/components/Home/PostCard";

interface UserInteractionInfo {
  user_id: string;
  user_name: string | null;
  profile_url: string | null;
  created_at: string;
}

interface CommentInfo {
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  id: string;
  is_liked: boolean;
  is_reposted: boolean;
  profile_url: string;
  likes_count: number;
  replies_count: number;
  reposts_count: number;
  reply_to_id: string;
  updated_at: string;
}

interface PostDetail {
  author_id: string;
  author_name: string | null;
  content: string;
  id: string;
  profile_url: string | null;
  likes_count: number;
  reposts_count: number;
  replies_count: number;
  is_liked: boolean;
  is_reposted: boolean;
  likes: UserInteractionInfo[];
  reposts: UserInteractionInfo[];
  replies: CommentInfo[];
  reply_to_id: string;
  updated_at: string;
  created_at: string;
}

const UserCard = ({ user, colors }: { user: UserInteractionInfo; colors: any }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}
  >
    {user.profile_url ? (
      <Image
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          marginRight: 12,
          borderWidth: 2,
          borderColor: colors.border,
        }}
        source={{ uri: user.profile_url }}
      />
    ) : (
      <Avatar />
    )}
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
      }}
    >
      {user.user_name || "Anonymous"}
    </Text>
  </View>
);

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [listModalType, setListModalType] = useState<"likes" | "reposts" | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

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
        console.log("----------POST GET: ", data.data);
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
        getPostDetail();
      } else {
        const data = await response.json();
        Alert.alert("Hata", data.message || "Yorum eklenemedi.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Hata", "Yorum gönderilirken ağ hatası oluştu.");
    }
  };

  const handleDeletePost = async () => {
    setIsMenuModalVisible(false);
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

  const handleDeleteComment = async () => {
    if (!selectedCommentId || !authData) return;
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
        Alert.alert("Başarılı", "Yorum silindi.");
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

  if (loading) {
    return (
      <LayoutProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Yükleniyor...</Text>
        </View>
      </LayoutProvider>
    );
  }

  if (!post) {
    return (
      <LayoutProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text
            style={{
              textAlign: "center",
              marginTop: 16,
              fontSize: 18,
              color: colors.text,
            }}
          >
            Gönderi bulunamadı
          </Text>
        </View>
      </LayoutProvider>
    );
  }

  return (
    <LayoutProvider hasBottomBar={false}>
      <PostCard
        key={post.id}
        isDetail={true}
        author_id={post.author_id}
        author_name={post.author_name}
        replies_count={post.replies_count}
        content={post.content}
        created_at={post.created_at}
        id={post.id}
        likes_count={post.likes_count}
        reposts_count={post.reposts_count}
        profile_url={post.profile_url}
        is_liked={post.is_liked}
        is_reposted={post.is_reposted}
        reply_to_id={post.reply_to_id}
        updated_at={post.updated_at}
      ></PostCard>

      {/* Stats Section */}
      <View style={[styles.postStatsSection, { borderTopColor: colors.border }]}>
        <TouchableOpacity onPress={() => handleOpenUserListModal("reposts")}>
          <Text style={{ color: colors.textSecondary }}>
            <Text style={{ fontWeight: "700", color: colors.text }}>{post.reposts_count}</Text> Reposts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOpenUserListModal("likes")}>
          <Text style={{ color: colors.textSecondary }}>
            <Text style={{ fontWeight: "700", color: colors.text }}>{post.likes_count}</Text> Likes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comment Input Section */}
      <View
        style={[
          styles.commentInputCard,
          {
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
          },
        ]}
      >
        <TextInput
          style={[
            styles.commentInputField,
            {
              backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F9FAFB") : colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Bir yorum yazın..."
          placeholderTextColor={colors.textSecondary}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[styles.commentSubmitButton, { backgroundColor: colors.primary }, commentText.trim() === "" && { opacity: 0.5 }]}
          onPress={handleSendComment}
          disabled={commentText.trim() === ""}
        >
          <Text style={styles.commentSubmitText}>Yorum Yap</Text>
          <Ionicons name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <View style={{ marginTop: 16, marginBottom: 20 }}>
        {/* <Text style={[styles.commentsHeader, { color: colors.text }]}>Yorumlar ({post.comments_count})</Text> */}
        {post.replies.map((item: CommentInfo) => (
          <PostCard
            key={item.id}
            isDetail={false}
            author_id={item.author_id}
            author_name={item.author_name}
            replies_count={item.replies_count}
            content={item.content}
            created_at={item.created_at}
            id={item.id}
            likes_count={item.likes_count}
            reposts_count={item.reposts_count}
            profile_url={item.profile_url}
            is_liked={item.is_liked}
            is_reposted={item.is_reposted}
            reply_to_id={item.reply_to_id}
            updated_at={item.updated_at}
          />
        ))}
      </View>

      {/* Modals */}
      {/* Post Menu Modal */}
      <Modal animationType="slide" transparent={true} visible={isMenuModalVisible} onRequestClose={() => setIsMenuModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuModalVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.cardBgSolid }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Gönderi Seçenekleri</Text>
            {isPostOwner && (
              <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeletePost}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text style={styles.modalDeleteText}>Gönderiyi Sil</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: colors.surface }]} onPress={() => setIsMenuModalVisible(false)}>
              <Text style={[styles.modalCancelText, { color: colors.text }]}>İptal</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Comment Delete Modal */}
      <Modal animationType="slide" transparent={true} visible={isCommentModalVisible} onRequestClose={() => setIsCommentModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsCommentModalVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.cardBgSolid }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Yorum Seçenekleri</Text>
            <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteComment}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
              <Text style={styles.modalDeleteText}>Yorumu Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: colors.surface }]} onPress={() => setIsCommentModalVisible(false)}>
              <Text style={[styles.modalCancelText, { color: colors.text }]}>İptal</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* User List Modal */}
      <Modal animationType="slide" transparent={true} visible={isListModalVisible} onRequestClose={() => setIsListModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsListModalVisible(false)}>
          <Pressable style={[styles.userListModal, { backgroundColor: colors.cardBgSolid }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>{listModalType === "likes" ? "Beğenenler" : "Repost Edenler"}</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {(listModalType === "likes" ? post?.likes : post?.reposts)?.map((user: UserInteractionInfo) => (
                <UserCard key={user.user_id} user={user} colors={colors} />
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.modalCancelButton, { backgroundColor: colors.surface }]} onPress={() => setIsListModalVisible(false)}>
              <Text style={[styles.modalCancelText, { color: colors.text }]}>Kapat</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </LayoutProvider>
  );
}
