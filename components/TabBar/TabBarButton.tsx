import { Pressable, StyleSheet, Text, View, PressableProps } from "react-native";
import React, { useEffect } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { TabBarIcons } from "./TabBarIcons";

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  badgeCount?: number;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ isFocused, label, routeName, color, badgeCount = 0, ...pressableProps }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, -1]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const hasBadge = badgeCount > 0;

  return (
    <Pressable {...pressableProps} style={styles.container}>
      {" "}
      {/* ✅ Props'ları spread et */}
      <Animated.View style={[animatedIconStyle]}>
        {(TabBarIcons as any)[routeName]({
          color: color,
          focused: isFocused,
          size: 20,
        })}
      </Animated.View>
      {hasBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeCount > 99 ? "99+" : badgeCount}</Text>
        </View>
      )}
      <Animated.Text style={{ color, fontSize: 10 }}>{label}</Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -8,
    right: 18,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default TabBarButton;
