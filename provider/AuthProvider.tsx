import {
  use,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import { useStorageState } from "@/hooks/use-storage-state";
import { useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { AuthData, AuthProvider, AuthProviderProps } from "@/types";
import { AUTH_DISCOVERY, AUTH_PROVIDERS_CONFIG, BASE_URL } from "@/constants";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthProviderProps>({
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithMicrosoft: async () => {},
  signOut: async () => {},
  authData: null,
  isLoading: false,
});

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingUserId, userId], setUserId] = useStorageState("user_id");
  const [[isLoadingSalt, salt], setSalt] = useStorageState("salt");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // ✅ Google Auth Hook
  const [, googleResponse, promptGoogleAsync] = useAuthRequest(
    AUTH_PROVIDERS_CONFIG[AuthProvider.GOOGLE],
    AUTH_DISCOVERY,
  );

  // ✅ Microsoft Auth Hook
  const [, microsoftResponse, promptMicrosoftAsync] = useAuthRequest(
    AUTH_PROVIDERS_CONFIG[AuthProvider.MICROSOFT],
    AUTH_DISCOVERY,
  );

  // ✅ Handle Google Response
  useEffect(() => {
    handleAuthResponse(googleResponse, AuthProvider.GOOGLE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse]);

  // ✅ Handle Microsoft Response
  useEffect(() => {
    handleAuthResponse(microsoftResponse, AuthProvider.MICROSOFT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microsoftResponse]);

  // Generic Auth Response Handler
  const handleAuthResponse = async (
    response: typeof googleResponse,
    provider: AuthProvider,
  ) => {
    if (response?.type === "success") {
      setIsAuthLoading(true);
      try {
        const { code } = response.params;
        console.log(`Authenticating with ${provider}...`);

        const resp = await fetch(`${BASE_URL}/api/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider,
            code,
            redirect_uri: `${BASE_URL}/api/auth/callback`,
            scope: "openid email profile",
          }),
        });

        const data = await resp.json();
        console.log(`${provider} token response:`, data);

        if (data.salt && data.user_id) {
          setUserId(data.user_id);
          setSalt(data.salt);
          console.log(`${provider} auth successful!`);
        } else {
          console.error(`${provider} auth failed: Missing user_id or salt`);
        }
      } catch (err) {
        console.error(`${provider} sign-in error:`, err);
      } finally {
        setIsAuthLoading(false);
      }
    } else if (response?.type === "error") {
      console.error(`${provider} auth error:`, response.error);
      setIsAuthLoading(false);
    } else if (response?.type === "cancel") {
      console.log(`${provider} auth cancelled by user`);
      setIsAuthLoading(false);
    }
  };

  const isLoading = isLoadingUserId || isLoadingSalt || isAuthLoading;

  const authData: AuthData | null =
    userId && salt ? { user_id: userId, salt: salt } : null;

  // ✅ Generic Sign In
  const signIn = async (provider?: AuthProvider) => {
    const selectedProvider = provider || AuthProvider.GOOGLE;

    switch (selectedProvider) {
      case AuthProvider.GOOGLE:
        return signInWithGoogle();
      case AuthProvider.MICROSOFT:
        return signInWithMicrosoft();
      default:
        return signInWithGoogle();
    }
  };

  // ✅ Google Sign In
  const signInWithGoogle = async () => {
    try {
      console.log("Initiating Google sign in...");
      await promptGoogleAsync();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  // ✅ Microsoft Sign In
  const signInWithMicrosoft = async () => {
    try {
      console.log("Initiating Microsoft sign in...");
      await promptMicrosoftAsync();
    } catch (error) {
      console.error("Microsoft sign in error:", error);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("user_id");
      await SecureStore.deleteItemAsync("salt");

      setUserId(null);
      setSalt(null);

      console.log("Sign out successful");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext
      value={{
        signIn,
        signInWithGoogle,
        signInWithMicrosoft,
        signOut,
        authData,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
