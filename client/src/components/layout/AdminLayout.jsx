import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  Calendar,
  ChevronRight,
  Shield,
  BookOpen,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Students',
      items: [
        { label: 'Student Directory', path: '/admin/students', icon: Users },
      ],
    },
    {
      title: 'Academic',
      items: [
        { label: 'Homework & PDFs', path: '/admin/materials', icon: FileText },
      ],
    },
    {
      title: 'Finance',
      items: [
        { label: 'Fees & Revenue', path: '/admin/fees', icon: CreditCard },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Notice Board', path: '/admin/notices', icon: Bell },
      ],
    },
  ];

  // Helper for current page title
  const getPageInfo = () => {
    const p = location.pathname;
    if (p.includes('/admin/students')) return { title: 'Students', section: '01 Directory' };
    if (p.includes('/admin/fees')) return { title: 'Finance & Fees', section: '02 Financial Ledger' };
    if (p.includes('/admin/materials')) return { title: 'Study Materials', section: '03 Academic Documents' };
    if (p.includes('/admin/notices')) return { title: 'Notice Board', section: '04 Announcements' };
    return { title: 'Dashboard', section: 'Academic Overview' };
  };

  const pageInfo = getPageInfo();

  // Current formatted date
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-[#FAF8F3] text-ink-900">
      {/* Sidebar for Desktop - Deep Navy Academic Foundation */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy-950 border-r border-navy-900 fixed inset-y-0 left-0 z-30 select-none">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-navy-900 flex items-center gap-3">
          <div className="h-10 w-10 rounded-academic bg-white p-1 flex items-center justify-center shadow-paper-sm border border-gold-500/40">
            <img src="/logo.png" alt="Vidyaarambh Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-base text-white tracking-wide leading-tight">
              Vidyaarambh
            </h1>
            <p className="text-[10px] tracking-widest font-extrabold uppercase text-gold-400 mt-0.5">
              Tuition Management
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-navy-300">
                {group.title}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-academic text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FAF8F3] text-navy-950 font-bold shadow-paper-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {/* Left Gold Accent Indicator for Active Item */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gold-500 rounded-r" />
                    )}
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isActive ? 'text-navy-950' : 'text-navy-300 group-hover:text-gold-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Administrator Profile Box */}
        <div className="p-3.5 border-t border-navy-900 bg-navy-950/80">
          <div className="flex items-center justify-between p-2 rounded-academic bg-white/5 border border-white/15">
            <div className="flex items-center gap-2.5 truncate">
              <div className="relative flex-shrink-0">
                <div className="h-8 w-8 rounded-academic bg-gold-500/20 text-gold-300 border border-gold-500/50 flex items-center justify-center font-serif font-bold text-xs">
                  {user?.name?.charAt(0) || 'T'}
                </div>
                {/* Small Green Online Status Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-academic-green border-2 border-navy-950" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10.5px] text-navy-200 font-medium truncate">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded text-navy-300 hover:text-academic-crimson hover:bg-white/10 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-14 bg-[#FAF8F3]/95 backdrop-blur-sm border-b border-borderWarm flex items-center justify-between px-4 sm:px-8">
          {/* Left Title & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-academic border border-borderWarm bg-white text-ink-800 hover:bg-ivory-sand"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-serif font-bold text-gold-700 hidden sm:inline">
                {pageInfo.section}
              </span>
              <span className="text-borderWarm hidden sm:inline">/</span>
              <h2 className="font-serif font-bold text-sm sm:text-base text-navy-950">
                {pageInfo.title}
              </h2>
            </div>
          </div>

          {/* Right Date & Institute Meta */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-ink-700 font-semibold">
              <Calendar className="h-3.5 w-3.5 text-gold-700" />
              <span>{todayFormatted}</span>
            </div>
            <div className="h-3 w-px bg-borderWarm hidden sm:block" />
            <span className="text-[11px] font-bold text-navy-900 bg-white border border-borderWarm px-2.5 py-0.5 rounded-academic shadow-paper-sm">
              Vidyaarambh Portal
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bg-navy-950 border-b border-navy-900 shadow-paper-elevated z-30 p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-300">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-academic text-xs font-semibold ${
                        isActive
                          ? 'bg-[#FAF8F3] text-navy-950 font-bold'
                          : 'text-navy-100 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="pt-2 border-t border-navy-900 flex justify-between items-center text-xs">
              <span className="text-white font-semibold">{user?.name} (Admin)</span>
              <button
                onClick={handleLogout}
                className="text-academic-crimson hover:underline font-bold flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
