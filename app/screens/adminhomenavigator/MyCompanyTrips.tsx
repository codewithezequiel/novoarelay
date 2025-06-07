import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function MyCompanyTripsScreen() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles(avatar_url, first_name, last_name)`);
    if (data) setEvents(data);
    console.log(error);
  }

  if (events.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-3 text-xl font-bold text-white">No Company Trips Yet</Text>
        <Text className="mb-6 text-center text-gray-400">
          Once someone creates a tow job, it will appear here.
        </Text>
        <TouchableOpacity
          className="rounded-full bg-indigo-600 px-6 py-3"
          onPress={() => router.push('/create')}>
          <Text className="font-semibold text-white">Create Job</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-black p-5"
      data={events}
      renderItem={({ item }) => (
        <View>
          <TRListItem report={item} />
        </View>
      )}
    />
  );
}
