import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Avatar from "../ui/avatar";

const ProfileHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfoWrapper}>
        <Avatar></Avatar>

        <View style={styles.userNameColumn}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>Alex</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.diamondPill}>
          <Feather name="star" style={styles.diamondIcon} />
          <Text style={styles.diamondText}>120</Text>
        </View>

        <View style={styles.coinPill}>
          <Feather name="dollar-sign" style={styles.coinIcon} />
          <Text style={styles.coinText}>2500</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.1 : 0.2,
    shadowRadius: 1,
    elevation: 2,
  },

  userInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  userNameColumn: {
    flexDirection: "column",
  },

  welcomeText: {
    fontSize: 16,
    color: "#1F2937",
  },
  nameText: {
    fontWeight: "bold",
    color: "#1F2937",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  diamondPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: "rgba(219, 234, 254, 0.5)",
  },
  diamondIcon: {
    fontSize: 14,
    color: "#3B82F6",
  },
  diamondText: {
    fontSize: 14,
    color: "#1D4ED8",
    fontWeight: "600",
  },

  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255, 237, 213, 0.5)",
  },
  coinIcon: {
    fontSize: 14,
    color: "#F59E0B",
  },
  coinText: {
    fontSize: 14,
    color: "#B45309",
    fontWeight: "600",
  },
});

export default ProfileHeader;
