import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "@/utils/supabase";

export const getPushTokenAsync = async (): Promise<string> => {
  try {
    if (!Device.isDevice) {
      throw new Error('Must use physical device for push notifications');
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error('Permission not granted to get push token for push notification!');
    }
    const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return token;
  } catch (err: any) {
    throw (err instanceof Error ? err : new Error(String(err)));
  }
}

export const sendTokenToDBAsync = async (userId: string, token: string) => {
  try {
    const { error } = await supabase
      .from("user_push_tokens")
      .upsert(
        {
          user_id: userId,
          expo_push_token: token,
        },
        {
          onConflict: "expo_push_token"
        }
      );
    if (error) {
      throw new Error(`Failed to insert push token to DB: ${error.message}`);
    }
  } catch (err: any) {
    throw (err instanceof Error ? err : new Error(String(err)));
  }
}
