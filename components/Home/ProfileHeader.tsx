import { View, Text, Image, useColorScheme } from "react-native";
import Avatar from "@/components/ui/avatar";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useSession } from "@/provider/AuthProvider";
import { createComponentStyles } from "@/styles";

const ProfileHeader = () => {
  const { authData } = useSession();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createComponentStyles(isDark);

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
        <View style={styles.statBadge}>
          <FontAwesome6 name="coins" size={12} color="#FFD700" />
          <Text style={styles.statValue}>120</Text>
        </View>
        <View style={styles.statBadge}>
          <Ionicons name="diamond" size={12} color="#24CCFF" />
          <Text style={styles.statValue}>2.5K</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
