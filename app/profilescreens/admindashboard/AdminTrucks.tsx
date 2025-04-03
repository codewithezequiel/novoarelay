import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import TruckListItem from '~/components/AdminTruckListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function AdminTruckList() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    fetchTrucks();
  }, []);

  async function fetchTrucks() {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();

      if (userError) throw new Error('Error retrieving company ID');

      const { data: userTrucks, error: truckError } = await supabase
        .from('trucks')
        .select('*')
        .eq('company_id', userData?.company_id);

      if (truckError) throw new Error('Error retrieving trucks');

      setTrucks(userTrucks || []);
    } catch (error) {
      console.error('Error retrieving trucks:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Trucks',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />
      <View className="h-full bg-black p-5">
        {loading ? (
          <ActivityIndicator size="large" color="#c8b6ff" />
        ) : trucks.length > 0 ? (
          <FlatList
            className="p-5"
            data={trucks}
            keyExtractor={(item) => item.id.toString()} // Ensuring each key is unique
            renderItem={({ item }) => <TruckListItem truck={item} />}
          />
        ) : (
          <Text className="text-gray-400">No trucks found.</Text>
        )}
      </View>
    </>
  );
}
