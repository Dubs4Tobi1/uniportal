import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, CalendarDays, Shield, Users, BarChart3, ArrowRight, CheckCircle, Layers, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const features = [
  { icon: BookOpen, title: 'Course Registration', desc: 'Register and manage your courses online with real-time credit unit tracking.' },
  { icon: CalendarDays, title: 'Exam Timetable', desc: 'Access your personalised examination schedule anytime, anywhere.' },
  { icon: FileTextIcon, title: 'Course Form', desc: 'Generate and print your official course registration form with one click.' },
  { icon: Shield, title: 'Secure Access', desc: 'Role-based access for students, lecturers and administrators.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Administrators get rich dashboards and registration statistics.' },
  { icon: Users, title: 'Multi-Role', desc: 'One portal, three dashboards — students, lecturers, and admins.' },
];

function FileTextIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const stats = [
  { value: '44+', label: 'Courses Available' },
  { value: '15+', label: 'Faculty Members' },
  { value: '500+', label: 'Students Enrolled' },
  { value: '6', label: 'Departments' },
];

export default function LandingPage() {
  const { dark, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-dark-100 dark:border-dark-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-bold text-dark-900 dark:text-white font-display">LCU Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-400 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="btn-secondary text-sm py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 hidden sm:inline-flex">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-400 text-xs font-medium mb-6 border border-primary-200 dark:border-primary-800">
            <GraduationCap size={13} />
            LCU Academic Management System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white font-display leading-tight mb-6">
            Your University,<br />
            <span className="text-primary-600">Simplified.</span>
          </h1>
          <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Register courses, view exam timetables, and manage your academic journey — all from one clean, modern portal built for LCU students, lecturers, and administrators.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-dark-50 dark:bg-dark-800 border-y border-dark-100 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary-600 font-display">{s.value}</p>
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white font-display mb-3">Everything you need</h2>
            <p className="text-dark-500 dark:text-dark-400">Designed for every member of the LCU community.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-1.5">{title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-4 bg-dark-50 dark:bg-dark-800 border-t border-dark-100 dark:border-dark-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white font-display mb-3">Built for everyone</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { role: 'Students', color: 'primary', items: ['Register & drop courses', 'View exam timetable', 'Print course form', 'Track credit units'], link: '/register' },
              { role: 'Lecturers', color: 'blue', items: ['View assigned courses', 'See registered students', 'Manage course info', 'View class roster'], link: '/login' },
              { role: 'Administrators', color: 'purple', items: ['Create & manage courses', 'Manage all accounts', 'Assign lecturers', 'View analytics & reports'], link: '/login' },
            ].map(({ role, color, items, link }) => {
              const colors = {
                primary: 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20',
                blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
                purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
              };
              const textColors = { primary: 'text-primary-700 dark:text-primary-400', blue: 'text-blue-700 dark:text-blue-400', purple: 'text-purple-700 dark:text-purple-400' };
              return (
                <div key={role} className={`rounded-xl border-2 p-5 ${colors[color]}`}>
                  <h3 className={`font-bold text-lg font-display mb-3 ${textColors[color]}`}>{role}</h3>
                  <ul className="space-y-2 mb-4">
                    {items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                        <CheckCircle size={14} className={textColors[color]} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={link} className={`text-sm font-medium ${textColors[color]} hover:underline flex items-center gap-1`}>
                    Get access <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-white font-display mb-4">Ready to get started?</h2>
          <p className="text-dark-500 dark:text-dark-400 mb-8">Create your account in seconds and start managing your academic life.</p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Create Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-100 dark:border-dark-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <Layers size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">LCU Portal</span>
          </div>
          <p className="text-xs text-dark-400">© {new Date().getFullYear()} LCU Academic Portal. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="text-xs text-dark-400 hover:text-dark-600 dark:hover:text-dark-200">About</Link>
            <Link to="/contact" className="text-xs text-dark-400 hover:text-dark-600 dark:hover:text-dark-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
