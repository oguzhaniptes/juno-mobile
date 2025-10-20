import { LayoutProvider } from "@/components/layout";
import Avatar from "@/components/ui/avatar";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
// Yönlendirme ve Session hook'larının Native versiyonlarını varsayıyoruz
// --- MOCK BİLEŞENLER VE TİP YARDIMLARI ---

// Auth verisinin yapısını varsayıyoruz
interface AuthData {
  username: string;
  fullName: string;
  joined: string;
  score: number;
  gold: number;
  diamonds: number;
}
// useRouter hook'unu taklit ediyoruz
const mockUseRouter = () => ({ push: (path: string) => console.log(`Navigating to: ${path}`) });
const mockUseSession = () => ({
  authData: {
    username: "ethan.carter",
    fullName: "Ethan Carter",
    joined: "2021",
    score: 1200,
    gold: 500,
    diamonds: 200,
  } as AuthData,
  isLoading: false,
});
// Bu satırları kendi gerçek hook'larınızla değiştirin
const useRouter = mockUseRouter;
const useSession = mockUseSession;

export default function ProfileScreen() {
  const { authData, isLoading } = useSession();
  const router = useRouter();

  // Web'den Native'e taşınan auth/redirect mantığı
  useEffect(() => {
    // Expo Router'da router.replace('/login') daha yaygındır.
    if (!isLoading && !authData) {
      router.push("/login");
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
      {/* Profile Content: bg-white rounded-lg shadow p-6 */}
      <View style={styles.profileContentBox}>
        <View style={styles.profileDetailsRow}>
          {/* Avatar: h-32 w-32 rounded-full object-cover ring-4 ring-gray-200 */}
          {/* <Image source={{ uri: "https://via.placeholder.com/150/0000FF/FFFFFF?text=P" }} style={styles.avatar} resizeMode="cover" /> */}
          <Avatar></Avatar>
          <View style={styles.infoWrapper}>
            <View style={styles.userInfoTopRow}>
              {/* 🔥 textWrapper stili eklendi */}
              <View style={styles.textWrapper}>
                <Text style={styles.displayNameText}>{authData.fullName}</Text>
                <Text style={styles.usernameText}>@{authData.username}</Text>
                <Text style={styles.joinedText}>Joined {authData.joined}</Text>
              </View>
            </View>

            {/* Stats: grid grid-cols-3 gap-4 mt-6 max-w-md */}
            <View style={styles.statsGrid}>
              <StatBox value={authData.score} label="Score" />
              <StatBox value={authData.gold} label="Gold" />
              <StatBox value={authData.diamonds} label="Diamonds" />
            </View>
          </View>
        </View>

        {/* Info Rows: mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 */}
        <View style={styles.infoGrid}>
          <InfoRow title="Favorite Team" value="Los Angeles Lakers" />
          <InfoRow title="Favorite Sport" value="Basketball" />
          <ActionRow title="Owned Items" subtitle="View your collectibles" onPress={() => router.push("/items")} />
          <ActionRow title="Wallet Address" subtitle="Manage wallet" onPress={() => router.push("/wallet")} />
        </View>
      </View>
    </LayoutProvider>
  );
}

// --- HELPER COMPONENTS ---

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

// --- STYLES ---

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
    backgroundColor: "#F3F4F6", // Hafif gri arka plan
  },
  contentPadding: {
    padding: 16,
  },

  // --- Header Stilleri ---
  headerBox: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24, // p-6
    marginBottom: 24, // mb-6
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24, // text-3xl'e yakın
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    color: "#4B5563",
    marginTop: 4, // mt-1
  },

  // --- Profile Content Stilleri ---
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
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // alignContent: "center",
    // alignItems: "flex-start",
    gap: 24, // gap-6
  },
  infoWrapper: {
    flexDirection: "column",
    alignItems: "center", // 🔥 İçeriği YATAYDA ORTALA
    justifyContent: "center",
  },
  userInfoTopRow: {
    // Bu View'ın çocuklarını ortalaması gerekir, ama metin tek bir View içinde
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    alignItems: "center", // 🔥 Metin satırlarını ortalar
  },

  displayNameText: {
    fontSize: 20, // text-2xl'e yakın
    fontWeight: "bold",
    color: "#1F2937",
  },
  usernameText: {
    fontSize: 14, // text-sm
    color: "#2563EB", // text-blue-600
  },
  joinedText: {
    fontSize: 12, // text-xs
    color: "#6B7280", // text-gray-500
  },

  // --- Stats Grid Stilleri ---
  statsGrid: {
    flexDirection: "row", // grid-cols-3 yerine
    // justifyContent: "center",
    // alignItems: "center",
    // alignContent: "center",
    marginTop: 24, // mt-6
    gap: 16, // gap-4
    // maxWidth: 300, // max-w-md
  },
  statBox: {
    // flex: 1, // Üç eşit sütun
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16, // p-4
    alignItems: "center", // text-center
  },
  statValue: {
    fontSize: 20, // text-2xl'e yakın
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12, // text-xs
    color: "#6B7280",
  },

  // --- Info Rows Stilleri ---
  infoGrid: {
    marginTop: 32, // mt-8
    // Mobil için tek sütun (grid-cols-1)
    gap: 16, // gap-4
  },
  infoRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
    borderRadius: 8,
    padding: 16, // p-4
  },
  infoRowTitle: {
    fontSize: 12, // text-xs
    color: "#6B7280",
  },
  infoRowValue: {
    fontSize: 14, // text-sm
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 4, // mt-1
  },
  // --- Action Rows Stilleri (Button) ---
  actionRow: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // text-left (TouchableOpacity'de hizalama gerektirmez)
  },
  arrowText: {
    fontSize: 24, // Ok simgesi için
    color: "#9CA3AF", // text-gray-400
  },
});
