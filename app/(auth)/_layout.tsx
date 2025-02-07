import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export default function AuthTabLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Stack />;
}
