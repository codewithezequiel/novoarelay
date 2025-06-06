import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function OnboardingProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false); // ✅ Track if upload happened
  const { session, fetchProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      Alert.alert('No session found');
      router.replace('/');
    }
  }, [session]);

  const handleUpload = async (url: string) => {
    if (!session?.user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: url,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setAvatarUrl(url);
      setUploaded(true); // ✅ Enable Complete button

      Alert.alert('Success!', 'Profile picture uploaded.');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!session?.user || !avatarUrl) return;

    try {
      setLoading(true);

      // ✅ Finalize onboarding in database
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      await fetchProfile(session.user.id); // ✅ Refetch for context update

      Alert.alert('Welcome!', 'Onboarding complete.');
      router.replace('/');
    } catch (error) {
      console.error('Completion error:', error);
      Alert.alert('Error', 'Could not complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Upload',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />

      <ScrollView className="flex-1 bg-black p-5">
        <View className="mt-20 items-center">
          <Text className="mb-5 text-3xl font-bold text-white">Upload Profile Picture</Text>

          <Avatar size={200} url={avatarUrl} onUpload={handleUpload} />

          {loading && <ActivityIndicator size="large" color="#00ff00" className="mt-5" />}

          {/* ✅ Complete Button */}
          <Pressable
            disabled={!uploaded}
            onPress={handleComplete}
            className={`mt-10 max-w-lg rounded-xl px-6 py-4 ${uploaded ? 'bg-green-600' : 'bg-gray-600'}`}>
            <Text className="text-lg font-semibold text-white">Complete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
