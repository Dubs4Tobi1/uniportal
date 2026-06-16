import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import { AboutPage, ContactPage } from './pages/public/StaticPages';

import StudentDashboard from './pages/student/StudentDashboard';
import CourseRegistration from './pages/student/CourseRegistration';
import { MyCourses } from './pages/student/MyCourses';
import ExamTimetable from './pages/student/ExamTimetable';
import CourseForm from './pages/student/CourseForm';
import StudentProfile from './pages/student/StudentProfile';
import Notifications from './pages/student/Notifications';

import { LecturerDashboard, LecturerCourses, LecturerStudents, LecturerProfile } from './pages/lecturer/LecturerPages';
import { AdminDashboard, ManageCourses, ManageStudents, ManageLecturers, AssignLecturers, Reports, SystemSettings } from './pages/admin/AdminPages';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

const wrap = (roles, Page) => (
  <ProtectedRoute roles={roles}>
    <DashboardLayout><Page /></DashboardLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '10px', fontSize: '13px' } }} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-5xl font-bold text-dark-200">403</h1><p className="text-dark-400 mt-2">Unauthorized Access</p></div></div>} />

            <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/register" element={<ProtectedRoute roles={['student']}><DashboardLayout><CourseRegistration /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute roles={['student']}><DashboardLayout><MyCourses /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute roles={['student']}><DashboardLayout><ExamTimetable /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/form" element={<ProtectedRoute roles={['student']}><DashboardLayout><CourseForm /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><DashboardLayout><StudentProfile /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute roles={['student']}><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />

            <Route path="/lecturer" element={<ProtectedRoute roles={['lecturer']}><DashboardLayout><LecturerDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/lecturer/courses" element={<ProtectedRoute roles={['lecturer']}><DashboardLayout><LecturerCourses /></DashboardLayout></ProtectedRoute>} />
            <Route path="/lecturer/students" element={<ProtectedRoute roles={['lecturer']}><DashboardLayout><LecturerStudents /></DashboardLayout></ProtectedRoute>} />
            <Route path="/lecturer/profile" element={<ProtectedRoute roles={['lecturer']}><DashboardLayout><LecturerProfile /></DashboardLayout></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute roles={['admin']}><DashboardLayout><ManageCourses /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><DashboardLayout><ManageStudents /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/lecturers" element={<ProtectedRoute roles={['admin']}><DashboardLayout><ManageLecturers /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/assign" element={<ProtectedRoute roles={['admin']}><DashboardLayout><AssignLecturers /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><DashboardLayout><SystemSettings /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-5xl font-bold text-dark-200">404</h1><p className="text-dark-400 mt-2">Page Not Found</p></div></div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
