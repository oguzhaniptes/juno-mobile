import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, useColorScheme, Modal, Pressable, Animated } from "react-native";
import { useSession } from "@/provider/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
  const { signInWithGoogle, signInWithMicrosoft } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [modalVisible, setModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [backgroundColorAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (modalVisible) {
      setShowModal(true);
      // Fade in overlay after a slight delay
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }).start(() => {
        // After modal fully opens, change background color
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    } else {
      // First, reset background color
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        // Then fade out overlay before closing
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowModal(false);
        });
      });
    }
  }, [modalVisible, overlayOpacity, backgroundColorAnim]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const openMoreOptions = () => {
    setModalVisible(true);
  };

  const animatedBackgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? ["#1a1a2e", "#0f0f1e"] : ["#e3f2fd", "#c5e1f5"],
  });

  return (
    <Animated.View style={[styles.background, isDark && styles.backgroundDark, { backgroundColor: animatedBackgroundColor }]}>
      <View style={styles.container}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Sign In With</Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Your Preferred Service</Text>

          <View style={styles.providersContainer}>
            {/* Google */}
            <TouchableOpacity style={[styles.providerButton, isDark && styles.providerButtonDark]} onPress={signInWithGoogle}>
              <View style={styles.googleIcon}>
                <Ionicons name="logo-google" size={28} color="#4285F4" />
              </View>
            </TouchableOpacity>

            {/* Twitch */}
            <TouchableOpacity disabled style={[styles.providerButton, isDark && styles.providerButtonDark]} onPress={() => {}}>
              <View style={styles.twitchIcon}>
                <Ionicons name="logo-twitch" size={28} color="#9146FF" />
              </View>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity disabled style={[styles.providerButton, isDark && styles.providerButtonDark]} onPress={() => {}}>
              <View style={styles.facebookIcon}>
                <Ionicons name="logo-facebook" size={32} color="#1877F2" />
              </View>
            </TouchableOpacity>

            {/* Microsoft */}
            <TouchableOpacity style={[styles.providerButton, isDark && styles.providerButtonDark]} onPress={signInWithMicrosoft}>
              <View style={styles.microsoftIcon}>
                <View style={styles.microsoftGrid}>
                  <View style={[styles.microsoftSquare, { backgroundColor: "#F25022" }]} />
                  <View style={[styles.microsoftSquare, { backgroundColor: "#7FBA00" }]} />
                  <View style={[styles.microsoftSquare, { backgroundColor: "#00A4EF" }]} />
                  <View style={[styles.microsoftSquare, { backgroundColor: "#FFB900" }]} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.moreButton, isDark && styles.moreButtonDark]} onPress={openMoreOptions}>
            <Text style={[styles.moreButtonText, isDark && styles.moreButtonTextDark]}>More Options</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Modal */}
        <Modal animationType="slide" transparent={true} visible={showModal} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
              <Pressable style={styles.modalOverlayPressable} onPress={closeModal} />
            </Animated.View>
            <Pressable style={[styles.modalContent, isDark && styles.modalContentDark]} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>More Sign In Options</Text>

              <View style={styles.modalProvidersContainer}>
                {/* Apple */}
                <TouchableOpacity style={[styles.modalProviderButton, isDark && styles.modalProviderButtonDark]} onPress={() => {}}>
                  <Ionicons name="logo-apple" size={24} color={isDark ? "#fff" : "#000"} />
                  <Text style={[styles.modalProviderText, isDark && styles.modalProviderTextDark]}>Sign in with Apple</Text>
                </TouchableOpacity>

                {/* Discord */}
                <TouchableOpacity style={[styles.modalProviderButton, isDark && styles.modalProviderButtonDark]} onPress={() => {}}>
                  <Ionicons name="logo-discord" size={24} color="#5865F2" />
                  <Text style={[styles.modalProviderText, isDark && styles.modalProviderTextDark]}>Sign in with Discord</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.modalCloseButton, isDark && styles.modalCloseButtonDark]} onPress={closeModal}>
                <Text style={[styles.modalCloseButtonText, isDark && styles.modalCloseButtonTextDark]}>Cancel</Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </Modal>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  backgroundDark: {
    backgroundColor: "#1a1a2e",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardDark: {
    backgroundColor: "#1C1C1E",
    shadowColor: "#fff",
    shadowOpacity: 0.05,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 8,
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
  },
  subtitleDark: {
    color: "#aaa",
  },
  providersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    gap: 12,
  },
  providerButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f5f5f7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  providerButtonDark: {
    backgroundColor: "#2C2C2E",
  },
  googleIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  twitchIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  facebookIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  microsoftIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  microsoftGrid: {
    width: 28,
    height: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  microsoftSquare: {
    width: 12,
    height: 12,
  },
  moreButton: {
    backgroundColor: "#f5f5f7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  moreButtonDark: {
    backgroundColor: "#2C2C2E",
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  moreButtonTextDark: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlayPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalContentDark: {
    backgroundColor: "#1C1C1E",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 24,
  },
  modalTitleDark: {
    color: "#fff",
  },
  modalProvidersContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modalProviderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  modalProviderButtonDark: {
    backgroundColor: "#2C2C2E",
  },
  modalProviderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  modalProviderTextDark: {
    color: "#fff",
  },
  modalCloseButton: {
    backgroundColor: "#f5f5f7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseButtonDark: {
    backgroundColor: "#2C2C2E",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  modalCloseButtonTextDark: {
    color: "#fff",
  },
});
