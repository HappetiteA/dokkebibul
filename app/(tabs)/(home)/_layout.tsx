import { Stack } from "expo-router";

export default function DefaultLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
