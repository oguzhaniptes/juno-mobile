export enum AuthProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
  // TWITCH = "twitch",
  // FACEBOOK = "facebook",
  // APPLE = "apple",
  // DISCORD = "discord",
}
export interface AuthData {
  salt: string;
  userId: string;
  idToken: string;
  provider: string;
  name: string | null;
  mail: string | null;
  photoUrl: string | null;
}

export interface EphemeralData {
  randomness: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
}

export interface ZkLoginPayload {
  nonce: string;
  maxEpoch: number;
  randomness: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
}

export interface ZkLoginCheckResult {
  success: boolean;
  newNonce: string | null;
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
