import { Link, Redirect, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/contexts/AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { View, Text, Image } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated, user } = useAuth();
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
    }

    fetchUserRole();
  }, [user]);

  if (!isAuthenticated) {
    return <Redirect href={'/employees/login'} />;
  }

  if (loading) {
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
          headerTitle: () => (
            <Image
              source={require('~/assets/novoarelay.jpg')}
              className="mt-5 h-24 w-24"
              resizeMode="contain"
            />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
          headerStyle: { backgroundColor: 'black' }, // Makes header black
          headerTintColor: 'white', // Makes text/icons white
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
