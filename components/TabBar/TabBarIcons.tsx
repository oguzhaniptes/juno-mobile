import { Ionicons } from "@expo/vector-icons";

export const TabBarIcons = {
  index: (props: { focused: boolean; color: string; size: number }) => <Ionicons name={props.focused ? "home" : "home-outline"} size={props.size} color={props.color} />,
  awards: (props: { focused: boolean; color: string; size: number }) => <Ionicons name={props.focused ? "trophy" : "trophy-outline"} size={props.size} color={props.color} />,
  community: (props: { focused: boolean; color: string; size: number }) => <Ionicons name={props.focused ? "people" : "people-outline"} size={props.size} color={props.color} />,
  profile: (props: { focused: boolean; color: string; size: number }) => <Ionicons name={props.focused ? "person" : "person-outline"} size={props.size} color={props.color} />,
  notifications: (props: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={props.focused ? "notifications" : "notifications-outline"} size={props.size} color={props.color} />
  ),
};
