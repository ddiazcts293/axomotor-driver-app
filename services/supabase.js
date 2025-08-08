import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../secrets.js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const auth = supabase.auth;

export const sessionStorage =
{ 
  async save(session) {
    try {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem('@axomotor-session', jsonValue);
    } catch (e) {
      console.error('Failed to save session', e);
    }
  },

  async load() {
    try {
      const jsonValue = await AsyncStorage.getItem('@axomotor-session');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load session', e);
      return null;
    }
  },

  async remove() {
    try {
      await AsyncStorage.removeItem('@axomotor-session');
    } catch (e) {
      console.error('Failed to remove session', e);
    }
  }
};
