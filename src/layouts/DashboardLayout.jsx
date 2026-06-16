import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, BookOpen, CalendarDays, User, FileText, Bell,
  GraduationCap, Users, ClipboardList, Settings, BarChart3,
  UserCog, BookMarked, LogOut, Menu, X, Sun, Moon, ChevronRight,
  BookCheck, Layers
} from 'lucide-react';

const studentNav = [
  { label: 'Dashboard', to: '/student', icon: LayoutDashboard },
  { label: 'Register Courses', to: '/student/register', icon: BookOpen },
  { label: 'My Courses', to: '/student/courses', icon: BookCheck },
  { label: 'Exam Timetable', to: '/student/timetable', icon: CalendarDays },
  { label: 'Course Form', to: '/student/form', icon: FileText },
  { label: 'Notifications', to: '/student/notifications', icon: Bell },
  { label: 'Profile', to: '/student/profile', icon: User },
];

const lecturerNav = [
  { label: 'Dashboard', to: '/lecturer', icon: LayoutDashboard },
  { label: 'My Courses', to: '/lecturer/courses', icon: BookOpen },
  { label: 'Students', to: '/lecturer/students', icon: Users },
  { label: 'Profile', to: '/lecturer/profile', icon: User },
];

const adminNav = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Courses', to: '/admin/courses', icon: BookOpen },
  { label: 'Students', to: '/admin/students', icon: GraduationCap },
  { label: 'Lecturers', to: '/admin/lecturers', icon: UserCog },
  { label: 'Assign Lecturers', to: '/admin/assign', icon: BookMarked },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const navByRole = { student: studentNav, lecturer: lecturerNav, admin: adminNav };
const colorByRole = {
  student: 'bg-primary-600',
  lecturer: 'bg-blue-600',
  admin: 'bg-purple-600',
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = navByRole[user?.role] || [];
  const roleColor = colorByRole[user?.role] || 'bg-primary-600';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to) => {
    if (to === `/${user?.role}`) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-200 dark:border-dark-700">
        <div className={`w-9 h-9 rounded-lg ${roleColor} flex items-center justify-center flex-shrink-0`}>
          <Layers size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-dark-900 dark:text-dark-50 font-display">LCU Portal</p>
          <p className="text-xs text-dark-400 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-dark-100 dark:border-dark-700">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full ${roleColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark-800 dark:text-dark-100 truncate">{user?.name}</p>
            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {nav.map(({ label, to, icon: Icon }) => (
          <Link key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${isActive(to) ? 'active' : ''}`}>
            <Icon size={16} />
            <span>{label}</span>
            {isActive(to) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-dark-200 dark:border-dark-700 space-y-1">
        <button onClick={toggle} className="sidebar-link w-full">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-50 dark:bg-dark-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 z-10 animate-slide-in">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700">
              <Menu size={18} className="text-dark-600 dark:text-dark-300" />
            </button>
            <h2 className="font-semibold text-dark-800 dark:text-dark-100 text-sm hidden sm:block">
              {nav.find(n => isActive(n.to))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={`w-8 h-8 rounded-full ${roleColor} flex items-center justify-center text-white text-xs font-bold`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
