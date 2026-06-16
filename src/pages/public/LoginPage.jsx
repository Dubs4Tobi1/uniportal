import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Layers, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = login(form.email, form.password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      const from = location.state?.from?.pathname;
      if (from) return navigate(from, { replace: true });
      navigate(`/${result.user.role}`, { replace: true });
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const demoLogins = [
    { label: 'Admin Demo', email: 'admin@lcu.edu.ng', password: 'admin123', color: 'purple' },
    { label: 'Lecturer Demo', email: 'a.okonkwo@lcu.edu.ng', password: 'lecturer123', color: 'blue' },
  ];

  const handleDemo = (demo) => {
    setForm({ email: demo.email, password: demo.password });
    toast('Demo credentials filled. Click Sign In.', { icon: '💡' });
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Layers size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">Sign in</h1>
            <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">Access your LCU Portal account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@lcu.edu.ng" autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pr-10" placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-5">
            No account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-dark-100 dark:border-dark-700">
            <p className="text-xs text-dark-400 text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              {demoLogins.map(d => (
                <button key={d.label} onClick={() => handleDemo(d)}
                  className="text-xs px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-left">
                  <span className="font-medium">{d.label}</span><br />
                  <span className="text-dark-400 text-xs">{d.email}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 p-2.5 bg-dark-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs text-dark-500 dark:text-dark-400">
                <span className="font-medium">Student:</span> Register a new account below
                <br /><span className="font-medium">Admin pw:</span> admin123 &nbsp;
                <span className="font-medium">Lecturer pw:</span> lecturer123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
