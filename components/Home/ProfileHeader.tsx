import { View, Text, StyleSheet, Image } from "react-native";
import Avatar from "@/components/ui/avatar";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useSession } from "@/provider/AuthProvider";

const ProfileHeader = () => {
  const { authData } = useSession();

  return (
    <View style={styles.header}>
      <View style={styles.userInfoWrapper}>
        {authData?.photoUrl ? <Image src={authData.photoUrl} style={{ height: 36, width: 36, borderRadius: 28 }}></Image> : <Avatar></Avatar>}

        <View>
          <Text style={styles.welcomeText}>{authData?.name}</Text>
          <Text style={styles.nameText}>@{authData?.mail?.slice(0, -27)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsPill}>
          <FontAwesome6 name="coins" size={16} color="#FFD700" />
          <Text style={styles.diamondText}>120</Text>
        </View>

        <View style={styles.statsPill}>
          <Ionicons name="diamond" size={16} color="#24ccffff" />
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
    padding: 16,
    elevation: 8,
  },

  userInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  welcomeText: {
    fontSize: 12,
    color: "#1F2937",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diamondIcon: {
    fontSize: 14,
    // color: "#3B82F6",
  },
  diamondText: {
    fontSize: 14,
    // color: "#1D4ED8",
    fontWeight: "600",
  },
  coinIcon: {
    fontSize: 14,
    // color: "#F59E0B",
  },
  coinText: {
    fontSize: 14,
    // color: "#B45309",
    fontWeight: "600",
  },
});

export default ProfileHeader;
