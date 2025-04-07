// hooks/useEmployeeCount.ts
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export default function useEmployeeCount() {
  const { session } = useAuth();
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchEmployeeCount();
    }
  }, [session?.user?.id]);

  async function fetchEmployeeCount() {
    setLoading(true);
    try {
      // Get current user's company_id
      const { data: myData, error: myDataError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();

      if (myDataError) throw myDataError;
      if (!myData?.company_id) throw new Error('Company ID not found');

      // Get count of users in that company
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', myData.company_id);

      if (countError) throw countError;

      setEmployeeCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching employee count:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return { employeeCount, loading };
}
