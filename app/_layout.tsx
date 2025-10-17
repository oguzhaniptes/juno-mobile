import { SessionProvider } from "@/provider/AuthProvider";
import { SplashScreenController } from "@/components/splash";
import RootNavigator from "@/components/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

function Root() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <StatusBar style="auto" />
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default Root;
