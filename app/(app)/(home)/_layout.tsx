import React from "react";
import { Link, Stack } from "expo-router";
import { GlobalSettingProvider } from "@/contexts/GlobalSettingProvider";

export default function HomeLayout() {
  return (
    <GlobalSettingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "home",
            gestureEnabled: false,
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
          name="EditProfile"
          options={{
            title: "EditProfile",
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
        <Stack.Screen
          name="chat"
          options={{
            title: "chat",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PISetting"
          options={{
            title: "PISetting",
            headerShown: false,
          }}
        />
      </Stack>
    </GlobalSettingProvider>
  );
}
