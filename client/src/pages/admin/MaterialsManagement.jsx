import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Clock,
  Award,
  BookOpen,
  Search,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [standards, setStandards] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'HOMEWORK',
    targetClass: 'All Classes',
    subject: 'Mathematics',
    dueDate: '',
    totalMarks: '',
  });

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const res = await axiosClient.get('/admin/standards');
      if (res.data?.standards && res.data.standards.length > 0) {
        setStandards(res.data.standards);
      } else {
        setStandards([
          { name: 'Class 8' },
          { name: 'Class 9' },
          { name: 'Class 10' },
          { name: 'Class 11' },
          { name: 'Class 12' },
        ]);
      }
    } catch (err) {
      console.warn('Failed to load standards in materials management.');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedCategory, selectedClass]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedClass !== 'ALL') params.targetClass = selectedClass;
      if (searchTerm) params.search = searchTerm;

      const res = await axiosClient.get('/materials', { params });
      if (res.data?.materials) {
        setMaterials(res.data.materials);
      }
    } catch (err) {
      console.warn('Backend materials fetch error.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setUploadError('Only PDF files (.pdf) are allowed.');
        setSelectedFile(null);
        return;
      }
      setUploadError('');
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('targetClass', form.targetClass);
      data.append('subject', form.subject);
      if (form.dueDate) data.append('dueDate', form.dueDate);
      if (form.totalMarks) data.append('totalMarks', form.totalMarks);

      const res = await axiosClient.post('/materials/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setForm({
          title: '',
          description: '',
          category: 'HOMEWORK',
          targetClass: 'All Classes',
          subject: 'Mathematics',
          dueDate: '',
          totalMarks: '',
        });
        fetchMaterials();
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete study material "${title}"?`)) {
      try {
        await axiosClient.delete(`/materials/${id}`);
        fetchMaterials();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete material.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderWarm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">03</span>
            <h1 className="font-serif font-bold text-2xl text-navy-950 tracking-tight">
              Study Materials & Exam Papers
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Publish homework worksheets, revision concept notes, and test question papers for student review.
          </p>
        </div>

        <button
          onClick={() => {
            setUploadError('');
            setIsUploadModalOpen(true);
          }}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <UploadCloud className="h-3.5 w-3.5 text-gold-400" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="academic-panel p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-academic border border-borderWarm overflow-x-auto w-full md:w-auto">
          {['ALL', 'HOMEWORK', 'NOTES', 'TEST'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm'
                  : 'text-ink-600 hover:text-navy-950'
              }`}
            >
              {cat === 'ALL' ? 'All Resources' : cat.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-600" />
            <input
              type="text"
              placeholder="Search documents or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 placeholder-ink-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="ALL">All Standards</option>
            {standards.map((s) => (
              <option key={s._id || s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid — Styled as Authentic Study Sheets */}
      {loading ? (
        <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
          <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
          <p className="text-xs font-serif italic font-medium">Loading academic documents...</p>
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((item) => (
            <div
              key={item._id}
              className="academic-panel doc-notch p-5 flex flex-col justify-between hover:border-navy-400 transition bg-white"
            >
              <div>
                {/* Academic Header Meta */}
                <div className="flex items-center justify-between pb-2.5 border-b border-borderWarm mb-3">
                  <span className="text-[10.5px] font-mono font-extrabold tracking-widest text-gold-700 uppercase">
                    {item.category === 'HOMEWORK' ? 'HOMEWORK SHEET' : item.category === 'NOTES' ? 'CONCEPT NOTES' : 'UNIT TEST'}
                  </span>
                  <span className="text-[10.5px] font-mono font-bold text-navy-900 uppercase">
                    {item.targetClass || 'All Classes'}
                  </span>
                </div>

                <p className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
                  {item.subject}
                </p>

                <h3 className="font-serif font-bold text-navy-950 text-base leading-snug line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-ink-700 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                )}

                {/* Due Date or Total Marks */}
                <div className="mt-4 pt-2.5 border-t border-[#EDE6D8] flex items-center justify-between text-[11px] text-ink-700 font-semibold">
                  {item.dueDate && (
                    <span className="flex items-center gap-1 text-academic-amber font-bold">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}
                    </span>
                  )}
                  {item.totalMarks && (
                    <span className="flex items-center gap-1 text-navy-950 font-bold font-mono">
                      <Award className="h-3 w-3 text-gold-700" />
                      Marks: {item.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-borderWarm flex items-center justify-between">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1.5 shadow-paper-sm font-bold"
                >
                  <FileText className="h-3.5 w-3.5 text-navy-950" />
                  <span>Open PDF Document</span>
                </a>

                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  title="Delete Document"
                  className="p-1.5 rounded text-ink-600 hover:text-academic-crimson hover:bg-academic-crimsonBg transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="academic-panel p-12 text-center text-ink-700 bg-white">
          <FileText className="h-8 w-8 mx-auto text-borderWarm mb-2" />
          <p className="font-serif italic text-sm font-medium">No study documents published in this category.</p>
          <p className="text-xs text-ink-600 mt-0.5">Click "Upload Study Material" to share new worksheets.</p>
        </div>
      )}

      {/* Modal: Upload PDF */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="academic-elevated max-w-lg w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-borderWarm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-academic bg-navy-900 text-gold-300 flex items-center justify-center shadow-paper-sm">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-navy-950">Publish Study Document</h3>
                  <p className="text-[11px] text-ink-700 font-medium">Attach PDF worksheets or revision notes</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded text-ink-700 hover:text-navy-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {uploadError && (
              <div className="mt-3 p-2.5 rounded-academic bg-academic-crimsonBg border border-academic-crimson/30 text-academic-crimson text-xs font-semibold">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5">
              {/* Document Dropzone */}
              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Select PDF Document *
                </label>
                <div className="border border-dashed border-borderWarm rounded-academic p-3.5 text-center bg-[#FAF8F3] hover:border-navy-700 transition cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={handleFileChange}
                    className="block w-full text-xs font-semibold text-ink-800 file:mr-2.5 file:py-1 file:px-2.5 file:rounded file:border file:border-borderWarm file:text-xs file:font-bold file:bg-white file:text-navy-950 hover:file:bg-ivory-sand cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-xs font-mono font-bold text-navy-950">
                      Attached: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 04 Quadratic Equations Worksheet"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Document Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="HOMEWORK">Homework Assignment</option>
                    <option value="NOTES">Revision / Class Notes</option>
                    <option value="TEST">Exam / Test Question Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Standard Level
                  </label>
                  <select
                    value={form.targetClass}
                    onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  >
                    <option value="All Classes">All Standards</option>
                    {standards.map((s) => (
                      <option key={s._id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                    Academic Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                {form.category === 'TEST' ? (
                  <div>
                    <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                      Total Test Marks
                    </label>
                    <input
                      type="number"
                      value={form.totalMarks}
                      onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-navy-950 uppercase tracking-wider mb-1">
                  Teacher's Notes & Instructions
                </label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Instructions for students regarding this document..."
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-borderWarm flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="btn-primary text-xs">
                  {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Publish PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManagement;
