import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function CreateEvent() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [clientName, setClientName] = useState('');
  const [truckModel, setTruckModel] = useState('');
  const [status, setStatus] = useState('pending');
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();

  useEffect(() => {
    const fetchTrucks = async () => {
      if (!session?.user) return;

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          return;
        }

        const companyId = profile?.company_id;

        const { data: truckData, error: truckError } = await supabase
          .from('trucks')
          .select('id, model')
          .eq('company_id', companyId);

        if (truckError) {
          console.error('Error fetching trucks:', truckError.message);
          return;
        }

        setTrucks(truckData || []);
      } catch (err) {
        console.error('Error fetching trucks:', err);
      }
    };

    fetchTrucks();
  }, [session]);

  const createEvent = async () => {
    setLoading(true);

    if (!clientName.trim()) {
      Alert.alert('Error', 'Please provide a valid client name.');
      setLoading(false);
      return;
    }

    try {
      const userId = session?.user?.id; // Get logged-in user ID

      if (!userId) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false);
        return;
      }

      // Fetch company_id from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        Alert.alert('Error', 'Could not fetch user profile.');
        setLoading(false);
        return;
      }

      const companyId = profile?.company_id;

      if (!companyId) {
        Alert.alert('Error', 'Company ID not found.');
        setLoading(false);
        return;
      }

      // Insert client without checking if it exists
      const { data: newClient, error: newClientError } = await supabase
        .from('clients')
        .insert([{ name: clientName.trim(), company_id: companyId }])
        .select()
        .single();

      if (newClientError) {
        console.error('Error inserting client:', newClientError.message);
        Alert.alert('Error', 'Could not insert client.');
        setLoading(false);
        return;
      }

      const clientId = newClient.id;

      // Insert event with user ID and company ID
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert([
          {
            user_id: userId, // Assign user ID
            company_id: companyId, // Assign company ID
            client_id: clientId,
            pickup_location: pickupLocation.trim(),
            dropoff_location: dropoffLocation.trim(),
            status: status,
          },
        ])
        .select()
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError.message);
        Alert.alert('Error', 'Could not create event.');
        setLoading(false);
        return;
      } else {
        console.log('Event created with ID:', event.id);
        Alert.alert('Success', 'Event created successfully!');

        // Reset fields
        setPickupLocation('');
        setDropoffLocation('');
        setClientName('');
        setTruckModel('');
        setStatus('pending');

        router.push(`/towingreport/${event.id}`);
      }

      console.log('Event created with ID:', event.id);
      Alert.alert('Success', 'Event created successfully!');

      // Insert data into truck_locations table
      if (truckModel) {
        const { data: truckData, error: truckError } = await supabase
          .from('trucks')
          .select('id')
          .eq('model', truckModel)
          .eq('company_id', companyId)
          .single();

        if (truckError) {
          console.error('Error fetching truck:', truckError.message);
          Alert.alert('Error', 'Could not fetch truck data.');
          setLoading(false);
          return;
        }

        const truckId = truckData?.id;

        if (truckId) {
          const { data: truckLocationData, error: truckLocationError } = await supabase
            .from('truck_locations')
            .insert([
              {
                truck_id: truckId,
                profile_id: userId, // Profile ID from the logged-in user
                location_source: 'phone', // Placeholder for now
                event_id: event.id, // Associate with the created event
              },
            ])
            .select()
            .single();

          if (truckLocationError) {
            console.error('Error inserting truck location:', truckLocationError.message);
            Alert.alert('Error', 'Could not insert truck location.');
          } else {
            console.log('Truck location inserted with ID:', truckLocationData.id);
          }
        } else {
          console.error('No truck found with model:', truckModel);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error.message);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="p-5">
      <Text className="mb-2 text-lg font-bold">Trip Pickup Location</Text>
      <TextInput
        placeholder="Enter pickup location"
        value={pickupLocation}
        onChangeText={setPickupLocation}
        className="mb-4 rounded border border-gray-300 p-3"
      />

      <Text className="mb-2 text-lg font-bold">Trip Dropoff Location</Text>
      <TextInput
        placeholder="Enter dropoff location"
        value={dropoffLocation}
        onChangeText={setDropoffLocation}
        className="mb-4 rounded border border-gray-300 p-3"
      />

      <Text className="mb-2 text-lg font-bold">Client Name</Text>
      <TextInput
        placeholder="Enter client name"
        value={clientName}
        onChangeText={setClientName}
        className="mb-4 rounded border border-gray-300 p-3"
      />

      <Text className="mb-2 text-lg font-bold">Select Your Truck Model</Text>
      <Picker selectedValue={truckModel} onValueChange={setTruckModel} className="mb-4">
        <Picker.Item label="Select a truck model" value="" />
        {trucks.map((truck) => (
          <Picker.Item key={truck.id} label={truck.model} value={truck.model} />
        ))}
      </Picker>

      <Text className="mb-2 text-lg font-bold">Trip Status</Text>
      <Picker selectedValue={status} onValueChange={setStatus} className="mb-4">
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="in_progress" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

      <Pressable
        onPress={createEvent}
        disabled={loading}
        className={`mt-5 rounded bg-blue-500 p-3 ${loading ? 'opacity-50' : ''}`}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white">Create Event</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
