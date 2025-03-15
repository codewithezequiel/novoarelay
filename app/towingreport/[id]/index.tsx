import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Button, Alert } from 'react-native';
import SupaAvatarImage from '~/components/SupaAvatarImage';
import SupaImage from '~/components/SupaImage';
import { Event } from '~/types/db';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';

export default function TowReportPage() {
  const { session } = useAuth();
  const { id } = useLocalSearchParams();
  const [role, setRole] = useState('');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
    checkUserRole();
  }, [session]);

  async function checkUserRole() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user?.id)
        .single();
      if (data?.role) {
        setRole(data.role);
        console.log(data.role);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchEvent() {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select(`*, profiles:profiles(avatar_url, username)`)
      .eq('id', id)
      .single();
    setEvent(data);
    // console.log(data);

    setLoading(false);
  }

  async function deleteTowReport() {
    if (!event?.id) {
      console.log('No event ID found.');
      return;
    }

    // Show confirmation alert before deleting
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this tow report? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('events').delete().eq('id', event.id);

              if (error) {
                console.log('Error deleting event:', error.message);
                Alert.alert('Error', 'Failed to delete tow report. Please try again.');
                return;
              }

              Alert.alert('Success', 'Tow Report deleted successfully');
              try {
                router.back();
              } catch (navError) {
                console.log('Navigation error:', navError);
              }
            } catch (error) {
              console.log('Unexpected error:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ]
    );
  }

  const employeeImage = event?.profiles?.avatar_url;
  const employeeUsername = event?.profiles?.username;
  // console.log(employeeImage);

  // Note: Skeleton loading activity indicator would be better
  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found.</Text>;
  }

  return (
    <View className="mx-auto max-w-screen-sm flex-1 gap-3 bg-white p-5">
      <ScrollView>
        {/* Header */}
        <Stack.Screen
          options={{
            title: 'Tow Report',
            headerBackTitle: 'Back',
            headerTintColor: 'black',
          }}
        />

        {/* Main Image */}
        <SupaImage path={event.image_url} className="mb-5 aspect-video w-full rounded-lg" />

        {/* Report Title */}
        <Text className="mb-3 text-3xl font-bold text-gray-800">
          {`${employeeUsername}'s Towing Report`}
        </Text>

        {/* Status Section */}
        <View className="mb-5 flex-row items-center">
          <Text
            className={`text-lg font-semibold ${
              event?.status === 'in_progress' ? 'text-orange-600' : 'text-green-600'
            }`}>
            {event?.status === 'in_progress' ? '🚧 Towing in Progress' : '✅ Tow Completed'}
          </Text>
        </View>

        {/* Description */}
        <Text className="mb-3 text-lg text-gray-700" numberOfLines={3}>
          {event?.description || 'No description available.'}
        </Text>

        {/* Pickup & Dropoff Locations */}
        <View className="mb-5">
          <Text className="text-lg font-semibold text-gray-800">
            📍 Pickup: {event?.pickup_location || 'Location not provided'}
          </Text>
          <Text className="mt-1 text-lg font-semibold text-gray-800">
            🚚 Dropoff: {event?.dropoff_location || 'Location not provided'}
          </Text>
        </View>

        {/* Employee Info */}
        <View className="mb-5 flex-row items-center">
          <SupaAvatarImage path={employeeImage} className="h-20 w-20 rounded-full" />
          <View>
            <Text className="text-lg font-semibold">{employeeUsername || 'Unknown Employee'}</Text>
            <Text className="text-sm text-gray-500">
              Live Location: {event?.current_location || 'Location Unknown'}
            </Text>
          </View>
        </View>
        {role === 'admin' ? (
          <Pressable
            onPress={() => {
              deleteTowReport();
            }}
            className="mt-4 w-full rounded-xl bg-red-600 p-4 shadow-lg transition-all duration-300 hover:bg-red-700 active:scale-95">
            <Text className="text-center text-lg font-semibold text-white">Delete Tow Report</Text>
          </Pressable>
        ) : (
          <Text>Employee</Text>
        )}
        <Link
          href={`/towingreport/${event.id}/posttripdetails`}
          className="mt-4 w-full rounded-xl bg-blue-500 p-4 shadow-lg transition-all duration-300 hover:bg-blue-700 active:scale-95">
          <Text className="lext-lg text-center font-semibold text-white">Update Trip Details</Text>
        </Link>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-10 left-0 right-0 border-t-2 border-gray-400 p-4">
        <Pressable onPress={() => console.log('Hello')} className="mt-2 rounded-xl bg-red-400 p-3">
          <Text className="text-center text-lg font-bold text-white">
            Call {event?.employee_full_name}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
