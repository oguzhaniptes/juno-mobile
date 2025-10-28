import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: false, title: "Post" }} />
      <Stack.Screen name="community/[id]" options={{ headerShown: false, title: "Community" }} />
    </Stack>
  );
}
