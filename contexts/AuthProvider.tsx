import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  // Fetch profile details
  const fetchProfile = async (userId: string) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setIsOnboardingComplete(false); // Default to false on error
    } else {
      setIsOnboardingComplete(data?.onboarding_completed);
      console.log('Fetched onboarding_completed:', data?.onboarding_completed);
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsReady(true);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setIsOnboardingComplete(null); // Reset on sign out
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        isAuthenticated: !!session?.user,
        isOnboardingComplete,
        setIsOnboardingComplete,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
