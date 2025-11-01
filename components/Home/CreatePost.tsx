import React, { useMemo, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, useColorScheme, Animated, Easing } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSession } from "@/provider/AuthProvider";
import { BASE_URL, Colors } from "@/constants";
import { createComponentStyles } from "@/styles";
// import { createComponentStyles, Colors } from "@/styles/componentStyles";

interface CreatePostProps {
  onPostCreated?: () => void;
  onCancel?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onCancel }) => {
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);
  const colors = isDark ? Colors.dark : Colors.light;

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Animations for expanding card and sliding actions area
  const expandAnim = useRef(new Animated.Value(0)).current; // 0 collapsed, 1 expanded

  const animateTo = (to: 0 | 1) => {
    Animated.timing(expandAnim, {
      toValue: to,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const onFocus = () => {
    setIsFocused(true);
    animateTo(1);
  };

  const onBlur = () => {
    if (!content.trim()) {
      setIsFocused(false);
      animateTo(0);
    }
  };

  const containerStyle = useMemo(
    () => [
      styles.createPostCard,
      {
        marginBottom: 0, // collapsed state should NOT add bottom spacing
        paddingVertical: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 16] }),
      },
    ],
    [styles, expandAnim]
  );

  const actionsHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 44] });
  const actionsOpacity = expandAnim;
  const actionsTranslate = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }

    if (!authData?.userId) {
      Alert.alert("Error", "You must be logged in to create a post");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/db/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.sessionToken}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          post_type: "standard",
        }),
      });

      console.log("res", response);

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        setContent("");
        onPostCreated?.();
      } else {
        Alert.alert("Error", data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Create post error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Animated.View style={containerStyle}>
        {!isFocused ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TextInput
              style={[styles.postInput, { marginBottom: 0, flex: 1 }]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.text}
              multiline
              value={content}
              onChangeText={setContent}
              maxLength={200}
              onFocus={onFocus}
            />
            <TouchableOpacity
              style={[styles.postButton, { paddingHorizontal: 16, paddingVertical: 12, height: 48 }, (!content.trim() || isLoading) && { opacity: 0.5 }]}
              onPress={handleCreatePost}
              disabled={!content.trim() || isLoading}
            >
              {isLoading ? <ActivityIndicator color="white" size="small" /> : <Feather name="send" size={18} color="white" />}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.postInput}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.text}
              multiline
              numberOfLines={4}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              maxLength={200}
              onBlur={onBlur}
              autoFocus
            />

            <View style={styles.postActions}>
              <Animated.View style={[styles.actionButtons, { height: actionsHeight, opacity: actionsOpacity, transform: [{ translateY: actionsTranslate }], overflow: "hidden" }]}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="image-outline" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="happy-outline" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="location-outline" size={20} color={colors.text} />
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={[styles.postButton, (!content.trim() || isLoading) && { opacity: 0.5 }]} onPress={handleCreatePost} disabled={!content.trim() || isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Feather name="send" size={16} color="white" />
                    <Text style={styles.postButtonText}>Post</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default CreatePost;
