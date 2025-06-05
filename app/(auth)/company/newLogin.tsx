import React, { useState, useEffect } from 'react';
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
import { supabase } from '~/utils/supabase';
import { Redirect, Stack } from 'expo-router';
import NovoaRelayLogo from '~/components/NovoaRelayLogo';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);

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
        .insert([{ name: companyName, created_by: userData.user!.id }])
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
      // Step 1: Sign in the user
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const user = authData?.user;
      if (!user) {
        Alert.alert('Error', 'User not found.');
        setLoading(false);
        return;
      }

      // Step 2: Fetch user role using user ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id) // ✅ Querying by user ID, not email
        .single();

      if (profileError || !profileData) {
        Alert.alert('Error', 'Failed to fetch user role.');
        setLoading(false);
        return;
      }

      // Step 3: Verify admin access
      if (profileData.role !== 'admin') {
        await supabase.auth.signOut();
        Alert.alert('Access Denied', 'You are not authorized to access the admin panel.');
        setLoading(false);
        return;
      }

      // Step 4: Redirect to admin dashboard
      setRedirectToAdmin(true); // Use state to trigger Redirect
    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
  }

  if (redirectToAdmin) {
    return <Redirect href="/" />;
  }

  if (redirectToEmployeeLogin) {
    return <Redirect href="/(auth)/employees/login" />;
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 items-center justify-center">
              <View className="w-full max-w-md items-center justify-center rounded-xl bg-zinc-950 p-6">
                <Stack.Screen
                  options={{
                    headerStyle: { backgroundColor: 'black' },
                    headerTintColor: 'white',
                    title: isSignUp ? 'Company Registration' : 'Admin Login',
                  }}
                />
                {/* Logo Section */}
                <View className="mb-10 max-w-sm bg-zinc-950">
                  <NovoaRelayLogo fontSize={60} />
                </View>

                <View className="w-full max-w-sm gap-4 space-y-4">
                  {isSignUp && (
                    <TextInput
                      className="w-full rounded-lg border border-zinc-400 bg-zinc-800 px-5 py-5 text-white"
                      placeholder="Company Name"
                      autoCapitalize="words"
                      onChangeText={setCompanyName}
                      value={companyName}
                      placeholderTextColor="gray"
                    />
                  )}

                  <TextInput
                    className="w-full rounded-lg border border-zinc-400 bg-zinc-800 px-5 py-5 text-white"
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    value={email}
                    placeholderTextColor="gray"
                  />

                  <TextInput
                    className="w-full rounded-lg border border-zinc-400 bg-zinc-800 px-5 py-5 text-white"
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                    placeholderTextColor="gray"
                  />

                  <TouchableOpacity
                    className={`flex w-full items-center justify-center rounded-lg py-3 ${
                      isSignUp ? 'bg-gray-200' : 'bg-gray-200'
                    } ${loading ? 'opacity-50' : 'hover:bg-opacity-80'}`}
                    disabled={loading}
                    onPress={isSignUp ? registerCompany : signInWithEmail}>
                    <Text className="text-lg font-semibold text-black">
                      {isSignUp ? 'Register Company' : 'Continue'}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
