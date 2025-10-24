import { use, createContext, type PropsWithChildren, useState, useEffect, useCallback, useMemo } from "react";
import { useStorageState } from "@/hooks/use-storage-state";
import { AuthSessionResult, AuthRequest, AuthRequestConfig } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { AuthData, AuthProvider, AuthProviderProps } from "@/types";
import { AUTH_DISCOVERY, AUTH_PROVIDERS_CONFIG, BASE_URL } from "@/constants";
import { useSessionStorageState } from "@/hooks/use-session-storage-state";
import { EphemeralData, ZkLoginCheckResult } from "@/types/auth";
import { useSui } from "@/hooks/use-sui";
import { fetchZkProvider } from "@/utils/zk";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

class ZkLoginAuthRequest extends AuthRequest {
  private getNonce: () => string | null;

  constructor(config: AuthRequestConfig, getNonce: () => string | null) {
    super(config);
    this.getNonce = getNonce;
  }

  // Override to inject nonce dynamically when auth URL is created
  async getAuthRequestConfigAsync(): Promise<AuthRequestConfig> {
    const config = await super.getAuthRequestConfigAsync();
    const nonce = this.getNonce();

    let platform: string;
    if (Platform.OS === "web") {
      platform = "web";
    } else if (Platform.OS === "android" || Platform.OS === "macos") {
      platform = "mobile";
    } else {
      platform = "undefined";
    }

    if (nonce) {
      return {
        ...config,
        extraParams: {
          ...config.extraParams,
          nonce,
          platform,
        },
      };
    }

    return config;
  }
}

const AuthContext = createContext<AuthProviderProps>({
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithMicrosoft: async () => {},
  signOut: async () => {},
  authData: null,
  ephemeralData: null,
  isLoading: false,
  isEpheremalLoading: false,
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
  const { suiClient } = useSui();

  // ZkLogin Salt & Max Epoch Data stored in SecureStore
  const [[isLoadingSalt, salt], setSalt] = useStorageState("salt");
  const [[isLoadingMaxEpoch, maxEpoch], setMaxEpoch] = useStorageState("maxEpoch");

  // ZKLogin randomness and Ephemeral Keys stored in SessionSecureStorage
  const [[isLoadingRandomness, randomness], setRandomness] = useSessionStorageState("randomness");
  const [[isLoadingPubKey, ephemeralPublicKey], setEphemeralPublicKey] = useSessionStorageState("ephemeralPublicKey");
  const [[isLoadingPrivKey, ephemeralPrivateKey], setEphemeralPrivateKey] = useSessionStorageState("ephemeralPrivateKey");
  const [[isLoadingNonce, nonce], setNonce] = useSessionStorageState("nonce");

  // Additional User Info
  const [[isLoadingUserId, userId], setUserId] = useStorageState("userId");
  const [[isLoadingIdToken, idToken], setIdToken] = useStorageState("idToken");
  const [[isLoadingName, name], setName] = useStorageState("name");
  const [[isLoadingMail, mail], setMail] = useStorageState("mail");
  const [[isLoadingPhotoUrl, photoUrl], setPhotoUrl] = useStorageState("photoUrl");
  const [[isLoadingProvider, provider], setProvider] = useStorageState("provider");

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const googleRequest = useMemo(() => {
    return new ZkLoginAuthRequest(AUTH_PROVIDERS_CONFIG[AuthProvider.GOOGLE], () => nonce);
  }, [nonce]);

  // ✅ Microsoft Auth Request with Custom Class
  const microsoftRequest = useMemo(() => {
    return new ZkLoginAuthRequest(AUTH_PROVIDERS_CONFIG[AuthProvider.MICROSOFT], () => nonce);
  }, [nonce]);

  const [googleResponse, setGoogleResponse] = useState<AuthSessionResult | null>(null);
  const [microsoftResponse, setMicrosoftResponse] = useState<AuthSessionResult | null>(null);

  const isLoading =
    isLoadingUserId || isLoadingSalt || isAuthLoading || isLoadingProvider || isLoadingName || isLoadingMail || isLoadingPhotoUrl || isLoadingMaxEpoch || isLoadingIdToken;

  const isEpheremalLoading = isLoadingRandomness || isLoadingPubKey || isLoadingPrivKey || isLoadingNonce;

  // Generic Auth Response Handler
  const handleAuthResponse = useCallback(
    async (response: AuthSessionResult | null, provider: AuthProvider) => {
      if (response?.type === "success") {
        setIsAuthLoading(true);
        try {
          console.log(response.params);
          const { code } = response.params;

          console.log(`Authenticating with ${provider}`);

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
            setIdToken(data.id_token);

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
    },
    [setIdToken, setMail, setName, setPhotoUrl, setProvider, setSalt, setUserId]
  );

  const checkAndRefreshZkLogin = useCallback(async (): Promise<ZkLoginCheckResult> => {
    try {
      const { epoch } = await suiClient.getLatestSuiSystemState();
      const currentEpoch = Number(epoch);

      const isSessionValid = ephemeralPrivateKey && ephemeralPublicKey && randomness && nonce && maxEpoch && Number(maxEpoch) >= currentEpoch;

      if (isSessionValid) {
        console.log(`🔐 Max epoch ${maxEpoch} is still valid (current: ${currentEpoch}). ZKLogin not restarting.`);
        return { success: true, newNonce: null };
      }

      console.log("🔐 ZKLogin data missing or invalid, fetching new ZKLogin data.");
      const zkData = await fetchZkProvider(currentEpoch);
      console.log("zkdata: ", zkData);

      if (zkData) {
        const { nonce, maxEpoch, randomness, ephemeralPrivateKey, ephemeralPublicKey } = zkData;

        setRandomness(randomness);
        setEphemeralPublicKey(ephemeralPublicKey);
        setEphemeralPrivateKey(ephemeralPrivateKey);
        setMaxEpoch(maxEpoch.toString());

        setNonce(nonce);

        console.log("✅ ZKLogin data successfully configured and nonce set.");
        return { success: true, newNonce: nonce };
      } else {
        console.error("❌ Failed to fetch ZKLogin data.");
        return { success: false, newNonce: null };
      }
    } catch (error) {
      console.error("❌ Error during ZKLogin check/refresh:", error);
      return { success: false, newNonce: null };
    }
  }, [suiClient, ephemeralPrivateKey, ephemeralPublicKey, randomness, nonce, maxEpoch, setRandomness, setEphemeralPublicKey, setEphemeralPrivateKey, setMaxEpoch, setNonce]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const init = async () => {
      await checkAndRefreshZkLogin();
    };

    init();
  }, [isLoading, checkAndRefreshZkLogin]);

  // Auth Response Handlers
  useEffect(() => {
    handleAuthResponse(googleResponse, AuthProvider.GOOGLE);
  }, [handleAuthResponse, googleResponse]);

  useEffect(() => {
    handleAuthResponse(microsoftResponse, AuthProvider.MICROSOFT);
  }, [handleAuthResponse, microsoftResponse]);

  const authData: AuthData | null = userId && salt && provider && idToken ? { userId, salt, provider, idToken, mail, name, photoUrl } : null;

  const ephemeralData: EphemeralData | null =
    randomness && ephemeralPublicKey && ephemeralPrivateKey
      ? {
          randomness,
          ephemeralPublicKey,
          ephemeralPrivateKey,
        }
      : null;

  // ✅ Generic Sign In
  const signIn = async (providerType: AuthProvider) => {
    if (!nonce) {
      console.warn("⚠️ Nonce is missing. Attempting to regenerate ZKLogin data before proceeding.");

      const { success, newNonce } = await checkAndRefreshZkLogin();

      if (!success || !newNonce) {
        console.error("❌ Cannot sign in: Failed to obtain required ZKLogin nonce.");
        return;
      }

      console.log(`✅ Nonce successfully regenerated. Proceeding with sign in.`);
    }

    console.log(`Starting sign in with nonce: ${nonce}...`);

    // Prompt the appropriate provider
    switch (providerType) {
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
      const result = await googleRequest.promptAsync(AUTH_DISCOVERY);
      setGoogleResponse(result);
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  // ✅ Microsoft Sign In
  const signInWithMicrosoft = async () => {
    try {
      console.log("Initiating Microsoft sign in...");
      const result = await microsoftRequest.promptAsync(AUTH_DISCOVERY);
      setMicrosoftResponse(result);
    } catch (error) {
      console.error("Microsoft sign in error:", error);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setSalt(null);
      setMaxEpoch(null);

      setUserId(null);
      setIdToken(null);
      setProvider(null);
      setName(null);
      setMail(null);
      setPhotoUrl(null);

      setRandomness(null);
      setEphemeralPublicKey(null);
      setEphemeralPrivateKey(null);

      setNonce(null);
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
        isEpheremalLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
