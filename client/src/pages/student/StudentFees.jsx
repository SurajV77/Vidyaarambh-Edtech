import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
  X,
  Loader2,
} from 'lucide-react';

const StudentFees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/student/fees');
      if (res.data?.fees) {
        setFees(res.data.fees);
      }
    } catch (err) {
      console.warn('Student fees fetch fallback.');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = fees.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const pendingDue = fees.reduce((acc, f) => {
    const diff = (f.amountDue || 0) - (f.amountPaid || 0);
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const handleOpenReceipt = (fee) => {
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
              Tuition Fee Statement & Receipts
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Review your tuition payment history and access official tuition receipts.
          </p>
        </div>
      </div>

      {/* Overview Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="academic-panel p-5 bg-white border-l-4 border-l-academic-green shadow-paper-sm">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
            Total Fees Paid
          </span>
          <p className="mt-2 text-2xl font-black text-navy-950 font-sans">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-ink-700 font-medium">Verified tuition payments recorded</p>
        </div>

        <div className="academic-panel p-5 bg-white border-l-4 border-l-academic-amber shadow-paper-sm">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-700">
            Outstanding Tuition Balance
          </span>
          <p className="mt-2 text-2xl font-black text-academic-amber font-sans">
            ₹{pendingDue.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-ink-700 font-medium">
            {pendingDue > 0 ? 'Kindly clear pending balance with your teacher' : 'All monthly tuition fees cleared'}
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="academic-panel overflow-hidden bg-white shadow-paper-sm">
        {loading ? (
          <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
            <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
            <p className="text-xs font-serif italic font-medium">Loading tuition statements...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderWarm text-left text-xs">
              <thead>
                <tr>
                  <th className="academic-th">Fee Period</th>
                  <th className="academic-th">Amount Due</th>
                  <th className="academic-th">Amount Paid</th>
                  <th className="academic-th">Payment Mode</th>
                  <th className="academic-th">Status</th>
                  <th className="academic-th">Receipt Ref</th>
                  <th className="academic-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D8] text-ink-950 bg-white">
                {fees.length > 0 ? (
                  fees.map((f) => (
                    <tr key={f._id} className="hover:bg-ivory-sand/40 transition">
                      <td className="academic-td font-bold text-navy-950">
                        {f.month} {f.year}
                      </td>
                      <td className="academic-td font-bold text-navy-950">
                        ₹{f.amountDue?.toLocaleString('en-IN')}
                      </td>
                      <td className="academic-td font-extrabold text-academic-green">
                        ₹{f.amountPaid?.toLocaleString('en-IN')}
                      </td>
                      <td className="academic-td">
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-[#FAF8F3] text-navy-950 border border-borderWarm">
                          {f.paymentMode || '—'}
                        </span>
                      </td>
                      <td className="academic-td">
                        {f.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-academic-greenBg text-academic-green border border-academic-green/30">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        )}
                        {f.status === 'PARTIAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-academic-amberBg text-academic-amber border border-academic-amber/30">
                            <Clock className="h-3 w-3" />
                            Partial (₹{(f.amountDue - f.amountPaid).toLocaleString('en-IN')} due)
                          </span>
                        )}
                        {f.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-academic-crimsonBg text-academic-crimson border border-academic-crimson/30">
                            <AlertCircle className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="academic-td font-mono text-[11px] font-bold text-navy-950">
                        {f.receiptNumber || '—'}
                      </td>
                      <td className="academic-td text-right">
                        {f.amountPaid > 0 ? (
                          <button
                            onClick={() => handleOpenReceipt(f)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF8F3] hover:bg-ivory-sand text-navy-950 border border-borderWarm text-[11px] font-bold transition shadow-paper-sm"
                          >
                            <Printer className="h-3 w-3 text-gold-700" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-ink-700 text-xs font-semibold">Unpaid</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="academic-td text-center text-ink-700 py-12 font-serif italic font-medium">
                      No tuition payment entries found on your student ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View & Print Digital Receipt */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded text-ink-700 hover:text-navy-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-2 border-double border-borderWarm p-6 bg-[#FAF8F3] rounded-academic relative">
              <div className="flex items-center justify-between pb-4 border-b border-borderWarm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white p-1 rounded border border-borderWarm flex items-center justify-center shadow-paper-sm">
                    <img src="/logo.png" alt="Logo" className="h-full w-auto object-contain" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-navy-950">Vidyaarambh</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gold-700 font-extrabold">
                      Student Tuition Receipt
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
                  <span className="font-bold text-navy-950">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Roll Identification:</span>
                  <span className="font-mono font-bold text-navy-950">{user?.rollNo || 'VR-N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-700 font-bold">Standard & Batch:</span>
                  <span className="font-bold text-navy-950">{user?.standardClass} ({user?.batch})</span>
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
                    Amount Paid
                  </p>
                  <p className="text-2xl font-black text-navy-950 font-sans mt-0.5">
                    ₹{selectedReceipt.amountPaid?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="text-right">
                  <div className="h-9 border-b border-navy-900 w-28 inline-block"></div>
                  <p className="text-[11px] text-ink-800 font-serif italic font-bold mt-0.5">Teacher Signatory</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => window.print()}
                className="btn-primary text-xs font-bold"
              >
                <Printer className="h-3.5 w-3.5 text-gold-400" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFees;
