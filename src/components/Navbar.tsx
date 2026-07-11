import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-xl text-blue-650">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent tracking-tight">
              ASKEVA
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="p-2 text-slate-450 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all relative focus:outline-none cursor-pointer" title="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* User Profile Info & Logout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {/* Initials Avatar */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-550 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(user?.name || '')}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-slate-700">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-all focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
