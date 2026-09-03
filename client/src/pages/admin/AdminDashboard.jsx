import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import CountUp from '../../components/common/CountUp';
import TiltCard from '../../components/common/TiltCard';
import TypewriterText from '../../components/common/TypewriterText';
import {
  Users,
  CreditCard,
  FileText,
  AlertCircle,
  TrendingUp,
  UserPlus,
  UploadCloud,
  CheckCircle2,
  Clock,
  IndianRupee,
  Bell,
  ArrowUpRight,
  BookOpen,
  Activity,
  Layers,
  BarChart2,
  AreaChart as AreaChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    currentMonthRevenue: 0,
    totalPendingDues: 0,
    totalMaterials: 0,
    totalNotices: 0,
    chartData: [],
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('bar'); // 'bar' | 'area'

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get('/admin/dashboard-stats');
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Backend stats loading error. Using standard overview.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  const todayDateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* 1. Real-Time Moving Activity Pulse Ticker */}
      <div className="academic-panel py-2 px-4 bg-white flex items-center justify-between gap-4 overflow-hidden border-borderWarm shadow-paper-sm">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academic-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-academic-green"></span>
          </span>
          <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-navy-950">
            Live Feed:
          </span>
        </div>

        <div className="overflow-hidden relative flex-1 text-xs text-ink-800 font-semibold">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-academic-green" />
              <span>All tuition ledger systems live and synchronized</span>
            </span>
            <span className="text-borderWarm">•</span>
            <span className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-gold-700" />
              <span>{stats.recentPayments?.[0]?.student?.name ? `Latest receipt recorded for ${stats.recentPayments[0].student.name}` : 'Ready to record student tuition payments'}</span>
            </span>
            <span className="text-borderWarm">•</span>
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-navy-900" />
              <span>{stats.totalMaterials} active PDF worksheets available in student repository</span>
            </span>
            <span className="text-borderWarm">•</span>
            <span className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-navy-950" />
              <span>{stats.totalStudents} enrolled learners across all standards</span>
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-navy-900 bg-ivory-sand px-2 py-0.5 rounded border border-borderWarm flex-shrink-0">
          REAL-TIME
        </span>
      </div>

      {/* 2. Dashboard Hero / Compact Academic Salutation with Typewriter */}
      <div className="academic-panel p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold-700 block mb-1">
            Vidyaarambh Coaching Administration
          </span>
          <h1 className="text-2xl sm:text-3xl text-navy-950 font-medium tracking-tight">
            <span className="font-serif italic font-normal text-gold-700">Good morning, </span>
            <span className="font-bold text-navy-950 font-sans">Sir.</span>
          </h1>

          {/* Dynamic Typewriter Greeting */}
          <p className="mt-1 text-xs sm:text-sm text-ink-700 font-serif italic">
            <TypewriterText
              texts={[
                'Another day to help students move forward toward academic mastery.',
                'Discipline in revision builds confidence in examination halls.',
                'Structured fee management ensures uninterrupted focus on teaching.',
              ]}
              typingSpeed={40}
              deletingSpeed={20}
              pauseTime={3000}
              className="text-ink-800 font-medium"
              cursorClassName="bg-gold-600"
            />
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-ink-700 font-semibold">
            <span>{todayDateString}</span>
            <span>•</span>
            <span className="text-navy-950 font-bold">{stats.totalStudents} enrolled learners</span>
          </div>
        </div>

        {/* Academic geometric rising-arc line art with subtle float animation */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <div className="h-16 w-32 relative flex items-center justify-center animate-float-slow opacity-90">
            <svg viewBox="0 0 120 60" className="w-full h-full text-gold-600" fill="none" stroke="currentColor">
              <path d="M10 50 A50 50 0 0 1 110 50" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M25 50 A35 35 0 0 1 95 50" strokeWidth="1" />
              <path d="M40 45 Q60 48 60 55 Q60 48 80 45" strokeWidth="1.5" />
              <path d="M40 38 Q60 41 60 48 Q60 41 80 38" strokeWidth="1.5" />
              <circle cx="60" cy="20" r="3" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Link to="/admin/students" className="btn-secondary text-xs">
              <UserPlus className="h-3.5 w-3.5 text-navy-800" />
              <span>Enroll Student</span>
            </Link>
            <Link to="/admin/materials" className="btn-primary text-xs">
              <UploadCloud className="h-3.5 w-3.5 text-gold-400" />
              <span>Upload PDF</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 3D Interactive Tilt Statistics Cards with Animated CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <TiltCard maxRotation={7} className="academic-panel p-5 relative border-l-4 border-l-navy-900 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Total Students
            </span>
            <Users className="h-4 w-4 text-navy-800" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-navy-950 tracking-tight">
              <CountUp end={stats.totalStudents} duration={1200} />
            </p>
            <span className="text-xs font-bold text-academic-green">
              {stats.activeStudents} active
            </span>
          </div>
          <p className="mt-2 text-[11px] text-ink-600 font-medium">
            Across standard batch enrollments
          </p>
        </TiltCard>

        {/* Card 2: This Month's Revenue with Animated Currency Counter */}
        <TiltCard maxRotation={7} className="academic-panel p-5 relative border-l-4 border-l-gold-500 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              This Month
            </span>
            <span className="text-[11px] font-bold text-gold-700 font-mono">
              INR ₹
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-navy-950 tracking-tight font-sans">
              <CountUp end={stats.currentMonthRevenue} isCurrency={true} duration={1400} />
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gold-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active billing period</span>
          </div>
        </TiltCard>

        {/* Card 3: Total Cumulative Collection */}
        <TiltCard maxRotation={7} className="academic-panel p-5 relative border-l-4 border-l-navy-700 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Total Revenue
            </span>
            <CreditCard className="h-4 w-4 text-navy-700" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-navy-950 tracking-tight font-sans">
              <CountUp end={stats.totalRevenue} isCurrency={true} duration={1600} />
            </p>
          </div>
          <p className="mt-2 text-[11px] text-ink-600 font-medium">
            Cumulative verified fee collections
          </p>
        </TiltCard>

        {/* Card 4: Pending Dues */}
        <TiltCard maxRotation={7} className="academic-panel p-5 relative border-l-4 border-l-academic-amber bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Pending Fees
            </span>
            <AlertCircle className="h-4 w-4 text-academic-amber" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-academic-amber tracking-tight font-sans">
              <CountUp end={stats.totalPendingDues} isCurrency={true} duration={1300} />
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-700 font-medium">
            <Clock className="h-3 w-3 text-academic-amber" />
            <span>Uncollected student balances</span>
          </div>
        </TiltCard>
      </div>

      {/* 4. Responsive Moving Recharts Section with Dual View Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Charts with View Switcher */}
        <div className="lg:col-span-2 academic-panel p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderWarm gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-gold-700">01</span>
                  <h2 className="font-serif font-bold text-base text-navy-950">
                    Revenue & Fee Ledger Dynamics
                  </h2>
                </div>
                <p className="text-xs text-ink-600 font-medium mt-0.5">
                  Monthly tuition collection trend vs unpaid student balance
                </p>
              </div>

              {/* Chart Mode Switcher Buttons */}
              <div className="flex items-center gap-1 bg-ivory-sand p-1 rounded-academic border border-borderWarm self-start sm:self-auto">
                <button
                  onClick={() => setChartView('bar')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition ${
                    chartView === 'bar'
                      ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm'
                      : 'text-ink-600 hover:text-navy-950'
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5 text-navy-900" />
                  <span>Ledger Bar</span>
                </button>
                <button
                  onClick={() => setChartView('area')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition ${
                    chartView === 'area'
                      ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm'
                      : 'text-ink-600 hover:text-navy-950'
                  }`}
                >
                  <AreaChartIcon className="h-3.5 w-3.5 text-gold-700" />
                  <span>Growth Wave</span>
                </button>
              </div>
            </div>

            {/* Dynamic Animated Chart Display */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'bar' ? (
                  <BarChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E0D6" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: '#D8D1C3' }}
                      fontSize={11}
                      stroke="#475569"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      stroke="#475569"
                      tickFormatter={(v) => `₹${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      contentStyle={{
                        backgroundColor: '#FAF8F3',
                        borderRadius: '8px',
                        border: '1px solid #D8D1C3',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#0F172A',
                        boxShadow: '0 4px 12px rgba(16,42,67,0.12)',
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingTop: '10px' }}
                    />
                    <Bar
                      dataKey="collected"
                      name="Fee Collected"
                      fill="#102A43"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="pending"
                      name="Unpaid Balance"
                      fill="#D99A2B"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D99A2B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D99A2B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#102A43" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#102A43" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E0D6" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: '#D8D1C3' }}
                      fontSize={11}
                      stroke="#475569"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      stroke="#475569"
                      tickFormatter={(v) => `₹${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      contentStyle={{
                        backgroundColor: '#FAF8F3',
                        borderRadius: '8px',
                        border: '1px solid #D8D1C3',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#0F172A',
                        boxShadow: '0 4px 12px rgba(16,42,67,0.12)',
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingTop: '10px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      name="Fee Collected"
                      stroke="#102A43"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#navyGradient)"
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      name="Unpaid Balance"
                      stroke="#D99A2B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#goldGradient)"
                      animationDuration={1800}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-borderWarm flex items-center justify-between text-xs text-ink-600">
            <p className="font-serif italic text-ink-800 font-medium">
              "Continuous collection tracking guarantees seamless educational operations."
            </p>
            <Link
              to="/admin/fees"
              className="font-bold text-navy-950 hover:text-gold-700 flex items-center gap-1 text-[11px]"
            >
              <span>Full Fee Ledger</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Academic Materials & Announcements */}
        <div className="academic-panel p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-borderWarm mb-4">
              <span className="font-serif font-bold text-sm text-gold-700">02</span>
              <h2 className="font-serif font-bold text-base text-navy-950">
                Academic Resources
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-academic bg-[#FAF8F3] border border-borderWarm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-950">Study Documents</p>
                    <p className="text-[10.5px] text-ink-600 font-medium">Homework & Notes PDFs</p>
                  </div>
                </div>
                <span className="text-lg font-black text-navy-950 font-mono">
                  <CountUp end={stats.totalMaterials} duration={1000} />
                </span>
              </div>

              <div className="p-3.5 rounded-academic bg-[#FAF8F3] border border-borderWarm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-academic bg-gold-500/20 text-gold-800 border border-gold-500/40 flex items-center justify-center">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-950">Notice Board</p>
                    <p className="text-[10.5px] text-ink-600 font-medium">Broadcast bulletins</p>
                  </div>
                </div>
                <span className="text-lg font-black text-navy-950 font-mono">
                  <CountUp end={stats.totalNotices} duration={1000} />
                </span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-academic border border-dashed border-borderWarm bg-[#FAF8F3] text-xs text-ink-700">
              <p className="font-bold text-navy-950 flex items-center gap-1.5 mb-1">
                <BookOpen className="h-3.5 w-3.5 text-gold-700" />
                Teaching Rhythm
              </p>
              <p className="text-[11px] text-ink-700 leading-relaxed font-medium">
                Publish homework worksheets after every chapter test to reinforce concepts before board exams.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-borderWarm">
            <Link
              to="/admin/materials"
              className="w-full btn-secondary text-xs flex justify-between"
            >
              <span>View All Study Materials</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Recent Payment Transactions Ledger Table */}
      <div className="academic-panel overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-borderWarm flex items-center justify-between bg-[#FAF8F3]/80">
          <div>
            <h2 className="font-serif font-bold text-base text-navy-950">
              Recent Tuition Receipts
            </h2>
            <p className="text-xs text-ink-600 font-medium">
              Latest payment entries verified in the tuition ledger
            </p>
          </div>
          <Link
            to="/admin/fees"
            className="text-xs font-bold text-navy-950 hover:text-gold-700 hover:underline"
          >
            Open Full Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-borderWarm text-left text-xs">
            <thead>
              <tr>
                <th className="academic-th">Student Name</th>
                <th className="academic-th">Roll No</th>
                <th className="academic-th">Class</th>
                <th className="academic-th">Billing Month</th>
                <th className="academic-th">Amount Paid</th>
                <th className="academic-th">Payment Mode</th>
                <th className="academic-th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8] text-ink-950 bg-white">
              {stats.recentPayments && stats.recentPayments.length > 0 ? (
                stats.recentPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-ivory-sand/40 transition">
                    <td className="academic-td font-bold text-navy-950">
                      {p.student?.name || 'Student'}
                    </td>
                    <td className="academic-td font-mono font-bold text-navy-800">
                      {p.student?.rollNo || '—'}
                    </td>
                    <td className="academic-td font-semibold text-navy-900">
                      {p.student?.standardClass || '—'}
                    </td>
                    <td className="academic-td font-semibold text-ink-800">
                      {p.month}
                    </td>
                    <td className="academic-td font-extrabold text-academic-green">
                      {formatCurrency(p.amountPaid)}
                    </td>
                    <td className="academic-td">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-ivory-sand text-navy-950 border border-borderWarm">
                        {p.paymentMode || 'UPI'}
                      </span>
                    </td>
                    <td className="academic-td">
                      <span className="inline-flex items-center gap-1 text-academic-green font-bold text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Recorded</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="academic-td text-center text-ink-600 py-10 font-serif italic">
                    No transactions recorded yet. Use the Fee Ledger to record student fee collections.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
