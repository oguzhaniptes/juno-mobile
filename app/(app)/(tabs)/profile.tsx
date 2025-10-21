import { LayoutProvider } from "@/components/layout";
import Avatar from "@/components/ui/avatar";
import { useSession } from "@/provider/AuthProvider";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const { authData, ephemeralData, isLoading, signOut } = useSession();
  console.log("👤 ProfileScreen authData:", authData);
  console.log("👤 ProfileScreen ephemeralData:", ephemeralData);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authData) {
      router.push("/sign-in");
    }
  }, [authData, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!authData) {
    return null;
  }

  return (
    <LayoutProvider>
      <View style={styles.profileContentBox}>
        <View style={styles.profileDetailsRow}>
          <Avatar></Avatar>
          <View style={styles.infoWrapper}>
            <View style={styles.userInfoTopRow}>
              <View style={styles.textWrapper}>
                <Text style={styles.displayNameText}>Mock Name</Text>
                <Text style={styles.usernameText}>@mockname</Text>
                <Text style={styles.usernameText}>mail@com</Text>
                <Text style={styles.joinedText}>Joined 01 01 1970</Text>
                <Text style={styles.joinedText}>Wallet: 0x000000</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={{ color: "#EF4444", marginTop: 12 }} onPress={signOut}>
                Sign Out
              </Text>
            </TouchableOpacity>
            <View style={styles.statsGrid}>
              <StatBox value={1000} label="Score" />
              <StatBox value={1000} label="Gold" />
              <StatBox value={1000} label="Diamonds" />
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoRow title="Favorite Team" value="Los Angeles Lakers" />
          <InfoRow title="Favorite Sport" value="Basketball" />
          <ActionRow title="Owned Items" subtitle="View your collectibles" onPress={() => router.push("/")} />
          <ActionRow title="Wallet Address" subtitle="Manage wallet" onPress={() => router.push("/")} />
        </View>
      </View>
    </LayoutProvider>
  );
}

const StatBox = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoRow = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoRowTitle}>{title}</Text>
    <Text style={styles.infoRowValue}>{value}</Text>
  </View>
);

const ActionRow = ({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionRow}>
    <View>
      <Text style={styles.infoRowTitle}>{title}</Text>
      <Text style={styles.infoRowValue}>{subtitle}</Text>
    </View>
    <Text style={styles.arrowText}>→</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#4B5563",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  contentPadding: {
    padding: 16,
  },

  headerBox: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    color: "#4B5563",
    marginTop: 4,
  },

  profileContentBox: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24, // p-6
  },
  profileDetailsRow: {
    justifyContent: "center",
    alignItems: "center",

    gap: 24, // gap-6
  },
  infoWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoTopRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    alignItems: "center",
  },

  displayNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  usernameText: {
    fontSize: 14,
    color: "#2563EB",
  },
  joinedText: {
    fontSize: 12,
    color: "#6B7280",
  },

  statsGrid: {
    flexDirection: "row",

    marginTop: 24,
    gap: 16,
  },
  statBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  infoGrid: {
    marginTop: 32, // mt-8

    gap: 16,
  },
  infoRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
  },
  infoRowTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 4,
  },

  actionRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowText: {
    fontSize: 24,
    color: "#9CA3AF",
  },
});
