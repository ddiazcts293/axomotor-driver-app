import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbqksysvvbgadjjevioe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZicWtzeXN2dmJnYWRqamV2aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzY4MDMsImV4cCI6MjA2NzQxMjgwM30.5pIsj9qFIKna6G6OdFzuMsyrHRKH378Q-O_0RP61ttc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);