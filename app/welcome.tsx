import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSession } from "@/provider/AuthProvider";

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isEpheremalLoading, ephemeralData } = useSession();

  useEffect(() => {
    const logger = () => {
      console.log("Welcome page: ", ephemeralData);
    };

    logger();
  }, [ephemeralData]);

  const steps = [
    {
      title: "Hoşgeldiniz",
      description: "Juno'ya hoş geldiniz! Başlamak için hazır mısınız?",
    },
    {
      title: "Keşfedin",
      description: "Yeni özellikler ve fırsatlar sizi bekliyor!",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        router.push("/sign-in");
      } catch (err) {
        console.error("Router error:", err);
      }
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.titleDark]}>{steps[currentStep].title}</Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>{steps[currentStep].description}</Text>
      </View>

      {/* Step Indicators */}
      <View style={styles.indicatorContainer}>
        {steps.map((_, index) => (
          <View key={index} style={[styles.indicator, isDark && styles.indicatorDark, currentStep === index && styles.activeIndicator]} />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep === steps.length - 1 ? (
          <>
            <TouchableOpacity style={[styles.backButton, isDark && styles.backButtonDark]} onPress={() => setCurrentStep(0)}>
              <Ionicons name="arrow-back" size={24} color={isDark ? "#0A84FF" : "#007AFF"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Başla</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.button, isEpheremalLoading && styles.buttonDisabled]} onPress={handleNext} disabled={!ephemeralData}>
            <Text style={[styles.buttonText, isEpheremalLoading && styles.buttonTextDisabled]}>İleri</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  titleDark: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
  },
  descriptionDark: {
    color: "#aaa",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  backButton: {
    width: 60,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonDark: {
    backgroundColor: "#1C1C1E",
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 25,
    width: 240,
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  indicatorDark: {
    backgroundColor: "#3A3A3C",
  },
  activeIndicator: {
    backgroundColor: "#007AFF",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#007AFF50", // Ana rengin transparan hali
    opacity: 0.7,
  },
  buttonTextDisabled: {
    color: "#ffffff80", // Beyazın transparan hali
  },
});
