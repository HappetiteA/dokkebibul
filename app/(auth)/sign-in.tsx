import { Platform, TouchableOpacity, View, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuthActions } from "@/hooks/useAuthActions";
import { BGStyle } from "@/components/style/commonStyle";

export default function SignIn() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple } = useAuthActions();

  return (
    <SafeAreaView style={[BGStyle.BG, { flex: 1 }]}>
      {/* Main Container */}
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        {/* --- Top Section: Logo --- */}
        {/* Centered vertically in the available upper space */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("@/assets/images/logo_full.png")}
            style={{ width: 220 }}
            resizeMode="contain"
          />
        </View>

        {/* --- Bottom Section: Buttons --- */}
        {/* justifyContent: 'flex-end' pushes content to the bottom. 
            On Android, the Google button will sit at the bottom-most position. */}
        <View
          style={{
            paddingBottom: 60,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* Google Button */}
          <TouchableOpacity
            style={{ marginVertical: 8 }}
            onPress={async () => {
              try {
                await loginWithGoogle();
              } catch (err: any) {
                Alert.alert("Login failed", err.message || JSON.stringify(err));
                console.error(err);
              }
            }}
          >
            {/* Adjusted width/height to match the wide pill design */}
            <Image
              style={{ width: 184, height: 44 }}
              resizeMode="contain"
              source={require("@/assets/sign_in/android_light_rd_SI.png")}
            />
          </TouchableOpacity>

          {/* Apple Button (iOS Only) */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={{ marginVertical: 8 }}
              onPress={async () => {
                try {
                  await loginWithApple();
                } catch (err: any) {
                  Alert.alert(
                    "Login failed",
                    err.message || JSON.stringify(err),
                  );
                  console.error(err);
                }
              }}
            >
              <Image
                style={{ width: 184, height: 44 }}
                resizeMode="contain"
                source={require("@/assets/sign_in/apple_light_SI.png")}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
