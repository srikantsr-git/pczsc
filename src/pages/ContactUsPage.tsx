import React, { useState } from 'react';
import { SubPageHero } from '../components/SubPageHero';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/SEOHead';
import { containsSqlInjection, sanitizeInput, isValidEmail, isValidPhone } from '../utils/security';
import {
  MapPin,
  Phone,
  Mail,
  User,
  Send,
  Building,
  CheckCircle2,
  Clock,
  Edit,
  X
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { contactInfo, updateContactInfo, addContactInquiry, isEditMode } = useCMS();
  const { showToast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);

  // Form states for contact details
  const [editOrg, setEditOrg] = useState(contactInfo.organisation);
  const [editPerson, setEditPerson] = useState(contactInfo.contactPerson);
  const [editAddress, setEditAddress] = useState(contactInfo.address);
  const [editMobile, setEditMobile] = useState(contactInfo.mobile);
  const [editEmail, setEditEmail] = useState(contactInfo.email);
  const [editMapUrl, setEditMapUrl] = useState(
    contactInfo.mapEmbedUrl ||
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.376829777598!2d73.8724652758836!3d18.50580556934371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c069b2b528b7%3A0x7d01878d655f464d!2sPoona%20College%20of%20Arts%2C%20Science%20and%20Commerce!5e0!3m2!1sen!2sin!4v1722080000000!5m2!1sen!2sin'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    subject: '',
    message: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. SQL Injection & Security Check
    if (
      containsSqlInjection(formData.name) ||
      containsSqlInjection(formData.college) ||
      containsSqlInjection(formData.subject) ||
      containsSqlInjection(formData.message)
    ) {
      showToast(
        'Security Warning: SQL Injection Blocked',
        'Suspicious SQL characters or script tags were detected in your input. Please enter valid text.',
        'error'
      );
      return;
    }

    // 2. Email Format Validation
    if (!isValidEmail(formData.email)) {
      showToast(
        'Invalid Email Format',
        'Please enter a valid email address (e.g. user@domain.com).',
        'error'
      );
      return;
    }

    // 3. Phone Format Validation
    if (!isValidPhone(formData.phone)) {
      showToast(
        'Invalid Phone Number',
        'Please enter a valid 10 to 12 digit telephone / mobile number.',
        'error'
      );
      return;
    }

    // 4. Sanitize and Submit
    addContactInquiry({
      name: sanitizeInput(formData.name),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      college: sanitizeInput(formData.college),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message)
    });

    setSubmitted(true);
    showToast(
      '🎉 Inquiry Submitted Successfully!',
      'The PCZSC Secretariat has received your message and will respond shortly.',
      'success'
    );

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        subject: '',
        message: ''
      });
    }, 4000);
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo({
      organisation: sanitizeInput(editOrg),
      contactPerson: sanitizeInput(editPerson),
      address: sanitizeInput(editAddress),
      mobile: editMobile.trim(),
      email: editEmail.trim(),
      mapEmbedUrl: editMapUrl.trim()
    });
    setShowEditContactModal(false);
    showToast('Contact Info Updated', 'Secretariat contact details have been updated.', 'success');
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <SEOHead pageKey="contact" />
      <SubPageHero pageKey="contact" />

      <section className="santic-section bg-slate-50/70 border-b border-slate-200/80">
        <div className="santic-container space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Official Contact Card */}
            <div className="lg:col-span-5 space-y-8 relative">
              {isEditMode && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditOrg(contactInfo.organisation);
                      setEditPerson(contactInfo.contactPerson);
                      setEditAddress(contactInfo.address);
                      setEditMobile(contactInfo.mobile);
                      setEditEmail(contactInfo.email);
                      setEditMapUrl(
                        contactInfo.mapEmbedUrl ||
                          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.376829777598!2d73.8724652758836!3d18.50580556934371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c069b2b528b7%3A0x7d01878d655f464d!2sPoona%20College%20of%20Arts%2C%20Science%20and%20Commerce!5e0!3m2!1sen!2sin!4v1722080000000!5m2!1sen!2sin'
                      );
                      setShowEditContactModal(true);
                    }}
                    className="bg-santic-red text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md uppercase tracking-wider"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Contact Details & Map URL</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
                <div className="space-y-2 border-b border-white/10 pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-santic-red/20 text-santic-red text-[10px] font-extrabold uppercase tracking-widest border border-santic-red/30">
                    <Building className="w-3.5 h-3.5" />
                    <span>PCZSC Secretariat</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white">
                    {contactInfo.organisation}
                  </h3>
                  <p className="text-xs text-white/60">
                    Savitribai Phule Pune University (SPPU), Pune
                  </p>
                </div>

                <div className="space-y-6 text-sm">
                  {/* Contact Person */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-santic-red shrink-0 border border-white/15">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-white/50 block">
                        Contact Person / Secretary
                      </span>
                      <p className="font-extrabold text-white text-sm md:text-base">
                        {contactInfo.contactPerson}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-santic-red shrink-0 border border-white/15">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-white/50 block">
                        Official Secretariat Address
                      </span>
                      <p className="font-medium text-white/90 leading-relaxed text-xs md:text-sm">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-santic-red shrink-0 border border-white/15">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-white/50 block">
                        Mobile / Telephone No.
                      </span>
                      <a
                        href={`tel:${contactInfo.mobile}`}
                        className="font-extrabold text-santic-red text-base md:text-lg hover:underline font-mono"
                      >
                        +91 {contactInfo.mobile}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  {Boolean(contactInfo.email) && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-santic-red shrink-0 border border-white/15">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-white/50 block">
                          Official Email ID
                        </span>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="font-bold text-white hover:text-santic-red transition-colors text-xs md:text-sm underline"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-santic-red" />
                    <span>Office Hours: 10:00 AM - 5:00 PM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry & Communication Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-200/90 shadow-xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-santic-red font-bold">
                  Send Message
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Official Communication Inquiry Form
                </h3>
                <p className="text-xs text-slate-500">
                  Affiliated college Physical Education Directors, Principals, and athletes may send tournament inquiries directly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <h4 className="text-lg font-extrabold text-green-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-green-700">
                    Thank you for contacting PCZSC. Your inquiry has been routed to Dr. Shaikh Aiyaz Hussain.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        maxLength={100}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone No.</label>
                      <input
                        type="tel"
                        maxLength={15}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Affiliated College / Institute</label>
                      <input
                        type="text"
                        maxLength={150}
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                        placeholder="e.g. Poona College, Pune"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      maxLength={200}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                    <textarea
                      rows={5}
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-normal"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-santic-red hover:bg-santic-hoverRed text-white px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Official Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Section 2: Exact Google Maps Location Frame */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between px-4 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-santic-red" />
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  PCZSC Poona College Camp Headquarters Map Location
                </h4>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">1647, Camp, New Modikhana, Pune</span>
            </div>

            <div className="h-96 rounded-2xl overflow-hidden border border-slate-200">
              <iframe
                title="PCZSC Poona College Map Location"
                src={
                  contactInfo.mapEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.376829777598!2d73.8724652758836!3d18.50580556934371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c069b2b528b7%3A0x7d01878d655f464d!2sPoona%20College%20of%20Arts%2C%20Science%20and%20Commerce!5e0!3m2!1sen!2sin!4v1722080000000!5m2!1sen!2sin'
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Edit Contact Details & Map URL Modal */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-200 shadow-2xl space-y-4 text-slate-900 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Secretariat Contact & Map URL</h3>
              <button onClick={() => setShowEditContactModal(false)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContactInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organisation Name</label>
                <input
                  type="text"
                  value={editOrg}
                  onChange={(e) => setEditOrg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={editPerson}
                  onChange={(e) => setEditPerson(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile No.</label>
                <input
                  type="text"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Embed iframe URL</label>
                <textarea
                  rows={3}
                  value={editMapUrl}
                  onChange={(e) => setEditMapUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-xs font-mono"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowEditContactModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
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
    </main>
  );
};
