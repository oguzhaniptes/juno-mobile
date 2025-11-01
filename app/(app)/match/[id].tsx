import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, Platform } from "react-native";
import { Colors, createComponentStyles } from "@/styles";

// Types
interface Team {
  name: string;
  shortName: string;
  score: number;
  scorers: string[];
  lastFive: string[];
}

interface MatchData {
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  round: string;
  minute: string;
  status: string;
}

interface Statistic {
  label: string;
  home: number;
  away: number;
}

interface TimelineEvent {
  minute: string;
  type: "goal" | "yellow" | "substitution" | "info";
  team?: "home" | "away";
  player?: string;
  assist?: string;
  playerOut?: string;
  playerIn?: string;
  text?: string;
}

interface Player {
  name: string;
  number: string;
}

interface TeamLineup {
  formation: string;
  goalkeeper: Player;
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
}

// Mock Data
const matchData: MatchData = {
  homeTeam: {
    name: "Manchester City",
    shortName: "M. City",
    score: 2,
    scorers: ["51' Haaland", "23' De Bruyne"],
    lastFive: ["W", "W", "D", "W", "L"],
  },
  awayTeam: {
    name: "Chelsea",
    shortName: "Chelsea",
    score: 2,
    scorers: ["14' Sterling", "72' Mudryk"],
    lastFive: ["W", "L", "W", "W", "D"],
  },
  competition: "English Premier League",
  round: "32 Match",
  minute: "72'",
  status: "Live",
};

const statistics: Statistic[] = [
  { label: "Ball possession", home: 34, away: 66 },
  { label: "Total shots", home: 2, away: 5 },
  { label: "Shots on target", home: 2, away: 4 },
  { label: "Counter Attacks", home: 4, away: 2 },
  { label: "Goal attempts", home: 8, away: 9 },
  { label: "Total crosses", home: 13, away: 10 },
  { label: "Corners", home: 3, away: 7 },
  { label: "Offsides", home: 2, away: 1 },
  { label: "Fouls", home: 8, away: 12 },
];

const timeline: TimelineEvent[] = [
  { minute: "72'", type: "goal", team: "away", player: "Mudryk", assist: "Palmer" },
  { minute: "68'", type: "substitution", team: "home", playerOut: "Grealish", playerIn: "Foden" },
  { minute: "65'", type: "yellow", team: "away", player: "Cucurella" },
  { minute: "51'", type: "goal", team: "home", player: "Haaland", assist: "De Bruyne" },
  { minute: "45'", type: "info", text: "Second Half begins" },
  { minute: "23'", type: "goal", team: "home", player: "De Bruyne" },
  { minute: "14'", type: "goal", team: "away", player: "Sterling", assist: "Enzo" },
  { minute: "8'", type: "yellow", team: "home", player: "Rodri" },
];

const lineups: { home: TeamLineup; away: TeamLineup } = {
  home: {
    formation: "4-3-3",
    goalkeeper: { name: "Ederson", number: "31" },
    defenders: [
      { name: "Walker", number: "2" },
      { name: "Dias", number: "3" },
      { name: "Akanji", number: "25" },
      { name: "Ake", number: "6" },
    ],
    midfielders: [
      { name: "Bernardo", number: "20" },
      { name: "Rodri", number: "16" },
      { name: "De Bruyne", number: "17" },
    ],
    forwards: [
      { name: "Foden", number: "47" },
      { name: "Haaland", number: "9" },
      { name: "Grealish", number: "10" },
    ],
  },
  away: {
    formation: "4-2-3-1",
    goalkeeper: { name: "Sanchez", number: "1" },
    defenders: [
      { name: "James", number: "24" },
      { name: "Silva", number: "6" },
      { name: "Badiashile", number: "4" },
      { name: "Cucurella", number: "3" },
    ],
    midfielders: [
      { name: "Caicedo", number: "25" },
      { name: "Enzo", number: "8" },
      { name: "Palmer", number: "20" },
      { name: "Mudryk", number: "10" },
      { name: "Sterling", number: "7" },
    ],
    forwards: [{ name: "Jackson", number: "15" }],
  },
};

const MatchDetailScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const renderLastFiveMatches = (results: string[]) => {
    return (
      <View style={styles.matchLastFiveContainer}>
        {results.map((result, index) => (
          <View
            key={index}
            style={[
              styles.matchResultBadge,
              {
                backgroundColor: result === "W" ? "rgba(16, 185, 129, 0.2)" : result === "D" ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)",
              },
            ]}
          >
            <Text
              style={[
                styles.matchResultText,
                {
                  color: result === "W" ? "#10B981" : result === "D" ? "#F59E0B" : "#EF4444",
                },
              ]}
            >
              {result}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStatBar = (home: number, away: number) => {
    const total = home + away;
    const homePercent = (home / total) * 100;

    return (
      <View style={styles.matchStatBarContainer}>
        <View style={styles.matchStatBar}>
          <View style={[styles.matchStatBarFill, { width: `${homePercent}%`, backgroundColor: "#3B82F6" }]} />
          <View style={[styles.matchStatBarFill, { width: `${100 - homePercent}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>
    );
  };

  const renderStatistics = () => {
    return (
      <View style={styles.matchTabContent}>
        {statistics.map((stat, index) => (
          <View key={index} style={styles.matchStatRow}>
            <Text style={[styles.matchStatValue, { color: colors.text }]}>{stat.home}</Text>
            <View style={styles.matchStatCenter}>
              <Text style={styles.matchStatLabel}>{stat.label}</Text>
              {renderStatBar(stat.home, stat.away)}
            </View>
            <Text style={[styles.matchStatValue, { color: colors.text }]}>{stat.away}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTimeline = () => {
    return (
      <View style={styles.matchTabContent}>
        {timeline.map((event, index) => (
          <View key={index} style={styles.matchTimelineRow}>
            <View
              style={[
                styles.matchTimelineDot,
                {
                  backgroundColor: event.type === "goal" ? "#10B981" : event.type === "yellow" ? "#F59E0B" : event.type === "substitution" ? colors.primary : colors.textSecondary,
                },
              ]}
            />
            <View style={styles.matchTimelineContent}>
              <Text style={styles.matchTimelineMinute}>{event.minute}</Text>
              {event.type === "info" ? (
                <Text style={[styles.matchTimelineText, { color: colors.textSecondary }]}>{event.text}</Text>
              ) : event.type === "goal" ? (
                <View>
                  <Text style={styles.matchTimelineText}>⚽ {event.player}</Text>
                  {event.assist && <Text style={styles.matchTimelineAssist}>Assist: {event.assist}</Text>}
                </View>
              ) : event.type === "yellow" ? (
                <Text style={styles.matchTimelineText}>🟨 {event.player}</Text>
              ) : event.type === "substitution" ? (
                <Text style={styles.matchTimelineText}>
                  🔄 {event.playerOut} → {event.playerIn}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderLineups = () => {
    return (
      <View style={styles.matchTabContent}>
        <View style={styles.matchFormationContainer}>
          <Text style={styles.matchFormationText}>{lineups.home.formation}</Text>
          <Text style={styles.matchFormationText}>{lineups.away.formation}</Text>
        </View>

        <View style={styles.matchLineupsGrid}>
          {/* Home Team */}
          <View style={styles.matchTeamLineup}>
            {/* Goalkeeper */}
            <View style={styles.matchLineupRow}>
              <View style={styles.matchPlayerItem}>
                <View style={[styles.matchPlayerCircle, { borderColor: "#3B82F6" }]}>
                  <Text style={styles.matchPlayerNumber}>{lineups.home.goalkeeper.number}</Text>
                </View>
                <Text style={styles.matchPlayerName}>{lineups.home.goalkeeper.name}</Text>
              </View>
            </View>

            {/* Defenders */}
            <View style={styles.matchLineupRow}>
              {lineups.home.defenders.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: "#3B82F6" }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>

            {/* Midfielders */}
            <View style={styles.matchLineupRow}>
              {lineups.home.midfielders.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: "#3B82F6" }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>

            {/* Forwards */}
            <View style={styles.matchLineupRow}>
              {lineups.home.forwards.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: "#3B82F6" }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.matchFieldDivider} />

          {/* Away Team */}
          <View style={styles.matchTeamLineup}>
            {/* Forwards */}
            <View style={styles.matchLineupRow}>
              {lineups.away.forwards.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: colors.primary }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>

            {/* Midfielders */}
            <View style={styles.matchLineupRow}>
              {lineups.away.midfielders.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: colors.primary }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>

            {/* Defenders */}
            <View style={styles.matchLineupRow}>
              {lineups.away.defenders.map((player, idx) => (
                <View key={idx} style={styles.matchPlayerItem}>
                  <View style={[styles.matchPlayerCircle, { borderColor: colors.primary }]}>
                    <Text style={styles.matchPlayerNumber}>{player.number}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>{player.name}</Text>
                </View>
              ))}
            </View>

            {/* Goalkeeper */}
            <View style={styles.matchLineupRow}>
              <View style={styles.matchPlayerItem}>
                <View style={[styles.matchPlayerCircle, { borderColor: colors.primary }]}>
                  <Text style={styles.matchPlayerNumber}>{lineups.away.goalkeeper.number}</Text>
                </View>
                <Text style={styles.matchPlayerName}>{lineups.away.goalkeeper.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === "ios" ? 60 : 40 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.matchDetailHeader}>
          <View style={styles.matchDetailHeaderCenter}>
            <Text style={styles.matchDetailCompetitionText}>{matchData.competition}</Text>
            <Text style={styles.matchDetailRoundText}>{matchData.round}</Text>
          </View>
        </View>

        {/* Score Card */}
        <View style={[styles.scoreCard, { marginHorizontal: 20, backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg }]}>
          {matchData.status === "Live" && (
            <View style={[styles.liveIndicator, { alignSelf: "center", marginBottom: 20 }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}

          <View style={styles.matchScoreContainer}>
            {/* Home Team */}
            <View style={styles.matchTeamSection}>
              <View style={[styles.teamLogo, { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ fontSize: 32 }}>🔵</Text>
              </View>
              <Text style={styles.teamName}>{matchData.homeTeam.shortName}</Text>
              {renderLastFiveMatches(matchData.homeTeam.lastFive)}
            </View>

            {/* Score */}
            <View style={styles.matchScoreSection}>
              <View style={styles.matchScoreDisplayRow}>
                <Text style={[styles.matchScoreNumber, { color: colors.text }]}>{matchData.homeTeam.score}</Text>
                <Text style={[styles.matchScoreSeparator, { color: colors.textSecondary }]}>:</Text>
                <Text style={[styles.matchScoreNumber, { color: colors.text }]}>{matchData.awayTeam.score}</Text>
              </View>
              <Text style={[styles.matchTimeText, { marginTop: 4 }]}>{matchData.minute}</Text>
            </View>

            {/* Away Team */}
            <View style={styles.matchTeamSection}>
              <View style={[styles.teamLogo, { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ fontSize: 32 }}>🔷</Text>
              </View>
              <Text style={styles.teamName}>{matchData.awayTeam.shortName}</Text>
              {renderLastFiveMatches(matchData.awayTeam.lastFive)}
            </View>
          </View>

          {/* Scorers */}
          <View style={styles.matchScorersContainer}>
            <View style={styles.matchScorersColumn}>
              {matchData.homeTeam.scorers.map((scorer, idx) => (
                <Text key={idx} style={[styles.leagueText, { color: colors.textSecondary, fontSize: 12 }]}>
                  {scorer}
                </Text>
              ))}
            </View>
            <View style={styles.matchScorersColumn}>
              {matchData.awayTeam.scorers.map((scorer, idx) => (
                <Text key={idx} style={[styles.leagueText, { color: colors.textSecondary, textAlign: "right", fontSize: 12 }]}>
                  {scorer}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.matchTabsContainer}>
          {["Stats", "Timeline", "Lineups"].map((tab, index) => (
            <TouchableOpacity key={index} style={[styles.matchTab, activeTab === index && { backgroundColor: colors.primary }]} onPress={() => setActiveTab(index)}>
              <Text style={[styles.matchTabText, { color: activeTab === index ? "#FFFFFF" : colors.textSecondary }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={[styles.feedItem, { marginHorizontal: 20, marginBottom: 40 }]}>
          {activeTab === 0 && renderStatistics()}
          {activeTab === 1 && renderTimeline()}
          {activeTab === 2 && renderLineups()}
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchDetailScreen;
