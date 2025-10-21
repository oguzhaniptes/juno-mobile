import { use, createContext, type PropsWithChildren, useState, useEffect } from "react";
import { useStorageState } from "@/hooks/use-storage-state";
import { useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { AuthData, AuthProvider, AuthProviderProps } from "@/types";
import { AUTH_DISCOVERY, AUTH_PROVIDERS_CONFIG, BASE_URL } from "@/constants";
import { useSessionStorageState } from "@/hooks/use-session-storage-state";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthProviderProps>({
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithMicrosoft: async () => {},
  signOut: async () => {},
  authData: null,
  ephemeralData: null,
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
  // Auth Data stored in SecureStore
  const [[isLoadingUserId, userId], setUserId] = useStorageState("user_id");
  const [[isLoadingSalt, salt], setSalt] = useStorageState("salt");
  const [[isLoadingProvider, provider], setProvider] = useStorageState("provider");
  const [[isLoadingName, name], setName] = useStorageState("name");
  const [[isLoadingMail, mail], setMail] = useStorageState("mail");
  const [[isLoadingPhotoUrl, photoUrl], setPhotoUrl] = useStorageState("photo_url");
  const [[isLoadingMaxEpoch, maxEpoch], setMaxEpoch] = useStorageState("max_epoch");

  // Ephemeral Data stored in SessionStorage (per Sui SDK pattern)
  const [[isLoadingIdToken, idToken], setIdToken] = useSessionStorageState("id_token");
  const [[isLoadingRandomness, jwtRandomness], setJwtRandomness] = useSessionStorageState("jwt_randomness");
  const [[isLoadingNonce, nonce], setNonce] = useSessionStorageState("nonce");
  const [[isLoadingPubKey, extendedEphemeralPublicKey], setExtendedEphemeralPublicKey] = useSessionStorageState("extended_ephemeral_public_key");
  const [[isLoadingPrivKey, extendedEphemeralPrivateKey], setExtendedEphemeralPrivateKey] = useSessionStorageState("extended_ephemeral_private_key");

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // ✅ Google Auth Hook
  const [, googleResponse, promptGoogleAsync] = useAuthRequest(AUTH_PROVIDERS_CONFIG[AuthProvider.GOOGLE], AUTH_DISCOVERY);

  // ✅ Microsoft Auth Hook
  const [, microsoftResponse, promptMicrosoftAsync] = useAuthRequest(AUTH_PROVIDERS_CONFIG[AuthProvider.MICROSOFT], AUTH_DISCOVERY);

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
  const handleAuthResponse = async (response: typeof googleResponse, provider: AuthProvider) => {
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

        if (data.salt && data.user_id && data.id_token) {
          console.log(`${provider} user authenticated:`, data);
          setUserId(data.user_id);
          setSalt(data.salt);
          setProvider(provider);
          setMaxEpoch(data.zk_payload.max_epoch.toString());

          setIdToken(data.id_token);
          setJwtRandomness(data.zk_payload.jwt_randomness);
          setNonce(data.zk_payload.nonce);
          setExtendedEphemeralPublicKey(data.zk_payload.extended_ephemeral_public_key);
          setExtendedEphemeralPrivateKey(data.zk_payload.extended_ephemeral_private_key);

          if (data.name) setName(data.name);
          if (data.mail) setMail(data.mail);
          if (data.photo_url) setPhotoUrl(data.photo_url);

          console.log(`${provider} auth successful!`);
        } else {
          console.error(`${provider} auth failed: Missing user_id, id_token or salt`);
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

  const isLoading =
    isLoadingUserId ||
    isLoadingSalt ||
    isAuthLoading ||
    isLoadingProvider ||
    isLoadingName ||
    isLoadingMail ||
    isLoadingPhotoUrl ||
    isLoadingMaxEpoch ||
    isLoadingRandomness ||
    isLoadingNonce ||
    isLoadingPubKey ||
    isLoadingPrivKey ||
    isLoadingIdToken;

  const authData: AuthData | null =
    userId && salt && maxEpoch && provider && idToken
      ? { user_id: userId, salt, provider, id_token: idToken, max_epoch: Number(maxEpoch), mail: mail ?? null, name: name ?? null, photo_url: photoUrl ?? null }
      : null;

  const ephemeralData =
    jwtRandomness && nonce && extendedEphemeralPublicKey && extendedEphemeralPrivateKey
      ? {
          jwt_randomness: jwtRandomness,
          nonce,
          extended_ephemeral_public_key: extendedEphemeralPublicKey,
          extended_ephemeral_private_key: extendedEphemeralPrivateKey,
        }
      : null;

  // ✅ Generic Sign In
  const signIn = async (provider: AuthProvider) => {
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

      await SecureStore.deleteItemAsync("provider");
      await SecureStore.deleteItemAsync("name");
      await SecureStore.deleteItemAsync("mail");
      await SecureStore.deleteItemAsync("photo_url");
      await SecureStore.deleteItemAsync("max_epoch");

      setUserId(null);
      setSalt(null);
      setProvider(null);
      setName(null);
      setMail(null);
      setPhotoUrl(null);
      setMaxEpoch(null);

      setJwtRandomness(null);
      setNonce(null);
      setExtendedEphemeralPublicKey(null);
      setExtendedEphemeralPrivateKey(null);

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
        ephemeralData,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
