import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams } from "expo-router";
export default function Product() {
  const { id } = useLocalSearchParams();

  return <ThemedText>Urun bu {id}</ThemedText>;
}
