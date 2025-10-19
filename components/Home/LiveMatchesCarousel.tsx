import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import LiveMatchCard from "./LiveMatchCard";
import { Match } from "@/mock";
import { Feather } from "@expo/vector-icons";
const HORIZONTAL_GAP = 16;

const MoreMatchesCard = ({ navigation }: { navigation: any }) => (
  <View style={styles.moreMatchesCardContainer}>
    <TouchableOpacity style={styles.moreMatchesLink} onPress={() => navigation.push("matches")}>
      <Feather name="arrow-right-circle" style={styles.moreMatchesIcon} />
      <Text style={styles.moreMatchesText}>More Matches</Text>
    </TouchableOpacity>
  </View>
);

const LiveMatchesCarousel = ({ liveMatches, navigation }: any) => {
  const renderItem = ({ item }: { item: Match }) => (
    <View style={styles.cardWrapper}>
      <LiveMatchCard {...item} />
    </View>
  );

  return (
    <FlatList
      data={liveMatches}
      renderItem={renderItem}
      keyExtractor={(item: Match, index) => index.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
      ListFooterComponent={<MoreMatchesCard navigation={navigation} />}
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: 2,
    marginLeft: 4,

    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    marginRight: HORIZONTAL_GAP,
    backgroundColor: "transparent",
    overflow: "visible",
  },

  moreMatchesCardContainer: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    marginRight: HORIZONTAL_GAP,
  },
  moreMatchesLink: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreMatchesIcon: {
    fontSize: 40,
    color: "#3b82f6",
  },
  moreMatchesText: {
    fontSize: 12,
    marginTop: 4,
    color: "#3b82f6",
    textAlign: "center",
  },

  carouselListStyle: {
    minHeight: 180,
  },
});

export default LiveMatchesCarousel;
