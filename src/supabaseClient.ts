import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Input validation
if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Make sure VITE_SUPABASE_URL is set in your .env file.");
}
if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key is missing. Make sure VITE_SUPABASE_ANON_KEY is set in your .env file.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization status (optional, helpful for debugging)
console.log("Supabase client initialized.");
