import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  IndianRupee,
  GraduationCap,
} from 'lucide-react';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form State
  const initialForm = {
    name: '',
    email: '',
    password: '',
    rollNo: '',
    standardClass: 'Class 10',
    batch: 'Morning Batch',
    phone: '',
    parentPhone: '',
    monthlyFeeAmount: 2000,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedBatch]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass !== 'ALL') params.standardClass = selectedClass;
      if (selectedBatch !== 'ALL') params.batch = selectedBatch;
      if (searchTerm) params.search = searchTerm;

      const res = await axiosClient.get('/admin/students', { params });
      if (res.data?.students) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.warn('Students fetch error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...initialForm,
      rollNo: `VR-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setModalError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      password: '',
      rollNo: student.rollNo || '',
      standardClass: student.standardClass || 'Class 10',
      batch: student.batch || 'Morning Batch',
      phone: student.phone || '',
      parentPhone: student.parentPhone || '',
      monthlyFeeAmount: student.monthlyFeeAmount || 2000,
      isActive: student.isActive !== undefined ? student.isActive : true,
    });
    setModalError('');
    setIsEditModalOpen(true);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      const res = await axiosClient.post('/admin/students', formData);
      if (res.data?.success) {
        setIsAddModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to enroll student.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!currentStudent) return;
    setModalLoading(true);
    setModalError('');

    try {
      const res = await axiosClient.put(`/admin/students/${currentStudent._id}`, formData);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update student.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the institute roster?`)) {
      try {
        await axiosClient.delete(`/admin/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderWarm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">01</span>
            <h1 className="font-serif font-bold text-2xl text-navy-950 tracking-tight">
              Student Directory & Roster
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Maintain student admissions, standard levels, parent communication records, and tuition credentials.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn-primary text-xs self-start sm:self-auto">
          <UserPlus className="h-3.5 w-3.5 text-gold-400" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="academic-panel p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-600" />
          <input
            type="text"
            placeholder="Search by student name, roll ID, or parent contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 placeholder-ink-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="ALL">All Standards</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="ALL">All Batches</option>
            <option value="Morning Batch">Morning Batch</option>
            <option value="Evening Batch">Evening Batch</option>
            <option value="Evening Science">Evening Science</option>
            <option value="Weekend Batch">Weekend Batch</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="academic-panel overflow-hidden bg-white">
        {loading ? (
          <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
            <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
            <p className="text-xs font-serif italic font-medium">Loading enrolled student records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderWarm text-left text-xs">
              <thead>
                <tr>
                  <th className="academic-th">Student Particulars</th>
                  <th className="academic-th">Roll No</th>
                  <th className="academic-th">Standard & Batch</th>
                  <th className="academic-th">Student Contact</th>
                  <th className="academic-th">Parent Phone</th>
                  <th className="academic-th">Monthly Fee</th>
                  <th className="academic-th">Status</th>
                  <th className="academic-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D8] text-ink-950 bg-white">
                {students.length > 0 ? (
                  students.map((st) => (
                    <tr key={st._id} className="hover:bg-ivory-sand/40 transition">
                      <td className="academic-td">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-paper-sm">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-navy-950 text-xs">{st.name}</p>
                            <p className="text-[11px] text-ink-700 font-medium">{st.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="academic-td font-mono font-bold text-navy-900">
                        {st.rollNo || '—'}
                      </td>
                      <td className="academic-td">
                        <span className="font-bold text-navy-950">{st.standardClass}</span>
                        <p className="text-[11px] text-ink-700 font-medium">{st.batch}</p>
                      </td>
                      <td className="academic-td text-ink-800 font-medium">
                        {st.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-ink-600" />
                            {st.phone}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="academic-td text-ink-800">
                        {st.parentPhone ? (
                          <span className="flex items-center gap-1 font-bold text-navy-950">
                            <Phone className="h-3 w-3 text-gold-700" />
                            {st.parentPhone}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="academic-td font-extrabold text-navy-950">
                        ₹{(st.monthlyFeeAmount || 2000).toLocaleString('en-IN')}
                      </td>
                      <td className="academic-td">
                        {st.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-academic-greenBg text-academic-green border border-academic-green/30">
                            <CheckCircle2 className="h-3 w-3" />
                            Enrolled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-ivory-sand text-ink-700 border border-borderWarm">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="academic-td text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            title="Edit Student Record"
                            className="p-1.5 rounded text-ink-600 hover:text-navy-950 hover:bg-ivory-sand transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st._id, st.name)}
                            title="Remove Student"
                            className="p-1.5 rounded text-ink-600 hover:text-academic-crimson hover:bg-academic-crimsonBg transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="academic-td text-center text-ink-700 py-12 font-serif italic font-medium">
                      No student records found. Enroll your first student using the button above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Enroll Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-borderWarm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center shadow-paper-sm">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-navy-950">Enroll New Student</h3>
                  <p className="text-[11px] text-ink-700 font-medium">Assign academic class, parent phone, and login credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Roll ID Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Student Email (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@vidyaarambh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Standard / Class
                  </label>
                  <select
                    value={formData.standardClass}
                    onChange={(e) => setFormData({ ...formData, standardClass: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Assigned Batch
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="Morning Batch">Morning Batch</option>
                    <option value="Evening Batch">Evening Batch</option>
                    <option value="Evening Science">Evening Science</option>
                    <option value="Weekend Batch">Weekend Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Parent Phone Contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 11111"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Monthly Tuition Fee (₹ INR)
                </label>
                <input
                  type="number"
                  value={formData.monthlyFeeAmount}
                  onChange={(e) => setFormData({ ...formData, monthlyFeeAmount: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-borderWarm flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn-primary text-xs">
                  {modalLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Complete Enrollment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student Record */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-borderWarm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-academic bg-gold-500/20 text-gold-800 flex items-center justify-center shadow-paper-sm">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-navy-950">Update Student Record</h3>
                  <p className="text-[11px] text-ink-700 font-medium">Edit particulars or reset password</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
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

            <form onSubmit={handleUpdateStudent} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Roll ID Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Standard / Class
                  </label>
                  <select
                    value={formData.standardClass}
                    onChange={(e) => setFormData({ ...formData, standardClass: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Batch Allocation
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="Morning Batch">Morning Batch</option>
                    <option value="Evening Batch">Evening Batch</option>
                    <option value="Evening Science">Evening Science</option>
                    <option value="Weekend Batch">Weekend Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Parent Phone Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Monthly Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFeeAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyFeeAmount: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Reset Password (optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-navy-900 focus:ring-navy-900 h-3.5 w-3.5"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-navy-950">
                  Student enrollment active (can access learning portal)
                </label>
              </div>

              <div className="pt-3 border-t border-borderWarm flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="btn-primary text-xs">
                  {modalLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;
