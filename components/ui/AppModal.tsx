import React, { PropsWithChildren, useEffect, useState } from "react";
import { Modal, Platform, KeyboardAvoidingView, Pressable, View, StyleSheet, useColorScheme, Keyboard } from "react-native";
import { Colors } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppModalProps = PropsWithChildren & {
  visible: boolean;
  onClose: () => void;
  sheetStyle?: object;
  overlayDismiss?: boolean;
  showHandle?: boolean;
};

const AppModal = ({ visible, onClose, sheetStyle, overlayDismiss = true, showHandle = true, children }: AppModalProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates?.height ?? 0);
    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <Pressable style={styles.overlay} onPress={overlayDismiss ? onClose : undefined} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.cardBgSolid, borderTopColor: colors.border, paddingBottom: 16 + insets.bottom, marginBottom: keyboardHeight },
            sheetStyle,
          ]}
        >
          {showHandle && <View style={[styles.handle, { backgroundColor: colors.border }]} />}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: "flex-end" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { padding: 24, paddingBottom: 32, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1 },
  handle: { width: 40, height: 5, borderRadius: 3, alignSelf: "center", marginBottom: 16 },
});

export default AppModal;
