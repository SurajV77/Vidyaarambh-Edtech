import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import CountUp from '../../components/common/CountUp';
import TiltCard from '../../components/common/TiltCard';
import {
  GraduationCap,
  FileText,
  CreditCard,
  Bell,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Calendar,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await axiosClient.get('/student/dashboard');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Student dashboard fetch error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* 1. Student Academic Greeting Banner */}
      <div className="academic-panel p-6 sm:p-7 relative overflow-hidden bg-white border-t-3 border-t-navy-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-paper-sm">
        <div>
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-gold-700 block mb-1">
            Student Academic Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl text-navy-950 font-bold tracking-tight">
            <span className="font-serif italic font-normal text-gold-700">Welcome, </span>
            <span>{user?.name || data?.student?.name || 'Student'}.</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-700 font-serif italic font-medium">
            "Every lesson builds the next step toward academic mastery."
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-ivory-sand font-mono font-bold text-navy-950 border border-borderWarm shadow-paper-sm">
              ID: {user?.rollNo || data?.student?.rollNo || 'VR-STUDENT'}
            </span>
            <span className="px-2.5 py-1 rounded bg-ivory-sand font-bold text-navy-950 border border-borderWarm shadow-paper-sm">
              {user?.standardClass || data?.student?.standardClass || 'Class 10'}
            </span>
            <span className="px-2.5 py-1 rounded bg-ivory-sand font-semibold text-ink-800 border border-borderWarm shadow-paper-sm">
              {user?.batch || data?.student?.batch || 'Regular Batch'}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Link to="/student/materials" className="btn-primary text-xs font-bold">
            <BookOpen className="h-3.5 w-3.5 text-gold-400" />
            <span>Open Study Repository</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Academic Stats with 3D Tilt and CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Homework */}
        <TiltCard maxRotation={7} className="academic-panel p-5 bg-white border-l-4 border-l-navy-900 shadow-paper-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Homework
            </span>
            <FileText className="h-4 w-4 text-navy-800" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-navy-950 font-sans">
            <CountUp end={data?.materialsSummary?.homeworkCount || 0} duration={1000} />
          </p>
          <p className="mt-1 text-[11px] text-ink-700 font-medium">Assigned problem worksheets</p>
        </TiltCard>

        {/* Notes */}
        <TiltCard maxRotation={7} className="academic-panel p-5 bg-white border-l-4 border-l-gold-500 shadow-paper-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Revision Notes
            </span>
            <BookOpen className="h-4 w-4 text-gold-700" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-navy-950 font-sans">
            <CountUp end={data?.materialsSummary?.notesCount || 0} duration={1100} />
          </p>
          <p className="mt-1 text-[11px] text-ink-700 font-medium">Concept sheets & summaries</p>
        </TiltCard>

        {/* Tests */}
        <TiltCard maxRotation={7} className="academic-panel p-5 bg-white border-l-4 border-l-navy-700 shadow-paper-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Test Papers
            </span>
            <Award className="h-4 w-4 text-navy-800" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-navy-950 font-sans">
            <CountUp end={data?.materialsSummary?.testsCount || 0} duration={1200} />
          </p>
          <p className="mt-1 text-[11px] text-ink-700 font-medium">Periodic test papers</p>
        </TiltCard>

        {/* Fee Status */}
        <TiltCard maxRotation={7} className="academic-panel p-5 bg-white border-l-4 border-l-academic-green shadow-paper-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
              Tuition Balance
            </span>
            <CreditCard className="h-4 w-4 text-academic-green" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-navy-950 font-sans">
            <CountUp end={data?.feeSummary?.pendingDue || 0} isCurrency={true} duration={1300} />
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px]">
            {data?.feeSummary?.pendingDue > 0 ? (
              <span className="text-academic-amber font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Dues Pending
              </span>
            ) : (
              <span className="text-academic-green font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Fees Cleared
              </span>
            )}
          </div>
        </TiltCard>
      </div>

      {/* 3. Announcements Section */}
      {data?.notices && data.notices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">01</span>
            <h2 className="font-serif font-bold text-base text-navy-950">
              Institute Announcements
            </h2>
          </div>

          <div className="space-y-3">
            {data.notices.map((n) => (
              <div
                key={n._id}
                className={`academic-panel p-4 bg-white shadow-paper-sm ${
                  n.priority === 'HIGH' ? 'border-l-4 border-l-academic-amber' : 'border-l-4 border-l-navy-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-gold-700 bg-gold-500/20 px-1.5 py-0.5 rounded">
                    BULLETIN
                  </span>
                  {n.priority === 'HIGH' && (
                    <span className="text-[10.5px] font-bold text-academic-amber uppercase tracking-wider">
                      Important
                    </span>
                  )}
                  <span className="text-[11px] text-ink-700 font-semibold font-sans">
                    {new Date(n.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-navy-950">{n.title}</h3>
                <p className="text-xs text-ink-800 mt-1 leading-relaxed font-medium">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Assigned Study Documents */}
      <div className="academic-panel p-6 bg-white shadow-paper-sm">
        <div className="flex items-center justify-between pb-4 border-b border-borderWarm mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-gold-700">02</span>
              <h2 className="font-serif font-bold text-base text-navy-950">
                Latest Learning Materials
              </h2>
            </div>
            <p className="text-xs text-ink-700 font-medium mt-0.5">
              Worksheets and revision notes assigned to your standard
            </p>
          </div>
          <Link
            to="/student/materials"
            className="text-xs font-bold text-navy-950 hover:text-gold-700 flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.materialsSummary?.recentMaterials && data.materialsSummary.recentMaterials.length > 0 ? (
            data.materialsSummary.recentMaterials.map((item) => (
              <div
                key={item._id}
                className="academic-sand p-4 flex flex-col justify-between doc-notch bg-[#FAF8F3] shadow-paper-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10.5px] font-mono font-extrabold tracking-wider text-gold-700 uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10.5px] font-bold text-navy-950">{item.subject}</span>
                  </div>
                  <h4 className="font-serif font-bold text-navy-950 text-xs leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  {item.dueDate && (
                    <p className="mt-2 text-[11px] text-academic-amber font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-borderWarm">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-[11px] w-full py-1.5 flex items-center justify-center gap-1.5 font-bold shadow-paper-sm"
                  >
                    <Download className="h-3 w-3 text-navy-950" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-xs text-ink-700 font-serif italic font-medium">
              No study materials assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
