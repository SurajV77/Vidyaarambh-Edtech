import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  X,
  Loader2,
  IndianRupee,
  Receipt,
  FileCheck2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const FeesManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-renew / sync state
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    feeId: '',
    studentId: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    amountDue: 2000,
    amountPaid: 2000,
    paymentMode: 'UPI',
    notes: '',
  });

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, [selectedMonth, selectedYear, selectedStatus]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedMonth !== 'ALL') params.month = selectedMonth;
      if (selectedYear) params.year = selectedYear;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const res = await axiosClient.get('/admin/fees', { params });
      if (res.data?.fees) {
        setFees(res.data.fees);
      }
    } catch (err) {
      console.warn('Backend fees fetch fallback.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axiosClient.get('/admin/students');
      if (res.data?.students) {
        setStudents(res.data.students);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleAutoRenewFees = async () => {
    setSyncLoading(true);
    setSyncMessage('');
    try {
      const res = await axiosClient.post('/admin/fees/generate-monthly', {
        month: selectedMonth !== 'ALL' ? selectedMonth : undefined,
        year: selectedYear,
      });
      if (res.data?.success) {
        const { createdCount, totalActive } = res.data.result || {};
        setSyncMessage(
          createdCount > 0
            ? `Successfully auto-renewed monthly tuition dues for ${createdCount} active student(s) for ${selectedMonth !== 'ALL' ? selectedMonth : 'current month'}!`
            : `All ${totalActive || ''} active students already have up-to-date fee records for this period.`
        );
        fetchFees();
      }
    } catch (err) {
      setSyncMessage(err.response?.data?.message || 'Failed to auto-renew monthly tuition dues.');
    } finally {
      setSyncLoading(false);
    }
  };

  const totalCollected = fees.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const totalPending = fees.reduce((acc, f) => {
    const diff = (f.amountDue || 0) - (f.amountPaid || 0);
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const handleOpenPayModal = (feeItem = null) => {
    setModalError('');
    if (feeItem) {
      setPaymentForm({
        feeId: feeItem._id,
        studentId: feeItem.student?._id || '',
        month: feeItem.month,
        year: feeItem.year,
        amountDue: feeItem.amountDue,
        amountPaid: feeItem.amountDue,
        paymentMode: 'UPI',
        notes: '',
      });
    } else {
      const defaultStudent = students[0];
      setPaymentForm({
        feeId: '',
        studentId: defaultStudent ? defaultStudent._id : '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        amountDue: defaultStudent?.monthlyFeeAmount || 2000,
        amountPaid: defaultStudent?.monthlyFeeAmount || 2000,
        paymentMode: 'UPI',
        notes: '',
      });
    }
    setIsPayModalOpen(true);
  };

  const handleStudentSelectInForm = (studentId) => {
    const st = students.find((s) => s._id === studentId);
    setPaymentForm((prev) => ({
      ...prev,
      studentId,
      amountDue: st?.monthlyFeeAmount || 2000,
      amountPaid: st?.monthlyFeeAmount || 2000,
    }));
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      const res = await axiosClient.post('/admin/fees/pay', paymentForm);
      if (res.data?.success) {
        setIsPayModalOpen(false);
        fetchFees();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewReceipt = (fee) => {
    setSelectedReceipt(fee);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderWarm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">02</span>
            <h1 className="font-serif font-bold text-2xl text-navy-950 tracking-tight">
              Tuition Fee Ledger
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Track student monthly tuition collections, issue verified digital receipts, and audit balances.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleAutoRenewFees}
            disabled={syncLoading}
            className="btn-secondary text-xs flex items-center gap-1.5 border-academic-green/40 hover:bg-academic-greenBg/30 text-navy-950 font-bold"
            title="Auto-generate or renew monthly tuition fees for all active students"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-academic-green ${syncLoading ? 'animate-spin' : ''}`} />
            <span>{syncLoading ? 'Syncing Dues...' : 'Auto-Renew / Sync Month'}</span>
          </button>

          <button onClick={() => handleOpenPayModal()} className="btn-primary text-xs">
            <Receipt className="h-3.5 w-3.5 text-gold-400" />
            <span>Record Tuition Collection</span>
          </button>
        </div>
      </div>

      {/* Auto-Renewal Status Alert Banner */}
      {syncMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-academic flex items-center justify-between gap-3 text-xs font-semibold text-emerald-950 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{syncMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncMessage('')}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Ledger Summary Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="academic-panel p-5 bg-white border-l-4 border-l-academic-green">
          <span className="text-[11px] font-extrabold text-ink-700 uppercase tracking-wider">
            Verified Collection
          </span>
          <p className="mt-2 text-2xl font-black text-navy-950 font-sans">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-ink-600 font-medium">Total received in active filter view</p>
        </div>

        <div className="academic-panel p-5 bg-white border-l-4 border-l-academic-amber">
          <span className="text-[11px] font-extrabold text-ink-700 uppercase tracking-wider">
            Pending Tuition Balance
          </span>
          <p className="mt-2 text-2xl font-black text-academic-amber font-sans">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-ink-600 font-medium">Outstanding student balances due</p>
        </div>

        <div className="academic-panel p-5 bg-white border-l-4 border-l-navy-800">
          <span className="text-[11px] font-extrabold text-ink-700 uppercase tracking-wider">
            Collection Efficiency
          </span>
          <p className="mt-2 text-2xl font-black text-navy-950 font-sans">
            {totalCollected + totalPending > 0
              ? `${Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%`
              : '100%'}
          </p>
          <p className="mt-1 text-[11px] text-ink-600 font-medium">Total cleared ratio</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="academic-panel p-3.5 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center flex-wrap gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="ALL">All Months</option>
            {monthsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>

        <span className="text-[11px] font-mono font-bold text-navy-950">
          Showing {fees.length} ledger entries
        </span>
      </div>

      {/* Ledger Table */}
      <div className="academic-panel overflow-hidden bg-white">
        {loading ? (
          <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
            <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
            <p className="text-xs font-serif italic font-medium">Loading financial records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderWarm text-left text-xs">
              <thead>
                <tr>
                  <th className="academic-th">Student Particulars</th>
                  <th className="academic-th">Standard & Batch</th>
                  <th className="academic-th">Billing Period</th>
                  <th className="academic-th">Amount Due</th>
                  <th className="academic-th">Amount Paid</th>
                  <th className="academic-th">Status</th>
                  <th className="academic-th">Receipt Ref</th>
                  <th className="academic-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D8] text-ink-950 bg-white">
                {fees.length > 0 ? (
                  fees.map((f) => (
                    <tr key={f._id} className="hover:bg-ivory-sand/40 transition">
                      <td className="academic-td">
                        <p className="font-bold text-navy-950 text-xs">{f.student?.name || 'Student'}</p>
                        <p className="text-[11px] font-mono font-bold text-navy-800">{f.student?.rollNo || '—'}</p>
                      </td>
                      <td className="academic-td">
                        <span className="font-bold text-navy-950">{f.student?.standardClass || '—'}</span>
                        <p className="text-[11px] text-ink-700 font-medium">{f.student?.batch || '—'}</p>
                      </td>
                      <td className="academic-td font-semibold text-ink-800">
                        {f.month} {f.year}
                      </td>
                      <td className="academic-td font-extrabold text-navy-950">
                        ₹{f.amountDue?.toLocaleString('en-IN')}
                      </td>
                      <td className="academic-td font-extrabold text-academic-green">
                        ₹{f.amountPaid?.toLocaleString('en-IN')}
                      </td>
                      <td className="academic-td">
                        {f.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-academic-greenBg text-academic-green border border-academic-green/30">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid in Full
                          </span>
                        )}
                        {f.status === 'PARTIAL' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-academic-amberBg text-academic-amber border border-academic-amber/30">
                            <Clock className="h-3 w-3" />
                            Partial (₹{(f.amountDue - f.amountPaid).toLocaleString('en-IN')} due)
                          </span>
                        )}
                        {f.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-academic-crimsonBg text-academic-crimson border border-academic-crimson/30">
                            <AlertCircle className="h-3 w-3" />
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="academic-td font-mono text-[11px] font-bold text-navy-950">
                        {f.receiptNumber || '—'}
                      </td>
                      <td className="academic-td text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {f.amountPaid > 0 && (
                            <button
                              onClick={() => handleViewReceipt(f)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF8F3] hover:bg-ivory-sand text-navy-950 border border-borderWarm text-[11px] font-bold transition shadow-paper-sm"
                            >
                              <Printer className="h-3 w-3 text-gold-700" />
                              <span>Receipt</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenPayModal(f)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-navy-900 hover:bg-navy-950 text-white text-[11px] font-bold transition shadow-paper-sm"
                          >
                            <span>Collect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="academic-td text-center text-ink-700 py-12 font-serif italic font-medium">
                      No ledger entries matching the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record Payment */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-md w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-borderWarm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center shadow-paper-sm">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-navy-950">Record Fee Collection</h3>
                  <p className="text-[11px] text-ink-700 font-medium">Update ledger and issue official receipt</p>
                </div>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded text-ink-700 hover:text-navy-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 p-2.5 rounded-academic bg-academic-crimsonBg border border-academic-crimson/30 text-academic-crimson text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Select Student *
                </label>
                <select
                  required
                  value={paymentForm.studentId}
                  onChange={(e) => handleStudentSelectInForm(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                >
                  {students.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} ({st.rollNo || 'No ID'}) — {st.standardClass}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Billing Month
                  </label>
                  <select
                    value={paymentForm.month}
                    onChange={(e) => setPaymentForm({ ...paymentForm, month: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={paymentForm.year}
                    onChange={(e) => setPaymentForm({ ...paymentForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Fee Due (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amountDue}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountDue: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amountPaid}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-extrabold text-academic-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash In Hand</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Notes / Particulars
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid in full via UPI"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="pt-3 border-t border-borderWarm flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn-primary text-xs">
                  {modalLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Record Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Official Receipt */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded text-ink-700 hover:text-navy-950"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Authentic Academic Receipt Document */}
            <div className="border-2 border-double border-borderWarm p-6 bg-[#FAF8F3] rounded-academic relative">
              <div className="flex items-center justify-between pb-4 border-b border-borderWarm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white p-1 rounded border border-borderWarm flex items-center justify-center shadow-paper-sm">
                    <img src="/logo.png" alt="Logo" className="h-full w-auto object-contain" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-navy-950">Vidyaarambh</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gold-700 font-extrabold">
                      Official Tuition Fee Receipt
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-navy-950 block">
                    {selectedReceipt.receiptNumber}
                  </span>
                  <p className="text-[11px] text-ink-700 font-semibold">
                    {new Date(selectedReceipt.paymentDate || selectedReceipt.updatedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="py-4 space-y-2.5 text-xs text-ink-900 border-b border-borderWarm font-sans">
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Student Name:</span>
                  <span className="font-bold text-navy-950">{selectedReceipt.student?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Roll Identification:</span>
                  <span className="font-mono font-bold text-navy-950">{selectedReceipt.student?.rollNo || 'VR-N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Standard & Batch:</span>
                  <span className="font-bold text-navy-950">{selectedReceipt.student?.standardClass} ({selectedReceipt.student?.batch})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Fee Period:</span>
                  <span className="font-bold text-navy-950">{selectedReceipt.month} {selectedReceipt.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Payment Channel:</span>
                  <span className="font-bold text-navy-950">{selectedReceipt.paymentMode || 'UPI'}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10.5px] text-ink-700 uppercase tracking-wider font-extrabold">
                    Amount Received
                  </p>
                  <p className="text-2xl font-black text-navy-950 font-sans mt-0.5">
                    ₹{selectedReceipt.amountPaid?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="text-right">
                  <div className="h-9 border-b border-navy-900 w-28 inline-block"></div>
                  <p className="text-[11px] text-ink-800 font-serif italic font-bold mt-0.5">Authorized Signatory</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => window.print()}
                className="btn-primary text-xs"
              >
                <Printer className="h-3.5 w-3.5 text-gold-400" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesManagement;
