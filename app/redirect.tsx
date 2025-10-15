import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function RedirectPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    WebBrowser.dismissBrowser();

    const handleDeepLink = async (url: string) => {
      if (isProcessing) return;
      setIsProcessing(true);

      setCurrentUrl(url); // URL'yi state'e yaz
      console.log("🔗 Deep Link URL:", url);

      try {
        const { queryParams } = Linking.parse(url);
        console.log("📦 Parsed params:", queryParams);

        const salt = await SecureStore.getItemAsync("salt");
        const userId = await SecureStore.getItemAsync("user_id");

        if (salt && userId) {
          console.log("✅ Parameters already set, redirecting to home");
          router.replace("/");
          return;
        }

        console.log("❌ Required parameters not found");
        router.replace("/welcome");
      } catch (err) {
        console.error("❌ Redirect handling error:", err);
        router.replace("/welcome");
      } finally {
        setIsProcessing(false);
      }
    };

    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleDeepLink(url);
      }
    };

    getInitialUrl();
  }, [router, isProcessing]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          color: "#333333",
          fontWeight: "500",
        }}
      >
        Giriş yapılıyor...
      </Text>
      {currentUrl && (
        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#888",
            textAlign: "center",
            maxWidth: 300,
          }}
        >
          {currentUrl}
        </Text>
      )}
    </View>
  );
}
