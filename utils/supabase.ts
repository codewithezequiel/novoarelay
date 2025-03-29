import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

const isBrowser = typeof window !== 'undefined'; // ✅ Check if it's in the browser

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? AsyncStorage : undefined, // ✅ Avoid using AsyncStorage in SSR
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
