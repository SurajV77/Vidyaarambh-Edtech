import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  Bell,
  PlusCircle,
  Trash2,
  AlertTriangle,
  Send,
  Calendar,
  X,
  Loader2,
  Pin,
} from 'lucide-react';

const NoticesManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    targetBatch: 'ALL',
    priority: 'NORMAL',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/notices');
      if (res.data?.notices) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.warn('Backend notices fetch fallback.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await axiosClient.post('/notices', form);
      if (res.data?.success) {
        setIsCreateModalOpen(false);
        setForm({
          title: '',
          content: '',
          targetBatch: 'ALL',
          priority: 'NORMAL',
        });
        fetchNotices();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id, title) => {
    if (window.confirm(`Remove notice "${title}" from the notice board?`)) {
      try {
        await axiosClient.delete(`/notices/${id}`);
        fetchNotices();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete notice.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderWarm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">04</span>
            <h1 className="font-serif font-bold text-2xl text-navy-950 tracking-tight">
              Institute Notice Board
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Publish official announcements, mock examination dates, and tuition schedule bulletins.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setIsCreateModalOpen(true);
          }}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <Pin className="h-3.5 w-3.5 text-gold-400" />
          <span>Pin New Announcement</span>
        </button>
      </div>

      {/* Notices List — Notice Board Visual Style */}
      {loading ? (
        <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
          <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
          <p className="text-xs font-serif italic font-medium">Loading announcement bulletins...</p>
        </div>
      ) : notices.length > 0 ? (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n._id}
              className={`academic-panel p-5 bg-white relative transition ${
                n.priority === 'HIGH'
                  ? 'border-l-4 border-l-academic-amber'
                  : 'border-l-4 border-l-navy-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-gold-700 bg-gold-500/20 px-2 py-0.5 rounded">
                      NOTICE
                    </span>
                    {n.priority === 'HIGH' && (
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-academic-amber bg-academic-amberBg px-2 py-0.5 rounded border border-academic-amber/30">
                        Urgent Bulletin
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-ink-700">
                      Target: {n.targetBatch === 'ALL' ? 'All Batches (General)' : n.targetBatch}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-navy-950 text-base leading-snug">
                    {n.title}
                  </h3>

                  <p className="mt-2 text-xs text-ink-800 leading-relaxed max-w-4xl font-medium">
                    {n.content}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-700 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-gold-700" />
                    <span>
                      Posted {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNotice(n._id, n.title)}
                  title="Remove from board"
                  className="p-1.5 rounded text-ink-600 hover:text-academic-crimson hover:bg-academic-crimsonBg transition flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="academic-panel p-12 text-center text-ink-700 bg-white">
          <Bell className="h-8 w-8 mx-auto text-borderWarm mb-2" />
          <p className="font-serif italic text-sm font-medium">No announcements pinned to the notice board.</p>
          <p className="text-xs text-ink-600 mt-0.5">Click "Pin New Announcement" to publish updates.</p>
        </div>
      )}

      {/* Modal: Publish Notice */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-borderWarm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center shadow-paper-sm">
                  <Pin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-navy-950">Pin Announcement</h3>
                  <p className="text-[11px] text-ink-700 font-medium">Post notice to student portals</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-ink-700 hover:text-navy-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-2.5 rounded-academic bg-academic-crimsonBg border border-academic-crimson/30 text-academic-crimson text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Bulletin Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Upcoming Mathematics Mock Exam"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Target Batch
                  </label>
                  <select
                    value={form.targetBatch}
                    onChange={(e) => setForm({ ...form, targetBatch: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="ALL">All Batches (General)</option>
                    <option value="Morning Batch">Morning Batch</option>
                    <option value="Evening Batch">Evening Batch</option>
                    <option value="Evening Science">Evening Science</option>
                    <option value="Weekend Batch">Weekend Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="NORMAL">Standard Notice</option>
                    <option value="HIGH">High Priority (Urgent Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Notice Details / Message *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Draft the official instructions or announcement for students..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-borderWarm flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary text-xs">
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Pin Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesManagement;
