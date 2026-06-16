import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatCard, SearchBar, Modal, ConfirmDialog, EmptyState } from '../../components/common/UI';
import courseService from '../../services/courseService';
import authService from '../../services/authService';
import { COURSES, LECTURERS_DATA } from '../../data/courses';
import toast from 'react-hot-toast';
import { BookOpen, Users, GraduationCap, BarChart3, Plus, Edit2, Trash2, UserCog, Save } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses: 0, students: 0, lecturers: 0, regs: 0 });

  useEffect(() => {
    const courses = courseService.getAllCourses();
    const students = authService.getAllStudents();
    const lecturers = authService.getAllLecturers();
    const regs = courseService.getAllRegistrations();
    const totalRegs = Object.values(regs).reduce((s, a) => s + a.length, 0);
    setStats({ courses: courses.length, students: students.length, lecturers: lecturers.length, regs: totalRegs });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">Admin Dashboard</h1>
        <p className="text-sm text-dark-500 mt-1">System overview — 2024/2025 Academic Session</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Total Courses" value={stats.courses} color="green" />
        <StatCard icon={GraduationCap} label="Students" value={stats.students} color="blue" />
        <StatCard icon={UserCog} label="Lecturers" value={stats.lecturers} color="purple" />
        <StatCard icon={BarChart3} label="Registrations" value={stats.regs} color="orange" />
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-1">System Status</h3>
        <p className="text-sm text-dark-500 mb-4">Registration is currently <span className="text-primary-600 font-medium">open</span>.</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p className="font-semibold text-primary-700 dark:text-primary-400">Registration</p>
            <p className="text-primary-600 text-xs mt-0.5">Open</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-700 dark:text-blue-400">Semester</p>
            <p className="text-blue-600 text-xs mt-0.5">First Semester</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="font-semibold text-orange-700 dark:text-orange-400">Session</p>
            <p className="text-orange-600 text-xs mt-0.5">2024/2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ code: '', title: '', credits: 3, department: '', level: 100, semester: 1, description: '', lecturerName: '' });

  const load = () => setCourses(courseService.getAllCourses());
  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (c) => {
    setEditing(c);
    setForm({ code: c.code, title: c.title, credits: c.credits, department: c.department, level: c.level, semester: c.semester, description: c.description || '', lecturerName: c.lecturerName || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', title: '', credits: 3, department: '', level: 100, semester: 1, description: '', lecturerName: '' });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      courseService.updateCourse(editing.id, form);
      toast.success('Course updated');
    } else {
      courseService.createCourse(form);
      toast.success('Course created');
    }
    setShowModal(false);
    load();
  };

  const handleDelete = () => {
    courseService.deleteCourse(deleteConfirm.id);
    toast.success('Course deleted');
    setDeleteConfirm(null);
    load();
  };

  const lecturers = authService.getAllLecturers();

  return (
    <div>
      <PageHeader title="Manage Courses" description={`${courses.length} courses total`}
        actions={<button onClick={openCreate} className="btn-primary"><Plus size={14} /> New Course</button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search courses..." /></div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
              <tr>{['Code', 'Title', 'Credits', 'Dept', 'Level', 'Lecturer', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30">
                  <td className="table-cell font-mono font-semibold text-primary-600">{c.code}</td>
                  <td className="table-cell font-medium">{c.title}</td>
                  <td className="table-cell"><span className="badge-green">{c.credits}</span></td>
                  <td className="table-cell text-dark-500 text-xs">{c.department}</td>
                  <td className="table-cell"><span className="badge-gray">{c.level}L</span></td>
                  <td className="table-cell text-xs text-dark-500">{c.lecturerName || 'Unassigned'}</td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteConfirm(c)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Course' : 'New Course'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Course Code</label>
              <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Credits</label>
              <input type="number" min={1} max={6} required value={form.credits} onChange={e => setForm(f => ({ ...f, credits: Number(e.target.value) }))} className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Course Title</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Department</label>
              <input required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Level</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} className="input-field">
                {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Semester</label>
              <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: Number(e.target.value) }))} className="input-field">
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
            <div>
              <label className="label">Lecturer</label>
              <select value={form.lecturerName} onChange={e => setForm(f => ({ ...f, lecturerName: e.target.value }))} className="input-field">
                <option value="">Unassigned</option>
                {lecturers.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary"><Save size={14} /> Save</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete}
        title="Delete Course" message={`Delete ${deleteConfirm?.code}? This will remove it from all registrations.`} confirmLabel="Delete" danger />
    </div>
  );
}

export function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => setStudents(authService.getAllStudents());
  useEffect(() => { load(); }, []);

  const filtered = students.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || (s.matricNumber || '').toLowerCase().includes(search.toLowerCase()));

  const handleDelete = () => {
    authService.deleteUser(deleteConfirm.id);
    toast.success('Student removed');
    setDeleteConfirm(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Manage Students" description={`${students.length} registered students`} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search students..." /></div>
      {filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No students found" description="Students who register on the portal will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
                <tr>{['Name', 'Email', 'Matric No.', 'Dept', 'Level', 'Registered', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                {filtered.map(s => {
                  const regCourses = courseService.getStudentCourses(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30">
                      <td className="table-cell font-medium">{s.name}</td>
                      <td className="table-cell text-dark-500 text-xs">{s.email}</td>
                      <td className="table-cell font-mono text-xs">{s.matricNumber || 'N/A'}</td>
                      <td className="table-cell text-xs text-dark-500">{s.department}</td>
                      <td className="table-cell"><span className="badge-gray">{s.level}L</span></td>
                      <td className="table-cell"><span className="badge-green">{regCourses.length} courses</span></td>
                      <td className="table-cell">
                        <button onClick={() => setDeleteConfirm(s)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete}
        title="Remove Student" message={`Remove ${deleteConfirm?.name} from the system?`} confirmLabel="Remove" danger />
    </div>
  );
}

export function ManageLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => setLecturers(authService.getAllLecturers());
  useEffect(() => { load(); }, []);

  const filtered = lecturers.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Manage Lecturers" description={`${lecturers.length} lecturers`} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search lecturers..." /></div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
              <tr>{['Name', 'Email', 'Department', 'Qualification', 'Courses'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {filtered.map(l => {
                const all = courseService.getAllCourses();
                const myCourses = all.filter(c => c.lecturerName === l.name);
                return (
                  <tr key={l.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30">
                    <td className="table-cell font-medium">{l.name}</td>
                    <td className="table-cell text-xs text-dark-500">{l.email}</td>
                    <td className="table-cell text-xs text-dark-500">{l.department}</td>
                    <td className="table-cell text-xs text-dark-500">{l.qualification}</td>
                    <td className="table-cell"><span className="badge-blue">{myCourses.length}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AssignLecturers() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => { setCourses(courseService.getAllCourses()); setLecturers(authService.getAllLecturers()); };
  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase()));

  const handleAssign = (courseId, lecturerName) => {
    courseService.updateCourse(courseId, { lecturerName });
    toast.success('Lecturer assigned');
    load();
  };

  return (
    <div>
      <PageHeader title="Assign Lecturers" description="Assign lecturers to courses" />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search courses..." /></div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
              <tr>{['Course Code', 'Title', 'Department', 'Current Lecturer', 'Assign'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30">
                  <td className="table-cell font-mono font-semibold text-primary-600">{c.code}</td>
                  <td className="table-cell font-medium text-sm">{c.title}</td>
                  <td className="table-cell text-xs text-dark-500">{c.department}</td>
                  <td className="table-cell text-xs">{c.lecturerName ? <span className="badge-blue">{c.lecturerName}</span> : <span className="badge-red">Unassigned</span>}</td>
                  <td className="table-cell">
                    <select value={c.lecturerName || ''} onChange={e => handleAssign(c.id, e.target.value)} className="input-field py-1.5 text-xs w-48">
                      <option value="">Unassigned</option>
                      {lecturers.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const [data, setData] = useState({ courses: [], students: [], regs: {} });

  useEffect(() => {
    setData({
      courses: courseService.getAllCourses(),
      students: authService.getAllStudents(),
      regs: courseService.getAllRegistrations(),
    });
  }, []);

  const totalRegs = Object.values(data.regs).reduce((s, a) => s + a.length, 0);
  const avgPerStudent = data.students.length > 0 ? (totalRegs / data.students.length).toFixed(1) : 0;

  const topCourses = data.courses
    .map(c => ({ ...c, count: Object.values(data.regs).filter(arr => arr.includes(c.id)).length }))
    .sort((a, b) => b.count - a.count).slice(0, 10);

  const deptBreakdown = data.courses.reduce((acc, c) => {
    if (!acc[c.department]) acc[c.department] = { courses: 0, students: 0 };
    acc[c.department].courses++;
    const enrolled = Object.values(data.regs).filter(arr => arr.includes(c.id)).length;
    acc[c.department].students += enrolled;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Registration statistics and insights" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={BookOpen} label="Total Courses" value={data.courses.length} color="green" />
        <StatCard icon={GraduationCap} label="Students" value={data.students.length} color="blue" />
        <StatCard icon={BarChart3} label="Total Registrations" value={totalRegs} color="orange" />
        <StatCard icon={Users} label="Avg Courses/Student" value={avgPerStudent} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-4">Top Enrolled Courses</h3>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-mono text-dark-700 dark:text-dark-300">{c.code}</span>
                  <span className="text-dark-500">{c.count} students</span>
                </div>
                <div className="h-1.5 bg-dark-100 dark:bg-dark-700 rounded-full">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${topCourses[0].count > 0 ? (c.count / topCourses[0].count) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-4">Department Overview</h3>
          <div className="space-y-2">
            {Object.entries(deptBreakdown).sort(([,a],[,b]) => b.students - a.students).map(([dept, d]) => (
              <div key={dept} className="flex items-center justify-between py-2 border-b border-dark-100 dark:border-dark-700 last:border-0">
                <p className="text-sm text-dark-700 dark:text-dark-300">{dept}</p>
                <div className="flex gap-2">
                  <span className="badge-gray">{d.courses} courses</span>
                  <span className="badge-blue">{d.students} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SystemSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ maxUnits: 24, minUnits: 12, regOpen: true, session: '2024/2025', semester: '1' });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="System Settings" description="Configure portal-wide settings" />
      <div className="max-w-xl">
        <form onSubmit={handleSave} className="card p-6 space-y-5">
          <div>
            <label className="label">Academic Session</label>
            <input value={settings.session} onChange={e => setSettings(s => ({ ...s, session: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">Current Semester</label>
            <select value={settings.semester} onChange={e => setSettings(s => ({ ...s, semester: e.target.value }))} className="input-field">
              <option value="1">First Semester</option>
              <option value="2">Second Semester</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Max Credit Units</label>
              <input type="number" value={settings.maxUnits} onChange={e => setSettings(s => ({ ...s, maxUnits: Number(e.target.value) }))} className="input-field" />
            </div>
            <div>
              <label className="label">Min Credit Units</label>
              <input type="number" value={settings.minUnits} onChange={e => setSettings(s => ({ ...s, minUnits: Number(e.target.value) }))} className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="regOpen" checked={settings.regOpen} onChange={e => setSettings(s => ({ ...s, regOpen: e.target.checked }))} className="rounded text-primary-600 w-4 h-4" />
            <label htmlFor="regOpen" className="text-sm font-medium text-dark-700 dark:text-dark-300">Course registration is open</label>
          </div>
          <button type="submit" className="btn-primary"><Save size={14} /> Save Settings</button>
        </form>
      </div>
    </div>
  );
}
