import React from "react";
import { View } from "react-native";
import PostCard from "./PostCard";
import AdCard from "./AdCard";
import NewsCard from "./NewsCard";

export interface FeedItem {
  id: string;
  type: "news" | "user-post" | "ad";
  author_id: string;
  author_name: string | null;
  comments_count: number;
  content: string;
  created_at: string;
  likes_count: number;
  share_count?: number;
  profile_url: string | null;
  reply_to_id: string | null;
  updated_at: string | null;
  category?: string;
  title?: string;
  image_url?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
}

export const renderFeedItem = ({ item }: { item: FeedItem }) => {
  const itemKey = String(item.id);

  if (item.type === "news") {
    // NewsCard uses some common props and specific ones
    return (
      <View key={itemKey}>
        <NewsCard
          authorAvatarUrl={item.profile_url || ""}
          type={item.type}
          content={item.content || ""}
          imageUrl={item.image_url || ""} // Using image_url
          likes={item.likes_count || 0} // Using snake_case
          comments={item.comments_count || 0} // Using snake_case
          shares={item.share_count || 0} // Using snake_case
          category={item.category || ""}
          title={item.title || ""}
        />
      </View>
    );
  } else if (item.type === "user-post") {
    // PostCard expects all properties from the FeedItem for a 'user-post'
    // We can spread the item directly or pass all expected snake_case props
    return (
      <View key={itemKey}>
        <PostCard
          author_id={item.author_id}
          author_name={item.author_name}
          comments_count={item.comments_count}
          content={item.content}
          created_at={item.created_at}
          id={item.id}
          likes_count={item.likes_count}
          profile_url={item.profile_url}
          reply_to_id={item.reply_to_id}
          updated_at={item.updated_at}
          // Note: share_count is not destructured in PostCard, but it's fine for now
        />
      </View>
    );
  } else if (item.type === "ad") {
    // AdCard uses specific ad-related properties
    return (
      <View key={itemKey}>
        <AdCard
          type={item.type}
          title={item.title || ""}
          content={item.content || ""}
          imageUrl={item.image_url || ""} // Using image_url
          // Ad cards usually don't show likes/comments, but if they do, use the counts
          likes={item.likes_count || 0}
          comments={item.comments_count || 0}
          shares={item.share_count || 0}
          ctaLink={item.cta_link || ""} // Using cta_link
          ctaText={item.cta_text || ""} // Using cta_text
          description={item.description || ""}
        />
      </View>
    );
  }
  return (
    <View key={itemKey}>
      <PostCard
        author_id={item.author_id}
        author_name={item.author_name}
        comments_count={item.comments_count}
        content={item.content}
        created_at={item.created_at}
        id={item.id}
        likes_count={item.likes_count}
        profile_url={item.profile_url}
        reply_to_id={item.reply_to_id}
        updated_at={item.updated_at}
        // Note: share_count is not destructured in PostCard, but it's fine for now
      />
    </View>
  );
};
