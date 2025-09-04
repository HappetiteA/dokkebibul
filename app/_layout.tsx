import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '@/utils/AuthContext';
import { SplashScreenController } from '@/components/SplashScreenController';

export default function Root() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
