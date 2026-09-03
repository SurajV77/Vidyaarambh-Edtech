import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  LogOut,
  Calendar,
  Sparkles,
} from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navTabs = [
    { label: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Study Materials', path: '/student/materials', icon: FileText },
    { label: 'Fee Ledger', path: '/student/fees', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col text-ink-900">
      {/* Top Academic Header */}
      <header className="sticky top-0 z-30 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-borderWarm shadow-paper-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Crest */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-academic bg-white p-1 flex items-center justify-center border border-borderWarm shadow-paper-sm">
              <img src="/logo.png" alt="Vidyaarambh Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-navy-950 leading-tight">
                Vidyaarambh
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-gold-700">
                Student Learning Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-ivory-sand/90 p-1 rounded-academic border border-borderWarm">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition ${
                    isActive
                      ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm'
                      : 'text-ink-700 hover:text-navy-950 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-gold-700' : 'text-ink-600'}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Student Profile snippet & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-navy-950 leading-tight">{user?.name}</span>
              <span className="text-[10.5px] text-ink-700 font-semibold">
                {user?.standardClass || 'Class'} • Roll: {user?.rollNo || '-'}
              </span>
            </div>
            <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center font-serif font-bold text-xs shadow-paper-sm border border-navy-800">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-academic border border-borderWarm bg-white text-ink-700 hover:text-academic-crimson hover:bg-ivory-sand transition shadow-paper-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex border-t border-borderWarm px-2 py-1 justify-around bg-ivory-sand/80">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded text-xs font-bold ${
                  isActive ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm' : 'text-ink-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-borderWarm py-5 text-center text-xs text-ink-700 font-medium">
        <p className="font-serif italic text-[11px] text-ink-700 mb-1">
          "Every lesson builds the next step toward academic mastery."
        </p>
        <p>© {new Date().getFullYear()} Vidyaarambh Tuition Management. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default StudentLayout;
