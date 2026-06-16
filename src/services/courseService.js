/**
 * courseService.js
 * Handles course registration, management.
 * 
 * TO MIGRATE TO FIREBASE/SUPABASE: Replace storage calls with DB queries.
 */

import storage from './storageService';
import { COURSES, MAX_CREDIT_UNITS, LECTURER_COURSE_MAP } from '../data/courses';

const COURSES_KEY = 'courses';
const REGISTRATIONS_KEY = 'registrations';

// Seed courses if not present
const initCourses = () => {
  if (!storage.get(COURSES_KEY)) {
    const coursesWithLecturers = COURSES.map(c => ({
      ...c,
      lecturerName: LECTURER_COURSE_MAP[c.id] || 'TBA',
    }));
    storage.set(COURSES_KEY, coursesWithLecturers);
  }
};
initCourses();

export const courseService = {
  getAllCourses: () => storage.get(COURSES_KEY) || COURSES,

  getCourseById: (id) => {
    const courses = storage.get(COURSES_KEY) || COURSES;
    return courses.find(c => c.id === id) || null;
  },

  createCourse: (courseData) => {
    const courses = storage.get(COURSES_KEY) || [];
    const newCourse = { ...courseData, id: courseData.code.replace(/\s/g, '').replace(/-/g, ''), createdAt: new Date().toISOString() };
    storage.set(COURSES_KEY, [...courses, newCourse]);
    return newCourse;
  },

  updateCourse: (id, updates) => {
    const courses = storage.get(COURSES_KEY) || [];
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) return false;
    courses[idx] = { ...courses[idx], ...updates };
    storage.set(COURSES_KEY, courses);
    return true;
  },

  deleteCourse: (id) => {
    const courses = storage.get(COURSES_KEY) || [];
    storage.set(COURSES_KEY, courses.filter(c => c.id !== id));
    // Remove from all student registrations
    const regs = storage.get(REGISTRATIONS_KEY) || {};
    Object.keys(regs).forEach(userId => {
      regs[userId] = regs[userId].filter(cId => cId !== id);
    });
    storage.set(REGISTRATIONS_KEY, regs);
    return true;
  },

  getStudentCourses: (userId) => {
    const regs = storage.get(REGISTRATIONS_KEY) || {};
    const courseIds = regs[userId] || [];
    const courses = storage.get(COURSES_KEY) || COURSES;
    return courses.filter(c => courseIds.includes(c.id));
  },

  registerCourse: (userId, courseId) => {
    const regs = storage.get(REGISTRATIONS_KEY) || {};
    const userRegs = regs[userId] || [];
    if (userRegs.includes(courseId)) return { success: false, error: 'Already registered for this course.' };

    const courses = storage.get(COURSES_KEY) || COURSES;
    const allRegistered = courses.filter(c => userRegs.includes(c.id));
    const currentUnits = allRegistered.reduce((sum, c) => sum + c.credits, 0);
    const courseToAdd = courses.find(c => c.id === courseId);
    if (!courseToAdd) return { success: false, error: 'Course not found.' };
    if (currentUnits + courseToAdd.credits > MAX_CREDIT_UNITS) {
      return { success: false, error: `Cannot exceed ${MAX_CREDIT_UNITS} credit units. You have ${currentUnits} units.` };
    }
    regs[userId] = [...userRegs, courseId];
    storage.set(REGISTRATIONS_KEY, regs);
    return { success: true };
  },

  dropCourse: (userId, courseId) => {
    const regs = storage.get(REGISTRATIONS_KEY) || {};
    const userRegs = regs[userId] || [];
    regs[userId] = userRegs.filter(id => id !== courseId);
    storage.set(REGISTRATIONS_KEY, regs);
    return { success: true };
  },

  getLecturerCourses: (lecturerUserId) => {
    const courses = storage.get(COURSES_KEY) || COURSES;
    // Match by lecturerName using the user's name stored at registration
    const { authService } = require('./authService');
    const profile = authService.getProfile(lecturerUserId);
    if (!profile) return [];
    return courses.filter(c => c.lecturerName === profile.name);
  },

  getCourseStudents: (courseId) => {
    const regs = storage.get(REGISTRATIONS_KEY) || {};
    const { authService } = require('./authService');
    const students = authService.getAllStudents();
    return students.filter(s => (regs[s.id] || []).includes(courseId));
  },

  getAllRegistrations: () => storage.get(REGISTRATIONS_KEY) || {},

  getTotalUnits: (userId) => {
    const courses = courseService.getStudentCourses(userId);
    return courses.reduce((sum, c) => sum + c.credits, 0);
  },
};

export default courseService;
