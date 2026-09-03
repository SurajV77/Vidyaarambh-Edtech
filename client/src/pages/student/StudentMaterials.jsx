import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  FileText,
  Download,
  Search,
  Clock,
  Award,
  BookOpen,
  Loader2,
} from 'lucide-react';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, [category]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'ALL') params.category = category;

      const res = await axiosClient.get('/student/materials', { params });
      if (res.data?.materials) {
        setMaterials(res.data.materials);
      }
    } catch (err) {
      console.warn('Student materials fallback.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term) ||
      (m.description && m.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderWarm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold-700">01</span>
            <h1 className="font-serif font-bold text-2xl text-navy-950 tracking-tight">
              Study Repository & Question Papers
            </h1>
          </div>
          <p className="text-xs text-ink-700 font-medium mt-1">
            Download revision notes, homework practice sheets, and periodic examination papers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="academic-panel p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white shadow-paper-sm">
        <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-academic border border-borderWarm overflow-x-auto w-full sm:w-auto">
          {['ALL', 'HOMEWORK', 'NOTES', 'TEST'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${
                category === cat
                  ? 'bg-white text-navy-950 shadow-paper-sm border border-borderWarm'
                  : 'text-ink-700 hover:text-navy-950'
              }`}
            >
              {cat === 'ALL' ? 'All Resources' : cat.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-600" />
          <input
            type="text"
            placeholder="Search documents or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F3] border border-borderWarm rounded-academic text-xs font-semibold text-navy-950 placeholder-ink-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="p-14 flex flex-col items-center justify-center gap-2 text-ink-700">
          <Loader2 className="h-6 w-6 animate-spin text-navy-900" />
          <p className="text-xs font-serif italic font-medium">Loading study sheets...</p>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => (
            <div
              key={item._id}
              className="academic-panel doc-notch p-5 flex flex-col justify-between hover:border-navy-400 transition bg-white shadow-paper-sm"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-borderWarm mb-3">
                  <span className="text-[10.5px] font-mono font-extrabold tracking-widest text-gold-700 uppercase">
                    {item.category === 'HOMEWORK' ? 'HOMEWORK SHEET' : item.category === 'NOTES' ? 'REVISION NOTES' : 'UNIT TEST'}
                  </span>
                  <span className="text-[10.5px] font-bold text-navy-950 uppercase">
                    {item.subject}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-navy-950 text-base leading-snug">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-ink-700 mt-2 line-clamp-3 leading-relaxed font-medium">
                    {item.description}
                  </p>
                )}

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
                      Total Marks: {item.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-borderWarm">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs w-full py-2 flex items-center justify-center gap-1.5 font-bold shadow-paper-sm"
                >
                  <Download className="h-3.5 w-3.5 text-gold-400" />
                  <span>Download Study PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="academic-panel p-12 text-center text-ink-700 bg-white">
          <FileText className="h-8 w-8 mx-auto text-borderWarm mb-2" />
          <p className="font-serif italic text-sm font-medium">No documents found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;
