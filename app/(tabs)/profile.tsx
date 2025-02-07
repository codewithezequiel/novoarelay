import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function Account() {
  const [username, setUsername] = useState('');
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);

  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website }: { username: string; website: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,

        updated_at: new Date(),
      };

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
    <View>
      <Stack.Screen options={{ title: 'Profile' }} />
      <TextInput
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        placeholder="website"
        value={website}
        onChangeText={setWebsite}
        autoCapitalize="none"
      />

      <TextInput
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        placeholder="email-address"
        value={session.user.email}
        editable={false}
        autoCapitalize="none"
      />
      <View>
        <Pressable
          disabled={loading}
          onPress={() => updateProfile({ username, website })}
          className="mx-5 mt-10 items-center rounded-md bg-indigo-400 p-3 px-5">
          <Text className="text-lg  font-bold text-white">Update Profile</Text>
        </Pressable>

        <Pressable
          disabled={loading}
          onPress={() => supabase.auth.signOut()}
          className="mx-5 mt-5 items-center rounded-md bg-red-400 p-3 px-5">
          <Text className="text-lg  font-bold text-white">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
