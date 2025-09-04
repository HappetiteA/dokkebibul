import { SplashScreen } from 'expo-router';
import { useAuth } from '@/utils/AuthContext';

export function SplashScreenController() {
  const { loading } = useAuth();

  if (!loading) {
    SplashScreen.hideAsync();
  }

  return null;
}
