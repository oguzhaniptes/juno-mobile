import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface InteractionButtonsProps {
  likes: number;
  comments: number;
  shares: number;
  viewAnaltics?: number;
}

const InteractionItem = ({ iconName, count }: any) => (
  <TouchableOpacity style={styles.interactionItem}>
    <Feather name={iconName} style={styles.iconStyle} />
    <Text style={styles.countText}>{count}</Text>
  </TouchableOpacity>
);

const InteractionButtons = ({ likes = 100, comments = 100, shares = 100, viewAnaltics = 100 }: InteractionButtonsProps) => {
  return (
    <View style={styles.container}>
      <InteractionItem iconName="heart" count={likes} />

      <InteractionItem iconName="message-square" count={comments} />

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

  countText: {
    fontSize: 14,
    color: "#4B5563",
  },
});

export default InteractionButtons;
