import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { supabase } from '~/utils/supabase'; // adjust this path as needed

export default function MaintenanceRequest() {
  const [requestTitle, setRequestTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage('');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Alert.alert('Error', 'You must be logged in to submit a request.');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles') // or 'employees' if applicable
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      Alert.alert('Error', 'Could not fetch company info.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('maintenancerequests').insert([
      {
        request_title: requestTitle,
        description,
        created_by: user.id,
        company_id: profile.company_id,
      },
    ]);

    if (insertError) {
      Alert.alert('Error', 'Failed to submit request.');
    } else {
      setSuccessMessage('Request submitted successfully!');
      setRequestTitle('');
      setDescription('');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="w-full max-w-md rounded-lg bg-zinc-900 px-4 py-6">
          <Text className="mb-6 text-center text-2xl font-bold text-white">
            Submit Maintenance Request
          </Text>

          <TextInput
            className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-white dark:border-gray-700 dark:text-white"
            placeholder="Request Title"
            placeholderTextColor="#888"
            value={requestTitle}
            onChangeText={setRequestTitle}
          />

          <TextInput
            className="mb-4 h-32 rounded-xl border border-gray-300 px-4 py-3 text-white dark:border-gray-700 dark:text-white"
            placeholder="Describe the issue..."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            className="mb-4 items-center rounded-xl bg-blue-600 py-3"
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Submit</Text>
            )}
          </Pressable>

          {successMessage ? (
            <Text className="mt-2 text-center text-green-600">{successMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
