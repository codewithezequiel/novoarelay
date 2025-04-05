import { useRouter } from 'expo-router';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AdminDashboard from '~/components/AdminDashboard';
import EmployeeDashboard from '~/components/EmployeeDashboard';
import SupaAvatarImage from '~/components/SupaAvatarImage';
import { useUserProfile } from '~/hooks/useUserProfile';
import { supabase } from '~/utils/supabase';

export default function Account() {
  const { loading, firstName, avatarUrl, role } = useUserProfile();
  const router = useRouter();

  const editProfile = () => {
    router.push('/profilescreens/editprofile');
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView className="bg-black">
        <TouchableWithoutFeedback>
          <View className="flex-1 gap-3 p-5">
            <View className="h-20 bg-black" />

            {/* Profile Section */}
            <View className="flex-row items-center justify-between rounded-lg border-2 border-zinc-900 p-5 shadow-md">
              <View className="mr-5 flex-shrink flex-row items-center">
                <SupaAvatarImage path={avatarUrl} className="mr-4 h-24 w-24 rounded-full" />
                <Text className="max-w-[60%] truncate text-2xl font-bold text-white">
                  {firstName?.trim()}
                </Text>
              </View>

              {/* Edit Profile Button */}
              <Pressable
                disabled={loading}
                onPress={editProfile}
                className="rounded-lg bg-indigo-500 px-5 py-3 shadow-lg transition active:scale-95 disabled:bg-gray-400">
                <Text className="text-center text-lg font-semibold text-white">
                  {loading ? 'Saving...' : 'Edit Profile'}
                </Text>
              </Pressable>
            </View>

            {/* Dashboard */}
            <Text className="mx-5 text-xl font-semibold text-cyan-700">
              {role === 'admin' ? 'Admin Dashboard' : 'Your Dashboard'}
            </Text>

            <View className="mx-5 gap-3"></View>
            {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}

            {/* Sign Out Button */}
            <View>
              <Pressable
                disabled={loading}
                onPress={signOut}
                className="mt-5 w-full rounded-xl bg-red-500 p-4 px-5 hover:bg-red-700">
                <Text className="text-center text-lg font-semibold text-white">Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
