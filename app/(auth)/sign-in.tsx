import {
  Platform,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuthActions } from "@/hooks/useAuthActions";

export default function SignIn() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple } = useAuthActions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <View>
          <Text style={{ fontSize: 60 }}>LOGO</Text>
          {
            //"<Image source={require(...)}/>"
          }
        </View>
        <TouchableOpacity
          style={{ marginVertical: 6 }}
          onPress={async () => {
            try {
              await loginWithGoogle();
            } catch (err: any) {
              Alert.alert("Login failed", err.message || JSON.stringify(err));
              console.error(err);
            }
          }}
        >
          <Image
            style={{ width: 184, height: 44 }}
            resizeMode="contain"
            source={require("../../assets/sign_in/android_light_rd_SI.png")}
          />
        </TouchableOpacity>
        {Platform.OS === "ios" ? (
          <TouchableOpacity
            style={{ marginVertical: 6 }}
            onPress={async () => {
              try {
                await loginWithApple();
              } catch (err: any) {
                Alert.alert("Login failed", err.message || JSON.stringify(err));
                console.error(err);
              }
            }}
          >
            <Image
              style={{ width: 184, height: 44 }}
              resizeMode="contain"
              source={require("../../assets/sign_in/apple_light_SI.png")}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
