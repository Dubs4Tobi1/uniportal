/**
 * timetableService.js
 * Handles exam timetable queries.
 * TO MIGRATE: Replace with Firestore/Supabase queries on 'timetable' collection.
 */
import { TIMETABLE } from '../data/courses';
import courseService from './courseService';

export const timetableService = {
  getAll: () => TIMETABLE,

  getByStudent: (userId) => {
    const registered = courseService.getStudentCourses(userId);
    const registeredIds = registered.map(c => c.id);
    return TIMETABLE.filter(t => registeredIds.includes(t.courseId));
  },

  search: (query) => {
    const q = query.toLowerCase();
    return TIMETABLE.filter(t =>
      t.courseCode.toLowerCase().includes(q) ||
      t.venue.toLowerCase().includes(q) ||
      t.day.toLowerCase().includes(q)
    );
  },

  filterByDate: (date) => TIMETABLE.filter(t => t.date === date),

  filterByCourse: (code) => TIMETABLE.filter(t => t.courseCode.toLowerCase().includes(code.toLowerCase())),
};

export default timetableService;
