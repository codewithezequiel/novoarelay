import { Stack } from 'expo-router';
import { View, FlatList } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { NearbyEvent } from '~/types/db';

export default function EmployeeHome() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles(avatar_url, first_name, last_name)`);
    setEvents(data);
    console.log(error);
  }

  // async function fetchNearbyEvents() {
  //   const { data, error } = await supabase.rpc('nearby_events', {
  //     lat: 33.7986,
  //     long: -118.2358,
  //   });
  //   console.log(JSON.stringify(data, null, 2));
  //   console.log(error);
  //   if (data) {
  //     setEvents(data);
  //   }
  // }

  return (
    <>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      <FlatList
        className="bg-black"
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
