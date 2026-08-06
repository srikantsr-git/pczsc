import React, { useState } from 'react';
import { useCMS, PhysicalEducationDirector } from '../../context/CMSContext';
import { useToast } from '../../context/ToastContext';
import { FileUploadInput } from '../FileUploadInput';
import { MediaRenderer } from '../MediaRenderer';
import {
  UserPlus, Edit2, Trash2, X, Save, GraduationCap,
  Phone, Mail, MapPin, User, AlertTriangle
} from 'lucide-react';

const defaultBlankAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%2394a3b8'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='22' fill='%2394a3b8'/%3E%3C/svg%3E";

const emptyDirector: Omit<PhysicalEducationDirector, 'id'> = {
  name: '',
  photo: '',
  mobile: '',
  email: '',
  collegeAddress: ''
};

interface DirectorFormModalProps {
  initial?: PhysicalEducationDirector;
  onSave: (data: Omit<PhysicalEducationDirector, 'id'>) => void;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const DirectorFormModal: React.FC<DirectorFormModalProps> = ({ initial, onSave, onClose, mode }) => {
  const [form, setForm] = useState<Omit<PhysicalEducationDirector, 'id'>>({
    name: initial?.name || '',
    photo: initial?.photo || '',
    mobile: initial?.mobile || '',
    email: initial?.email || '',
    collegeAddress: initial?.collegeAddress || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-santic-red" />
            <h3 className="text-lg font-extrabold text-slate-900">
              {mode === 'add' ? 'Add New PE Director' : 'Edit PE Director'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo Upload */}
          <FileUploadInput
            sectionName="pe-directors"
            label="Director Photo"
            currentUrl={form.photo}
            onUrlChange={(url) => setForm(f => ({ ...f, photo: url }))}
            accept="image/*"
          />

          {/* Photo Preview */}
          {form.photo && (
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-santic-red/30">
                <MediaRenderer
                  src={form.photo || defaultBlankAvatar}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Firstname Lastname"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={form.mobile}
                onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="director@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* College Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              College Name & Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                value={form.collegeAddress}
                onChange={e => setForm(f => ({ ...f, collegeAddress: e.target.value }))}
                placeholder="College Name, Area, Pune - 411001"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 font-medium hover:text-slate-900">
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-santic-red text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:bg-santic-hoverRed transition-colors"
            >
              <Save className="w-4 h-4" />
              {mode === 'add' ? 'Add Director' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Section Component ────────────────────────────────────────────────────
export const ManagePEDirectorsSection: React.FC = () => {
  const { peDirectors, addPEDirector, editPEDirector, deletePEDirector } = useCMS();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<PhysicalEducationDirector | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = (peDirectors || []).filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.collegeAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<PhysicalEducationDirector, 'id'>) => {
    addPEDirector(data);
    setShowModal(null);
    showToast('✅ Director Added', `${data.name} has been added successfully.`, 'success');
  };

  const handleEdit = (data: Omit<PhysicalEducationDirector, 'id'>) => {
    if (!selectedDirector) return;
    editPEDirector(selectedDirector.id, data);
    setShowModal(null);
    setSelectedDirector(null);
    showToast('✅ Director Updated', `${data.name} details saved successfully.`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    deletePEDirector(id);
    setDeleteConfirmId(null);
    showToast('🗑️ Director Removed', `${name} has been removed from the list.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-santic-red" />
            Directors of Physical Education & Sports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {peDirectors?.length || 0} director{(peDirectors?.length || 0) !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setShowModal('add')}
          className="flex items-center gap-2 bg-santic-red text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:bg-santic-hoverRed transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Director
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or college..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-santic-red bg-white"
      />

      {/* Directors Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {search ? 'No directors match your search.' : 'No PE Directors added yet.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal('add')}
              className="mt-4 text-santic-red text-sm font-bold hover:underline"
            >
              + Add your first director
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(director => (
            <div key={director.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3">
              {/* Delete confirmation overlay */}
              {deleteConfirmId === director.id && (
                <div className="absolute inset-0 z-10 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 text-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <p className="text-sm font-bold text-slate-800">Delete {director.name}?</p>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button onClick={() => handleDelete(director.id, director.name)} className="px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  </div>
                </div>
              )}

              <div className="relative flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-200 shrink-0 bg-slate-100">
                  <MediaRenderer
                    src={director.photo || defaultBlankAvatar}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm truncate">{director.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{director.collegeAddress}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 border-t pt-2">
                {director.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{director.mobile}</span>
                  </div>
                )}
                {director.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{director.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setSelectedDirector(director); setShowModal('edit'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 rounded-xl py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(director.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 rounded-xl py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal === 'add' && (
        <DirectorFormModal
          mode="add"
          onSave={handleAdd}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === 'edit' && selectedDirector && (
        <DirectorFormModal
          mode="edit"
          initial={selectedDirector}
          onSave={handleEdit}
          onClose={() => { setShowModal(null); setSelectedDirector(null); }}
        />
      )}
    </div>
  );
};
