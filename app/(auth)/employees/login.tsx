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
} from 'react-native';
import { supabase } from '~/utils/supabase';

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
    <ScrollView className="flex-1 bg-black p-10">
      <View className="items-center justify-center p-10">
        <Stack.Screen
          options={{
            title: 'User Login',
            headerStyle: { backgroundColor: 'black' },
            headerTintColor: 'white',
          }}
        />
        {/* <View className="mb-10 items-center">
          <Image
            source={require('~/assets/novoarelay.jpg')}
            className="h-48 w-48 "
            resizeMode="contain"
          />
        </View> */}
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
            className="flex w-full items-center rounded-lg bg-blue-600 py-3"
            disabled={loading}
            onPress={signInWithEmail}>
            <Text className="font-semibold text-white">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex w-full items-center rounded-lg bg-green-600 py-3"
            disabled={loading}
            onPress={signUpWithEmail}>
            <Text className="font-semibold text-white">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text
          className="mt-4 cursor-pointer text-center text-blue-600 underline"
          onPress={() => setRedirectToAdminLogin(true)}>
          Need to log in as an admin?
        </Text>
      </View>
    </ScrollView>
  );
}
