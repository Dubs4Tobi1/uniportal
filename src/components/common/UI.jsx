import { X } from 'lucide-react';

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-dark-200 dark:border-dark-700 animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200 dark:border-dark-700">
          <h3 className="font-semibold text-dark-900 dark:text-dark-50 text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-dark-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return <div className={`${s[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`} />;
};

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <div className="w-14 h-14 rounded-full bg-dark-100 dark:bg-dark-700 flex items-center justify-center mb-4"><Icon size={24} className="text-dark-400" /></div>}
    <h3 className="font-semibold text-dark-700 dark:text-dark-300 mb-1">{title}</h3>
    {description && <p className="text-sm text-dark-500 mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
);

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-dark-600 dark:text-dark-400 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={() => { onConfirm(); onClose(); }} className={danger ? 'btn-danger' : 'btn-primary'}>{confirmLabel}</button>
    </div>
  </Modal>
);

export const StatCard = ({ icon: Icon, label, value, color = 'green', sub }) => {
  const colors = {
    green: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <div className="stat-card">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-dark-900 dark:text-dark-50 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-dark-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-dark-900 dark:text-dark-50 font-display">{title}</h1>
      {description && <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="input-field pl-9" />
  </div>
);

export const Table = ({ columns, data, emptyMessage = 'No data found.' }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="border-b border-dark-200 dark:border-dark-700">
        <tr>{columns.map(col => <th key={col.key} className="table-header">{col.label}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
        {data.length === 0
          ? <tr><td colSpan={columns.length} className="table-cell text-center text-dark-400 py-10">{emptyMessage}</td></tr>
          : data.map((row, i) => (
            <tr key={i} className="hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="table-cell">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);
