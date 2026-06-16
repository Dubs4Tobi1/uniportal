import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Layers, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const DEPARTMENTS = ['Natural Sciences', 'Economics', 'Computer Science', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'Insurance', 'Public Health'];
const LEVELS = [100, 200, 300, 400, 500];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', department: '', level: '', phone: '', gender: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    const result = register(form);
    if (result.success) {
      toast.success('Account created! Welcome to LCU Portal.');
      navigate('/student', { replace: true });
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 mb-6">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Layers size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">Create account</h1>
            <p className="text-sm text-dark-500 mt-1">Student registration — LCU Portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name</label>
                <input required value={form.name} onChange={set('name')} className="input-field" placeholder="John Doe" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Email Address</label>
                <input type="email" required value={form.email} onChange={set('email')} className="input-field" placeholder="you@email.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} className="input-field pr-10" placeholder="Min. 6 chars" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={set('confirm')} className="input-field" placeholder="Repeat password" />
              </div>
              <div>
                <label className="label">Department</label>
                <select required value={form.department} onChange={set('department')} className="input-field">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Level</label>
                <select required value={form.level} onChange={set('level')} className="input-field">
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l} Level</option>)}
                </select>
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <input value={form.phone} onChange={set('phone')} className="input-field" placeholder="+234..." />
              </div>
              <div>
                <label className="label">Gender (optional)</label>
                <select value={form.gender} onChange={set('gender')} className="input-field">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-dark-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
