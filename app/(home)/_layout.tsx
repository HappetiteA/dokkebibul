import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "home",
        }}
      />
      <Stack.Screen name="chat/list" options={{ title: "Chat List" }} />
      <Stack.Screen
        name="avatar"
        options={{
          title: "avatar",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-profile"
        options={{
          title: "my-profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="other-profile"
        options={{
          title: "other-profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
