import { SessionProvider } from "@/provider/AuthProvider";
import { SplashScreenController } from "@/components/splash";
import RootNavigator from "@/components/RootNavigator";
import { StatusBar } from "expo-status-bar";

function Root() {
  return (
    <SessionProvider>
      <StatusBar style="auto" />
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

export default Root;
