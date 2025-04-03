import { Stack } from 'expo-router';
import { View, FlatList, Image } from 'react-native';
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
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="mb-2 ">
              <Image
                source={require('~/assets/novoarelay.jpg')}
                className="h-24 w-24"
                resizeMode="contain"
              />
            </View>
          ),
          headerStyle: { height: 140, backgroundColor: 'black' },
        }}
      />
      <FlatList
        className="bg-black p-5"
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
