import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '~/utils/supabase';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const fetchProfile = async (userId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsOnboardingComplete(false);
      } else {
        setIsOnboardingComplete(data?.onboarding_completed ?? false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsOnboardingComplete(false);
    } finally {
      setIsProfileLoaded(true);
    }
  };

  useEffect(() => {
    // Initial fetch of session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setIsProfileLoaded(false);
        fetchProfile(session.user.id);
      } else {
        setIsProfileLoaded(true); // no user means profile is loaded (empty)
      }
    });

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        setIsProfileLoaded(false);
        fetchProfile(session.user.id);
      } else {
        setIsOnboardingComplete(false);
        setIsProfileLoaded(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isProfileLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        isAuthenticated: !!session?.user,
        isOnboardingComplete,
        setIsOnboardingComplete,
        fetchProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
