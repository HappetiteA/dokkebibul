import { Stack, Redirect, usePathname } from "expo-router";
import { useAuth } from "@/utils/AuthContext";

export default function AppLayout() {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  if (!user && !pathname.startsWith('/sign-in')) {
    return <Redirect href="/sign-in" />;
  }

  if (user && !profile && !pathname.startsWith('/onboarding')) {
    return <Redirect href="/(app)/onboarding" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}

