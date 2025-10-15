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

// Provider-specific configurations
export const AUTH_PROVIDERS_CONFIG = {
  [AuthProvider.GOOGLE]: {
    clientId: AuthProvider.GOOGLE,
    scopes: ["openid", "profile", "email"],
    redirectUri: AUTH_REDIRECT_URI,
    extraParams: {
      provider: AuthProvider.GOOGLE,
      platform: "mobile",
    },
  },
  [AuthProvider.MICROSOFT]: {
    clientId: AuthProvider.MICROSOFT,
    scopes: ["openid", "profile", "email"],
    redirectUri: AUTH_REDIRECT_URI,
    extraParams: {
      provider: AuthProvider.MICROSOFT,
      platform: "mobile",
    },
  },
};

// Helper function
export const getProviderConfig = (provider: AuthProvider) => {
  return AUTH_PROVIDERS_CONFIG[provider];
};
