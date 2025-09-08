import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/utils/AuthContext";

export default function SignInLayout() {
  const { profile, loading } = useAuth();

  if (loading) return null;
  
  if (profile) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
