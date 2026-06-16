import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/UI';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { Save, User } from 'lucide-react';

const DEPARTMENTS = ['Natural Sciences', 'Economics', 'Computer Science', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'Insurance', 'Public Health'];

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = authService.getProfile(user.userId);
    setProfile(p);
    setForm({ name: p?.name || '', phone: p?.phone || '', gender: p?.gender || '', department: p?.department || '', level: p?.level || 100 });
  }, [user.userId]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    authService.updateProfile(user.userId, form);
    refreshUser();
    toast.success('Profile updated');
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal information" />
      <div className="max-w-2xl">
        {/* Avatar */}
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-dark-900 dark:text-dark-50 text-lg">{profile?.name}</p>
              <p className="text-sm text-dark-500">{profile?.email}</p>
              <p className="text-xs font-mono text-primary-600 mt-0.5">{profile?.matricNumber}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="card p-6 space-y-4">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-2">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input value={form.name || ''} onChange={set('name')} className="input-field" required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input value={profile?.email || ''} disabled className="input-field bg-dark-50 dark:bg-dark-700 cursor-not-allowed" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.phone || ''} onChange={set('phone')} className="input-field" placeholder="+234..." />
            </div>
            <div>
              <label className="label">Gender</label>
              <select value={form.gender || ''} onChange={set('gender')} className="input-field">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <select value={form.department || ''} onChange={set('department')} className="input-field">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Level</label>
              <select value={form.level || 100} onChange={set('level')} className="input-field">
                {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l} Level</option>)}
              </select>
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary"><Save size={14} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
