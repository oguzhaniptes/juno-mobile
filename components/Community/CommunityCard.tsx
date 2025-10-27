import { Image, TouchableOpacity, Platform, View, Text, Linking, StyleSheet } from "react-native";

interface CommunityCardProps {
  name: string;
  members: number;
  max_member: number;
  description: string;
  cover?: string; // Optional - URI
  onJoin: () => void;
  onPress: () => void;
  isJoined?: boolean; // Kullanıcı bu community'ye üye mi?
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ name, members, max_member, description, cover, onJoin, onPress, isJoined = false }) => (
  <TouchableOpacity onPress={onPress} style={styles.cardContainer} activeOpacity={0.7}>
    {/* Sol Kısım: Avatar */}
    <View style={styles.cardImageWrapper}>
      {cover ? (
        <Image source={{ uri: cover }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        // Fallback: İlk harf ile placeholder
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Text style={styles.cardImagePlaceholderText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
    </View>

    {/* Orta Kısım: Bilgiler */}
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.cardMembers}>
        {members}/{max_member}
      </Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {description || "No description available"}
      </Text>
    </View>

    {/* Sağ Kısım: Join/Joined Butonu */}
    <View style={styles.cardButtonWrapper}>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Parent onPress'i tetiklemesin
          onJoin();
        }}
        style={[styles.joinButton, isJoined && styles.joinedButton]}
      >
        <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>{isJoined ? "Joined" : "Join"}</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// --- HELPER FUNCTION: Section Header ---
interface SectionHeaderProps {
  title: string;
  showAll?: boolean | null;
  onToggle: (() => void) | null;
  linkHref?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, showAll, onToggle, linkHref }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onToggle ? (
        // Göster/Gizle Butonu
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.linkText}>{showAll ? "Show less" : "See all"}</Text>
        </TouchableOpacity>
      ) : linkHref ? (
        // Explore more Linki
        <TouchableOpacity onPress={() => console.log(`Navigate to: ${linkHref}`)}>
          <Text style={styles.linkText}>Explore more</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Section Stilleri ---
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12, // mb-3
  },
  sectionTitle: {
    fontSize: 18, // text-xl
    fontWeight: "600",
    color: "#1F2937", // text-gray-900
  },
  linkText: {
    fontSize: 14, // text-sm
    color: "#2563EB", // text-blue-600
    fontWeight: "500",
  },

  // --- CommunityCard Stilleri ---
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    padding: 16, // p-4
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: { elevation: 3 },
    }),
  },
  cardImageWrapper: {
    marginRight: 16, // mr-4
    flexShrink: 0,
  },
  cardImage: {
    height: 64, // h-16
    width: 64, // w-16
    borderRadius: 8, // rounded-lg
    backgroundColor: "#F3F4F6", // bg-gray-100
  },
  cardImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DBEAFE", // bg-blue-100
  },
  cardImagePlaceholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB", // text-blue-600
  },
  cardInfo: {
    flex: 1,
    paddingRight: 60, // Join buton için alan
  },
  cardTitle: {
    fontSize: 16, // text-base
    fontWeight: "600",
    color: "#1F2937", // text-gray-900
  },
  cardMembers: {
    fontSize: 12, // text-xs
    color: "#6B7280", // text-gray-500
    marginTop: 2, // mt-0.5
  },
  cardDescription: {
    fontSize: 14, // text-sm
    color: "#374151", // text-gray-700
    marginTop: 8, // mt-2
  },
  cardButtonWrapper: {
    position: "absolute",
    bottom: 16, // bottom-4
    right: 16, // right-4
  },
  joinButton: {
    paddingHorizontal: 12, // px-3
    paddingVertical: 6, // py-1.5
    backgroundColor: "#2563EB", // bg-blue-600
    borderRadius: 6, // rounded-md
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: { elevation: 2 },
    }),
  },
  joinButtonText: {
    fontSize: 14, // text-sm
    color: "white",
    fontWeight: "500",
  },
  // Joined state
  joinedButton: {
    backgroundColor: "#E5E7EB", // bg-gray-200
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  joinedButtonText: {
    color: "#374151", // text-gray-700
  },
});
