// MyCourses.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, EmptyState, ConfirmDialog } from '../../components/common/UI';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';
import { BookCheck, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

export function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const load = () => setCourses(courseService.getStudentCourses(user.userId));
  useEffect(() => { load(); }, []);

  const handleDrop = (course) => {
    setConfirm(course);
  };

  const doDrop = () => {
    courseService.dropCourse(user.userId, confirm.id);
    toast.success(`Dropped ${confirm.code}`);
    load();
    setConfirm(null);
  };

  const totalUnits = courses.reduce((s, c) => s + c.credits, 0);

  const exportCSV = () => {
    const data = courses.map(c => ({ Code: c.code, Title: c.title, Credits: c.credits, Department: c.department, Level: c.level, Lecturer: c.lecturerName }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'my-courses.csv'; a.click();
    toast.success('Exported as CSV');
  };

  return (
    <div>
      <PageHeader
        title="My Registered Courses"
        description={`${courses.length} courses · ${totalUnits} credit units`}
        actions={
          courses.length > 0 && (
            <button onClick={exportCSV} className="btn-secondary text-sm py-2"><Download size={14} /> Export CSV</button>
          )
        }
      />
      {courses.length === 0 ? (
        <EmptyState icon={BookCheck} title="No courses registered" description="Head to Course Registration to get started."
          action={<Link to="/student/register" className="btn-primary">Browse Courses</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
                <tr>
                  {['Code', 'Title', 'Dept', 'Level', 'Credits', 'Lecturer', ''].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/30 transition-colors">
                    <td className="table-cell font-mono font-semibold text-primary-600">{c.code}</td>
                    <td className="table-cell font-medium">{c.title}</td>
                    <td className="table-cell text-dark-500">{c.department}</td>
                    <td className="table-cell"><span className="badge-gray">{c.level}L</span></td>
                    <td className="table-cell"><span className="badge-green">{c.credits}</span></td>
                    <td className="table-cell text-dark-500">{c.lecturerName || 'TBA'}</td>
                    <td className="table-cell">
                      <button onClick={() => handleDrop(c)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-700/50">
                <tr>
                  <td colSpan={4} className="table-cell font-semibold">Total</td>
                  <td className="table-cell font-bold text-primary-600">{totalUnits}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={doDrop}
        title="Drop Course" message={`Are you sure you want to drop ${confirm?.code} — ${confirm?.title}?`}
        confirmLabel="Drop Course" danger />
    </div>
  );
}
