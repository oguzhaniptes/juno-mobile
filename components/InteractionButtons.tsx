import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";

interface InteractionButtonsProps {
  likes: number;
  comments: number;
  shares: number;
  viewAnaltics?: number;
  isUserLiked: boolean;
  // functions
  handleLike: () => void;
  handleComment: (e: GestureResponderEvent) => void;
}

const InteractionItem = ({ iconName, count, onPress, isUserLiked }: any) => (
  <TouchableOpacity style={styles.interactionItem} onPress={onPress}>
    <Feather name={iconName} style={[isUserLiked ? styles.likedIcon : styles.iconStyle]} />
    <Text style={styles.countText}>{count}</Text>
  </TouchableOpacity>
);

const InteractionButtons = ({ isUserLiked, likes = 100, comments = 100, shares = 100, viewAnaltics = 100, handleLike, handleComment }: InteractionButtonsProps) => {
  return (
    <View style={styles.container}>
      <InteractionItem onPress={handleLike} isUserLiked={isUserLiked} iconName="heart" count={likes} />

      <InteractionItem onPress={handleComment} iconName="message-square" count={comments} />

      <InteractionItem iconName="share" count={shares} />

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

  countText: {
    fontSize: 14,
    color: "#4B5563",
  },
});

export default InteractionButtons;
