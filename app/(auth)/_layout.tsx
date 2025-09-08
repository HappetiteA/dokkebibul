import { Stack, Redirect, usePathname } from "expo-router";
import { useAuth } from "@/utils/AuthContext";

export {
  ErrorBoundary,
} from "expo-router";

export default function SignInLayout() {
  const { profile, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;
  
  if (profile && pathname.startsWith('/(auth)')) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
