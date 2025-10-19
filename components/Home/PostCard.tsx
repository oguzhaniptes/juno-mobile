import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import Avatar from "../ui/avatar";
import InteractionButtons from "../InteractionButtons";

interface PostCardProps {
  type: "news" | "user-post";
  category?: string;
  title?: string;
  content: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  authorName?: string;
}

const PostCard: React.FC<PostCardProps> = ({ type, category, title, content, imageUrl, likes, comments, shares, authorName }) => {
  const isNews = type === "news";

  return (
    <View style={styles.cardContainer}>
      <View style={styles.authorSection}>
        <View style={styles.authorInfoRow}>
          <Avatar></Avatar>

          <View style={styles.authorTextColumn}>
            {isNews && category ? (
              <View>
                <Text style={styles.categoryText}>{category}</Text>
                <Text style={styles.titleText}>{title}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.nameText}>Alex</Text>
                <Text style={styles.nicknameText}>{authorName}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.postContentContainer}>
          <Text style={styles.postContentText}>{content}</Text>
        </View>
      </View>

      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.postImage} resizeMode="cover" />}

      <InteractionButtons likes={likes} comments={comments} shares={shares} viewAnaltics={shares} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.4,
    shadowRadius: 3,
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
    marginBottom: 8,
  },

  authorTextColumn: {
    justifyContent: "center",
    marginLeft: 8,
  },

  nameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  nicknameText: {
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
});

export default PostCard;
