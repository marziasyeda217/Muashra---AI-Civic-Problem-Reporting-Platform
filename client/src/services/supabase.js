import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pzyqyualrdkvmiyujoaz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXF5dWFscmRrdm1peXVqb2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjU4ODAsImV4cCI6MjEwMzkwMTg4MH0.uqjVGFCK1MXAkC0GIEw3SZCwPHzIupZ3vRwSxcf8VZw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

