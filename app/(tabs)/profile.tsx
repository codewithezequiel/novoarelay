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
  SafeAreaView,
  Keyboard,
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.warn('No active session found. Skipping sign out.');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);

      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 bg-black"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 items-center gap-3 bg-black p-8">
              {/* Profile Section */}
              <View className="w-full max-w-lg flex-row items-center justify-between rounded-lg border-2 border-zinc-900 p-5 shadow-md">
                <View className="mr-5 flex-shrink flex-row items-center">
                  <SupaAvatarImage path={avatarUrl} className="mr-4 h-24 w-24 rounded-full" />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="max-w-[60%] text-2xl font-bold text-white">
                    {firstName?.trim()}
                  </Text>
                </View>

                {/* Edit Profile Button */}
                <Pressable
                  disabled={loading}
                  onPress={editProfile}
                  className="rounded-lg bg-indigo-500 px-5 py-3 shadow-lg active:scale-95 disabled:bg-gray-400">
                  <Text className="text-center text-lg font-semibold text-white">
                    {loading ? 'Saving...' : 'Edit Profile'}
                  </Text>
                </Pressable>
              </View>

              {/* Dashboard Title */}
              <Text className="mx-5 text-xl font-semibold text-cyan-700">
                {role === 'admin' ? 'Admin Dashboard' : 'Your Dashboard'}
              </Text>

              {/* Dashboard Component */}
              {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}

              {/* Sign Out Button */}
              <View className="w-full max-w-lg">
                <Pressable
                  disabled={loading}
                  onPress={signOut}
                  className="mt-5 rounded-xl bg-red-500 p-4 px-5 active:bg-red-700">
                  <Text className="text-center text-lg font-semibold text-white">Sign Out</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
