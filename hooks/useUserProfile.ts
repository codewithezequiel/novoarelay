import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export function useUserProfile() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) {
      getProfile();
      checksUserRoleInDB();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name, avatar_url`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const checksUserRoleInDB = async () => {
    try {
      if (!session?.user) throw new Error('No user in the session');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`role`)
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data?.role) {
        setRole(data.role);
      }
    } catch (err) {
      Alert.alert(err instanceof Error ? err.message : 'Error fetching profile');
    }
  };

  return {
    loading,
    firstName,
    avatarUrl,
    role,
  };
}
