import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TypewriterText from '../components/common/TypewriterText';
import TiltCard from '../components/common/TiltCard';
import CountUp from '../components/common/CountUp';
import {
  GraduationCap,
  ShieldCheck,
  FileText,
  CreditCard,
  Users,
  Bell,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
  Receipt,
} from 'lucide-react';

const Landing = () => {
  // -------------------------------------------------------------
  // ACADEMIC STATS CONFIGURATION:
  // 1. DYNAMIC MODE (Default): Fetches real-time counts from your MongoDB database
  //    (actual enrolled students, study worksheets, verified receipts).
  // 2. MANUAL OVERRIDE MODE: Set USE_CUSTOM_STATS to true if you want to
  //    display specific figures manually without creating database records.
  // -------------------------------------------------------------
  const USE_CUSTOM_STATS = false;
  const CUSTOM_STATS = {
    enrolledLearners: 50,       // e.g. Your real student count
    verifiedReceiptsRate: 100,  // e.g. Receipt verification percentage
    studyWorksheets: 45,        // e.g. Your real worksheets/tests count
    syllabusClearedRate: 98,    // e.g. Syllabus completion rate
  };

  const [metrics, setMetrics] = useState(
    USE_CUSTOM_STATS
      ? CUSTOM_STATS
      : {
          enrolledLearners: 0,
          verifiedReceiptsRate: 100,
          studyWorksheets: 0,
          syllabusClearedRate: 98,
          isLive: false,
        }
  );

  useEffect(() => {
    if (USE_CUSTOM_STATS) return;

    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const response = await axiosClient.get('/public/stats');
        if (response.data?.success && isMounted) {
          const s = response.data.stats;
          setMetrics({
            enrolledLearners: s.enrolledLearners ?? 0,
            verifiedReceiptsRate: s.verifiedReceiptsRate ?? 100,
            studyWorksheets: s.studyWorksheets ?? 0,
            syllabusClearedRate: s.syllabusClearedRate ?? 98,
            isLive: true,
          });
        }
      } catch (err) {
        console.warn('Live metrics sync notice:', err.message);
      }
    };

    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, [USE_CUSTOM_STATS]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-ink-900 flex flex-col selection:bg-gold-500/20 overflow-x-hidden">
      {/* Top Academic Header */}
      <header className="border-b border-borderWarm bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-paper-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-academic bg-white p-1 border border-borderWarm flex items-center justify-center shadow-paper-sm">
              <img src="/logo.png" alt="Vidyaarambh Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-navy-950 leading-tight">
                Vidyaarambh
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-gold-700">
                Tuition Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/login"
              className="btn-secondary text-xs font-bold"
            >
              <GraduationCap className="h-3.5 w-3.5 text-navy-900" />
              <span>Student Portal</span>
            </Link>
            <Link
              to="/admin/login"
              className="btn-primary text-xs font-bold"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
              <span>Teacher Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Classical Academic Hero with Real-Time Dynamic Typewriter */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col items-center text-center relative">
        {/* Floating 3D Background Crest Decorative Badges */}
        <div className="hidden lg:block absolute -left-6 top-16 animate-float pointer-events-none opacity-90">
          <div className="p-3 bg-white rounded-academic border border-borderWarm shadow-paper flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-gold-500/20 text-gold-800 flex items-center justify-center font-bold shadow-paper-sm">
              <Award className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-extrabold text-navy-950">Academic Rigor</p>
              <p className="text-[10.5px] text-ink-700 font-semibold">Class 9 - 12 Standards</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute -right-6 top-24 animate-float-slow pointer-events-none opacity-90">
          <div className="p-3 bg-white rounded-academic border border-borderWarm shadow-paper flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-academic-greenBg text-academic-green flex items-center justify-center font-bold shadow-paper-sm">
              <Receipt className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-extrabold text-navy-950">Instant Receipts</p>
              <p className="text-[10.5px] text-ink-700 font-semibold">Verified UPI Ledger</p>
            </div>
          </div>
        </div>

        {/* Academic Seal / Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-academic border border-borderWarm bg-white shadow-paper-sm text-xs text-navy-900 mb-6 font-semibold">
          <span className="h-2 w-2 rounded-full bg-gold-600 animate-pulse" />
          <span className="font-serif italic text-gold-700 font-bold">
            Premier Tuition & Academic Management
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 tracking-tight max-w-3xl leading-[1.2]">
          A dignified standard in <span className="italic font-normal text-gold-700">personal tuition</span> and student mentorship.
        </h2>

        {/* Dynamic Real-Time Typewriter Typography */}
        <div className="mt-4 min-h-[32px] flex items-center justify-center">
          <p className="text-sm sm:text-base font-bold text-navy-950 font-sans tracking-wide">
            <span className="text-gold-700 mr-2 font-extrabold">Focus:</span>
            <TypewriterText
              texts={[
                'Personalized Academic Mentorship for Every Student.',
                'Systematic Homework & Question Paper Distribution.',
                'Transparent Monthly Tuition Ledger & Instant Receipts.',
                'Empowering Focus, Discipline, and Exam Mastery.',
              ]}
              typingSpeed={45}
              deletingSpeed={25}
              pauseTime={2200}
              className="text-navy-950 font-extrabold"
              cursorClassName="bg-gold-600"
            />
          </p>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-ink-700 max-w-2xl leading-relaxed font-sans font-medium">
          Engineered exclusively for dedicated coaching faculties. Manage batch admissions, track monthly tuition dues with digital receipts, and distribute homework & test question sheets seamlessly.
        </p>

        {/* Portal Entry Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto z-10">
          <Link
            to="/admin/login"
            className="w-full sm:w-auto btn-primary text-sm py-3 px-6 shadow-paper"
          >
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            <span>Teacher Administrative Portal</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto btn-secondary text-sm py-3 px-6"
          >
            <GraduationCap className="h-4 w-4 text-navy-900" />
            <span>Student Access Portal</span>
          </Link>
        </div>

        {/* Live Academic Metric Badges with CountUp Animation */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
          <div className="academic-panel p-3.5 bg-white text-center transition-all duration-200 hover:shadow-paper">
            <p className="text-2xl font-black text-navy-950 font-sans">
              <CountUp end={metrics.enrolledLearners} duration={1200} />
              {metrics.enrolledLearners > 0 ? '+' : ''}
            </p>
            <p className="text-[11.5px] text-ink-700 font-bold mt-0.5">Enrolled Learners</p>
          </div>

          <div className="academic-panel p-3.5 bg-white text-center transition-all duration-200 hover:shadow-paper">
            <p className="text-2xl font-black text-gold-700 font-sans">
              <CountUp end={metrics.verifiedReceiptsRate} duration={1400} />%
            </p>
            <p className="text-[11.5px] text-ink-700 font-bold mt-0.5">Verified Receipts</p>
          </div>

          <div className="academic-panel p-3.5 bg-white text-center transition-all duration-200 hover:shadow-paper">
            <p className="text-2xl font-black text-navy-950 font-sans">
              <CountUp end={metrics.studyWorksheets} duration={1500} />
              {metrics.studyWorksheets > 0 ? '+' : ''}
            </p>
            <p className="text-[11.5px] text-ink-700 font-bold mt-0.5">Study Worksheets</p>
          </div>

          <div className="academic-panel p-3.5 bg-white text-center transition-all duration-200 hover:shadow-paper">
            <p className="text-2xl font-black text-academic-green font-sans">
              <CountUp end={metrics.syllabusClearedRate} duration={1600} />%
            </p>
            <p className="text-[11.5px] text-ink-700 font-bold mt-0.5">Syllabus Cleared</p>
          </div>
        </div>

        {/* 3D Interactive Tilt Cards Trio */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {/* 3D Card 1 */}
          <TiltCard
            maxRotation={9}
            className="academic-elevated p-6 bg-white border-t-3 border-t-navy-900 h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-xs text-gold-700">01 BATCH ROSTER</span>
                <Users className="h-4 w-4 text-navy-900" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-950 mb-2">
                Structured Roster & Batches
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans font-medium">
                Maintain comprehensive student records, standard levels, parent contacts, and individual batch progress trackers.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-borderWarm flex items-center gap-1.5 text-[11px] font-bold text-navy-950">
              <CheckCircle2 className="h-3.5 w-3.5 text-academic-green" />
              <span>Full Student Directory & Roll IDs</span>
            </div>
          </TiltCard>

          {/* 3D Card 2 */}
          <TiltCard
            maxRotation={9}
            className="academic-elevated p-6 bg-white border-t-3 border-t-gold-500 h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-xs text-gold-700">02 FINANCE</span>
                <CreditCard className="h-4 w-4 text-gold-700" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-950 mb-2">
                Verified Financial Ledger
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans font-medium">
                Track monthly fee collections, view revenue trends, record UPI/cash receipts, and generate printable statements.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-borderWarm flex items-center gap-1.5 text-[11px] font-bold text-navy-950">
              <CheckCircle2 className="h-3.5 w-3.5 text-academic-green" />
              <span>Official Print-Ready Receipts</span>
            </div>
          </TiltCard>

          {/* 3D Card 3 */}
          <TiltCard
            maxRotation={9}
            className="academic-elevated p-6 bg-white border-t-3 border-t-navy-700 h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-bold text-xs text-gold-700">03 ACADEMIC</span>
                <FileText className="h-4 w-4 text-navy-900" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-950 mb-2">
                Academic PDF Repository
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans font-medium">
                Distribute homework worksheets, revision concept notes, and unit examination question papers directly to students.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-borderWarm flex items-center gap-1.5 text-[11px] font-bold text-navy-950">
              <CheckCircle2 className="h-3.5 w-3.5 text-academic-green" />
              <span>Direct Student PDF Downloads</span>
            </div>
          </TiltCard>
        </div>
      </main>

      {/* Classical Academic Footer */}
      <footer className="border-t border-borderWarm bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-700">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
            <span className="font-serif font-bold text-navy-950">Vidyaarambh</span>
            <span className="text-borderWarm">|</span>
            <span className="text-[11px] text-ink-700 font-serif italic font-medium">Tuition Management System</span>
          </div>
          <p className="text-[11.5px] font-medium">© {new Date().getFullYear()} Vidyaarambh. Committed to Academic Rigor.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
