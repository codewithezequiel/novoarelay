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

export default function PostTripForm({ eventId }) {
  const [clientVehicleModel, setClientVehicleModel] = useState('');
  const [clientVehicleVinNumb, setClientVehicleVinNum] = useState('');
  const [clientVehicleLP, setClientVehicleLP] = useState('');
  const [clientVehicleNum, setClientVehicleNum] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();

  useEffect(() => {}, [session]);

  const confirmEvent = async () => {
    setLoading(true);
    console.log(eventId);

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

      // ✅ Correctly update the existing event instead of inserting a new one
      const { error: eventError } = await supabase
        .from('events')
        .update({
          client_truck_model: clientVehicleModel || null, // Allow empty values
          client_truck_vin: clientVehicleVinNumb || null,
          client_truck_license_plate: clientVehicleLP || null,
          client_truck_number: clientVehicleNum || null,
          status: status,
        })
        .eq('id', eventId); // ✅ Correct filter for UPDATE

      if (eventError) {
        console.error('Error updating event:', eventError.message);
        Alert.alert('Error', 'Could not update event.');
        setLoading(false);
        return;
      }

      console.log('Event updated successfully!');
      Alert.alert('Success', 'Event updated successfully!');

      // Reset fields
      setClientVehicleModel('');
      setClientVehicleVinNum('');
      setClientVehicleLP('');
      setClientVehicleNum('');
      setStatus('pending');

      router.push(`/`);
    } catch (error) {
      console.log('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="bg-black p-5">
      <View className="mb-6">
        <Text className="mb-4  text-2xl font-extrabold text-white">Post Trip Details</Text>
      </View>

      {/* Client Vehicle Model */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">Client Vehicle Model</Text>
        <TextInput
          placeholder="Enter client vehicle model"
          placeholderTextColor="#A1A1AA"
          value={clientVehicleModel}
          onChangeText={setClientVehicleModel}
          className="mt-2 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white"
        />
      </View>

      {/* Client Vehicle VIN */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">Client Vehicle Vin Number</Text>
        <TextInput
          placeholder="Enter client vin number"
          placeholderTextColor="#A1A1AA"
          value={clientVehicleVinNumb}
          onChangeText={setClientVehicleVinNum}
          className="mt-2 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white"
        />
      </View>

      {/* Client Vehicle License Plate */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">Client Vehicle License Plate</Text>
        <TextInput
          placeholder="Enter client license plate number"
          placeholderTextColor="#A1A1AA"
          value={clientVehicleLP}
          onChangeText={setClientVehicleLP}
          className="mt-2 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white"
        />
      </View>

      {/* Client Vehicle Number */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">Client Vehicle Number</Text>
        <TextInput
          placeholder="Enter client truck number"
          placeholderTextColor="#A1A1AA"
          value={clientVehicleNum}
          onChangeText={setClientVehicleNum}
          className="mt-2 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white"
        />
      </View>

      {/* Trip Status */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">Trip Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={setStatus}
          className="mt-2 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white">
          <Picker.Item color="white" label="In Progress" value="in_progress" />
          <Picker.Item color="white" label="Completed" value="completed" />
        </Picker>
      </View>

      {/* Confirm Button */}
      <Pressable
        onPress={confirmEvent}
        disabled={loading}
        className={`mt-5 rounded-lg bg-blue-600 p-4 ${loading ? 'opacity-50' : ''}`}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center font-semibold text-white">Confirm Event</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
