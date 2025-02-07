import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  // executes when we mount the provider
  // we get the session, and based on the session we are setting it in state
  // to have access to that data (user info)

  // when user logs out, the method will receive that event and set the session w new details
  // !!session?.user -> if there is a user !! means its true, if user is undefined !! means false.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user, isAuthenticated: !!session?.user }}>
      {children}
    </AuthContext.Provider>
  );
}

// To consume the data, we use a hook
export const useAuth = () => useContext(AuthContext);
