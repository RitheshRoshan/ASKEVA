import { Employee } from '../services/mockData';

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onView: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete, onView }: Props) {
  if (employees.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-50 rounded-full text-slate-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="max-w-xs">
          <h4 className="text-sm font-bold text-slate-800">No employees match criteria</h4>
          <p className="text-xs text-slate-400 mt-1">Try expanding your search query or adjusting selected filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex-initial flex flex-col min-h-0">
      <div className="overflow-auto">
        <table className="w-full text-sm text-slate-650 border-collapse">
          <thead>
            <tr className="bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 sticky top-0 z-10 shadow-sm shadow-slate-100/50">
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Name</th>
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Email Address</th>
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Department</th>
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Designation</th>
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Status</th>
              <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Joining Date</th>
              <th className="text-right px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-900">{emp.name}</td>
                <td className="px-5 py-4 text-slate-600 font-medium">{emp.email}</td>
                <td className="px-5 py-4 text-slate-500">
                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-md">
                    {emp.department}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 font-medium">{emp.designation}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {emp.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 font-medium">
                  {new Date(emp.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onEdit(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
                      title="Edit employee"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onDelete(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
                      title="Delete employee"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
