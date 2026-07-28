import React, { useState } from 'react';
import { SubPageHero } from '../components/SubPageHero';
import { useCMS, DocumentItem } from '../context/CMSContext';
import { FileUploadInput } from '../components/FileUploadInput';
import {
  FileText,
  Download,
  Eye,
  EyeOff,
  Search,
  Plus,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    isAdmin,
    isEditMode,
    addDocument,
    editDocument,
    deleteDocument,
    toggleDocumentNewsMarquee
  } = useCMS();

  const showAdminControls = isAdmin || isEditMode;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Document Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('Circulars');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docViewUrl, setDocViewUrl] = useState('');

  // Edit Document Modal State
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  const categories = [
    'All',
    'News',
    'Circulars',
    'Rules & Regulations',
    'Souvenirs',
    'Annual Reports - BOS&PE, SPPU, Pune',
    'Sports Calendar - Intercollegiate',
    'Sports Calendar - Inter Zonal',
    'Draws',
    'Results'
  ];

  const filteredDocs = documents.filter((doc) => {
    const normCategory = (c: string) => c.toLowerCase().replace(/&/g, 'and').trim();
    const matchesCategory =
      selectedCategory === 'All' ||
      normCategory(doc.category) === normCategory(selectedCategory) ||
      (selectedCategory.toLowerCase().includes('rules') &&
        normCategory(doc.category).includes('rules'));
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      title: docTitle,
      category: docCategory,
      date: docDate,
      viewUrl: docViewUrl || '#',
      downloadUrl: docViewUrl || '#'
    });
    setDocTitle('');
    setDocViewUrl('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      editDocument(editingDoc.id, {
        title: editingDoc.title,
        category: editingDoc.category,
        date: editingDoc.date,
        viewUrl: editingDoc.viewUrl,
        downloadUrl: editingDoc.viewUrl
      });
      setEditingDoc(null);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <SubPageHero pageKey="documents" />

      <section className="santic-section bg-slate-50/70 border-b border-slate-200/80">
        <div className="santic-container space-y-8">
          
          {/* Section Heading & Intro */}
          <div className="space-y-2 border-b border-slate-200/80 pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-santic-red/10 border border-santic-red/20 text-santic-red text-xs font-extrabold uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              <span>Official Document Repository</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              PCZSC Official Circulars, Sports Calendars & Tournament Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Access official circulars, AIU body weight notifications, sports calendars, intercollegiate souvenirs, tournament draws, annual reports, and competition results.
            </p>
          </div>

          {/* Header Controls: Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circulars, schedules, results by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-santic-red"
              />
            </div>

            {/* Admin Upload / Add Document Trigger */}
            {showAdminControls && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-santic-red hover:bg-santic-hoverRed text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-red-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Add Document</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Categorized Document Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-sm font-extrabold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6 w-16">Sr. No.</th>
                    <th className="py-4 px-6">Document Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6 w-36">Date / Year</th>
                    <th className="py-4 px-6 text-center w-72">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, idx) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-400 font-numeric text-sm">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-start gap-2.5">
                              <FileText className="w-4.5 h-4.5 text-santic-red shrink-0 mt-0.5" />
                              <a
                                href={doc.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-extrabold text-slate-900 hover:text-santic-red transition-colors leading-snug text-sm sm:text-base"
                              >
                                {doc.title}
                              </a>
                            </div>

                            {doc.showOnNewsMarquee && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Featured on Home Page News Marquee</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border border-slate-200">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-500 text-xs sm:text-sm">
                          {doc.date}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {/* View Document */}
                            <a
                              href={doc.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-200"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </a>

                            {/* Download Document */}
                            <a
                              href={doc.downloadUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-santic-red text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </a>

                            {/* Show / Hide on Home Page News Marquee Toggle (Admin Only) */}
                            {showAdminControls && (
                              <button
                                onClick={() => toggleDocumentNewsMarquee(doc.id)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                  doc.showOnNewsMarquee
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                                    : 'bg-santic-red hover:bg-santic-hoverRed text-white border-santic-red shadow-sm'
                                }`}
                                title={
                                  doc.showOnNewsMarquee
                                    ? 'Click to Hide from Home Page News Marquee'
                                    : 'Click to Show on Home Page News Marquee'
                                }
                              >
                                {doc.showOnNewsMarquee ? (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 text-amber-300" />
                                    <span>Show</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Admin Edit Document Button */}
                            {showAdminControls && (
                              <button
                                onClick={() => setEditingDoc({ ...doc })}
                                className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm"
                                title="Edit Document Details"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            )}

                            {/* Admin Delete Action */}
                            {showAdminControls && (
                              <button
                                onClick={() => deleteDocument(doc.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                        No documents found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Admin Add Document Modal */}
      {showAdminControls && showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto scrollbar-thin">
            <h3 className="text-lg font-extrabold text-slate-900">Upload & Add New Document</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  placeholder="e.g. AIU Body Weight Implementation Order 2025-26"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="News">News</option>
                  <option value="Circulars">Circulars</option>
                  <option value="Rules & Regulations">Rules & Regulations</option>
                  <option value="Souvenirs">Souvenirs</option>
                  <option value="Annual Reports - BOS&PE, SPPU, Pune">Annual Reports - BOS&PE, SPPU, Pune</option>
                  <option value="Sports Calendar - Intercollegiate">Sports Calendar - Intercollegiate</option>
                  <option value="Sports Calendar - Inter Zonal">Sports Calendar - Inter Zonal</option>
                  <option value="Draws">Draws</option>
                  <option value="Results">Results</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date / Year</label>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <FileUploadInput
                sectionName="documents"
                label="Upload Document PDF / Circular File (Saved to uploads/documents/)"
                currentUrl={docViewUrl}
                onUrlChange={(url) => setDocViewUrl(url)}
                accept=".pdf,.doc,.docx,image/*"
              />

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Save & Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Document Modal */}
      {showAdminControls && editingDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto scrollbar-thin">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-santic-red" />
                <span>Edit Document Details</span>
              </h3>
              <button
                onClick={() => setEditingDoc(null)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingDoc.category}
                  onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="News">News</option>
                  <option value="Circulars">Circulars</option>
                  <option value="Rules & Regulations">Rules & Regulations</option>
                  <option value="Souvenirs">Souvenirs</option>
                  <option value="Annual Reports - BOS&PE, SPPU, Pune">Annual Reports - BOS&PE, SPPU, Pune</option>
                  <option value="Sports Calendar - Intercollegiate">Sports Calendar - Intercollegiate</option>
                  <option value="Sports Calendar - Inter Zonal">Sports Calendar - Inter Zonal</option>
                  <option value="Draws">Draws</option>
                  <option value="Results">Results</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date / Year</label>
                <input
                  type="date"
                  value={editingDoc.date}
                  onChange={(e) => setEditingDoc({ ...editingDoc, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <FileUploadInput
                sectionName="documents"
                label="Replace Document File (Saved to uploads/documents/)"
                currentUrl={editingDoc.viewUrl}
                onUrlChange={(url) => setEditingDoc({ ...editingDoc, viewUrl: url, downloadUrl: url })}
                accept=".pdf,.doc,.docx,image/*"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  Update & Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
