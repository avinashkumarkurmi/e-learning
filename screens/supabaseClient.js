// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and API key
const SUPABASE_URL = 'https://ilauwcitammfrmubvhgm.supabase.co'; // Your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYXV3Y2l0YW1tZnJtdWJ2aGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NDU1MzIsImV4cCI6MjA1NDMyMTUzMn0.GlhOyIqq4IHqszATu37hly8dbN4ILIBE4cm8kiocDd8'; // Your Supabase Anon public key

// Create a Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
