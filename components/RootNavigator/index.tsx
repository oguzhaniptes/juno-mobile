import { useSession } from "@/provider/AuthProvider";
import { Stack } from "expo-router";
import Loading from "@/components/loading";

function RootNavigator() {
  const { authData, isLoading, isEpheremalLoading } = useSession();

  if (isLoading || isEpheremalLoading) {
    return <Loading />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!authData}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!authData}>
        <Stack.Screen options={{ headerShown: false }} name="welcome" />
        <Stack.Screen options={{ headerShown: false }} name="sign-in" />
        <Stack.Screen options={{ headerShown: false }} name="redirect" />
      </Stack.Protected>
    </Stack>
  );
}

export default RootNavigator;
