import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View, TextInput, TouchableOpacity, Text, AppState } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
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
  const [companyName, setCompanyName] = useState(''); // New state for company name
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }
  async function signUpWithEmail() {
    setLoading(true);

    // Step 1: Sign up the user (authenticate the user first)
    const {
      data: { session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Alert.alert('Sign-up Error: ' + signUpError.message);
      setLoading(false);
      return; // Return early if sign-up fails
    }

    // If sign-up is successful, continue to create the company and assign user as admin
    if (session) {
      try {
        // Step 2: Create the company for the user
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: companyName,
            },
          ])
          .single();

        if (companyError) {
          throw new Error('Error registering company: ' + companyError.message);
        }

        // Successfully signed up, created company, and assigned role
        Alert.alert('Company registered successfully. Redirecting to admin dashboard...');
        // Redirect user to the admin dashboard
        setLoading(false);
      } catch (error) {
        // Handle any error that occurred during company creation or role assignment
        Alert.alert('Error: ' + error.message);
        setLoading(false);
      }
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      <Stack.Screen options={{ title: 'Company Login' }} />
      <View className="w-full max-w-sm gap-4">
        {/* Email Input */}
        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Company Name Input */}
        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          onChangeText={setCompanyName}
          value={companyName}
          placeholder="Company Name"
        />

        {/* Sign In Button */}
        <TouchableOpacity
          className="flex w-full items-center rounded-lg bg-blue-600 py-3"
          disabled={loading}
          onPress={signInWithEmail}>
          <Text className="font-semibold text-white">Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="flex w-full items-center rounded-lg bg-green-600 py-3"
          disabled={loading}
          onPress={signUpWithEmail}>
          <Text className="font-semibold text-white">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
