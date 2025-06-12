import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fmefqxqqhsaqokyexhwb.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZWZxeHFxaHNhcW9reWV4aHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDA5MjIsImV4cCI6MjA2NTI3NjkyMn0.HNXkx1q2ZixEpCMO13WvPanmo9DdPoovSRpaTVrZS_8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);