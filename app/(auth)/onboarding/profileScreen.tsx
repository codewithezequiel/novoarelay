import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function OnboardingProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      Alert.alert('No session found');
      router.push('/'); // Redirect if no session
    }
  }, [session]);

  const handleUpload = async (url: string) => {
    if (!session?.user) return;

    try {
      setLoading(true);

      // 1. Update the avatar URL in the database
      const { error: avatarError } = await supabase
        .from('profiles')
        .update({ avatar_url: url, onboarding_completed: true }) // ✅ Set onboarding completed
        .eq('id', session.user.id);

      if (avatarError) throw avatarError;

      setAvatarUrl(url);

      // 2. Redirect the user to the home screen
      Alert.alert('Onboarding completed!');
      router.replace('/'); // ✅ Redirect to home
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Failed to upload profile picture');
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
          headerStyle: { backgroundColor: 'black' }, // Makes header black
          headerTintColor: 'white',
        }}
      />
      <ScrollView className="flex-1 bg-black p-5">
        <View className="mt-20 items-center">
          <Text className="mb-5 text-3xl font-bold text-white">Upload Profile Picture</Text>

          {/* Avatar Component */}
          <Avatar
            size={200}
            url={avatarUrl}
            onUpload={handleUpload} // Trigger onboarding completion
          />

          {loading && <ActivityIndicator size="large" color="#00ff00" className="mt-5" />}
        </View>
      </ScrollView>
    </>
  );
}
