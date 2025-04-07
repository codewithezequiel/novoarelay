// hooks/useCompanyTrips.ts
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export function useCompanyTrips() {
  const [tripCount, setTripCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      getCompanyTripCount();
    }
  }, [session?.user?.id]);

  const getCompanyTripCount = async () => {
    // Step 1: Get the user's company_id
    const { data: userData, error: userError } = await supabase
      .from('profiles') // or whatever table your user data is in
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user company ID:', userError.message);
      setLoading(false);
      return;
    }

    const companyId = userData.company_id;

    // Step 2: Count all trips associated with that company_id
    const { count, error: tripError } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (tripError) {
      console.error('Error fetching trip count:', tripError.message);
    } else if (typeof count === 'number') {
      setTripCount(count);
    }

    setLoading(false);
  };

  return { tripCount, loading };
}
