import { Stack } from 'expo-router';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function EmployeeHome() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles(avatar_url, first_name, last_name)`);
    setEvents(data || []);
    console.log(error);
  }

  const isEmpty = events.length === 0;

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen
        options={{
          headerStyle: { height: 140, backgroundColor: 'black' },
        }}
      />

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-3 text-xl font-bold text-white">No Tow Jobs Yet</Text>
          <Text className="mb-6 text-center text-gray-400">
            Create your first trip to get started tracking your towing jobs!
          </Text>
          <TouchableOpacity
            className="rounded-full bg-indigo-600 px-6 py-3"
            onPress={() => router.push('/create')}>
            <Text className="font-semibold text-white">Create job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          className="bg-black p-6"
          data={events}
          renderItem={({ item }) => (
            <View>
              <TRListItem report={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}
