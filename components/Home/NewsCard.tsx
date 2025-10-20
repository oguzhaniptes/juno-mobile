import React from "react";
import { View, Text, StyleSheet } from "react-native";
import InteractionButtons from "../InteractionButtons";

const NativeBadge = ({ category }: any) => (
  <View style={styles.badgeContainer}>
    <Text style={styles.badgeText}>{category}</Text>
  </View>
);

interface NewsCardProps {
  type: "news";
  category?: string;
  title?: string;
  content: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ category, title, content, likes, comments, shares }) => {
  return (
    <View style={styles.cardContainer}>
      {category && <NativeBadge category={category} />}

      <View style={styles.headerSection}>
        <View>{title && <Text style={styles.titleText}>{title}</Text>}</View>
      </View>

      <Text style={styles.contentText}>{content}</Text>

      <InteractionButtons likes={likes} comments={comments} shares={shares} viewAnaltics={shares} />
    </View>
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
    position: "relative",
  },

  badgeContainer: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    // paddingRight: 50,
  },

  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
    lineHeight: 28,
  },

  contentText: {
    color: "#374151",
    fontSize: 14,
  },
});

export default NewsCard;
