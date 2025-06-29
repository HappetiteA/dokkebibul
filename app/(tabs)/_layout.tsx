import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="avatar"
        options={{
          tabBarLabel: "avatar",
          title: "avatar",
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
        }}
      />
    </Tabs>
  );
}
