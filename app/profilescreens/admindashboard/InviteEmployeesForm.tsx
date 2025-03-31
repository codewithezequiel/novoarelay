import { View, Pressable, Text, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import { Stack } from 'expo-router';

export default function InviteDropdown() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { session } = useAuth();

  async function inviteEmployee() {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const { data: userAuthData } = await supabase.auth.getUser();
    console.log(userAuthData.user?.id);

    const { data } = await supabase
      .from('companies')
      .select('id')
      .eq('created_by', session.user.id)
      .single();

    console.log(data.id);

    try {
      const { error } = await supabase
        .from('invitations')
        .insert([{ email, company_id: data.id, token: 'helloWorld', role: 'employee' }]); // Adjust table name as needed

      if (error) {
        throw error;
      }

      Alert.alert('Success', `Invitation sent to ${email}`);
      setEmail(''); // Clear input after sending
      setDropdownOpen(false); // Close dropdown
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send invite');
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Invite',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'black' },
          headerBackTitle: 'Back',
        }}
      />
      <View className="flex-1 bg-black">
        {/* Invite Employee Button */}
        <Text className="my-10 text-center text-xl font-medium text-white">
          Have any employees? Send them an invite!{' '}
        </Text>
        <Pressable
          onPress={() => setDropdownOpen(!isDropdownOpen)}
          className="mx-5 rounded-lg bg-orange-400 p-3">
          <Text className="text-center text-lg text-white">Invite Employee</Text>
        </Pressable>

        {/* Collapsible Dropdown */}
        {isDropdownOpen && (
          <View className="mx-5 mt-3 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <TextInput
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Employee email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Pressable onPress={inviteEmployee} className="mt-3 rounded-lg bg-blue-500 p-3">
              <Text className="text-center text-lg text-white">Send Invite</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}
