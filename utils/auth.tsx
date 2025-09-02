import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  GoogleSignin,
  GoogleSigninButton,
  GoogleSigninButtonProps,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const handleAppleLogin = async () => {
  const router = useRouter();
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    // Sign in via Supabase Auth.
    if (credential.identityToken) {
      const {
        error,
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      console.log(JSON.stringify({ error, user }, null, 2));
      if (!error && user) {
        // User is signed in.
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, is_initialized")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile) {
          Alert.alert("Profile missing", "Please try again later, or contact developer."); return;
        } 
        if (profileError) {
          Alert.alert("Failed to fetch profile information: ", JSON.stringify(profileError)); return;
        }
        if (!profile.is_initialized) {
          router.replace("/onboarding");
        }
        else router.replace("/(tabs)/(home)");
      } else {
        Alert.alert("Login failed: ", JSON.stringify(error));
      }
    } else {
      throw new Error("No identityToken.");
    }
  } catch (e) {
    const err = e as any;
    if (err.code === "ERR_REQUEST_CANCELED") {
      // handle that the user canceled the sign-in flow
      Alert.alert("Login failed: ", err.code);
    } else {
      // handle other errors
      Alert.alert("Login failed: ", err.code);
    }
  }
};

export const GoogleLoginButton = () => {
  const router = useRouter();
  GoogleSignin.configure({
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.data.idToken) {
            const {
              data: { user },
              error,
            } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data.idToken,
            });
            console.log(error, user);
            if (!error && user) {
              // User is signed in.
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("id, is_initialized")
                .eq("id", user.id)
                .maybeSingle();
              if (profileError) {
                Alert.alert("Failed to fetch profile information: ", JSON.stringify(profileError)); return;
              }
              if (!profile) {
                Alert.alert("Profile missing", "Please try again later, or contact developer."); return;
              } else {
                if (!profile.is_initialized) router.replace("/onboarding");
                else router.replace("/(tabs)/(home)");
              }
            } else {
              Alert.alert("Login failed: ", JSON.stringify(error));
              console.log("Login failed: ", JSON.stringify(error));
            }
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log(1);
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log(2);
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log(3);
          } else {
            console.log(error);
          }
        }
      }}
    />
  );
};

export const handleLogout = async () => {
  const router = useRouter();
  const { error } = await supabase.auth.signOut();

  if (error) {
    Alert.alert("Logout failed", error.message);
  } else {
    router.replace("/login");
  }
};
