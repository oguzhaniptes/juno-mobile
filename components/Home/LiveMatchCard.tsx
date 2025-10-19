import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, Platform } from "react-native";

interface Team {
  name: string;
  logo: string;
}

interface LiveMatchCardProps {
  sport: "football" | "basketball" | "tennis";
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: string;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ homeTeam, awayTeam, homeScore, awayScore, status }) => {
  const TeamLogo = ({ uri, altText }: any) => (
    <View style={styles.imageContainer}>{uri ? <Image source={{ uri: uri }} style={styles.teamLogo} /> : <Text style={styles.logoPlaceholder}>{altText}</Text>}</View>
  );

  return (
    <View style={styles.cardContainer}>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDotContainer}>
          <View style={styles.liveDot} />
        </View>
        <Text style={styles.liveText}>Live</Text>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.teamColumn}>
          <TeamLogo uri={homeTeam.logo} altText={homeTeam.name.slice(0, 1)} />
          <Text style={styles.teamNameText}>{homeTeam.name}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {homeScore} - {awayScore}
          </Text>
        </View>

        <View style={styles.teamColumn}>
          <TeamLogo uri={awayTeam.logo} altText={awayTeam.name.slice(0, 1)} />
          <Text style={styles.teamNameText}>{awayTeam.name}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.4,
    shadowRadius: 3,
    elevation: 3,

    padding: 8,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  liveIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  liveDotContainer: {
    marginRight: 4,
    height: 8,
    width: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  liveDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  liveText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  teamColumn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  teamLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  logoPlaceholder: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  teamNameText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },

  scoreContainer: {
    marginHorizontal: 16, // mx-4
  },
  scoreText: {
    color: "#1F2937",
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },

  statusContainer: {
    marginTop: 16, // mt-4
  },
  statusText: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },
});

export default LiveMatchCard;
