import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import ModalProvider from "@/contexts/ModalProvider";
import { SplashScreenController } from "@/components/SplashScreenController";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { BGStyle } from "@/components/style/commonStyle";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/(app)/(home)",
};

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <View style={BGStyle.BG}>
      <AuthProvider>
        <ModalProvider>
          <SplashScreenController />
          <Stack screenOptions={{ headerShown: false }} />
        </ModalProvider>
      </AuthProvider>
    </View>
  );
}
