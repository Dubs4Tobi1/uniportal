import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, BookCheck, CalendarDays, Award, TrendingUp, Clock } from 'lucide-react';
import { StatCard, PageHeader } from '../../components/common/UI';
import courseService from '../../services/courseService';
import authService from '../../services/authService';
import { MAX_CREDIT_UNITS } from '../../data/courses';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const p = authService.getProfile(user.userId);
    setProfile(p);
    setCourses(courseService.getStudentCourses(user.userId));
  }, [user.userId]);

  const totalUnits = courses.reduce((s, c) => s + c.credits, 0);
  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">{greeting}, {firstName} 👋</h1>
        <p className="text-sm text-dark-500 mt-1">
          {profile?.matricNumber && <span className="font-mono">{profile.matricNumber}</span>}
          {profile?.department && <span> · {profile.department}</span>}
          {profile?.level && <span> · {profile.level} Level</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Registered Courses" value={courses.length} color="green" />
        <StatCard icon={Award} label="Credit Units" value={totalUnits} sub={`Max: ${MAX_CREDIT_UNITS}`} color="blue" />
        <StatCard icon={TrendingUp} label="Units Remaining" value={MAX_CREDIT_UNITS - totalUnits} color="purple" />
        <StatCard icon={CalendarDays} label="Exam Sessions" value={courses.length} color="orange" />
      </div>

      {/* Credit unit bar */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Credit Unit Load</p>
          <p className="text-sm font-bold text-dark-900 dark:text-dark-50">{totalUnits} / {MAX_CREDIT_UNITS}</p>
        </div>
        <div className="h-2.5 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${totalUnits >= MAX_CREDIT_UNITS ? 'bg-red-500' : totalUnits >= 18 ? 'bg-orange-500' : 'bg-primary-500'}`}
            style={{ width: `${Math.min((totalUnits / MAX_CREDIT_UNITS) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-dark-400 mt-1.5">
          {totalUnits < 12 ? `Register at least ${12 - totalUnits} more units (min: 12)` :
            totalUnits >= MAX_CREDIT_UNITS ? 'Maximum credit units reached' :
              `${MAX_CREDIT_UNITS - totalUnits} units available`}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent courses */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark-800 dark:text-dark-100">Registered Courses</h3>
            <Link to="/student/courses" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={28} className="text-dark-300 mx-auto mb-2" />
              <p className="text-sm text-dark-500">No courses registered yet.</p>
              <Link to="/student/register" className="btn-primary mt-3 text-sm py-2 px-4">Browse Courses</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-dark-100 dark:border-dark-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{c.code}</p>
                    <p className="text-xs text-dark-400 truncate max-w-[200px]">{c.title}</p>
                  </div>
                  <span className="badge-green">{c.credits} units</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="card p-5">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Register Courses', to: '/student/register', icon: BookOpen, color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' },
              { label: 'View Timetable', to: '/student/timetable', icon: CalendarDays, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
              { label: 'Course Form', to: '/student/form', icon: BookCheck, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
              { label: 'My Profile', to: '/student/profile', icon: Award, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
            ].map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-dark-50 dark:hover:bg-dark-700 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-dark-700 dark:text-dark-300 text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
