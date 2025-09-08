import { Stack, Redirect, usePathname } from "expo-router";
import { useAuth } from "@/utils/AuthContext";

export default function AppLayout() {
  const { profile, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  if (!profile && pathname.startsWith('/(app)')) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}

