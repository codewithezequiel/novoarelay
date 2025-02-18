import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Image, TextInput, View, Text, Pressable, Alert } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function CreateReport() {
  const [companyName, setCompanyName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [dateIn, setDateIn] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  async function uploadEvent() {
    if (!session?.user) {
      console.error('No authenticated user found.');
      return;
    }

    setLoading(true);

    const { data: userProfileData, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle(); // ✅ Prevent error if no profile is found

    if (userProfileError) {
      console.error('Error fetching user profile:', userProfileError.message);
      Alert.alert('Error', 'Could not retrieve user profile.');
      setLoading(false);
      return;
    }

    if (!userProfileData) {
      Alert.alert('Error', 'User profile not found.');
      setLoading(false);
      return;
    }

    const userCompanyId = userProfileData.company_id;
    const employeeFullName = userProfileData.username;

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          user_id: session.user.id,
          company_id: userCompanyId,
          company_name: companyName.trim(),
          pickup_location: pickupLocation.trim(),
          dropoff_location: dropoffLocation.trim(),
          description: tripDescription.trim(),
          date_initiated: new Date(dateIn).toISOString(),
          employee_full_name: employeeFullName,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      Alert.alert('Upload Failed', error.message);
      console.error('Error inserting event:', error.message);
    } else {
      console.log('Event uploaded successfully:', data);
      Alert.alert('Upload Successful!', 'Your report has been published.');

      setCompanyName('');
      setPickupLocation('');
      setDropoffLocation('');
      setTripDescription('');
      setDateIn(new Date().toISOString()); // Reset to current date
      router.push(`/towingreport/${data.id}`);
    }

    setLoading(false);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Upload' }} />
      <View className="flex-1 gap-5 bg-white px-5 ">
        <Image />
        <TextInput
          onChangeText={setCompanyName}
          value={companyName}
          placeholder="Company Name"
          className="rounded border-2 border-green-200 p-3"
        />
        <TextInput
          onChangeText={setPickupLocation}
          value={pickupLocation}
          placeholder="Pick Up Location"
          className="rounded border-2 border-green-200  p-3"
        />
        <TextInput
          onChangeText={setDropoffLocation}
          value={dropoffLocation}
          placeholder="Drop Off Location"
          className="rounded border-2 border-green-200 p-3"
        />
        <TextInput
          onChangeText={setTripDescription}
          value={tripDescription}
          placeholder="Description"
          numberOfLines={3}
          multiline
          className="min-h-48 rounded border-2 border-green-200  p-3"
        />
        <TextInput
          editable={false}
          value={dateIn}
          onChangeText={setDateIn}
          placeholder="Date"
          className="rounded border-2 border-green-200 p-3"
        />
        <TextInput />
        <Pressable
          disabled={loading}
          onPress={() => uploadEvent()}
          className="mx-5 mt-5 items-center rounded-md bg-red-400 p-3 px-5">
          <Text className="text-lg font-bold text-white">Publish Report</Text>
        </Pressable>
      </View>
    </>
  );
}
