// import * as AppleAuthentication from "expo-apple-authentication";
// import { supabase } from "@/utils/supabase";
// import { Alert } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   GoogleSigninButtonProps,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

// export const handleAppleSignIn = async () => {
//   const router = useRouter();
//   try {
//     const credential = await AppleAuthentication.signInAsync({
//       requestedScopes: [
//         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//         AppleAuthentication.AppleAuthenticationScope.EMAIL,
//       ],
//     });
//     if (credential.identityToken) {
//       console.log(supabase)
//       const {
//         error,
//         data: { user },
//       } = await supabase.auth.signInWithIdToken({
//         provider: "apple",
//         token: credential.identityToken,
//       });
//       console.log(JSON.stringify({ error, user }, null, 2));
//       if (!error && user) {
//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("id, is_initialized")
//           .eq("id", user.id)
//           .maybeSingle();
//         if (!profile) {
//           Alert.alert("Profile missing", "Please try again later, or contact developer."); return;
//         } 
//         if (profileError) {
//           Alert.alert("Failed to fetch profile information: ", JSON.stringify(profileError)); return;
//         }
//         if (!profile.is_initialized) {
//           router.replace("/(app)/onboarding");
//         }
//         else router.replace("/(app)/(tabs)/(home)");
//         console.log(profile)
//       } else {
//         Alert.alert("Login failed: ", JSON.stringify(error));
//       }
//     } else {
//       throw new Error("No identityToken.");
//     }
//   } catch (e) {
//     const err = e as any;
//     if (err.code === "ERR_REQUEST_CANCELED") {
//       // handle that the user canceled the sign-in flow
//       Alert.alert("Login failed: ", err.code);
//     } else {
//       // handle other errors
//       Alert.alert("Login failed: ", err.code);
//     }
//   }
// };

// export const GoogleLoginButton = () => {
//   const router = useRouter();
//   GoogleSignin.configure({
//     webClientId:
//       process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//     iosClientId:
//       process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
//   });

//   return (
//     <GoogleSigninButton
//       size={GoogleSigninButton.Size.Wide}
//       color={GoogleSigninButton.Color.Dark}
//       onPress={async () => {
//         try {
//           await GoogleSignin.hasPlayServices();
//           const userInfo = await GoogleSignin.signIn();
//           if (!userInfo.data) {
//             Alert.alert("Failed to fetch profile information"); return;
//           }
//           if (userInfo.data.idToken) {
//             const {
//               data: { user },
//               error,
//             } = await supabase.auth.signInWithIdToken({
//               provider: "google",
//               token: userInfo.data.idToken,
//             });
//             console.log(error, user);
//             if (!error && user) {
//               // User is signed in.
//               const { data: profile, error: profileError } = await supabase
//                 .from("profiles")
//                 .select("id, is_initialized")
//                 .eq("id", user.id)
//                 .maybeSingle();
//               if (profileError) {
//                 Alert.alert("Failed to fetch profile information: ", JSON.stringify(profileError)); return;
//               }
//               if (!profile) {
//                 Alert.alert("Profile missing", "Please try again later, or contact developer."); return;
//               } else {
//                 if (!profile.is_initialized) router.replace("/onboarding");
//                 else router.replace("/(tabs)/(home)");
//               }
//             } else {
//               Alert.alert("Login failed: ", JSON.stringify(error));
//               console.log("Login failed: ", JSON.stringify(error));
//             }
//           } else {
//             throw new Error("no ID token present!");
//           }
//         } catch (error: any) {
//           if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//             console.log(1);
//           } else if (error.code === statusCodes.IN_PROGRESS) {
//             console.log(2);
//           } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//             console.log(3);
//           } else {
//             console.log(error);
//           }
//         }
//       }}
//     />
//   );
// };

// export const handleLogout = async () => {
//   const router = useRouter();
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     Alert.alert("Logout failed", error.message);
//   } else {
//     router.replace("/sign-in");
//   }
// };

import { Platform, Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/utils/AuthContext";

export const useAuthActions = () => {
  const { setProfile, signOut } = useAuth();

  const loginWithGoogle = async (redirectTo?: string) => {
    try {
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

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        if (!userInfo.data) throw new Error("Google user data missing");
        if (!userInfo.data.idToken) throw new Error("Google user ID token missing");

        const { data: { user }, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if (error || !user) throw error || new Error("Google login failed");

        await ensureProfile(user.id);
      }
    } catch (err: any) {
      Alert.alert("Login failed", err.message || JSON.stringify(err));
      console.error(err);
    }
  };

  const loginWithApple = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Apple login not supported on web");
      return;
    }

    try {
      const rawNonce = Math.random().toString(36).substring(2, 15);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: rawNonce,
      });

      if (!credential.identityToken) throw new Error("No identity token returned by Apple");

      const { data: { user }, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
        nonce: hashedNonce,
      });

      if (error || !user) throw error || new Error("Apple login failed");

      await ensureProfile(user.id);
    } catch (err: any) {
      Alert.alert("Login failed", err.message || JSON.stringify(err));
      console.error(err);
    }
  };

  const logout = signOut

  const ensureProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: userId, is_initialized: false })
        .select()
        .single();

      if (insertError) throw insertError;
      setProfile(newProfile);
    } else {
      setProfile(profile);
    }
  };

  return { loginWithGoogle, loginWithApple, logout };
};
