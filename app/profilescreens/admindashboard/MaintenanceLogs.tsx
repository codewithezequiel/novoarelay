import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function MaintenanceLogs() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Alert.alert('Error', 'You must be logged in.');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles') // or 'employees'
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      Alert.alert('Error', 'Could not fetch admin profile.');
      setLoading(false);
      return;
    }

    const { data, error: logsError } = await supabase
      .from('maintenancerequests')
      .select('*')
      .eq('company_id', profile.company_id)
      .order('created_at', { ascending: false });

    if (logsError) {
      Alert.alert('Error', 'Could not fetch maintenance logs.');
    } else {
      setRequests(data);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="mb-3 rounded-lg bg-slate-700 p-4">
      <Text className="text-xl font-bold text-white">{item.request_title}</Text>
      <Text className="text-md mt-1 text-white">{item.description}</Text>
      <Text className="text-md mt-2 text-gray-200">
        Submitted: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <View className="flex-1 items-center  bg-zinc-900 px-4 py-6 ">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="max-w-lg">
          <Text className="mb-4 text-center text-2xl font-bold text-white dark:text-white">
            Maintenance Logs
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : requests.length === 0 ? (
            <Text className="text-center text-gray-500 dark:text-gray-400">
              No maintenance requests found.
            </Text>
          ) : (
            <FlatList
              className="p-2"
              data={requests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 24, height: '100%' }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
