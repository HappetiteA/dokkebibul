import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import ModalProvider from "@/contexts/ModalProvider";
import { AnimatedSplashScreen } from "@/components/SplashScreen";
import { View } from "react-native";
import { BGStyle } from "@/components/style/commonStyle";
import { useAuth } from "@/contexts/AuthContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/(app)/(home)",
};

SplashScreen.preventAutoHideAsync();

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
      <StatusBar style="dark" translucent={true} />
      <AuthProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </AuthProvider>
    </View>
  );
}

function AppContent() {
  const { loading } = useAuth(); // Get loading state

  return (
    <View style={BGStyle.BG}>
      <AnimatedSplashScreen isAppReady={!loading}>
        <Stack screenOptions={{ headerShown: false }} />
      </AnimatedSplashScreen>
    </View>
  );
}
