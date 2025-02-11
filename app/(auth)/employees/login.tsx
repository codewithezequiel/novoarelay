import { Stack, Redirect } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View, TextInput, TouchableOpacity, Text, AppState } from 'react-native';
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
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  if (redirectToAdminLogin) {
    return <Redirect href="/(auth)/company/newLogin" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      <Stack.Screen options={{ title: 'Employee Login' }} />
      <View className="w-full max-w-sm gap-4">
        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
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
  );
}
