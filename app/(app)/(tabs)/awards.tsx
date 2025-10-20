import { LayoutProvider } from "@/components/layout";
import { ThemedView } from "@/components/themed-view";
import Avatar from "@/components/ui/avatar";

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";

type Leader = {
  id: number;
  name: string;
  avatar: string; // React Native'de bu, URI olmalıdır
  earningsUsd: number;
  points: number;
};

// Mock verileri buraya tekrar eklenmiştir:
const MOCK_DATA = {
  currentLeaders: [
    { id: 1, name: "Aylin Demir", avatar: "https://via.placeholder.com/100/FFA500/000000?text=A1", earningsUsad: 1520, points: 980 },
    { id: 2, name: "Mert Yılmaz", avatar: "https://via.placeholder.com/100/C0C0C0/000000?text=M2", earningsUsd: 1310, points: 920 },
    { id: 3, name: "Zeynep Kaya", avatar: "https://via.placeholder.com/100/CD7F32/000000?text=Z3", earningsUsd: 1090, points: 870 },
    { id: 4, name: "Ahmet Çetin", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=A4", earningsUsd: 880, points: 820 },
    { id: 5, name: "Ece Koç", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=E5", earningsUsd: 770, points: 790 },
    { id: 6, name: "Onur Can", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=O6", earningsUsd: 640, points: 760 },
    { id: 7, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S7", earningsUsd: 590, points: 740 },
    { id: 8, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S8", earningsUsd: 590, points: 740 },
    { id: 9, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S9", earningsUsd: 590, points: 740 },
    { id: 11, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 12, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 13, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 14, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 15, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 16, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
    { id: 17, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
  ],
  lastWeekLeaders: [
    { id: 1, name: "Aylin Demir", avatar: "https://via.placeholder.com/100/FFA500/000000?text=A1", earningsUsd: 1380, points: 930 },
    { id: 2, name: "Zeynep Kaya", avatar: "https://via.placeholder.com/100/C0C0C0/000000?text=Z2", earningsUsd: 1210, points: 900 },
    { id: 3, name: "Mert Yılmaz", avatar: "https://via.placeholder.com/100/CD7F32/000000?text=M3", earningsUsd: 1170, points: 880 },
    { id: 4, name: "Ece Koç", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=E4", earningsUsd: 860, points: 810 },
    { id: 5, name: "Ahmet Çetin", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=A5", earningsUsd: 810, points: 790 },
    { id: 6, name: "Onur Can", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=O6", earningsUsd: 620, points: 750 },
    { id: 7, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S7", earningsUsd: 590, points: 740 },
    { id: 8, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S8", earningsUsd: 590, points: 740 },
    { id: 9, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S9", earningsUsd: 590, points: 740 },
    { id: 10, name: "Seda Acar", avatar: "https://via.placeholder.com/100/AAAAAA/000000?text=S10", earningsUsd: 590, points: 740 },
  ],
};

// --- HELPER COMPONENT (Podium Tier) ---
const TierComponent = ({ leader, tierStyles }: any) => {
  // leader = top3[1] (Silver), top3[0] (Gold), top3[2] (Bronze)
  const { avatar, name, earningsUsd, points } = leader;
  const { badge, color, ring, height, avatar: avatarSize } = tierStyles;

  // Stilleri dinamik olarak al
  const tierPodiumStyle = (styles as any)[color.replace("bg-", "") + "Podium"];
  const tierHeightStyle = (styles as any)[height.replace("h-", "") + "Height"];
  const tierAvatarStyle = (styles as any)[avatarSize.replace("h-", "") + "Avatar"];

  // Ring rengini dinamik stil olarak verelim
  // const ringColorStyle = { borderColor: (styles as any)[ring.replace("ring-", "") + "Ring"].borderColor };

  return (
    <View style={styles.tierContainer}>
      <View style={styles.avatarWrapper}>
        {/* Avatar */}
        <Avatar></Avatar>

        <Text style={styles.tierName}>{name}</Text>
        <Text style={styles.tierStats}>
          ${earningsUsd} • {points} pts
        </Text>
      </View>
      {/* Podium Bloğu */}
      <View style={[styles.podiumBlock, tierPodiumStyle, tierHeightStyle]}></View>
    </View>
  );
};

// --- MAIN COMPONENT ---
export default function AwardsPage() {
  const [tab, setTab] = useState<"current" | "lastWeek">("current");

  const leaders = tab === "current" ? MOCK_DATA.currentLeaders : MOCK_DATA.lastWeekLeaders;
  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const tierStyles = [
    { badge: "Gold", color: "bg-yellow-400", ring: "ring-yellow-400", height: "h-40", avatar: "h-24 w-24" },
    { badge: "Silver", color: "bg-gray-300", ring: "ring-gray-300", height: "h-32", avatar: "h-20 w-20" },
    { badge: "Bronze", color: "bg-orange-300", ring: "ring-orange-300", height: "h-28", avatar: "h-16 w-16" },
  ];

  // Dikey kaydırma için ana ScrollView kullanılır.
  return (
    <LayoutProvider>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Awards</Text>

        {/* Sekme Butonları */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setTab("current")} style={[styles.tabButton, tab === "current" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "current" && styles.tabTextActive]}>Current</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("lastWeek")} style={[styles.tabButton, tab === "lastWeek" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "lastWeek" && styles.tabTextActive]}>Last week</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 2. Podium (Top 3) --- */}
      <View style={styles.podiumContainer}>
        <View style={styles.podiumGrid}>
          {/* Silver (2. Sıra) */}
          <TierComponent leader={top3[1]} tierStyles={tierStyles[1]} />

          {/* Gold (1. Sıra) */}
          <TierComponent leader={top3[0]} tierStyles={tierStyles[0]} />

          {/* Bronze (3. Sıra) */}
          <TierComponent leader={top3[2]} tierStyles={tierStyles[2]} />
        </View>
      </View>

      {/* --- 3. Ranks 4+ (Liste) --- */}
      <ThemedView style={styles.ranksContainer}>
        {/* Divide-y yerine FlatList kullanmak daha uygundur, ancak map yapısını koruyalım */}
        {rest.map((u, idx) => (
          <View key={u.id} style={styles.rankItem}>
            {/* Sıra Numarası */}
            <Text style={styles.rankNumber}>{idx + 4}</Text>

            {/* Avatar */}
            <Avatar></Avatar>

            {/* İsim ve İstatistikler */}
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{u.name}</Text>
              <Text style={styles.rankStats}>
                ${u.earningsUsd} • {u.points} pts
              </Text>
            </View>
          </View>
        ))}
      </ThemedView>
    </LayoutProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  contentPadding: {
    // padding: 16,
    // paddingBottom: 40,
  },

  // --- Header ve Tab Stilleri ---
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32, // space-y-8
  },
  pageTitle: {
    fontSize: 24, // text-3xl'e yakın
    fontWeight: "bold",
    color: "#1F2937", // text-gray-900
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    backgroundColor: "white", // bg-white
    padding: 2, // p-0.5
  },
  tabButton: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 6, // rounded-md
  },
  tabActive: {
    backgroundColor: "#2563EB", // bg-blue-600
  },
  tabText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-700
  },
  tabTextActive: {
    color: "white",
  },

  // --- Podium Stilleri (Top 3) ---
  podiumContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24, // p-6
    // shadow-md
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
    marginBottom: 32, // space-y-8
  },
  podiumGrid: {
    flexDirection: "row", // grid grid-cols-3
    justifyContent: "space-around",
    alignItems: "flex-end", // items-end
    gap: 16, // gap-4
  },

  // Tier Component Stilleri
  tierContainer: {
    flex: 1, // Üç sütuna böl
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatarWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  baseAvatar: {
    borderRadius: 9999, // rounded-full
    objectFit: "cover",
    borderWidth: 4,
  },
  ringStyle: {
    // Ring renkleri dinamik olarak TierComponent'te verilir
  },

  // Avatar Boyutları
  "h-24 w-24Avatar": { height: 96, width: 96 }, // Gold
  "h-20 w-20Avatar": { height: 80, width: 80 }, // Silver
  "h-16 w-16Avatar": { height: 64, width: 64 }, // Bronze

  tierName: {
    marginTop: 8, // mt-2
    fontSize: 14,
    fontWeight: "600", // font-semibold
    color: "#4B5563", // text-gray-700
  },
  tierStats: {
    fontSize: 12, // text-xs
    color: "#6B7280", // text-gray-500
  },

  // Podium Blokları
  podiumBlock: {
    marginTop: 12, // mt-3
    width: "100%", // w-full
    borderRadius: 6, // rounded-md
  },
  "h-40Height": { height: 160 }, // Gold
  "h-32Height": { height: 128 }, // Silver
  "h-28Height": { height: 112 }, // Bronze

  // Podium Renkleri
  "yellow-400Podium": { backgroundColor: "#FBBF24" }, // Gold
  "gray-300Podium": { backgroundColor: "#D1D5DB" }, // Silver
  "orange-300Podium": { backgroundColor: "#FDBA74" }, // Bronze

  // Ring Renkleri (Dinamik stil için referans)
  "ring-yellow-400Ring": { borderColor: "#FBBF24" },
  "ring-gray-300Ring": { borderColor: "#D1D5DB" },
  "ring-orange-300Ring": { borderColor: "#FDBA74" },

  // --- Ranks 4+ Stilleri ---
  ranksContainer: {
    marginBottom: 56,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // shadow-md
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16, // p-4
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6", // divide-y divide-gray-100
  },
  rankNumber: {
    width: 40, // w-10
    fontSize: 14, // text-sm
    fontWeight: "600",
    color: "#6B7280", // text-gray-500
  },
  rankAvatar: {
    height: 40, // h-10
    width: 40, // w-10
    borderRadius: 20, // rounded-full
    objectFit: "cover",
  },
  rankInfo: {
    marginLeft: 12, // ml-3
    flex: 1, // flex-1
  },
  rankName: {
    fontSize: 14, // text-sm
    fontWeight: "500",
    color: "#1F2937", // text-gray-900
  },
  rankStats: {
    fontSize: 12, // text-xs
    color: "#6B7280", // text-gray-500
  },
});
