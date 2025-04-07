// hooks/useCompanyTrips.ts
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export function useAdminClientCount() {
  const [clientCount, setClientCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      getAdminClientCount();
    }
  }, [session?.user?.id]);

  const getAdminClientCount = async () => {
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

    // Step 2: Count all clients associated with that company_id
    const { count, error: clientError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (clientError) {
      console.error('Error fetching client count:', clientError.message);
    } else if (typeof count === 'number') {
      setClientCount(count);
    }

    setLoading(false);
  };

  return { clientCount, loading };
}
