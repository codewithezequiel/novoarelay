import { Stack, Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  AppState,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import NovoaRelayLogo from '~/components/NovoaRelayLogo';
import { supabase } from '~/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import NovoaRelayHome from '~/components/NovoaRelayHome';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToAdminLogin, setRedirectToAdminLogin] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    // 1️⃣ Check if email exists in the invitations table
    const { data: invitedUser, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .single();

    if (inviteError || !invitedUser) {
      Alert.alert('Error', 'You must be invited to sign up.');
      setLoading(false);
      return;
    }

    try {
      // 2️⃣ Proceed with signing up
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = userData.user;
      if (user) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ company_id: invitedUser.company_id, role: 'employee' })
          .eq('id', user.id);

        if (profileUpdateError) throw profileUpdateError;
      }

      Alert.alert('Success', 'Check your inbox for email verification!');

      // 3️⃣ Remove used invitation after successful sign-up
      await supabase.from('invitations').delete().eq('email', email);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Sign-up failed.');
    }

    setLoading(false);
  }

  if (redirectToAdminLogin) {
    return <Redirect href="/(auth)/company/newLogin" />;
  }

  return (
    <LinearGradient
      colors={['#1c1c1e', '#3a3a3c', '#1e1b4b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }} // ✅ required, don't use className here
    >
      <SafeAreaView className="flex-1 ">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // adjust if needed
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="flex-1 items-center justify-center p-6">
              <View className="w-full max-w-md items-center justify-center rounded-xl bg-zinc-950 p-6">
                <Stack.Screen
                  options={{
                    title: 'Login',
                    headerStyle: { backgroundColor: 'black' },
                    headerTintColor: 'white',
                    headerShown: false,
                  }}
                />
                {/* Logo Section */}
                <View className="mb-10 max-w-sm bg-zinc-950">
                  <NovoaRelayLogo fontSize={60} />
                </View>

                <View className="w-full max-w-sm gap-4 ">
                  <TextInput
                    className="w-full rounded-lg border border-zinc-400 bg-zinc-800 px-5 py-5 text-white"
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                  <TextInput
                    className="w-full rounded-lg border border-zinc-400 bg-zinc-800 px-5 py-5 text-white"
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                  <TouchableOpacity
                    className="flex w-full items-center rounded-xl bg-white/10 py-3"
                    disabled={loading}
                    onPress={signInWithEmail}>
                    <Text className="font-semibold text-white">Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex w-full items-center rounded-lg bg-gray-200 py-3"
                    disabled={loading}
                    onPress={signUpWithEmail}>
                    <Text className="font-semibold text-black">Sign Up</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  className="mt-4 cursor-pointer text-center text-blue-600 underline"
                  onPress={() => setRedirectToAdminLogin(true)}>
                  Need to log in as an admin?
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
