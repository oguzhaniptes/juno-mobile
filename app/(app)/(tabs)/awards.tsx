// screens/AwardsScreen.tsx - YENİDEN TASARLANDI
import { LayoutProvider } from "@/components/layout";
import Avatar from "@/components/ui/avatar";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, useColorScheme, ScrollView, Image } from "react-native";
import { Colors, createComponentStyles } from "@/styles";
import { LinearGradient } from "expo-linear-gradient";
import Background from "@/components/background";

type Leader = {
  id: number;
  name: string;
  avatar: string;
  earningsUsd: number;
  points: number;
};

const MOCK_DATA = {
  currentLeaders: [
    { id: 1, name: "Aylin Demir", avatar: "https://via.placeholder.com/100", earningsUsd: 1520, points: 980 },
    { id: 2, name: "Mert Yılmaz", avatar: "https://via.placeholder.com/100", earningsUsd: 1310, points: 920 },
    { id: 3, name: "Zeynep Kaya", avatar: "https://via.placeholder.com/100", earningsUsd: 1090, points: 870 },
    { id: 4, name: "Ahmet Çetin", avatar: "https://via.placeholder.com/100", earningsUsd: 880, points: 820 },
    { id: 5, name: "Ece Koç", avatar: "https://via.placeholder.com/100", earningsUsd: 770, points: 790 },
    { id: 6, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 7, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 8, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 9, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 10, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 11, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
    { id: 12, name: "Onur Can", avatar: "https://via.placeholder.com/100", earningsUsd: 640, points: 760 },
  ],
  lastWeekLeaders: [
    { id: 1, name: "Aylin Demir", avatar: "https://via.placeholder.com/100", earningsUsd: 1380, points: 930 },
    { id: 2, name: "Zeynep Kaya", avatar: "https://via.placeholder.com/100", earningsUsd: 1210, points: 900 },
    { id: 3, name: "Mert Yılmaz", avatar: "https://via.placeholder.com/100", earningsUsd: 1170, points: 880 },
  ],
};

const TierComponent = ({ leader, tierStyles, colors, isDark }: any) => {
  const { avatar, name, earningsUsd, points } = leader;
  const { badge, gradientColors, height, avatarSize } = tierStyles;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Image
          source={{ uri: avatar }}
          style={{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: 4,
            borderColor: gradientColors[0],
          }}
        />
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          ${earningsUsd} • {points} pts
        </Text>
      </View>

      <LinearGradient
        colors={gradientColors}
        style={{
          width: "100%",
          height: height,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

export default function AwardsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const [tab, setTab] = useState<"current" | "lastWeek">("current");
  const leaders = tab === "current" ? MOCK_DATA.currentLeaders : MOCK_DATA.lastWeekLeaders;
  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const tierStyles = [
    {
      badge: "Gold",
      gradientColors: ["#FBBF24", "#F59E0B"],
      height: 140,
      avatarSize: 80,
    },
    {
      badge: "Silver",
      gradientColors: ["#E5E7EB", "#9CA3AF"],
      height: 110,
      avatarSize: 70,
    },
    {
      badge: "Bronze",
      gradientColors: ["#FDBA74", "#F97316"],
      height: 90,
      avatarSize: 60,
    },
  ];

  return (
    <LayoutProvider>
      {/* Header with Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: colors.text,
          }}
        >
          Awards
        </Text>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
            borderRadius: 12,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setTab("current")}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: tab === "current" ? colors.primary : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: tab === "current" ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              Current
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("lastWeek")}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: tab === "lastWeek" ? colors.primary : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: tab === "lastWeek" ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              Last Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Podium (Top 3) */}
      <View
        style={[
          styles.podiumCard,
          {
            backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
            marginBottom: 24,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "flex-end",
            gap: 12,
            paddingTop: 20,
          }}
        >
          {/* Silver (2nd) */}
          <TierComponent leader={top3[1]} tierStyles={tierStyles[1]} colors={colors} isDark={isDark} />

          {/* Gold (1st) */}
          <TierComponent leader={top3[0]} tierStyles={tierStyles[0]} colors={colors} isDark={isDark} />

          {/* Bronze (3rd) */}
          <TierComponent leader={top3[2]} tierStyles={tierStyles[2]} colors={colors} isDark={isDark} />
        </View>
      </View>

      {/* Ranks 4+ */}
      {rest.length > 0 && (
        <View
          style={[
            styles.ranksCard,
            {
              backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
            },
          ]}
        >
          {rest.map((user, idx) => (
            <View
              key={user.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: idx < rest.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <Text
                style={{
                  width: 40,
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textSecondary,
                }}
              >
                {idx + 4}
              </Text>

              <Image
                source={{ uri: user.avatar }}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              />

              <View
                style={{
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {user.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  ${user.earningsUsd} • {user.points} pts
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </LayoutProvider>
  );
}
