import React, { useState, useEffect } from 'react';
import { Alert, View, TextInput, TouchableOpacity, Text, AppState } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Redirect, Stack } from 'expo-router';

// Start Supabase Auth session management
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function CompanyAuth() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-in and sign-up
  const [redirectToEmployeeLogin, setRedirectToEmployeeLogin] = useState(false);

  useEffect(() => {
    // Check if the user is already signed in and redirect
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        <Redirect href={'/'} />; // Redirect to dashboard
      }
    };
    checkUser();
  }, []);

  /** 🔹 Handles Company Registration & Admin Sign-Up */
  async function registerCompany() {
    setLoading(true);

    // Me: Step 1: Check if company already exists

    try {
      // Step 1: Check if the company already exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('name', companyName)
        .single();

      if (existingCompany) {
        throw new Error('Company already exists. Please sign in.');
      }

      // Step 1.5 Authenticate company first before creating it. Can't insert row in companies table without being authenticated.

      // Step 3: Register the admin user
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Step 2: Create the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName, created_by: userData.user.id }])
        .select()
        .single();

      if (companyError) throw companyError;

      // Step 4: Update the user's profile with company_id and admin role
      const user = userData?.user;
      if (user) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ company_id: company.id, role: 'admin' })
          .eq('id', user.id);

        if (profileUpdateError) throw profileUpdateError;
      }

      Alert.alert('Success', 'Company Registered! Check your email for verification.');
      <Redirect href={'/'} />; // Redirect to admin dashboard
    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
  }

  /** 🔹 Handles Company Admin Sign-In */
  async function signInWithEmail() {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user role to confirm admin access
      const { data: userData } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single();

      if (userData?.role === 'admin') {
        <Redirect href={'/'} />; // Redirect to company dashboard
      } else {
        Alert.alert('Access Denied', 'Only company admins can sign in here.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
  }

  if (redirectToEmployeeLogin) {
    return <Redirect href="/(auth)/employees/login" />;
  }

  return (
    <View className="flex flex-1 items-center justify-center bg-gray-100 px-6">
      <Stack.Screen options={{ title: isSignUp ? 'Company Registration' : 'Admin Login' }} />
      <Text className="mb-6 text-3xl font-bold text-gray-800">
        {isSignUp ? 'Register Company' : 'Company Admin Login'}
      </Text>

      <View className="w-full max-w-sm space-y-4">
        {isSignUp && (
          <TextInput
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm"
            placeholder="Company Name"
            autoCapitalize="words"
            onChangeText={setCompanyName}
            value={companyName}
          />
        )}

        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm"
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm"
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          className={`flex w-full items-center justify-center rounded-lg py-3 ${
            isSignUp ? 'bg-green-600' : 'bg-blue-600'
          } ${loading ? 'opacity-50' : 'hover:bg-opacity-80'}`}
          disabled={loading}
          onPress={isSignUp ? registerCompany : signInWithEmail}>
          <Text className="text-lg font-semibold text-white">
            {isSignUp ? 'Register Company' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <Text
          className="mt-4 cursor-pointer text-center text-blue-600 underline"
          onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already registered? Sign In' : 'Need to register a company?'}
        </Text>
      </View>
      <View>
        <Text
          className="mt-4 cursor-pointer text-center text-blue-600 underline"
          onPress={() => setRedirectToEmployeeLogin(true)}>
          Need to log in as an employee?
        </Text>
      </View>
    </View>
  );
}
