import { Stack } from 'expo-router';
import { View, FlatList, Image, Text } from 'react-native';
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
    <View className="flex-1  bg-black">
      <Stack.Screen
        options={{
          headerStyle: { height: 140, backgroundColor: 'black' },
        }}
      />
      <FlatList
        className="bg-black p-6"
        data={events}
        renderItem={({ item }) => (
          <View>
            <TRListItem report={item} />
          </View>
        )}
      />
    </View>
  );
}
