import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, SearchBar, EmptyState } from '../../components/common/UI';
import timetableService from '../../services/timetableService';
import { CalendarDays, MapPin, Clock, User } from 'lucide-react';

export default function ExamTimetable() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [myOnly, setMyOnly] = useState(false);

  useEffect(() => {
    const all = timetableService.getAll();
    const mine = timetableService.getByStudent(user.userId);
    setEntries({ all, mine });
  }, [user.userId]);

  const source = myOnly ? (entries.mine || []) : (entries.all || []);
  const filtered = search
    ? source.filter(t => t.courseCode.toLowerCase().includes(search.toLowerCase()) || t.venue.toLowerCase().includes(search.toLowerCase()) || t.day.toLowerCase().includes(search.toLowerCase()))
    : source;

  // Group by date
  const grouped = filtered.reduce((acc, t) => {
    const key = `${t.date}|||${t.day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Examination Timetable" description="2024/2025 First Semester Examinations" />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search course code, venue..." /></div>
        <label className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 cursor-pointer card px-4 py-2.5">
          <input type="checkbox" checked={myOnly} onChange={e => setMyOnly(e.target.checked)} className="rounded text-primary-600" />
          My courses only
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No timetable entries" description={myOnly ? "Register courses to see your exam schedule." : "No exams found."} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([key, exams]) => {
            const [date, day] = key.split('|||');
            const d = new Date(date);
            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                    <p className="text-xs font-medium leading-none">{day.slice(0, 3)}</p>
                    <p className="text-lg font-bold leading-tight">{d.getDate()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark-800 dark:text-dark-100">{day}</p>
                    <p className="text-xs text-dark-400">{d.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 ml-0 sm:ml-15">
                  {exams.sort((a, b) => a.time.localeCompare(b.time)).map(exam => {
                    const isMine = (entries.mine || []).some(m => m.id === exam.id);
                    return (
                      <div key={exam.id} className={`card p-4 border-l-4 ${isMine ? 'border-l-primary-500' : 'border-l-dark-200 dark:border-l-dark-600'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold text-dark-900 dark:text-dark-50 font-mono">{exam.courseCode}</p>
                          {isMine && <span className="badge-green text-xs">My Exam</span>}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                            <Clock size={12} /> {exam.time}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                            <MapPin size={12} /> {exam.venue}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                            <User size={12} /> {exam.invigilator}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
