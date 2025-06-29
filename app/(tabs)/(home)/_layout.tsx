import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function DefaultLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "home",
        }}
      />
      <Stack.Screen name="chat/list" options={{ title: "Chat List" }} />
    </Stack>
  );
}
