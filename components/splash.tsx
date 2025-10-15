import { SplashScreen } from "expo-router";
import { useSession } from "@/provider/AuthProvider";

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
