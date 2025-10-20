import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer((state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action], initialValue) as UseStateHook<T>;
}

export async function setSessionStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Session storage is unavailable:", e);
    }
  } else {
    const sessionKey = `session-${key}`;
    if (value == null) {
      await SecureStore.deleteItemAsync(sessionKey);
    } else {
      await SecureStore.setItemAsync(sessionKey, value);
    }
  }
}

export function useSessionStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    const fetchSessionData = async () => {
      let value: string | null = null;
      if (Platform.OS === "web") {
        try {
          if (typeof sessionStorage !== "undefined") {
            value = sessionStorage.getItem(key);
          }
        } catch (e) {
          console.error("Session storage is unavailable:", e);
        }
      } else {
        const sessionKey = `session-${key}`;
        value = await SecureStore.getItemAsync(sessionKey);
      }
      setState(value);
    };

    fetchSessionData();
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setSessionStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
