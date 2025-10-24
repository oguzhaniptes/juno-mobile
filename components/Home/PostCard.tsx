import { View, Text, StyleSheet, Image } from "react-native";
import Avatar from "@/components/ui/avatar";
import InteractionButtons from "@/components/InteractionButtons";

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
  share_count?: number;
}

const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return "Just now";
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes}m ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours}h ago`;
  } else if (diffInSeconds < year) {
    const days = Math.floor(diffInSeconds / day);
    return `${days}d ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    return `${years}y ago`;
  }
};

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
  share_count = 0,
}: PostCardProps) => {
  const postTime = timeAgo(created_at);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.authorSection}>
        <View style={styles.authorInfoRow}>
          {profile_url ? <Image style={styles.avatarImage} source={{ uri: profile_url }} /> : <Avatar />}

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
        </View>

        <View style={styles.postContentContainer}>
          <Text style={styles.postContentText}>{content}</Text>
        </View>
      </View>

      {image_url && <Image source={{ uri: image_url }} style={styles.postImage} resizeMode="cover" />}

      <InteractionButtons likes={likes_count} comments={comments_count} shares={share_count} viewAnaltics={0} />
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
  },

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
