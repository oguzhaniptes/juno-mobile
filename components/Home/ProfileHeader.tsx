import { View, Text, Alert, useColorScheme, TouchableOpacity } from "react-native";
import Avatar from "@/components/ui/avatar";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSession } from "@/provider/AuthProvider";
import { createComponentStyles } from "@/styles";
import { BASE_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";

const ProfileHeader = () => {
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);

  const [gold, setGold] = useState<number | undefined>(undefined);
  const [silver, setSilver] = useState<number | undefined>(undefined);
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [claimableTime, setClaimableTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const getUser = useCallback(async () => {
    if (!authData?.userId || !authData?.sessionToken) return;

    try {
      const response = await fetch(`${BASE_URL}/api/db/user/${authData?.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data;

        setGold(userData.gold_amount);
        setSilver(userData.silver_amount);
        setLastClaim(userData.last_silver_claim);

        const lastClaimDate = new Date(userData.last_silver_claim);
        const claimableAt = new Date(lastClaimDate.getTime() + 5 * 60 * 1000);

        setClaimableTime(claimableAt);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [authData?.sessionToken, authData?.userId]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!claimableTime) return;

    const calculateRemainingTime = () => {
      const now = new Date().getTime();
      const claimTime = claimableTime.getTime();
      const difference = claimTime - now;

      if (difference <= 0) {
        setTimeRemaining(0);
        // Süre dolduğunda verileri güncelle
        getUser();
      } else {
        setTimeRemaining(Math.ceil(difference / 1000));
      }
    };

    calculateRemainingTime();

    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [claimableTime, getUser]);

  const maxClaimTimeSeconds = 300;
  const isClaimReady = timeRemaining !== null && timeRemaining <= 0;

  let silverBorderColor = "#555555";

  if (timeRemaining !== null) {
    if (isClaimReady) {
      silverBorderColor = "#32CD32";
    } else {
      const ratio = timeRemaining / maxClaimTimeSeconds;

      if (ratio < 0.2) {
        silverBorderColor = isDark ? "#FFF000" : "#FFD700";
      } else if (ratio < 0.6) {
        silverBorderColor = isDark ? "#AAAAAA" : "#DDDDDD";
      } else {
        silverBorderColor = "#555555";
      }
    }
  }

  const claimSilver = async () => {
    if (!authData?.userId || !authData?.sessionToken) return;
    if (!isClaimReady) return Alert.alert("Bekle", "Gümüş talep etmek için 5 dakikalık bekleme süresi henüz dolmadı.");

    try {
      const response = await fetch(`${BASE_URL}/api/db/claim-silver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Başarılı!", `${data.data} Gümüş başarıyla alındı.`);
        getUser(); // Başarılı claim sonrası veriyi yeniden çek
      } else {
        const errorText = await response.text();
        Alert.alert("Hata", `Claim başarısız: ${errorText}`);
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Hata", "Ağ hatası. Lütfen tekrar deneyin.");
    }
  };

  const silverBadgeStyle = {
    ...styles.statBadge,
    borderColor: silverBorderColor,
    borderWidth: 1,
    // Claim hazır değilse opaklığı azalt
    opacity: isClaimReady ? 1 : 0.5,
  };

  return (
    <View style={styles.profileHeader}>
      <View style={styles.userInfoWrapper}>
        <Avatar imageUrl={authData?.photoUrl} />
        <View style={styles.userTextContainer}>
          <Text style={styles.greetingText}>{new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}</Text>
          <Text style={styles.usernameText}>{authData?.name || "User"}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity
          onPress={claimSilver}
          disabled={!isClaimReady} // Claim hazır değilse disabled = true
        >
          <View style={silverBadgeStyle}>
            <FontAwesome6 name="coins" size={12} color="#A9A9A9" />
            <Text style={styles.statValue}>{silver === undefined ? "..." : silver.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.statBadge}>
          <FontAwesome6 name="coins" size={12} color="#FFD700" />
          <Text style={styles.statValue}>{gold === undefined ? "..." : gold.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
