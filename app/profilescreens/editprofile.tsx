import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Avatar from '~/components/Avatar';

import SupaAvatarImage from '~/components/SupaAvatarImage';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function EditProfileDetails() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [containerDropdown, setContainerDropdown] = useState(false);
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    first_name,
    last_name,
    avatar_url,
  }: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        first_name,
        last_name,
        avatar_url,
        updated_at: new Date(),
      };

      router.back();

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
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
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerTintColor: 'white',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
        }}
      />
      <ScrollView className="bg-black">
        <TouchableWithoutFeedback onPress={() => setContainerDropdown(false)}>
          <View className="flex-1 gap-3 p-5">
            <View className="mt-20 items-center">
              <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                  updateProfile({
                    first_name: firstName,
                    last_name: lastName,
                    avatar_url: url,
                  });
                }}
              />
              <View className="w-full items-center  py-5">
                <Text className="text-4xl font-bold text-white">{firstName}</Text>
              </View>
            </View>

            <View className="mx-5 gap-3"></View>

            <View className="mx-5 gap-3">
              <Text className="text-lg font-bold text-white">First Name</Text>
              <TextInput
                className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
                placeholderTextColor="gray"
                maxLength={10}
              />
            </View>
            <View className="mx-5 gap-3">
              <Text className="text-lg font-bold text-white">Last Name</Text>
              <TextInput
                className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
                placeholderTextColor="gray"
              />
            </View>

            <View className="mx-5 gap-3">
              <Text className="text-lg font-bold text-white">Email</Text>

              <TextInput
                className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
                placeholder="Email"
                value={session.user.email}
                editable={false}
                autoCapitalize="none"
                placeholderTextColor="gray"
              />
            </View>

            <Pressable
              disabled={loading}
              onPress={() =>
                updateProfile({
                  first_name: firstName,
                  last_name: lastName,
                  avatar_url: avatarUrl,
                })
              }
              className="mt-5 w-full rounded-xl bg-indigo-300 p-4 px-5 shadow-lg transition-all duration-300 hover:bg-indigo-700 active:scale-95">
              <Text className="text-center text-lg font-semibold text-white">Update Profile</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
}
