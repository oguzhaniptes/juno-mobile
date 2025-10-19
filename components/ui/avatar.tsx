import React from "react";
import { View, StyleSheet } from "react-native";

const Avatar = () => {
  return <View style={styles.header}></View>;
};

const styles = StyleSheet.create({
  header: {
    height: 40,
    width: 40,
    backgroundColor: "gray",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#000000",
  },
});

export default Avatar;
