import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PISetting"
        options={{
          title: "PISetting",
        }}
      />
      <Stack.Screen
        name="EditPISetting"
        options={{
          title: "EditPISetting",
        }}
      />
    </Stack>
  );
}
