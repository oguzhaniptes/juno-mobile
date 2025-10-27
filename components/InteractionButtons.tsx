import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";

interface InteractionButtonsProps {
  likes: number;
  comments: number;
  reposts: number;
  viewAnaltics?: number;
  isUserLiked: boolean;
  isUserReposted: boolean;
  handleLike: () => void;
  handleComment: (e: GestureResponderEvent) => void;
  handleRepost: () => void;
}

const InteractionItem = ({ iconName, count, onPress, isUserLiked, isUserResposted }: any) => {
  let iconStyle = styles.iconStyle;

  if (iconName === "heart" && isUserLiked) {
    iconStyle = styles.likedIcon;
  } else if (iconName === "repeat" && isUserResposted) {
    iconStyle = styles.repostedIcon;
  }

  return (
    <TouchableOpacity style={styles.interactionItem} onPress={onPress}>
      <Feather name={iconName} style={iconStyle} />
      <Text style={styles.countText}>{count}</Text>
    </TouchableOpacity>
  );
};

const InteractionButtons = ({
  isUserLiked,
  isUserReposted,
  likes = 100,
  comments = 100,
  reposts = 100,
  viewAnaltics = 100,
  handleLike,
  handleComment,
  handleRepost,
}: InteractionButtonsProps) => {
  return (
    <View style={styles.container}>
      <InteractionItem onPress={handleLike} isUserLiked={isUserLiked} iconName="heart" count={likes} />

      <InteractionItem onPress={handleComment} iconName="message-square" count={comments} />

      <InteractionItem onPress={handleRepost} isUserResposted={isUserReposted} iconName="repeat" count={reposts} />

      <InteractionItem iconName="bar-chart-2" count={viewAnaltics} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconStyle: {
    fontSize: 20,
    marginRight: 4,
    color: "#4B5563",
  },

  likedIcon: {
    fontSize: 20,
    marginRight: 4,
    color: "#ff0000ff",
  },

  repostedIcon: {
    fontSize: 20,
    marginRight: 4,
    color: "#1D9BF0",
  },

  countText: {
    fontSize: 14,
    color: "#4B5563",
  },
});

export default InteractionButtons;
