import { Employee } from '../services/mockData';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export default function EmployeeDetailsModal({ employee, onClose }: Props) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const calculateTenure = (dateStr: string) => {
    const joinDate = new Date(dateStr);
    const now = new Date();
    if (isNaN(joinDate.getTime())) return 'N/A';

    let years = now.getFullYear() - joinDate.getFullYear();
    let months = now.getMonth() - joinDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years < 0) return 'Just joined';

    const yearText = years > 0 ? `${years} yr${years !== 1 ? 's' : ''}` : '';
    const monthText = months > 0 ? `${months} mo${months !== 1 ? 's' : ''}` : '';

    return [yearText, monthText].filter(Boolean).join(' ') || 'Less than a month';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all scale-100 animate-slide-in">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-650 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/35 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center shadow-md">
              {getInitials(employee.name)}
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 border shadow-2xs ${employee.status === 'Active'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${employee.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {employee.status}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">{employee.name}</h3>
            <p className="text-sm font-medium text-slate-550">{employee.designation}</p>
            <div className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-750 rounded-md">
              {employee.department}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email Address</p>
                <p className="text-sm text-slate-700 font-medium truncate">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Joining Date</p>
                <p className="text-sm text-slate-700 font-medium">
                  {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Work Tenure</p>
                <p className="text-sm text-slate-700 font-medium">
                  {calculateTenure(employee.joiningDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
