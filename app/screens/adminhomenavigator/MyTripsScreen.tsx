import { View, FlatList } from 'react-native';
import TRListItem from '~/components/TRListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { NearbyEvent } from '~/types/db';
import { useAuth } from '~/contexts/AuthProvider';

export default function MyTripsScreen() {
  const [events, setEvents] = useState([]);
  const { session } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  async function fetchMyEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles(avatar_url, first_name, last_name)`)
      .eq('user_id', session.user.id);
    if (data) {
      setEvents(data);
    }
    console.log(error);
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
