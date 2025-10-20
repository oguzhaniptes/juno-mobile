import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 20,
    marginBottom: 54,
    backgroundColor: "whitesmoke",
  },
  shadowWrapper: {
    // 🔥 Gölge stillerini buraya uygula (shadowColor, elevation vb.)

    // 🔥 KRİTİK: Gölgenin görünmesi için overflow: 'visible' olmalı
    overflow: "visible",
    backgroundColor: "transparent", // Arkaplan şeffaf olmalı
    padding: 5, // Gölgenin sığması için boşluk bırak
  },
});
