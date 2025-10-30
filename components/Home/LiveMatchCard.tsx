import React from "react";
import { View, Text, Image, TouchableOpacity, useColorScheme } from "react-native";
import { createComponentStyles } from "@/styles/componentStyles";
import { router } from "expo-router";

interface Team {
  name: string;
  logo: string;
}

interface LiveMatchCardProps {
  id: number;
  sport: "football" | "basketball" | "tennis";
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: string;
  league?: string;
  onPress?: () => void;
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ id, homeTeam, awayTeam, homeScore, awayScore, status, league = "EPL", onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);

  return (
    <TouchableOpacity style={styles.matchCard} onPress={() => router.push(`/match/${id}`)} activeOpacity={0.95}>
      <View style={styles.matchHeader}>
        <View style={styles.leagueBadge}>
          <Text style={styles.leagueText}>{league}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.matchContent}>
        <View style={styles.teamContainer}>
          <Image source={{ uri: homeTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName} numberOfLines={1}>
            {homeTeam.name}
          </Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.scoreDisplay}>
            {homeScore} - {awayScore}
          </Text>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.teamContainer}>
          <Image source={{ uri: awayTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName} numberOfLines={1}>
            {awayTeam.name}
          </Text>
        </View>
      </View>

      <View style={styles.matchTime}>
        <Text style={styles.matchTimeText}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LiveMatchCard;
