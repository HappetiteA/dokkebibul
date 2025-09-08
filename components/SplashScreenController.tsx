import { SplashScreen } from 'expo-router';
import { useAuth } from '@/utils/AuthContext';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading])

  return null;
}
