import React from "react";
import { View } from "react-native";
import PostCard from "./PostCard";
import AdCard from "./AdCard";
import NewsCard from "./NewsCard";

export interface FeedItem {
  id: number;
  type: "news" | "user-post" | "ad";
  category?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  authorName?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const renderFeedItem = ({ item }: { item: FeedItem }) => {
  const itemKey = String(item.id);

  if (item.type === "news") {
    const commonProps = {
      type: item.type,
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      likes: item.likes || 0,
      comments: item.comments || 0,
      shares: item.shares || 0,
    };

    return (
      <View key={itemKey}>
        <NewsCard authorAvatarUrl="" {...commonProps} category={item.category || ""} title={item.title || ""} />
      </View>
    );
  } else if (item.type === "user-post") {
    const commonProps = {
      type: item.type,
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      likes: item.likes || 0,
      comments: item.comments || 0,
      shares: item.shares || 0,
    };

    return (
      <View key={itemKey}>
        <PostCard authorAvatarUrl="" {...commonProps} authorName={item.authorName || ""} />
      </View>
    );
  } else if (item.type === "ad") {
    return (
      <View key={itemKey}>
        <AdCard
          type={item.type}
          title={item.title || ""}
          content={item.content || ""}
          imageUrl={item.imageUrl || ""}
          likes={item.likes || 0}
          comments={item.comments || 0}
          shares={item.shares || 0}
          ctaLink={item.ctaLink || ""}
          ctaText={item.ctaText || ""}
          description={item.description || ""}
        />
      </View>
    );
  }

  return null;
};
