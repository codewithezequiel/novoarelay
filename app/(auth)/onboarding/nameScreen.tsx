import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function NameScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');

          // 🚀 Redirect if already onboarded
          if (data.onboarding_completed) {
            console.log('Onboarding already completed. Redirecting...');
            router.replace('/'); // Navigate to home
          }
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  async function updateProfile({
    first_name,
    last_name,
  }: {
    first_name: string;
    last_name: string;
  }) {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error('No user on the session.');
      }

      const updates = {
        id: session.user.id,
        first_name,
        last_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw new Error('Update unsuccessful');

      console.log('Profile details updated successfully');

      // 🚀 Navigate away after successful onboarding
      router.replace('/(auth)/onboarding/profileScreen');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-black p-5">
        <View className="mb-10 w-full border-2 ">
          <Text className="text-center text-lg font-bold text-white">Create Account</Text>
        </View>
        <View className="w-full max-w-sm gap-4">
          <View className="gap-3">
            <Text className="text-lg font-bold text-white">First Name *</Text>
            <TextInput
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="none"
              placeholderTextColor="gray"
            />
          </View>

          <View className="gap-3">
            <Text className="text-lg font-bold text-white">Last Name *</Text>
            <TextInput
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="none"
              placeholderTextColor="gray"
            />
          </View>
          <Pressable
            className="flex items-center rounded-lg bg-green-600 py-3"
            disabled={loading}
            onPress={() => updateProfile({ first_name: firstName, last_name: lastName })}>
            <Text className="font-semibold text-white">Next</Text>
          </Pressable>
        </View>

        <View></View>
      </View>
    </>
  );
}
