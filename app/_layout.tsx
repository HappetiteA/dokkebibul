import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, SplashScreen, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts({
    IBMPlexSansKRBold: require("@/assets/fonts/IBMPlexSansKR-Bold.otf"),
    IBMPlexSansKRRegular: require("@/assets/fonts/IBMPlexSansKR-Regular.otf"),
    IBMPlexSansKRSemiBold: require("@/assets/fonts/IBMPlexSansKR-SemiBold.otf"),
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
  const router = useRouter();

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data && data.conversation_id) {
          router.navigate({
            pathname: `/(app)/(home)/chat/${data.conversation_id}/ChatScreen`,
          });
        }
      });

    return () => {
      responseListener.remove();
    };
  }, []);

  return (
    <View style={BGStyle.BG}>
      <AnimatedSplashScreen isAppReady={!loading}>
        <Stack screenOptions={{ headerShown: false }} />
      </AnimatedSplashScreen>
    </View>
  );
}
