// hooks/useJoinDate.ts
import { useAuth } from '~/contexts/AuthProvider';

export default function useJoinDate() {
  const { session } = useAuth();

  if (!session?.user?.created_at) {
    return { createdAt: null };
  }

  const formatted = new Date(session.user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  }); // e.g., "Jan 2024"

  return { createdAt: formatted };
}
