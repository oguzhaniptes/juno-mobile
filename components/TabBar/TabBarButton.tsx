import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
  community: (props: any) => <AntDesign name="usergroup-add" size={20} {...props} />,
  awards: (props: any) => <AntDesign name="trophy" size={20} {...props} />,
  profile: (props: any) => <AntDesign name="user" size={20} {...props} />,
  index: (props: any) => <AntDesign name="home" size={20} {...props} />,
};

const TabBarButton = (props: any) => {
  const { isFocused, label, routeName, color } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, -1]);

    return {
      // styles
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  //   const animatedTextStyle = useAnimatedStyle(() => {
  //     const opacity = interpolate(scale.value, [0, 1], [1, 0]);

  //     return {
  //       // styles
  //       opacity,
  //     };
  //   });

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {(icons as any)[routeName]({
          color,
        })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: 10,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // gap: 4,
  },
});

export default TabBarButton;
