import { Stack } from 'expo-router';
import { View, FlatList } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);
  async function fetchEvents() {
    const { data, error } = await supabase.from('events').select(`*, profiles(avatar_url)`);
    setEvents(data);
    console.log(error);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View>
            <TRListItem report={item} />
          </View>
        )}
      />
    </>
  );
}
