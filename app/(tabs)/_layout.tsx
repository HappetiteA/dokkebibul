import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="avatar"
        options={{
          tabBarLabel: "avatar",
          title: "avatar",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: "home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "profile",
          title: "profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
