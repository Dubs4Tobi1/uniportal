import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, SearchBar, EmptyState } from '../../components/common/UI';
import courseService from '../../services/courseService';
import { MAX_CREDIT_UNITS } from '../../data/courses';
import toast from 'react-hot-toast';
import { BookOpen, Plus, Check, Filter } from 'lucide-react';

export default function CourseRegistration() {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const load = () => {
    setAll(courseService.getAllCourses());
    setRegistered(courseService.getStudentCourses(user.userId));
  };

  useEffect(() => { load(); }, []);

  const totalUnits = registered.reduce((s, c) => s + c.credits, 0);
  const registeredIds = new Set(registered.map(c => c.id));

  const filtered = all.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
    const matchDept = !deptFilter || c.department === deptFilter;
    const matchLevel = !levelFilter || c.level === Number(levelFilter);
    return matchSearch && matchDept && matchLevel;
  });

  const departments = [...new Set(all.map(c => c.department))].sort();

  const handleRegister = (course) => {
    if (registeredIds.has(course.id)) {
      toast('Already registered for this course.', { icon: 'ℹ️' });
      return;
    }
    const result = courseService.registerCourse(user.userId, course.id);
    if (result.success) {
      toast.success(`Registered for ${course.code}`);
      load();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <PageHeader
        title="Course Registration"
        description={`${totalUnits} / ${MAX_CREDIT_UNITS} credit units registered`}
      />

      {/* Unit progress */}
      <div className="card p-4 mb-5">
        <div className="flex justify-between text-xs text-dark-500 mb-1.5">
          <span>Credit Units Used</span>
          <span className="font-medium">{totalUnits} / {MAX_CREDIT_UNITS}</span>
        </div>
        <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full">
          <div className={`h-full rounded-full ${totalUnits >= MAX_CREDIT_UNITS ? 'bg-red-500' : 'bg-primary-500'}`}
            style={{ width: `${Math.min((totalUnits / MAX_CREDIT_UNITS) * 100, 100)}%`, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search by code or title..." /></div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field sm:w-52">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="input-field sm:w-36">
          <option value="">All Levels</option>
          {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-dark-400 mb-3">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => {
            const isReg = registeredIds.has(course.id);
            const wouldExceed = !isReg && totalUnits + course.credits > MAX_CREDIT_UNITS;
            return (
              <div key={course.id} className={`card p-4 flex flex-col gap-3 ${isReg ? 'border-primary-300 dark:border-primary-700' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-dark-900 dark:text-dark-50 font-mono">{course.code}</p>
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{course.department}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge-green">{course.credits} units</span>
                    <span className="badge-gray">{course.level}L</span>
                  </div>
                </div>
                <p className="text-sm text-dark-700 dark:text-dark-300 font-medium leading-tight">{course.title}</p>
                {course.lecturerName && (
                  <p className="text-xs text-dark-400 flex items-center gap-1">
                    <span>👤</span> {course.lecturerName}
                  </p>
                )}
                <button
                  onClick={() => handleRegister(course)}
                  disabled={isReg || wouldExceed}
                  className={`mt-auto flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                    ${isReg ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 cursor-default border border-primary-200 dark:border-primary-800'
                      : wouldExceed ? 'bg-dark-100 text-dark-400 cursor-not-allowed dark:bg-dark-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                >
                  {isReg ? <><Check size={14} /> Registered</> : wouldExceed ? 'Exceeds limit' : <><Plus size={14} /> Register</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
