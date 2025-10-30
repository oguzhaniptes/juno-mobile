// components/InteractionButtons.tsx - YENİDEN TASARLANDI
import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, useColorScheme, Platform } from "react-native";
import { Colors } from "@/styles";

interface InteractionButtonsProps {
  likes: number;
  replies: number;
  reposts: number;
  viewAnaltics?: number;
  isUserLiked: boolean;
  isUserReposted: boolean;
  handleLike: () => void;
  handleComment: (e: GestureResponderEvent) => void;
  handleRepost: () => void;
}

const InteractionItem = ({ iconName, count, onPress, isUserLiked, isUserReposted, colors }: any) => {
  let iconColor = colors.textSecondary;
  let countColor = colors.textSecondary;
  let buttonBg = "transparent";

  if (iconName === "heart" && isUserLiked) {
    iconColor = "#EF4444";
    countColor = "#EF4444";
    buttonBg = "rgba(239, 68, 68, 0.1)";
  } else if (iconName === "repeat" && isUserReposted) {
    iconColor = "#10B981";
    countColor = "#10B981";
    buttonBg = "rgba(16, 185, 129, 0.1)";
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: buttonBg,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Feather name={iconName} size={20} color={iconColor} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: countColor,
        }}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const InteractionButtons = ({
  isUserLiked,
  isUserReposted,
  likes = 0,
  replies = 0,
  reposts = 0,
  viewAnaltics = 0,
  handleLike,
  handleComment,
  handleRepost,
}: InteractionButtonsProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        // borderTopWidth: 1,
        // borderTopColor: colors.border,
      }}
    >
      <InteractionItem onPress={handleLike} isUserLiked={isUserLiked} iconName="heart" count={likes} colors={colors} />
      <InteractionItem onPress={handleComment} iconName="message-square" count={replies} colors={colors} />
      <InteractionItem onPress={handleRepost} isUserReposted={isUserReposted} iconName="repeat" count={reposts} colors={colors} />
      <InteractionItem iconName="bar-chart-2" count={viewAnaltics} colors={colors} />
    </View>
  );
};

export default InteractionButtons;
