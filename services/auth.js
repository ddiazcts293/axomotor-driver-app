import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from '../secrets.js'

const supabase =  createClient(supabaseUrl, supabaseAnonKey);

export const auth = supabase.auth;
