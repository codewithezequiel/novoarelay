import { Stack } from 'expo-router';
import { useState } from 'react';
import { Image, TextInput, View, Text, Pressable } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function CreateReport() {
  const [companyName, setCompanyName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [dateIn, setDateIn] = useState('');

  async function uploadEvent() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { data: userProfileData, error: userProfileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user?.id)
      .single();

    const userCompanyId = userProfileData?.company_id;
    console.log(userProfileData?.company_id);

    if (authError) {
      console.error('Error getting authenticated user:', authError.message);
      return;
    }

    if (!user) {
      console.error('No authenticated user found.');
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          user_id: user.id, // ✅ Correctly passing authenticated user ID
          company_id: userCompanyId,
          company_name: companyName,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          description: tripDescription,
          date_initiated: dateIn, // Make sure this column exists in your database
        },
      ])
      .select();
    console.log(data);

    if (error) {
      console.error('Error inserting event:', error.message);
    } else {
      console.log('Event uploaded successfully:', data);
    }
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
          value={dateIn}
          onChangeText={setDateIn}
          placeholder="Date"
          className="rounded border-2 border-green-200 p-3"
        />
        <TextInput />
        <Pressable
          onPress={() => uploadEvent()}
          className="mx-5 mt-5 items-center rounded-md bg-red-400 p-3 px-5">
          <Text className="text-lg font-bold text-white">Publish Report</Text>
        </Pressable>
      </View>
    </>
  );
}
