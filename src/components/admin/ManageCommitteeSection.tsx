import React, { useState } from 'react';
import { useCMS, CommitteeMember } from '../../context/CMSContext';
import { useToast } from '../../context/ToastContext';
import { FileUploadInput } from '../FileUploadInput';
import { MediaRenderer } from '../MediaRenderer';
import {
  UserPlus, Edit2, Trash2, X, Save, Users,
  Phone, MapPin, User, AlertTriangle, RotateCcw, Award
} from 'lucide-react';

const defaultBlankAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%2394a3b8'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='22' fill='%2394a3b8'/%3E%3C/svg%3E";

interface MemberFormModalProps {
  initial?: CommitteeMember;
  onSave: (data: Omit<CommitteeMember, 'id'>) => void;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({ initial, onSave, onClose, mode }) => {
  const [form, setForm] = useState<Omit<CommitteeMember, 'id'>>({
    name: initial?.name || '',
    designation: initial?.designation || '',
    photo: initial?.photo || '',
    collegeAddress: initial?.collegeAddress || '',
    contactDetails: initial?.contactDetails || ''
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
            <Users className="w-5 h-5 text-santic-red" />
            <h3 className="text-lg font-extrabold text-slate-900">
              {mode === 'add' ? 'Add New Committee Member' : 'Edit Committee Member'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo Upload */}
          <FileUploadInput
            sectionName="committee"
            label="Member Photo"
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

          {/* Full Name */}
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
                placeholder="e.g. Dr. Aftab Anwar Shaikh"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Designation / Role *
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={form.designation}
                onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                placeholder="e.g. President / Secretary / Member"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* College Name & Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              College Name & Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                value={form.collegeAddress}
                onChange={e => setForm(f => ({ ...f, collegeAddress: e.target.value }))}
                placeholder="Poona College of Arts, Science and Commerce, Camp, Pune"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:border-santic-red"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Contact Details (Phone / Email)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.contactDetails}
                onChange={e => setForm(f => ({ ...f, contactDetails: e.target.value }))}
                placeholder="+91 98765 43210 / email@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-santic-red"
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
              {mode === 'add' ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Section Component ────────────────────────────────────────────────────
export const ManageCommitteeSection: React.FC = () => {
  const { committeeMembers, addCommitteeMember, editCommitteeMember, deleteCommitteeMember, resetCommitteeMembers } = useCMS();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = (committeeMembers || []).filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.designation.toLowerCase().includes(search.toLowerCase()) ||
    m.collegeAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<CommitteeMember, 'id'>) => {
    addCommitteeMember(data);
    setShowModal(null);
    showToast('✅ Committee Member Added', `${data.name} has been added successfully.`, 'success');
  };

  const handleEdit = (data: Omit<CommitteeMember, 'id'>) => {
    if (!selectedMember) return;
    editCommitteeMember(selectedMember.id, data);
    setShowModal(null);
    setSelectedMember(null);
    showToast('✅ Committee Member Updated', `${data.name} details saved successfully.`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    deleteCommitteeMember(id);
    setDeleteConfirmId(null);
    showToast('🗑️ Member Removed', `${name} has been removed from the list.`, 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset committee list to official 14 members?')) {
      resetCommitteeMembers();
      showToast('🔄 Official List Restored', 'Committee list restored to official 14 members.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-santic-red" />
            PCZSC Committee Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {committeeMembers?.length || 0} executive member{(committeeMembers?.length || 0) !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            title="Restore official 14 committee members"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset List</span>
          </button>
          <button
            onClick={() => setShowModal('add')}
            className="flex items-center gap-2 bg-santic-red text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:bg-santic-hoverRed transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, designation, or college..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-santic-red bg-white"
      />

      {/* Committee Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {search ? 'No committee members match your search.' : 'No committee members added yet.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal('add')}
              className="mt-4 text-santic-red text-sm font-bold hover:underline"
            >
              + Add your first committee member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(member => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3 relative">
              {/* Delete confirmation overlay */}
              {deleteConfirmId === member.id && (
                <div className="absolute inset-0 z-10 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 text-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <p className="text-sm font-bold text-slate-800">Delete {member.name}?</p>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button onClick={() => handleDelete(member.id, member.name)} className="px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-200 shrink-0 bg-slate-100">
                  <MediaRenderer
                    src={member.photo || defaultBlankAvatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-900 text-sm truncate">{member.name}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-santic-red/10 text-santic-red border border-santic-red/20 truncate">
                    {member.designation}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 border-t pt-2">
                {member.collegeAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{member.collegeAddress}</span>
                  </div>
                )}
                {member.contactDetails && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.contactDetails}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setSelectedMember(member); setShowModal('edit'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 rounded-xl py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(member.id)}
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
        <MemberFormModal
          mode="add"
          onSave={handleAdd}
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === 'edit' && selectedMember && (
        <MemberFormModal
          mode="edit"
          initial={selectedMember}
          onSave={handleEdit}
          onClose={() => { setShowModal(null); setSelectedMember(null); }}
        />
      )}
    </div>
  );
};
