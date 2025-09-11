import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "@/utils/supabase";

const handleRegistrationError = (errorMessage: string) => {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export const getPushTokenAsync = async () => {
  if (!Device.isDevice) {
    handleRegistrationError('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
    return;
  }
  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      })
    ).data;
    console.log("Expo push token:", token);
    return token;
  } catch (e: any) {
    handleRegistrationError(`${e}`);
    return;
  }
}

export const sendTokenToDBAsync = async (userId: string, token: string) => {
  try {
    const { error } = await supabase
      .from("user_push_tokens")
      .insert(
        {
          user_id: userId,
          expo_push_token: token,
        },
      );
    if (error) {
      handleRegistrationError('Failed to insert push token to DB');
    }
  } catch (e: any) {
    handleRegistrationError(`${e}`);
  }
}
