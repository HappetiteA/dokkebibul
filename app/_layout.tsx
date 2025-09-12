import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "@/utils/AuthContext";
import { SplashScreenController } from "@/components/SplashScreenController";

export {
  ErrorBoundary,
} from "expo-router";

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
    <AuthProvider>
      <SplashScreenController />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
