import { PageHeader } from '../../components/common/UI';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const notifications = [
  { id: 1, type: 'info', title: 'Registration is now open', body: 'Course registration for the 2024/2025 First Semester is now open. Register before the deadline.', time: '2 hours ago' },
  { id: 2, type: 'success', title: 'Registration deadline extended', body: 'The course registration deadline has been extended by one week. Please complete your registration.', time: '1 day ago' },
  { id: 3, type: 'warning', title: 'Minimum credit units reminder', body: 'Ensure you register a minimum of 12 credit units to be eligible for examinations.', time: '3 days ago' },
  { id: 4, type: 'info', title: 'Exam timetable published', body: 'The first semester examination timetable has been published. Check your personalised schedule.', time: '5 days ago' },
];

const icons = { info: Info, success: CheckCircle, warning: AlertTriangle };
const colors = {
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function Notifications() {
  return (
    <div>
      <PageHeader title="Notifications" description={`${notifications.length} notifications`} />
      <div className="max-w-2xl space-y-3">
        {notifications.map(n => {
          const Icon = icons[n.type];
          return (
            <div key={n.id} className="card p-4 flex gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[n.type]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-dark-800 dark:text-dark-100">{n.title}</p>
                <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-dark-400 mt-2">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
