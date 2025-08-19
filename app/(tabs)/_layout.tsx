import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="avatar"
        options={{
          title: "avatar",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(home)"
        options={{
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
