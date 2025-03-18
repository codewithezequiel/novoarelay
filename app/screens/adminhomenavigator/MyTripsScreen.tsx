import { View, FlatList } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { NearbyEvent } from '~/types/db';

export default function MyTripsScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles(avatar_url, username)`);
    if (data) {
      setEvents(data);
    }
    console.log(error);
  }

  return (
    <FlatList
      className="bg-black"
      data={events}
      renderItem={({ item }) => (
        <View>
          <TRListItem report={item} />
        </View>
      )}
    />
  );
}
