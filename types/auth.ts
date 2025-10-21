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
  id_token: string;
  salt: string;
  provider: string;
  name: string | null;
  mail: string | null;
  photo_url: string | null;
  max_epoch: number;
}

export interface EphemeralData {
  jwt_randomness: string;
  nonce: string;
  extended_ephemeral_public_key: string;
  extended_ephemeral_private_key: string;
}

export interface AuthProviderProps {
  signIn: (provider: AuthProvider) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  authData: AuthData | null;
  ephemeralData: EphemeralData | null;
  isLoading: boolean;
}
