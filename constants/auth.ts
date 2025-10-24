import { makeRedirectUri } from "expo-auth-session";
import { AuthProvider } from "@/types";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Redirect URI
export const AUTH_REDIRECT_URI = makeRedirectUri({
  scheme: "juno",
  path: "redirect",
});

// Discovery endpoints
export const AUTH_DISCOVERY = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

interface AuthProviderConfig {
  clientId: string;
  scopes: string[];
  redirectUri: string;
  extraParams?: Record<string, string>;
}

// Provider-specific configurations
export const AUTH_PROVIDERS_CONFIG: Record<AuthProvider, AuthProviderConfig> = {
  [AuthProvider.GOOGLE]: {
    clientId: AuthProvider.GOOGLE,
    scopes: ["openid", "profile", "email"],
    redirectUri: AUTH_REDIRECT_URI,
  },
  [AuthProvider.MICROSOFT]: {
    clientId: AuthProvider.MICROSOFT,
    scopes: ["openid", "profile", "email"],
    redirectUri: AUTH_REDIRECT_URI,
  },
};

// Helper function
export const getProviderConfig = (provider: AuthProvider) => {
  return AUTH_PROVIDERS_CONFIG[provider];
};
