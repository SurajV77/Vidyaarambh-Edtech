import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowLeft, Loader2, BookOpen } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your student email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Student login failed:', err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify credentials with your teacher.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-gold-500/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-gold-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-academic bg-white p-2 border border-borderWarm shadow-paper mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Vidyaarambh Logo" className="h-full w-auto object-contain" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-navy-950 text-center tracking-tight">
            Student Learning Portal
          </h2>
          <p className="mt-1 text-center text-xs text-ink-700 font-serif italic font-medium">
            "Access homework worksheets, revision sheets, and test dates"
          </p>
        </div>

        <div className="mt-6 academic-elevated p-7 sm:p-8 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-academic bg-academic-crimsonBg border border-academic-crimson/30 text-academic-crimson text-xs flex items-start gap-2 font-semibold">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                Student Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@vidyaarambh.com"
                className="w-full px-3.5 py-2 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 placeholder-ink-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 placeholder-ink-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-xs py-2.5 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 text-gold-400" />
                  <span>Enter Student Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-borderWarm text-center">
            <p className="text-[11px] text-ink-700 font-serif italic font-medium">
              Login credentials are provided by your tuition teacher.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-700 font-medium">
          Tuition Administrator?{' '}
          <Link to="/admin/login" className="font-bold text-navy-950 hover:text-gold-700 underline">
            Teacher Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
