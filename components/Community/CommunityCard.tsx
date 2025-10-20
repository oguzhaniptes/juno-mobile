// --- HELPER COMPONENT: CommunityCard ---
import { Image, TouchableOpacity, Platform, View, Text, Linking, StyleSheet } from "react-native";

interface CommunityCardProps {
  name: string;
  members: number;
  description: string;
  cover: string; // URI
  onJoin: () => void;
  onPress: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ name, members, description, cover, onJoin, onPress }) => (
  // Ana Kapsayıcı: bg-card rounded-lg shadow-md border border-gray-200 p-4 flex
  <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
    {/* Sol Kısım: Avatar */}
    <View style={styles.cardImageWrapper}>
      <Image source={{ uri: cover }} style={styles.cardImage} resizeMode="cover" />
    </View>

    {/* Orta Kısım: Bilgiler (pr-20'den kaçınmak için flex: 1) */}
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardMembers}>{members.toLocaleString()} members</Text>
      {/* line-clamp-2 karşılığı: numberOfLines */}
      <Text style={styles.cardDescription} numberOfLines={2}>
        {description}
      </Text>
    </View>

    {/* Sağ Kısım: Join Butonu (absolute bottom-4 right-4) */}
    <View style={styles.cardButtonWrapper}>
      <TouchableOpacity onPress={onJoin} style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// --- HELPER FUNCTION: Section Header ---
export const SectionHeader = ({ title, showAll, onToggle, linkHref }: any) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onToggle ? (
        // Göster/Gizle Butonu
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.linkText}>{showAll ? "Show less" : "See all"}</Text>
        </TouchableOpacity>
      ) : (
        // Explore more Linki
        <TouchableOpacity onPress={() => Linking.openURL(linkHref)}>
          <Text style={styles.linkText}>Explore more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Hafif gri arka plan
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 40,
  },

  // --- Genel Başlık ---
  pageMainTitle: {
    fontSize: 28, // text-3xl
    fontWeight: "bold",
    color: "#1F2937", // text-gray-900
    marginBottom: 24, // mb-6
  },

  // --- Section Stilleri ---
  section: {
    marginBottom: 32, // mb-8
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12, // mb-3
  },
  sectionTitle: {
    fontSize: 18, // text-xl'e yakın
    fontWeight: "600",
    color: "#1F2937", // text-gray-900
  },
  linkText: {
    fontSize: 14, // text-sm
    color: "#2563EB", // text-blue-600
    fontWeight: "500",
  },
  gridContainer: {
    // Mobil için tek sütun (grid-cols-1) ve aralık (gap-4)
    flexDirection: "column",
    gap: 16, // gap-4
  },

  // --- CommunityCard Stilleri ---
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    padding: 16, // p-4
    position: "relative", // Join butonu için
    // shadow-md
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
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
  cardInfo: {
    flex: 1,
    // pr-20 yerine, butonun genişliğini telafi etmek için
    paddingRight: 60,
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
    // shadow-sm
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1 },
      android: { elevation: 2 },
    }),
  },
  joinButtonText: {
    fontSize: 14, // text-sm
    color: "white",
    fontWeight: "500",
  },
});
