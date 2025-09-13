import { Platform, Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/utils/AuthContext";

export const useAuthActions = () => {
  const { signOut } = useAuth();

  const loginWithGoogle = async (redirectTo?: string) => {

    if (Platform.OS === "web") {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo || window.location.origin },
      });
    } else {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      });

      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data) throw new Error("Google user data missing");
      if (!userInfo.data.idToken) throw new Error("Google user ID token missing");

      const { data: { user }, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });

      if (error || !user) throw error || new Error("Google login failed");
    }

  };

  const loginWithApple = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Apple login not supported on web");
      return;
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) throw new Error("No identity token returned by Apple");

    const { data: { user }, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error || !user) throw error || new Error("Apple login failed");
  };

  const logout = signOut

  return { loginWithGoogle, loginWithApple, logout };
};
