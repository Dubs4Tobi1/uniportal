/**
 * authService.js
 * Handles authentication logic.
 * 
 * TO MIGRATE TO FIREBASE AUTH:
 *   import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
 * 
 * TO MIGRATE TO SUPABASE AUTH:
 *   supabase.auth.signInWithPassword({ email, password })
 *   supabase.auth.signUp({ email, password })
 */

import storage from './storageService';
import { LECTURERS_DATA } from '../data/courses';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

// Initialize default admin and lecturers on first run
const initDefaults = () => {
  const users = storage.get(USERS_KEY) || [];
  if (users.length === 0) {
    const defaults = [
      {
        id: 'ADMIN001',
        name: 'System Administrator',
        email: 'admin@lcu.edu.ng',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      ...LECTURERS_DATA.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        password: 'lecturer123',
        role: 'lecturer',
        lecturerId: l.id,
        department: l.department,
        phone: l.phone,
        qualification: l.qualification,
        createdAt: new Date().toISOString(),
      })),
    ];
    storage.set(USERS_KEY, defaults);
  }
};

initDefaults();

export const authService = {
  login: (email, password) => {
    const users = storage.get(USERS_KEY) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    const session = { userId: user.id, role: user.role, name: user.name, email: user.email };
    storage.set(SESSION_KEY, session);
    return { success: true, user: session };
  },

  register: (data) => {
    const users = storage.get(USERS_KEY) || [];
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser = {
      id: 'STU' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'student',
      matricNumber: 'LCU/' + new Date().getFullYear() + '/' + String(Math.floor(Math.random() * 9000) + 1000),
      department: data.department || 'Natural Sciences',
      level: data.level || 100,
      phone: data.phone || '',
      gender: data.gender || '',
      registeredCourses: [],
      createdAt: new Date().toISOString(),
    };
    storage.set(USERS_KEY, [...users, newUser]);
    const session = { userId: newUser.id, role: 'student', name: newUser.name, email: newUser.email };
    storage.set(SESSION_KEY, session);
    return { success: true, user: session };
  },

  logout: () => {
    storage.remove(SESSION_KEY);
  },

  getSession: () => storage.get(SESSION_KEY),

  getProfile: (userId) => {
    const users = storage.get(USERS_KEY) || [];
    return users.find(u => u.id === userId) || null;
  },

  updateProfile: (userId, updates) => {
    const users = storage.get(USERS_KEY) || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates, id: userId };
    storage.set(USERS_KEY, users);
    return true;
  },

  getAllStudents: () => {
    const users = storage.get(USERS_KEY) || [];
    return users.filter(u => u.role === 'student');
  },

  getAllLecturers: () => {
    const users = storage.get(USERS_KEY) || [];
    return users.filter(u => u.role === 'lecturer');
  },

  deleteUser: (userId) => {
    const users = storage.get(USERS_KEY) || [];
    storage.set(USERS_KEY, users.filter(u => u.id !== userId));
    return true;
  },

  getAllUsers: () => storage.get(USERS_KEY) || [],
};

export default authService;
