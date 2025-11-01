import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useColorScheme, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { Colors, createComponentStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import Background from "@/components/background";

interface Cell {
  id: number;
  isNFT: boolean;
  isRevealed: boolean;
}

export default function FindNFTGameScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const GRID_SIZE = 16; // 4x4 grid
  const NFT_COUNT = 3; // 3 NFTs to find
  const MAX_ATTEMPTS = 10;

  const [cells, setCells] = useState<Cell[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [foundNFTs, setFoundNFTs] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newCells: Cell[] = Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      isNFT: false,
      isRevealed: false,
    }));

    // Randomly place NFTs
    const nftPositions = new Set<number>();
    while (nftPositions.size < NFT_COUNT) {
      nftPositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    nftPositions.forEach((pos) => {
      newCells[pos].isNFT = true;
    });

    setCells(newCells);
    setAttempts(0);
    setFoundNFTs(0);
    setGameStatus("playing");
    setScore(0);
  };

  const handleCellPress = (cellId: number) => {
    if (gameStatus !== "playing") return;

    const cell = cells[cellId];
    if (cell.isRevealed) return;

    const newCells = [...cells];
    newCells[cellId].isRevealed = true;
    setCells(newCells);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (cell.isNFT) {
      const newFoundNFTs = foundNFTs + 1;
      setFoundNFTs(newFoundNFTs);

      // Calculate score: more points for finding faster
      const pointsEarned = Math.max(100 - newAttempts * 5, 50);
      setScore(score + pointsEarned);

      if (newFoundNFTs === NFT_COUNT) {
        setGameStatus("won");
        const bonusPoints = (MAX_ATTEMPTS - newAttempts) * 10;
        setScore(score + pointsEarned + bonusPoints);
        setTimeout(() => {
          Alert.alert("🎉 Congratulations!", `You found all NFTs!\nScore: ${score + pointsEarned + bonusPoints}\nAttempts: ${newAttempts}/${MAX_ATTEMPTS}`, [
            { text: "Play Again", onPress: initializeGame },
          ]);
        }, 500);
      }
    } else if (newAttempts >= MAX_ATTEMPTS) {
      setGameStatus("lost");
      // Reveal all NFTs
      const revealedCells = newCells.map((c) => ({ ...c, isRevealed: true }));
      setCells(revealedCells);
      setTimeout(() => {
        Alert.alert("😔 Game Over", `You've run out of attempts!\nFound: ${foundNFTs}/${NFT_COUNT}`, [{ text: "Try Again", onPress: initializeGame }]);
      }, 500);
    }
  };

  const getProgressColor = () => {
    const percentage = (attempts / MAX_ATTEMPTS) * 100;
    if (percentage < 50) return colors.success;
    if (percentage < 80) return colors.warning;
    return colors.danger;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Background isDark={isDark} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 0 : 20 }}>
          {/* Header */}
          <View style={styles.matchDetailHeader}>
            <TouchableOpacity style={styles.matchDetailHeaderButton} onPress={() => router.back()}>
              <Text style={styles.matchDetailHeaderIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.matchDetailHeaderCenter}>
              <Text style={styles.matchDetailCompetitionText}>Find NFT</Text>
              <Text style={styles.matchDetailRoundText}>Memory Challenge</Text>
            </View>
            <TouchableOpacity style={styles.matchDetailHeaderButton} onPress={initializeGame}>
              <Ionicons name="refresh" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={[styles.scoreCard, { marginBottom: 20 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={[styles.scoreValue, { fontSize: 32, lineHeight: 40 }]}>{score}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.scoreLabel}>Found NFTs</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {Array.from({ length: NFT_COUNT }).map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: i < foundNFTs ? colors.primary : colors.surface,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{i < foundNFTs ? "🎯" : "❓"}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Attempts Bar */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={styles.scoreLabel}>Attempts</Text>
                <Text style={[styles.scoreLabel, { fontWeight: "700" }]}>
                  {attempts} / {MAX_ATTEMPTS}
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${(attempts / MAX_ATTEMPTS) * 100}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </View>
            </View>
          </View>

          {/* Game Grid */}
          <View
            style={{
              aspectRatio: 1,
              padding: 4,
              gap: 8,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {cells.map((cell) => (
              <TouchableOpacity
                key={cell.id}
                style={{
                  width: "23%",
                  aspectRatio: 1,
                  backgroundColor: cell.isRevealed ? (cell.isNFT ? colors.primary : colors.surface) : Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: cell.isRevealed ? (cell.isNFT ? colors.primary : colors.border) : colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  ...Platform.select({
                    ios: {
                      shadowColor: cell.isNFT && cell.isRevealed ? colors.primary : "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    },
                    android: {
                      elevation: cell.isNFT && cell.isRevealed ? 8 : 2,
                    },
                  }),
                }}
                onPress={() => handleCellPress(cell.id)}
                disabled={cell.isRevealed || gameStatus !== "playing"}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 32 }}>{cell.isRevealed ? (cell.isNFT ? "🎯" : "❌") : "❓"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* How to Play */}
          <View
            style={[
              styles.feedItem,
              {
                marginTop: 20,
                backgroundColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)",
                borderColor: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)",
              },
            ]}
          >
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: colors.text,
                }}
              >
                🎮 How to Play
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                • Find {NFT_COUNT} hidden NFTs in the grid{"\n"}• You have {MAX_ATTEMPTS} attempts to find them all{"\n"}• Each correct find gives you points{"\n"}• Faster finds =
                Higher scores!
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
