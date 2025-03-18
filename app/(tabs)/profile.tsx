import { Stack } from 'expo-router';
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
import AdminDashboard from '~/components/AdminDashboard';
import Avatar from '~/components/Avatar';
import EmployeeDashboard from '~/components/EmployeeDashboard';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function Account() {
  const [username, setUsername] = useState('');
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [containerDropdown, setContainerDropdown] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) {
      getProfile();
      checksUserRoleInDB();
    }
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

  async function checksUserRoleInDB() {
    try {
      if (!session.user) throw new Error('No user in the session');
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`role`)
        .eq('id', session.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data?.role) setRole(data.role);
    } catch (err) {
      Alert.alert(err instanceof Error ? err.message : 'Error fetching profile');
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
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
    <ScrollView className="bg-black">
      <TouchableWithoutFeedback onPress={() => setContainerDropdown(false)}>
        <View className="flex-1 gap-3 p-5">
          <View className="mt-20 items-center border-2 border-yellow-300">
            <Avatar
              size={200}
              url={avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url);
                updateProfile({ username, website, avatar_url: url });
              }}
            />
          </View>
          {role === 'admin' ? (
            <Text className=" mx-5 text-xl font-semibold text-cyan-700">Admin Dashboard</Text>
          ) : (
            <Text className=" mx-5 text-xl font-semibold text-cyan-700">Your Dashboard</Text>
          )}

          <View className="mx-5 gap-3">
            <Text className="text-lg font-medium text-white">User Name</Text>
            <TextInput
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="white"
            />
          </View>

          <View className="mx-5 gap-3">
            <Text className="text-lg font-bold text-white">Website</Text>
            <TextInput
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-bold text-white"
              placeholder="Website"
              value={website}
              onChangeText={setWebsite}
              autoCapitalize="none"
              placeholderTextColor="white"
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
              placeholderTextColor="white"
            />
          </View>

          {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}

          {/* <Pressable
            onPress={() => {
              deleteTowReport();
            }}
            className="mt-4 w-full rounded-xl bg-red-600 p-4 shadow-lg transition-all duration-300 hover:bg-red-700 active:scale-95">
            <Text className="text-center text-lg font-semibold text-white">Delete Tow Report</Text>
          </Pressable> */}

          <Pressable
            disabled={loading}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            className="mt-5 w-full rounded-xl bg-indigo-300 p-4 px-5 shadow-lg transition-all duration-300 hover:bg-indigo-700 active:scale-95">
            <Text className="text-center text-lg font-semibold text-white">Update Profile</Text>
          </Pressable>

          <View>
            <Pressable
              disabled={loading}
              onPress={() => supabase.auth.signOut()}
              className="mt-5 w-full rounded-xl bg-red-500 p-4 px-5 shadow-lg transition-all duration-300 hover:bg-red-700 active:scale-95">
              <Text className="text-center text-lg font-semibold text-white">Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
