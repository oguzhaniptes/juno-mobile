import { LayoutProvider } from "@/components/layout";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Colors, createComponentStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
  players: string;
  route: string;
  isComingSoon: boolean;
}

export default function GamesListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;
  const [refreshing, setRefreshing] = useState(false);

  const games: Game[] = [
    {
      id: "1",
      name: "Find NFT",
      description: "Discover hidden NFTs in a grid puzzle. Test your memory and win rewards!",
      icon: "🎯",
      difficulty: "Easy",
      players: "1 Player",
      route: "/find-nft",
      isComingSoon: false,
    },
    {
      id: "2",
      name: "XOX",
      description: "Classic tic-tac-toe game with a crypto twist. Challenge your friends!",
      icon: "❌⭕",
      difficulty: "Medium",
      players: "2 Players",
      route: "/xox",
      isComingSoon: true,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleGamePress = (game: Game) => {
    if (game.isComingSoon) {
      return;
    }
    router.push(game.route as any);
  };

  return (
    <LayoutProvider refreshing={refreshing} onRefresh={onRefresh}>
      <View>
        {/* Header */}
        <View style={styles.gamesHeader}>
          <Text style={styles.gamesTitle}>Games</Text>
        </View>

        {/* Games List */}
        <View style={{ gap: 16 }}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, game.isComingSoon && styles.gameCardDisabled]}
              onPress={() => handleGamePress(game)}
              disabled={game.isComingSoon}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.gameCardHeader}>
                <View style={styles.gameIconContainer}>
                  <Text style={styles.gameIcon}>{game.icon}</Text>
                </View>

                {game.isComingSoon && (
                  <View style={styles.gameComingSoonBadge}>
                    <Text style={styles.gameComingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.gameCardContent}>
                <Text style={styles.gameTitle}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>

                {/* Stats */}
                <View style={styles.gameStatsRow}>
                  <View style={styles.gameStatItem}>
                    <Text style={styles.gameStatIcon}>👥</Text>
                    <Text style={styles.gameStatText}>{game.players}</Text>
                  </View>
                  <View style={styles.gameStatItem}>
                    <Text style={styles.gameStatIcon}>⚡</Text>
                    <Text style={styles.gameStatText}>{game.difficulty}</Text>
                  </View>
                </View>
              </View>

              {/* Footer */}
              {!game.isComingSoon && (
                <View style={styles.gameCardFooter}>
                  <View style={styles.gameDifficultyBadge}>
                    <Text style={styles.gameDifficultyText}>Free to Play</Text>
                  </View>

                  <View style={styles.gamePlayButton}>
                    <Text style={styles.gamePlayButtonText}>Play Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View
          style={[
            styles.feedItem,
            {
              marginTop: 24,
              backgroundColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)",
              borderColor: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)",
            },
          ]}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 24 }}>🎮</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                More Games Coming Soon!
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                We&apos;re working on exciting new games for you. Stay tuned for updates and be the first to play!
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LayoutProvider>
  );
}
