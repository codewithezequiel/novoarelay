import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="flex-1 bg-black"
            contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 items-center gap-5 p-5">
              {/* Avatar and Name */}
              <View className="mt-10 items-center">
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
                <Text className="mt-5 text-4xl font-bold text-white">{firstName}</Text>
              </View>

              {/* Form Inputs */}
              <View className="w-full max-w-lg gap-5">
                {/* First Name */}
                <View>
                  <Text className="mb-1 text-lg font-bold text-white">First Name</Text>
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

                {/* Last Name */}
                <View>
                  <Text className="mb-1 text-lg font-bold text-white">Last Name</Text>
                  <TextInput
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                </View>

                {/* Email (read-only) */}
                <View>
                  <Text className="mb-1 text-lg font-bold text-white">Email</Text>
                  <TextInput
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
                    placeholder="Email"
                    value={session.user.email}
                    editable={false}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                </View>

                {/* Update Button */}
                <Pressable
                  disabled={loading}
                  onPress={() =>
                    updateProfile({
                      first_name: firstName,
                      last_name: lastName,
                      avatar_url: avatarUrl,
                    })
                  }
                  className="mt-3 w-full rounded-xl bg-indigo-500 p-4 shadow-lg active:scale-95 disabled:bg-gray-400">
                  <Text className="text-center text-lg font-semibold text-white">
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
