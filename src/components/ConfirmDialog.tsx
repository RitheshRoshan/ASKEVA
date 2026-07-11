interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Scrim */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCancel} />
      
      {/* Card */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 transform transition-all scale-100 animate-slide-in">
        <div className="flex gap-4">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl h-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all rounded-xl shadow-md shadow-rose-650/10 active:scale-98 cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
