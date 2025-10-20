import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loading = () => {
  const indicatorColor = "#007AFF";
  const indicatorSize = "large";

  return (
    <View style={styles.container}>
      <ActivityIndicator size={indicatorSize} color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#333333",
  },
});

export default Loading;
