import {useState, useEffect, useRef} from "react"
import { StyleSheet, Button, Platform } from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useSession } from "@/provider/AuthProvider";
import { tokenCache } from "@/utils/cache";
import * as jose from "jose";

interface UserPageProps {
  propName: string;
}

export default function UserPage({ propName }: UserPageProps) {
  const router = useRouter();
  const { signOut } = useSession();
    const [accessTokenExpiration, setAccessTokenExpiration] = useState<
      string | null
    >(null);
    const [refreshTokenExpiration, setRefreshTokenExpiration] = useState<
      string | null
    >(null);
  const isWeb = Platform.OS === "web";
  const accessTokenExpiryRef = useRef<number | null>(null);
    const refreshTokenExpiryRef = useRef<number | null>(null);


const formatExpirationTime = (timestamp: number) => {
    if (!timestamp) return null;

    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = timestamp - now;

    if (secondsRemaining <= 0) {
      return "expired";
    }

    // Convert to appropriate units
    if (secondsRemaining < 60) {
      return `expires in ${secondsRemaining}s`;
    } else if (secondsRemaining < 3600) {
      const minutes = Math.floor(secondsRemaining / 60);
      return `expires in ${minutes}min`;
    } else if (secondsRemaining < 86400) {
      const hours = Math.floor(secondsRemaining / 3600);
      return `expires in ${hours}h`;
    } else {
      const days = Math.floor(secondsRemaining / 86400);
      return `expires in ${days} day${days > 1 ? "s" : ""}`;
    }
  };


useEffect(() => {
    const fetchTokenExpirations = async () => {
        // Get access token expiration
        const storedAccessToken = await tokenCache?.getToken("accessToken");
        console.log(storedAccessToken)
        if (storedAccessToken) {
          try {
            const decoded = jose.decodeJwt(storedAccessToken);
            const expTime = (decoded as any).exp || 0;
            accessTokenExpiryRef.current = expTime;
            setAccessTokenExpiration(formatExpirationTime(expTime));
          } catch (e) {
            console.error("Error decoding access token:", e);
          }
        }

        // Get refresh token expiration
        const storedRefreshToken = await tokenCache?.getToken("refreshToken");
        if (storedRefreshToken) {
          try {
            const decoded = jose.decodeJwt(storedRefreshToken);
            const expTime = (decoded as any).exp || 0;
            refreshTokenExpiryRef.current = expTime;
            setRefreshTokenExpiration(formatExpirationTime(expTime));
          } catch (e) {
            console.error("Error decoding refresh token:", e);
          }
      }
    };

    // Fetch token expirations once when component mounts
    fetchTokenExpirations();
  }, [isWeb]);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Users
        </ThemedText>
        <ThemedText>{accessTokenExpiration}</ThemedText>
        <ThemedText>{refreshTokenExpiration}</ThemedText>

        <ThemedText onPress={() => router.push("/product/1")}>
          User 1
        </ThemedText>
        <ThemedText
          onPress={() => {
            console.log("Routing...");
            router.push("/product/2");
          }}
        >
          User 2
        </ThemedText>


         <Button title="Sign Out" onPress={signOut} color={"red"} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
  },
});
