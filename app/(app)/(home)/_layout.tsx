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
      <Stack.Screen
        name="avatar"
        options={{
          title: "avatar",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyProfile"
        options={{
          title: "MyProfile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OtherProfile"
        options={{
          title: "OtherProfile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FollowersList"
        options={{
          title: "FollowersList",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FollowingsList"
        options={{
          title: "FollowingsList",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
