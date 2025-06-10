import { Link, Redirect, router, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/contexts/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { View, Text, SafeAreaView } from 'react-native';
import NovoaRelayHomeLogo from '~/components/NovoaRelayHome';

export default function TabLayout() {
  const { isAuthenticated, user, isOnboardingComplete } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data) {
        setRole(data.role);
      }
      setLoading(false);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', sessionData);
    }

    console.log('User', user, isAuthenticated);

    fetchUserRole();
  }, [user]);

  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/employees/login'} />;
  }

  if (isAuthenticated) {
    if (isOnboardingComplete === false) {
      console.log('Redirecting to onboarding');
      return <Redirect href={'/(auth)/onboarding/nameScreen'} />;
    }
  }

  if (loading) {
    console.log('loading profile');

    console.log('Onboarding Status:', isOnboardingComplete);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarStyle: { backgroundColor: 'black', borderColor: 'black' },
      }}>
      {/* Admin / Employee specific content for the index screen */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: '',
          header: () => (
            <SafeAreaView className="bg-black">
              <NovoaRelayHomeLogo />
            </SafeAreaView>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
          headerStyle: { backgroundColor: 'black' }, // Makes header black
          headerTintColor: 'white', // Makes text/icons white
          headerShown: false,
        }}
        initialParams={{ role }} // Pass role as a parameter to the index screen
      />

      {/* The 'create' tab (unchanged) */}
      <Tabs.Screen
        name="create"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          headerStyle: { backgroundColor: 'black' }, // Makes header black
          headerTintColor: 'white', // Makes text/icons white
        }}
      />

      {/* The 'profile' tab (unchanged) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerStyle: { backgroundColor: 'black' }, // Makes header black
          headerTintColor: 'white', // Makes text/icons white
        }}
      />
    </Tabs>
  );
}
