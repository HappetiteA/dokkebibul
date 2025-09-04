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
  const { session, profile } = useAuth();

  let isGuard = false;

  if (session) {
    if (profile) isGuard = true;
  }

  return (
    <Stack>
      <Stack.Protected guard={isGuard}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!isGuard}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
