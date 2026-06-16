/**
 * storageService.js
 * Abstraction layer for data persistence.
 * 
 * TO MIGRATE TO FIREBASE:
 *   Replace localStorage calls with Firebase Firestore SDK calls.
 *   import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
 * 
 * TO MIGRATE TO SUPABASE:
 *   Replace with Supabase client calls.
 *   import { createClient } from '@supabase/supabase-js';
 *   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 */

const PREFIX = 'lcu_portal_';

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

export default storage;
