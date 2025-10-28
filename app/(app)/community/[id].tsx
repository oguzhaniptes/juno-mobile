import { LayoutProvider } from "@/components/layout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BASE_URL } from "@/constants";
import { useSession } from "@/provider/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const Community = () => {
  const { id } = useLocalSearchParams();
  const { authData } = useSession();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPostDetail = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/db/community/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(id, "COMMU", data);

        setCommunity(data.data);
      } else {
        console.log("Error fetching post detail.");
        setCommunity(null);
      }
    } catch (error) {
      console.log("error", error);
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  }, [authData?.idToken, id]);

  useEffect(() => {
    getPostDetail();
  }, [getPostDetail]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#2563EB" />
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <LayoutProvider>
      <ThemedText>Community</ThemedText>
      {community && (
        <ThemedView>
          {/* <View>{community.data?.name}</View> */}
          <ThemedText>{community.name}</ThemedText>
          <ThemedText>{community.slug}</ThemedText>
          <ThemedText>{community.is_public.toString()}</ThemedText>
        </ThemedView>
      )}
    </LayoutProvider>
  );
};

export default Community;
