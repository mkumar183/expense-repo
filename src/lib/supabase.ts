import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// These values come from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    },
    global: {
      fetch: (url, options) => {
        // Custom fetch with timeout to better handle connectivity issues
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const fetchOptions = { ...options, signal };
        
        return fetch(url, fetchOptions)
          .then(response => {
            clearTimeout(timeoutId);
            return response;
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Supabase fetch error:', error);
            throw error;
          });
      }
    }
  }
);

// Helper function to check Supabase connectivity
export const checkSupabaseConnection = async () => {
  try {
    console.log('Testing connection to Supabase...');
    // Simple query to check if we can connect to Supabase
    const { data, error } = await supabase.from('tenants').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test error:', error);
      return { connected: false, error: error.message };
    }
    console.log('Supabase connection successful');
    return { connected: true, error: null };
  } catch (err: any) {
    console.error('Supabase connection test exception:', err);
    return { connected: false, error: err.message || 'Unknown connection error' };
  }
};
