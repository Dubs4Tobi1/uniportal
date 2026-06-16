import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/UI';
import courseService from '../../services/courseService';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { Printer, Download } from 'lucide-react';

export default function CourseForm() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    setCourses(courseService.getStudentCourses(user.userId));
    setProfile(authService.getProfile(user.userId));
  }, []);

  const totalUnits = courses.reduce((s, c) => s + c.credits, 0);

  const handlePrint = () => window.print();

  return (
    <div>
      <PageHeader
        title="Course Registration Form"
        description="Print or save your official course registration form"
        actions={
          <div className="flex gap-2 no-print">
            <button onClick={handlePrint} className="btn-secondary"><Printer size={14} /> Print</button>
          </div>
        }
      />

      <div ref={printRef} className="card p-8 max-w-3xl" id="print-form">
        {/* Header */}
        <div className="text-center border-b-2 border-dark-900 dark:border-dark-100 pb-4 mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl font-display">LCU</span>
          </div>
          <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 font-display uppercase tracking-wide">Landmark Christian University</h2>
          <p className="text-sm text-dark-600 dark:text-dark-300 mt-1">Department of {profile?.department || 'Natural Sciences'}</p>
          <p className="text-base font-bold mt-2 text-dark-800 dark:text-dark-100 uppercase">Course Registration Form</p>
          <p className="text-sm text-dark-500">2024/2025 Academic Session — First Semester</p>
        </div>

        {/* Student info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          {[
            ['Student Name', profile?.name || user.name],
            ['Matric Number', profile?.matricNumber || 'N/A'],
            ['Department', profile?.department || 'N/A'],
            ['Level', profile?.level ? `${profile.level} Level` : 'N/A'],
            ['Email', profile?.email || user.email],
            ['Phone', profile?.phone || 'N/A'],
          ].map(([label, value]) => (
            <div key={label} className="border border-dark-300 dark:border-dark-600 rounded p-2.5">
              <p className="text-xs text-dark-500 font-medium uppercase tracking-wide">{label}</p>
              <p className="font-semibold text-dark-900 dark:text-dark-50 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Courses table */}
        <table className="w-full border-collapse border border-dark-300 dark:border-dark-600 text-sm mb-6">
          <thead>
            <tr className="bg-dark-100 dark:bg-dark-700">
              <th className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-left text-xs font-bold uppercase">S/N</th>
              <th className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-left text-xs font-bold uppercase">Course Code</th>
              <th className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-left text-xs font-bold uppercase">Course Title</th>
              <th className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-left text-xs font-bold uppercase">Units</th>
              <th className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-left text-xs font-bold uppercase">Lecturer</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} className={i % 2 === 0 ? '' : 'bg-dark-50 dark:bg-dark-800/50'}>
                <td className="border border-dark-300 dark:border-dark-600 px-3 py-2">{i + 1}</td>
                <td className="border border-dark-300 dark:border-dark-600 px-3 py-2 font-mono font-semibold">{c.code}</td>
                <td className="border border-dark-300 dark:border-dark-600 px-3 py-2">{c.title}</td>
                <td className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-center font-semibold">{c.credits}</td>
                <td className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-dark-600 dark:text-dark-400">{c.lecturerName || 'TBA'}</td>
              </tr>
            ))}
            <tr className="bg-dark-100 dark:bg-dark-700 font-bold">
              <td colSpan={3} className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-right">Total Credit Units:</td>
              <td className="border border-dark-300 dark:border-dark-600 px-3 py-2 text-center text-primary-600">{totalUnits}</td>
              <td className="border border-dark-300 dark:border-dark-600" />
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-4">
          {['Student Signature', 'Advisor Signature', 'HOD Signature'].map(label => (
            <div key={label} className="text-center">
              <div className="border-t-2 border-dark-900 dark:border-dark-300 mt-8 pt-2">
                <p className="text-xs text-dark-600 dark:text-dark-400">{label}</p>
                <p className="text-xs text-dark-400">Date: ___________</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-dark-400 text-center mt-6">Generated on {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — LCU Academic Portal</p>
      </div>
    </div>
  );
}
