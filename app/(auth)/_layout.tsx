import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '~/contexts/AuthProvider';

export default function AuthTabLayout() {
  const router = useRouter();
  const { isAuthenticated, isOnboardingComplete } = useAuth();

  console.log('Authenticated:', isAuthenticated);
  console.log('Onboarding complete:', isOnboardingComplete);

  useEffect(() => {
    if (isAuthenticated) {
      if (isOnboardingComplete === false) {
        console.log('Redirecting to onboarding');
        router.replace('/(auth)/onboarding/nameScreen'); // Use router.replace for stable navigation
      } else if (isOnboardingComplete === true) {
        console.log('Redirecting to home');
        router.replace('/'); // Navigate to home after onboarding
      }
    }
  }, [isAuthenticated, isOnboardingComplete]);

  if (!isAuthenticated || isOnboardingComplete === null) {
    console.log('Loading or unauthenticated...');
    return <Stack />; // Display the stack while loading
  }

  return <Stack />;
}
