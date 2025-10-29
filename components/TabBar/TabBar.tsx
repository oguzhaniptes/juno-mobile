import { View, useColorScheme, Platform } from "react-native";
import TabBarButton from "./TabBarButton";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Colors } from "@/styles";

const TabBar = ({ state, descriptors, navigation }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        height: 60,
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
          ios: {
            shadowColor: isDark ? colors.primary : "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.6 : 0.2,
            shadowRadius: 24,
          },
          android: {
            elevation: 16,
          },
        }),
      }}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["rgba(30, 20, 50, 0.95)", "rgba(30, 20, 50, 0.98)"] : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.98)"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Blur Effect (iOS only) */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={80}
          tint={isDark ? "dark" : "light"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Tab Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: "100%",
          paddingHorizontal: 8,
        }}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const isFocused = state.index === index;
          const badgeCount = options.tabBarBadge ?? 0;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? colors.primary : colors.textSecondary}
              label={label}
              badgeCount={badgeCount}
            />
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
