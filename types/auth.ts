export enum AuthProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
  // TWITCH = "twitch",
  // FACEBOOK = "facebook",
  // APPLE = "apple",
  // DISCORD = "discord",
}

export interface AuthData {
  user_id: string;
  salt: string;
}

export interface AuthProviderProps {
  signIn: (provider: AuthProvider) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  authData: AuthData | null;
  isLoading: boolean;
}
