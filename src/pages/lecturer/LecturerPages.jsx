import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatCard, EmptyState, SearchBar } from '../../components/common/UI';
import courseService from '../../services/courseService';
import authService from '../../services/authService';
import { BookOpen, Users, Award, User, Save } from 'lucide-react';

export function LecturerDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(authService.getProfile(user.userId));
    // Get courses assigned to this lecturer
    const all = courseService.getAllCourses();
    const p = authService.getProfile(user.userId);
    const myCourses = all.filter(c => c.lecturerName === (p?.name || user.name));
    setCourses(myCourses);
  }, []);

  const totalStudents = courses.reduce((sum, c) => {
    const students = courseService.getCourseStudents(c.id);
    return sum + students.length;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">Welcome, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-sm text-dark-500 mt-1">{profile?.department} · {profile?.qualification}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Assigned Courses" value={courses.length} color="blue" />
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="green" />
        <StatCard icon={Award} label="Department" value={profile?.department?.split(' ')[0] || 'N/A'} color="purple" />
      </div>
      <div className="card p-5">
        <h3 className="font-semibold mb-4 text-dark-800 dark:text-dark-100">My Courses</h3>
        {courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses assigned" description="Contact the administrator to have courses assigned to you." />
        ) : (
          <div className="space-y-2">
            {courses.map(c => {
              const students = courseService.getCourseStudents(c.id);
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-dark-100 dark:border-dark-700">
                  <div>
                    <p className="font-mono font-semibold text-sm text-dark-900 dark:text-dark-50">{c.code}</p>
                    <p className="text-xs text-dark-500">{c.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge-blue">{students.length} students</span>
                    <span className="badge-green">{c.credits} units</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function LecturerCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const all = courseService.getAllCourses();
    const p = authService.getProfile(user.userId);
    setCourses(all.filter(c => c.lecturerName === (p?.name || user.name)));
  }, []);

  return (
    <div>
      <PageHeader title="My Courses" description={`${courses.length} assigned courses`} />
      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses assigned" description="Contact the administrator." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono font-bold text-dark-900 dark:text-dark-50">{c.code}</p>
                <div className="flex gap-2">
                  <span className="badge-green">{c.credits} units</span>
                  <span className="badge-gray">{c.level}L</span>
                </div>
              </div>
              <p className="font-semibold text-dark-700 dark:text-dark-300 mb-1">{c.title}</p>
              <p className="text-xs text-dark-500">{c.department} · Semester {c.semester}</p>
              <p className="text-xs text-dark-400 mt-2 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LecturerStudents() {
  const { user } = useAuth();
  const [courseStudents, setCourseStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const all = courseService.getAllCourses();
    const p = authService.getProfile(user.userId);
    const myCourses = all.filter(c => c.lecturerName === (p?.name || user.name));
    const data = myCourses.map(c => ({ course: c, students: courseService.getCourseStudents(c.id) }));
    setCourseStudents(data);
  }, []);

  return (
    <div>
      <PageHeader title="Registered Students" description="Students enrolled in your courses" />
      <div className="mb-5"><SearchBar value={search} onChange={setSearch} placeholder="Search students..." /></div>
      <div className="space-y-6">
        {courseStudents.map(({ course, students }) => {
          const filtered = search
            ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
            : students;
          return (
            <div key={course.id} className="card overflow-hidden">
              <div className="px-5 py-3 bg-dark-50 dark:bg-dark-700 border-b border-dark-200 dark:border-dark-600 flex items-center justify-between">
                <div>
                  <p className="font-mono font-bold text-dark-900 dark:text-dark-50">{course.code}</p>
                  <p className="text-xs text-dark-500">{course.title}</p>
                </div>
                <span className="badge-blue">{students.length} enrolled</span>
              </div>
              {filtered.length === 0 ? (
                <p className="text-sm text-dark-400 p-4 text-center">No students {search ? 'matching your search' : 'enrolled yet'}.</p>
              ) : (
                <div className="divide-y divide-dark-100 dark:divide-dark-700">
                  {filtered.map(s => (
                    <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-800 dark:text-dark-100">{s.name}</p>
                        <p className="text-xs text-dark-400">{s.email} · {s.matricNumber}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="badge-gray">{s.level}L</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LecturerProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const p = authService.getProfile(user.userId);
    setProfile(p);
    setForm({ phone: p?.phone || '', qualification: p?.qualification || '' });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    authService.updateProfile(user.userId, form);
    refreshUser();
    const { toast } = require('react-hot-toast');
    toast.success('Profile updated');
  };

  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="max-w-xl">
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-dark-900 dark:text-dark-50">{profile?.name}</p>
              <p className="text-sm text-dark-500">{profile?.email}</p>
              <span className="badge-blue mt-1">Lecturer</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSave} className="card p-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input disabled value={profile?.email || ''} className="input-field bg-dark-50 dark:bg-dark-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">Qualification</label>
            <input value={form.qualification || ''} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} className="input-field" />
          </div>
          <button type="submit" className="btn-primary"><Save size={14} /> Save Changes</button>
        </form>
      </div>
    </div>
  );
}
