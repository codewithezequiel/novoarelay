import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AdminClientListItem from '~/components/AdminClientListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function AdminClientList() {
  const { session } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyClients();
  }, []);

  async function fetchCompanyClients() {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();

      if (userError) throw userError;

      const { data: companyClients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', userData?.company_id);

      if (clientsError) throw clientsError;

      setClients(companyClients || []);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Clients',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerBackTitle: 'Back',
        }}
      />
      <View className="flex-1 bg-black p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#c8b6ff" />
        ) : clients.length > 0 ? (
          <FlatList
            className="p-5"
            data={clients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AdminClientListItem client={item} />}
          />
        ) : (
          <Text className="text-center text-white">No clients found.</Text>
        )}
      </View>
    </>
  );
}
