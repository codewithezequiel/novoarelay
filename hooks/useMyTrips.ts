// hooks/useMyTrips.ts
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export function useMyTrips() {
  const [myTripCount, setMyTripCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      getMyTripCount();
    }
  }, [session?.user?.id]);

  const getMyTripCount = async () => {
    const { count, error } = await supabase
      .from('events')
      .select('company_id', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching trip count:', error.message);
    } else if (typeof count === 'number') {
      setMyTripCount(count);
    }

    setLoading(false);
  };

  return { myTripCount, loading };
}
