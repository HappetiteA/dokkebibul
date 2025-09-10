import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "@/utils/supabase";

export async function registerPushToken(userId: string) {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Push notification permissions not granted");
    return;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    })
  ).data;

  console.log("Expo push token:", token);

  const { error } = await supabase.from("user_push_tokens").upsert(
    {
      user_id: userId,
      expo_push_token: token,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,expo_push_token" }
  );

  if (error) {
    console.error("Failed to save push token:", error);
  }
}
