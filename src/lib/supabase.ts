import { createClient } from '@supabase/supabase-js';

// Public client configuration from environment variables with public cloud fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlypxvvoxstxhyoouvdh.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXB4dnZveHN0eGh5b291dmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMDAwMDAsImV4cCI6MjAyNDU3NjAwMH0.dummy';

export const isSupabaseConfigured = true;

// Instantiate client for global multi-network cloud realtime broadcast
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 25,
    },
  },
});

