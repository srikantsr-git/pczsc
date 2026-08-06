import React, { useState, useEffect } from 'react';
import { SubPageHero } from '../components/SubPageHero';
import { useCMS, CommitteeMember, PhysicalEducationDirector } from '../context/CMSContext';
import { FileUploadInput } from '../components/FileUploadInput';
import { defaultBlankAvatar } from '../data/defaultPEDirectors';
import {
  Trophy,
  Award,
  Target,
  CheckCircle2,
  Tv,
  Edit,
  Plus,
  X,
  Users,
  ZoomIn,
  Building,
  Phone,
  Trash2,
  Mail,
  Search
} from 'lucide-react';
import { ImageWithTextBlock } from '../components/ImageWithTextBlock';
import { AdminConfigModals } from '../components/AdminConfigModals';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/SEOHead';
import { PaginationControls } from '../components/PaginationControls';

export const AboutUsPage: React.FC = () => {
  const { showToast } = useToast();
  const {
    isAdmin,
    isEditMode,
    aboutUsConfig,
    updateAboutUsConfig,
    visionMission,
    aboutSections,
    addSection,
    committeeMembers,
    addCommitteeMember,
    editCommitteeMember,
    deleteCommitteeMember,
    peDirectors,
    addPEDirector,
    editPEDirector,
    deletePEDirector
  } = useCMS();

  // Modals for editing sections
  const [showHistoryEdit, setShowHistoryEdit] = useState(false);
  const [showObjectivesEdit, setShowObjectivesEdit] = useState(false);
  const [showPresidentEdit, setShowPresidentEdit] = useState(false);
  const [showVMModal, setShowVMModal] = useState(false);

  // Form states for history
  const [historyBadge, setHistoryBadge] = useState(aboutUsConfig.historyBadge);
  const [historyTitle, setHistoryTitle] = useState(aboutUsConfig.historyTitle);
  const [historyBody, setHistoryBody] = useState(aboutUsConfig.historyBody);
  const [historyImage, setHistoryImage] = useState(aboutUsConfig.historyImage);

  // Form states for objectives
  const [objectivesTitle, setObjectivesTitle] = useState(aboutUsConfig.objectivesTitle);
  const [objectivesBody, setObjectivesBody] = useState(aboutUsConfig.objectivesBody);

  // President member fallback from committee list
  const presidentMember = committeeMembers.find((m) =>
    m.designation.toLowerCase().includes('president')
  );

  // Form states for president
  const [presidentTitle, setPresidentTitle] = useState(aboutUsConfig.presidentTitle);
  const [presidentSubtitle, setPresidentSubtitle] = useState(aboutUsConfig.presidentSubtitle);
  const [presidentBody, setPresidentBody] = useState(aboutUsConfig.presidentBody);
  const [presidentHighlightTitle, setPresidentHighlightTitle] = useState(aboutUsConfig.presidentHighlightTitle);
  const [presidentHighlightBody, setPresidentHighlightBody] = useState(aboutUsConfig.presidentHighlightBody);
  const [presidentName, setPresidentName] = useState(
    aboutUsConfig.presidentName || presidentMember?.name || 'Prin. Dr. Iqbal N. Shaikh'
  );
  const [presidentPhoto, setPresidentPhoto] = useState(
    aboutUsConfig.presidentPhoto || presidentMember?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  );
  const [presidentRole, setPresidentRole] = useState(aboutUsConfig.presidentRole);
  const [presidentOrganization, setPresidentOrganization] = useState(aboutUsConfig.presidentOrganization);
  const [presidentUniversity, setPresidentUniversity] = useState(aboutUsConfig.presidentUniversity);

  // New custom section modal
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePos, setNewImagePos] = useState<'left' | 'right'>('right');
  const [showAddModal, setShowAddModal] = useState(false);

  // Photo Lightbox / Dialog Modal State
  const [selectedPhotoMember, setSelectedPhotoMember] = useState<CommitteeMember | null>(null);

  // Committee Member Add/Edit Modal state on About Us page
  const [showCommitteeFormModal, setShowCommitteeFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  const [cmName, setCmName] = useState('');
  const [cmDesignation, setCmDesignation] = useState('');
  const [cmPhoto, setCmPhoto] = useState('');
  const [cmCollegeAddress, setCmCollegeAddress] = useState('');
  const [cmContactDetails, setCmContactDetails] = useState('');

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setCmName('');
    setCmDesignation('');
    setCmPhoto('');
    setCmCollegeAddress('');
    setCmContactDetails('');
    setShowCommitteeFormModal(true);
  };

  const handleOpenEditMember = (member: CommitteeMember) => {
    setEditingMember(member);
    setCmName(member.name);
    setCmDesignation(member.designation);
    setCmPhoto(member.photo);
    setCmCollegeAddress(member.collegeAddress);
    setCmContactDetails(member.contactDetails);
    setShowCommitteeFormModal(true);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from the committee list?`)) {
      deleteCommitteeMember(id);
      if (selectedPhotoMember?.id === id) {
        setSelectedPhotoMember(null);
      }
      showToast('Member Deleted', `${name} has been removed from PCZSC Committee.`, 'info');
    }
  };

  const handleSaveMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmName.trim() || !cmDesignation.trim()) {
      showToast('Validation Error', 'Name and Designation are required fields.', 'error');
      return;
    }

    const payload = {
      name: cmName.trim(),
      designation: cmDesignation.trim(),
      photo: cmPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      collegeAddress: cmCollegeAddress.trim(),
      contactDetails: cmContactDetails.trim()
    };

    if (editingMember) {
      editCommitteeMember(editingMember.id, payload);
      showToast('Member Updated', `Updated details for ${payload.name}.`, 'success');
    } else {
      addCommitteeMember(payload);
      showToast('Member Added', `Added ${payload.name} to PCZSC Committee.`, 'success');
    }

    setShowCommitteeFormModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhotoMember(null);
      }
    };
    if (selectedPhotoMember) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoMember]);

  const handleSaveHistory = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutUsConfig({
      ...aboutUsConfig,
      historyBadge,
      historyTitle,
      historyBody,
      historyImage
    });
    setShowHistoryEdit(false);
  };

  const handleSaveObjectives = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutUsConfig({
      ...aboutUsConfig,
      objectivesTitle,
      objectivesBody
    });
    setShowObjectivesEdit(false);
  };

  const handleSavePresident = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutUsConfig({
      ...aboutUsConfig,
      presidentTitle,
      presidentSubtitle,
      presidentBody,
      presidentHighlightTitle,
      presidentHighlightBody,
      presidentName,
      presidentPhoto,
      presidentRole,
      presidentOrganization,
      presidentUniversity
    });
    setShowPresidentEdit(false);
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSection('about', {
      title: newTitle,
      subtitle: newSubtitle,
      body: newBody,
      imageUrl: newImageUrl,
      imagePosition: newImagePos
    });
    setNewTitle('');
    setNewSubtitle('');
    setNewBody('');
    setNewImageUrl('');
    setShowAddModal(false);
  };

  // Director of Physical Education & Sports Modal State
  const [showDirectorFormModal, setShowDirectorFormModal] = useState(false);
  const [editingDirector, setEditingDirector] = useState<PhysicalEducationDirector | null>(null);

  const [dirName, setDirName] = useState('');
  const [dirPhoto, setDirPhoto] = useState('');
  const [dirMobile, setDirMobile] = useState('');
  const [dirEmail, setDirEmail] = useState('');
  const [dirCollegeAddress, setDirCollegeAddress] = useState('');
  const [directorSearch, setDirectorSearch] = useState('');

  const [directorPage, setDirectorPage] = useState<number>(1);
  const directorsPerPage = 20;

  const filteredDirectors = peDirectors.filter((dir) => {
    const q = directorSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      dir.name.toLowerCase().includes(q) ||
      dir.collegeAddress.toLowerCase().includes(q) ||
      dir.email.toLowerCase().includes(q) ||
      dir.mobile.includes(q)
    );
  });

  const totalDirectorPages = Math.ceil(filteredDirectors.length / directorsPerPage);
  const paginatedDirectors = filteredDirectors.slice(
    (directorPage - 1) * directorsPerPage,
    directorPage * directorsPerPage
  );

  const getDirectorPhoto = (dir: PhysicalEducationDirector) => {
    if (dir.photo && dir.photo !== defaultBlankAvatar) {
      return dir.photo;
    }
    const cleanDirName = dir.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|prin\.)\s*/gi, '').trim();
    const match = committeeMembers.find((cm) => {
      if (!cm.photo || cm.photo === defaultBlankAvatar) return false;
      const cleanCmName = cm.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|prin\.)\s*/gi, '').trim();
      const dirDigits = dir.mobile.replace(/\D/g, '');
      const cmDigits = cm.contactDetails.replace(/\D/g, '');
      return (
        cleanDirName === cleanCmName ||
        (dirDigits.length > 5 && dirDigits === cmDigits) ||
        (cleanDirName.length > 6 && cleanCmName.includes(cleanDirName))
      );
    });
    return match?.photo || defaultBlankAvatar;
  };

  const [selectedDirectorPhoto, setSelectedDirectorPhoto] = useState<PhysicalEducationDirector | null>(null);

  const handleOpenAddDirector = () => {
    setEditingDirector(null);
    setDirName('');
    setDirPhoto('');
    setDirMobile('');
    setDirEmail('');
    setDirCollegeAddress('');
    setShowDirectorFormModal(true);
  };

  const handleOpenEditDirector = (director: PhysicalEducationDirector) => {
    setEditingDirector(director);
    setDirName(director.name);
    setDirPhoto(director.photo);
    setDirMobile(director.mobile);
    setDirEmail(director.email);
    setDirCollegeAddress(director.collegeAddress);
    setShowDirectorFormModal(true);
  };

  const handleDeleteDirector = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deletePEDirector(id);
      if (selectedDirectorPhoto?.id === id) {
        setSelectedDirectorPhoto(null);
      }
      showToast('Director Deleted', `${name} removed from list.`, 'info');
    }
  };

  const handleSaveDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirName.trim() || !dirMobile.trim()) {
      showToast('Validation Error', 'Name and Mobile number are required fields.', 'error');
      return;
    }

    const payload = {
      name: dirName.trim(),
      photo: dirPhoto.trim() || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      mobile: dirMobile.trim(),
      email: dirEmail.trim(),
      collegeAddress: dirCollegeAddress.trim()
    };

    if (editingDirector) {
      editPEDirector(editingDirector.id, payload);
      showToast('Director Updated', `Updated details for ${payload.name}.`, 'success');
    } else {
      addPEDirector(payload);
      showToast('Director Added', `Added ${payload.name} to Director list.`, 'success');
    }

    setShowDirectorFormModal(false);
  };

  // Active Tab Filter State for About Page
  const [activeTab, setActiveTab] = useState<
    'all' | 'committee' | 'directors' | 'history' | 'objectives' | 'leadership' | 'vision' | 'values' | 'dynamic'
  >('all');

  const aboutTabs = [
    { id: 'all', label: 'All Sections', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'Overview & History', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'objectives', label: 'Objectives & Directives', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'leadership', label: "President's Message", icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'vision', label: 'Vision & Mission', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'values', label: 'Core Values', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'committee', label: 'PCZSC Committee', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'directors', label: 'Director of Physical Education & Sports', icon: <Users className="w-3.5 h-3.5" /> },
    ...(aboutSections.length > 0
      ? [{ id: 'dynamic', label: 'Additional Sections', icon: <Tv className="w-3.5 h-3.5" /> }]
      : [])
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <SEOHead pageKey="about" />
      <SubPageHero pageKey="about" />

      <section className="santic-section bg-white">
        <div className="santic-container space-y-12">
          
          {/* Mobile Navigation Dropdown Select (< md) */}
          <div className="md:hidden w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm sticky top-20 z-30 bg-white/95 backdrop-blur-md space-y-1">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1">
              Select Page Section / View
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-extrabold text-slate-900 focus:outline-none focus:border-santic-red shadow-sm cursor-pointer"
            >
              {aboutTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Page Navigation Tabs Bar (>= md) */}
          <div className="hidden md:flex flex-wrap items-center justify-start gap-2.5 p-3.5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm sticky top-20 z-30 bg-white/95 backdrop-blur-md">
            {aboutTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-santic-red text-white shadow-md shadow-red-500/20 scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-16">
          
          {/* Section 1: Overview & History */}
          {(activeTab === 'all' || activeTab === 'history') && (
            <div className="relative group animate-fade-in">
              {isEditMode && (
                <div className="absolute -top-6 right-0 z-20">
                  <button
                    onClick={() => {
                      setHistoryBadge(aboutUsConfig.historyBadge);
                      setHistoryTitle(aboutUsConfig.historyTitle);
                      setHistoryBody(aboutUsConfig.historyBody);
                      setHistoryImage(aboutUsConfig.historyImage);
                      setShowHistoryEdit(true);
                    }}
                    className="bg-santic-red text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/20 uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit History Section</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/10 border border-santic-red/20 text-santic-red text-xs font-extrabold uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{aboutUsConfig.historyBadge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    {aboutUsConfig.historyTitle}
                  </h2>
                  <div className="text-slate-600 text-base md:text-lg leading-relaxed font-normal space-y-4">
                    {aboutUsConfig.historyBody.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                    <img
                      src={aboutUsConfig.historyImage}
                      alt="PCZSC Sports Championship"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-santic-red">PCZSC Legacy</span>
                      <h4 className="text-lg font-bold">Uniting Higher Education Institutions in Pune</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Detailed Objectives & Talent Development (Editable) */}
          {(activeTab === 'all' || activeTab === 'objectives') && (
            <div className="relative p-8 md:p-14 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-6 animate-fade-in">
              {isEditMode && (
                <div className="absolute top-6 right-6 z-20">
                  <button
                    onClick={() => {
                      setObjectivesTitle(aboutUsConfig.objectivesTitle);
                      setObjectivesBody(aboutUsConfig.objectivesBody);
                      setShowObjectivesEdit(true);
                    }}
                    className="bg-santic-red text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Objectives Section</span>
                  </button>
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                {aboutUsConfig.objectivesTitle}
              </h3>
              <div className="text-slate-600 text-base md:text-lg leading-relaxed font-normal space-y-4">
                {aboutUsConfig.objectivesBody.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: President's Message (Editable) */}
          {(activeTab === 'all' || activeTab === 'leadership') && (
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl border border-slate-800 space-y-8 overflow-hidden animate-fade-in">
              {isEditMode && (
                <div className="absolute top-6 right-6 z-20">
                  <button
                    onClick={() => {
                      setPresidentTitle(aboutUsConfig.presidentTitle);
                      setPresidentSubtitle(aboutUsConfig.presidentSubtitle);
                      setPresidentBody(aboutUsConfig.presidentBody);
                      setPresidentHighlightTitle(aboutUsConfig.presidentHighlightTitle);
                      setPresidentHighlightBody(aboutUsConfig.presidentHighlightBody);
                      setPresidentName(aboutUsConfig.presidentName || presidentMember?.name || 'Prin. Dr. Iqbal N. Shaikh');
                      setPresidentPhoto(aboutUsConfig.presidentPhoto || presidentMember?.photo || '');
                      setPresidentRole(aboutUsConfig.presidentRole);
                      setPresidentOrganization(aboutUsConfig.presidentOrganization);
                      setPresidentUniversity(aboutUsConfig.presidentUniversity);
                      setShowPresidentEdit(true);
                    }}
                    className="bg-santic-red text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Leadership Section</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/20 text-santic-red text-xs font-extrabold uppercase tracking-wider border border-santic-red/30">
                    <Award className="w-3.5 h-3.5" />
                    <span>{aboutUsConfig.presidentSubtitle}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {aboutUsConfig.presidentTitle}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                    {aboutUsConfig.presidentBody}
                  </p>
                  {aboutUsConfig.presidentHighlightTitle && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {aboutUsConfig.presidentHighlightTitle}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {aboutUsConfig.presidentHighlightBody}
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-santic-red shadow-xl">
                    <img
                      src={aboutUsConfig.presidentPhoto || presidentMember?.photo || ''}
                      alt={aboutUsConfig.presidentName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white">
                      {aboutUsConfig.presidentName || presidentMember?.name || 'Prin. Dr. Iqbal N. Shaikh'}
                    </h3>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-santic-red text-white uppercase tracking-wider shadow-md">
                        {aboutUsConfig.presidentRole}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-santic-red tracking-wide pt-1">
                      {aboutUsConfig.presidentOrganization}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aboutUsConfig.presidentUniversity || presidentMember?.collegeAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Vision & Mission (Editable by Admin) */}
          {(activeTab === 'all' || activeTab === 'vision') && (
            <div className="space-y-12 relative animate-fade-in">
              {isEditMode && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowVMModal(true)}
                    className="bg-santic-red text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Vision & 10 Mission Points</span>
                  </button>
                </div>
              )}

              {/* Vision Statement */}
              <div className="p-8 md:p-12 rounded-3xl bg-red-50/70 border border-santic-red/30 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-santic-red font-extrabold text-xs uppercase tracking-widest">
                  <Target className="w-4 h-4" />
                  <span>Our Strategic Vision</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  {visionMission.visionTitle}
                </h3>
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
                  "{visionMission.visionText}"
                </p>
              </div>

              {/* Mission 10 Points */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-santic-red font-bold">
                    Core Objectives
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Mission Statement
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visionMission.missions.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3.5 hover:border-santic-red/40 hover:shadow-md transition-all duration-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-santic-red shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                        {m}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Core Values (8 Cards) */}
          {(activeTab === 'all' || activeTab === 'values') && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-santic-red font-bold">
                    Organizational Principles
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Core Values
                  </h3>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowVMModal(true)}
                    className="bg-santic-red text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider shrink-0 self-start sm:self-auto"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Core Values</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visionMission.coreValues.map((val) => (
                  <div
                    key={val.title}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-santic-red hover:shadow-xl transition-all duration-300 space-y-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-santic-red/10 flex items-center justify-center text-santic-red font-bold text-sm group-hover:bg-santic-red group-hover:text-white transition-colors">
                      {val.title.charAt(0)}
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-santic-red transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: PCZSC Committee Members */}
          {(activeTab === 'all' || activeTab === 'committee') && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/10 border border-santic-red/20 text-santic-red text-xs font-extrabold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Governance & Leadership</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    PCZSC Committee
                  </h2>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">
                    Official Executive Committee members of Pune City Zonal Sports Committee.
                  </p>
                </div>

                {(isEditMode || isAdmin) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleOpenAddMember}
                      className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Member</span>
                    </button>
                  </div>
                )}
              </div>

              {committeeMembers.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">No committee members found.</p>
                  {(isEditMode || isAdmin) && (
                    <button
                      onClick={handleOpenAddMember}
                      className="bg-santic-red text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Add First Member
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-md bg-white w-full">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-4 text-center w-40">Photo</th>
                        <th className="py-4 px-4 w-48 sm:w-56">Name</th>
                        <th className="py-4 px-4 w-40">Designation</th>
                        <th className="py-4 px-4">College Address</th>
                        <th className="py-4 px-4 w-48">Contact Details</th>
                        {(isEditMode || isAdmin) && <th className="py-4 px-4 text-right w-24">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
                      {committeeMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedPhotoMember(member)}
                              className="group/photo relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-santic-red/30 shadow-md mx-auto bg-slate-100 shrink-0 block transition-all duration-300 hover:scale-105 hover:border-santic-red hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-santic-red/50"
                              title="Click to expand photo & view details"
                            >
                              <img
                                src={member.photo}
                                alt={member.name}
                                className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                <ZoomIn className="w-6 h-6 drop-shadow-md" />
                              </div>
                            </button>
                          </td>
                          <td className="py-4 px-4 font-extrabold text-slate-900 leading-snug">
                            {member.name}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-santic-red/10 text-santic-red border border-santic-red/20">
                              {member.designation}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-normal text-slate-600 leading-relaxed break-words">
                            {member.collegeAddress}
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-slate-600">
                            {member.contactDetails}
                          </td>
                          {(isEditMode || isAdmin) && (
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditMember(member)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-santic-red hover:text-white text-slate-600 transition-colors shadow-sm"
                                  title="Edit Member"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id, member.name)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition-colors shadow-sm"
                                  title="Delete Member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Section 7: Director of Physical Education & Sports */}
          {(activeTab === 'all' || activeTab === 'directors') && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/10 border border-santic-red/20 text-santic-red text-xs font-extrabold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Physical Education Leadership</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Director of Physical Education & Sports
                  </h2>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">
                    Directors of Physical Education & Sports across affiliated colleges and institutes.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search Input Box */}
                  <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search directors by name, college, email..."
                      value={directorSearch}
                      onChange={(e) => setDirectorSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-santic-red shadow-sm"
                    />
                  </div>

                  {(isEditMode || isAdmin) && (
                    <button
                      onClick={handleOpenAddDirector}
                      className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Director</span>
                    </button>
                  )}
                </div>
              </div>

              {filteredDirectors.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">No directors found matching "{directorSearch}".</p>
                  <button
                    onClick={() => setDirectorSearch('')}
                    className="bg-santic-red text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-md bg-white w-full">
                  <div className="bg-slate-100 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-extrabold text-slate-700 flex-wrap gap-2">
                    <span>Showing {filteredDirectors.length} Directors of Physical Education & Sports</span>
                    <span className="text-[11px] text-slate-500 font-normal">Photos feature neutral placeholder silhouette avatar by default</span>
                  </div>
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-4 text-center w-40">Photo</th>
                        <th className="py-4 px-4 w-48 sm:w-56">Name</th>
                        <th className="py-4 px-4 w-36">Mobile Number</th>
                        <th className="py-4 px-4 w-44">Email ID</th>
                        <th className="py-4 px-4">College/Institute Name & Address</th>
                        {(isEditMode || isAdmin) && <th className="py-4 px-4 text-right w-24">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
                      {paginatedDirectors.map((dir) => (
                        <tr key={dir.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedDirectorPhoto(dir)}
                              className="group/photo relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md mx-auto bg-slate-100 shrink-0 block transition-all duration-300 hover:scale-105 hover:border-santic-red hover:shadow-xl focus:outline-none"
                              title="Click to expand photo & view details"
                            >
                              <img
                                src={getDirectorPhoto(dir)}
                                alt={dir.name}
                                className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultBlankAvatar;
                                }}
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                <ZoomIn className="w-6 h-6 drop-shadow-md" />
                              </div>
                            </button>
                          </td>
                          <td className="py-4 px-4 font-extrabold text-slate-900 leading-snug">
                            {dir.name}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-700 whitespace-nowrap">
                            <a href={`tel:${dir.mobile}`} className="hover:text-santic-red transition-colors flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-santic-red shrink-0" />
                              <span>{dir.mobile}</span>
                            </a>
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-700 break-all">
                            <a href={`mailto:${dir.email}`} className="hover:text-santic-red transition-colors flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-santic-red shrink-0" />
                              <span className="break-all">{dir.email}</span>
                            </a>
                          </td>
                          <td className="py-4 px-4 text-xs font-normal text-slate-600 leading-relaxed break-words">
                            {dir.collegeAddress}
                          </td>
                          {(isEditMode || isAdmin) && (
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditDirector(dir)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-santic-red hover:text-white text-slate-600 transition-colors shadow-sm"
                                  title="Edit Director"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDirector(dir.id, dir.name)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 transition-colors shadow-sm"
                                  title="Delete Director"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls for PE Directors */}
              <PaginationControls
                currentPage={directorPage}
                totalPages={totalDirectorPages}
                totalItems={filteredDirectors.length}
                itemsPerPage={directorsPerPage}
                onPageChange={(page) => setDirectorPage(page)}
              />
            </div>
          )}
          {/* Section 6: Dynamic Admin Sections */}
          {(activeTab === 'all' || activeTab === 'dynamic') &&
            aboutSections.map((sec) => (
              <ImageWithTextBlock key={sec.id} section={sec} page="about" />
            ))}
          </div>

          {/* Admin Add Section Button */}
          {isEditMode && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-santic-red text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Section to About Us</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Edit History Modal */}
      {showHistoryEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Edit History & Governance Section</h3>
              <button onClick={() => setShowHistoryEdit(false)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHistory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={historyBadge}
                  onChange={(e) => setHistoryBadge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={historyTitle}
                  onChange={(e) => setHistoryTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  required
                />
              </div>

              <FileUploadInput
                sectionName="sections"
                label="Upload Section Image (Saved to uploads/sections/)"
                currentUrl={historyImage}
                onUrlChange={(url) => setHistoryImage(url)}
                accept="image/*"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Paragraph Content (Separate paragraphs with double enter)</label>
                <textarea
                  rows={8}
                  value={historyBody}
                  onChange={(e) => setHistoryBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowHistoryEdit(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Objectives Modal */}
      {showObjectivesEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Detailed Objectives Section</h3>
              <button onClick={() => setShowObjectivesEdit(false)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveObjectives} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={objectivesTitle}
                  onChange={(e) => setObjectivesTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Paragraph Content (Separate paragraphs with double enter)</label>
                <textarea
                  rows={8}
                  value={objectivesBody}
                  onChange={(e) => setObjectivesBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowObjectivesEdit(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit President's Message Modal */}
      {showPresidentEdit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Edit President's Message</h3>
              <button onClick={() => setShowPresidentEdit(false)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePresident} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={presidentTitle}
                    onChange={(e) => setPresidentTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={presidentSubtitle}
                    onChange={(e) => setPresidentSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Body (Separate paragraphs with double enter)</label>
                <textarea
                  rows={6}
                  value={presidentBody}
                  onChange={(e) => setPresidentBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-santic-red uppercase tracking-wider">President Profile Information</h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">President Full Name *</label>
                  <input
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    placeholder="e.g. Prin. Dr. Iqbal N. Shaikh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-santic-red"
                    required
                  />
                </div>

                <FileUploadInput
                  sectionName="president"
                  label="President Photo (Upload image file or paste URL)"
                  currentUrl={presidentPhoto}
                  onUrlChange={(url) => setPresidentPhoto(url)}
                  accept="image/*"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={presidentRole}
                      onChange={(e) => setPresidentRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Organization</label>
                    <input
                      type="text"
                      value={presidentOrganization}
                      onChange={(e) => setPresidentOrganization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">College Address / University</label>
                    <input
                      type="text"
                      value={presidentUniversity}
                      onChange={(e) => setPresidentUniversity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-santic-red uppercase tracking-wider">Highlight Box (e.g. Live Streaming)</h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Highlight Title</label>
                  <input
                    type="text"
                    value={presidentHighlightTitle}
                    onChange={(e) => setPresidentHighlightTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Highlight Content</label>
                  <textarea
                    rows={2}
                    value={presidentHighlightBody}
                    onChange={(e) => setPresidentHighlightBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-normal"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowPresidentEdit(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVMModal && (
        <AdminConfigModals activeTab="vision" onClose={() => setShowVMModal(false)} />
      )}

      {/* Admin Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <h3 className="text-lg font-extrabold text-slate-900">Add New Section to About Us</h3>
            <form onSubmit={handleAddSectionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Subtitle</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <FileUploadInput
                sectionName="sections"
                label="Upload Section Image or Video (Saved to uploads/sections/)"
                currentUrl={newImageUrl}
                onUrlChange={(url) => setNewImageUrl(url)}
                accept="image/*,video/*"
              />

              {newImageUrl && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image Float Position</label>
                  <select
                    value={newImagePos}
                    onChange={(e) => setNewImagePos(e.target.value as 'left' | 'right')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  >
                    <option value="right">Float Right of Paragraph</option>
                    <option value="left">Float Left of Paragraph</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Paragraph Text</label>
                <textarea
                  rows={5}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

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
                  className="bg-santic-red text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Photo Lightbox / Member Detail Dialog Box */}
      {selectedPhotoMember && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
          onClick={() => setSelectedPhotoMember(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-center text-slate-900 transform transition-all duration-300 animate-scale-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedPhotoMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-santic-red hover:text-white transition-colors focus:outline-none"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Photo Preview */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto rounded-3xl overflow-hidden border-4 border-santic-red/20 shadow-2xl bg-slate-100">
              <img
                src={selectedPhotoMember.photo}
                alt={selectedPhotoMember.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>

            {/* Member Details */}
            <div className="space-y-2">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-santic-red text-white uppercase tracking-wider shadow-sm">
                {selectedPhotoMember.designation}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                {selectedPhotoMember.name}
              </h3>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-left text-xs text-slate-600">
              {selectedPhotoMember.collegeAddress && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Building className="w-4 h-4 text-santic-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                      College Address
                    </span>
                    <p className="mt-0.5 leading-relaxed font-normal">
                      {selectedPhotoMember.collegeAddress}
                    </p>
                  </div>
                </div>
              )}

              {selectedPhotoMember.contactDetails && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-santic-red shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                      Contact Information
                    </span>
                    <p className="mt-0.5 font-medium text-slate-700">
                      {selectedPhotoMember.contactDetails}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Close & Edit Buttons */}
            <div className="pt-2 flex items-center gap-3">
              {(isEditMode || isAdmin) && (
                <>
                  <button
                    onClick={() => {
                      const memberToEdit = selectedPhotoMember;
                      setSelectedPhotoMember(null);
                      handleOpenEditMember(memberToEdit);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedPhotoMember.id;
                      const name = selectedPhotoMember.name;
                      handleDeleteMember(id, name);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-2xl text-xs font-bold transition-colors"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedPhotoMember(null)}
                className="flex-1 bg-slate-900 hover:bg-santic-red text-white py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Committee Member Modal Dialog */}
      {showCommitteeFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-slate-900 shadow-2xl my-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingMember ? 'Edit Committee Member' : 'Add New Committee Member'}
              </h3>
              <button
                onClick={() => setShowCommitteeFormModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Prin. Dr. Iqbal N. Shaikh"
                  value={cmName}
                  onChange={(e) => setCmName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-santic-red"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  placeholder="e.g. President / Secretary / Member / Joint Secretary"
                  value={cmDesignation}
                  onChange={(e) => setCmDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-santic-red"
                  required
                />
              </div>

              <FileUploadInput
                sectionName="committee"
                label="Photo (Upload image file or paste URL)"
                currentUrl={cmPhoto}
                onUrlChange={(url) => setCmPhoto(url)}
                accept="image/*"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">College Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter college name and location address..."
                  value={cmCollegeAddress}
                  onChange={(e) => setCmCollegeAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-santic-red"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Details</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile No. : 9822012345"
                  value={cmContactDetails}
                  onChange={(e) => setCmContactDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-santic-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCommitteeFormModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Director Lightbox Modal */}
      {selectedDirectorPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedDirectorPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-santic-red hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={getDirectorPhoto(selectedDirectorPhoto)}
                alt={selectedDirectorPhoto.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">{selectedDirectorPhoto.name}</h3>
              <p className="text-xs font-semibold text-santic-red uppercase tracking-wider">
                Director of Physical Education & Sports
              </p>
              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-santic-red" /> {selectedDirectorPhoto.mobile}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-santic-red" /> {selectedDirectorPhoto.email}</p>
                <p className="text-slate-500 pt-1">{selectedDirectorPhoto.collegeAddress}</p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              {(isEditMode || isAdmin) && (
                <button
                  onClick={() => {
                    const dirToEdit = selectedDirectorPhoto;
                    setSelectedDirectorPhoto(null);
                    handleOpenEditDirector(dirToEdit);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={() => setSelectedDirectorPhoto(null)}
                className="flex-1 bg-slate-900 hover:bg-santic-red text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Director Modal */}
      {showDirectorFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-slate-900 shadow-2xl my-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingDirector ? 'Edit Director Details' : 'Add Director of Physical Education & Sports'}
              </h3>
              <button
                onClick={() => setShowDirectorFormModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDirectorSubmit} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Chikte Anagha Sunil"
                  value={dirName}
                  onChange={(e) => setDirName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-santic-red"
                  required
                />
              </div>

              <FileUploadInput
                sectionName="directors"
                label="Photo (Upload photo file or enter URL)"
                currentUrl={dirPhoto}
                onUrlChange={(url) => setDirPhoto(url)}
                accept="image/*"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 9850710713"
                    value={dirMobile}
                    onChange={(e) => setDirMobile(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-santic-red"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email ID *</label>
                  <input
                    type="email"
                    placeholder="e.g. anaghaschikte@yahoo.co.in"
                    value={dirEmail}
                    onChange={(e) => setDirEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-santic-red"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">College/Institute Name & Address *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Maharshi Karve Stree Shikshan Sanstha's Shri Sidhvinayak Mahila Mahavidyalaya, Karvenagar, Pune"
                  value={dirCollegeAddress}
                  onChange={(e) => setDirCollegeAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-santic-red"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDirectorFormModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-santic-red hover:bg-santic-hoverRed text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                >
                  {editingDirector ? 'Update Director' : 'Add Director'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
