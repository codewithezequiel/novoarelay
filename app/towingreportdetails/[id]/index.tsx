import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Button, Alert } from 'react-native';
import SupaAvatarImage from '~/components/SupaAvatarImage';
import SupaImage from '~/components/SupaImage';
import { Event } from '~/types/db';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import Ionicons from '@expo/vector-icons/Ionicons';

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
      .select(`*, profiles:profiles(avatar_url, first_name, last_name)`)
      .eq('id', id)
      .single();
    setEvent(data);
    setLoading(false);
  }

  async function deleteTowReport() {
    if (!event?.id) {
      console.log('No event ID found.');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this tow report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
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
  const employeeFirstName = event?.profiles?.first_name;
  const employeeLastName = event?.profiles?.last_name;

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found.</Text>;
  }

  return (
    <View className="max-w-screen-sm flex-1 bg-black p-6 pb-10 text-white">
      <ScrollView className=" p-5 pb-20">
        <Stack.Screen
          options={{
            title: 'Tow Report',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: 'black' }, // Makes header black
            headerTintColor: 'white', // Makes text/icons white
          }}
        />

        {/* Main Image */}
        {/* <SupaImage path={event.image_url} className="mb-6 aspect-video w-full rounded-lg" /> */}

        {/* Report Title */}
        <Text className="mb-4 text-center text-4xl font-bold text-white">
          {`${employeeFirstName}'s Towing Report`}
        </Text>

        <View className="mb-4 border-b border-gray-700 pb-2" />

        {/* Status Section */}
        <View className="mb-6 flex-row items-center">
          <Text
            className={`text-xl font-bold ${
              event?.status === 'in_progress' ? 'text-orange-400' : 'text-green-400'
            }`}>
            {event?.status === 'in_progress' ? '🚧 Towing in Progress' : '✅ Tow Completed'}
          </Text>
        </View>

        {/* Trip Date */}
        <View className="mb-1 rounded-lg border border-white bg-zinc-800 p-6 shadow-lg">
          <View className="flex-row gap-5">
            <Ionicons name="time-outline" size={28} color="#6366f1" />
            <Text className="mb-4 text-xl font-semibold text-white">Report</Text>
          </View>
          <Text className="mb-4 text-lg text-gray-300">
            {event?.created_at || 'No description available.'}
          </Text>
        </View>

        {/* Client Details */}
        <View className="mb-1 rounded-lg border border-white bg-zinc-800 p-6 shadow-lg">
          <View className="flex-row gap-5">
            <Ionicons name="newspaper-outline" size={28} color="#6366f1" />
            <Text className="mb-4 text-xl font-semibold text-white">Client Details</Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium text-gray-300">Truck Model</Text>
              <Text className="text-lg text-white">
                {event.client_truck_model || 'Not provided'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium text-gray-300">VIN:</Text>
              <Text className="text-lg text-white">{event.client_truck_vin || 'Not provided'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium text-gray-300">Truck Number:</Text>
              <Text className="text-lg text-white">
                {event.client_truck_number || 'Not provided'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium text-gray-300">License Plate:</Text>
              <Text className="text-lg text-white">
                {event.client_truck_license_plate || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-1 rounded-lg border border-white bg-zinc-800 p-6 shadow-lg">
          <View className="flex-row gap-5">
            <Ionicons name="pencil-outline" size={28} color="#6366f1" />
            <Text className="mb-4 text-xl font-semibold text-white">Description</Text>
          </View>
          <Text className="mb-4 text-lg text-gray-300" numberOfLines={3}>
            {event?.description || 'No description available.'}
          </Text>
        </View>

        {/* Pickup & Dropoff Locations */}
        <View className="mb-1 rounded-lg border border-white bg-zinc-800 p-6 shadow-lg">
          <View className="flex-row gap-5">
            <Ionicons name="location-outline" size={28} color="#6366f1" />
            <Text className="mb-4 text-xl font-semibold text-white">Locations</Text>
          </View>
          <Text className="text-lg font-semibold text-gray-300">
            📍 Pickup: {event?.pickup_location || 'Location not provided'}
          </Text>
          <Text className="mt-2 text-lg font-semibold text-gray-300">
            🚚 Dropoff: {event?.dropoff_location || 'Location not provided'}
          </Text>
        </View>

        {/* Employee Info */}
        <View className="my-6 flex-row items-center">
          <SupaAvatarImage path={employeeImage} className="mr-5 h-24 w-24 rounded-full" />
          <View className="align-middle">
            <Text className="text-2xl font-semibold text-white">
              {employeeFirstName && employeeLastName
                ? `${employeeFirstName} ${employeeLastName}`
                : 'Unknown Employee'}
            </Text>
            <Text className="text-lg text-gray-400">
              Live Location: {event?.current_location || 'Location Unknown'}
            </Text>
          </View>
        </View>

        {/* Update Trip Details Link */}
        <Link
          href={`/towingreportdetails/${event.id}/posttripdetails`}
          className="mt-6 rounded-xl bg-blue-600 p-5 shadow-lg transition-all duration-300 hover:bg-blue-700 active:scale-95">
          <Text className="text-center text-xl font-semibold text-white">Update Trip Details</Text>
        </Link>

        {/* Delete Button (for admins) */}
        {role === 'admin' && (
          <Pressable
            onPress={() => deleteTowReport()}
            className="my-6 rounded-xl bg-red-600 p-5 shadow-lg transition-all duration-300 hover:bg-red-700 active:scale-95">
            <Text className="text-center text-xl font-semibold text-white">Delete Tow Report</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
