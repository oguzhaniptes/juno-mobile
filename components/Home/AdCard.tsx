import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import Feather from "react-native-vector-icons/Feather"; // Kapatma simgesi için

interface AdCardProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  type: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

const AdCard: React.FC<AdCardProps> = ({ type, title, description, imageUrl, ctaText, ctaLink, comments, content, likes, shares }) => {
  const handleCtaPress = () => {
    console.log(`Navigating to CTA link: ${ctaLink}`);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.adLabel}>Advertisement</Text>

        <TouchableOpacity onPress={() => console.log("Reklam gizlendi")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="x" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.titleText}>{title}</Text>

      <Text style={styles.descriptionText}>{description}</Text>

      <TouchableOpacity style={styles.ctaButton} onPress={handleCtaPress}>
        <Text style={styles.ctaText}>{ctaText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.1 : 0.4,
    shadowRadius: 3,
    elevation: 3,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  adLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  closeIcon: {
    fontSize: 16,
    color: "#9CA3AF",
  },

  imageWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },

  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },

  descriptionText: {
    color: "#374151",
    fontSize: 14,
    marginBottom: 16,
  },

  ctaButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AdCard;
