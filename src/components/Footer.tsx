import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { AdminConfigModals } from './AdminConfigModals';

export const Footer: React.FC = () => {
  const { footerConfig, contactInfo, headerConfig, isEditMode } = useCMS();
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
        <Trophy className="w-96 h-96 text-white" />
      </div>

      <div className="santic-container relative z-10 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Column 1: Organization Overview (Editable) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              {headerConfig.logoIconUrl ? (
                <img
                  src={headerConfig.logoIconUrl}
                  alt={footerConfig.logoTitle}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-santic-red flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                  <Trophy className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-lg font-extrabold tracking-tight block leading-none">
                  {footerConfig.logoTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-santic-red block mt-1">
                  {footerConfig.logoSubtitle}
                </span>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="p-1 rounded-lg bg-santic-red text-white hover:scale-110 transition-transform ml-2"
                  title="Edit Footer Configuration"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {footerConfig.description}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-santic-red shrink-0" />
                <span>{contactInfo.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-santic-red shrink-0" />
                <span>+91 {contactInfo.mobile}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-santic-red shrink-0" />
                <span>{contactInfo.email}</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              style={{ fontSize: 'var(--font-size-footer-heading)' }}
              className="font-extrabold uppercase tracking-widest text-santic-red"
            >
              Quick Navigation
            </h4>
            <ul
              style={{ fontSize: 'var(--font-size-footer-body)' }}
              className="space-y-2.5 text-slate-300"
            >
              {headerConfig.navItems.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-santic-red transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Document Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              style={{ fontSize: 'var(--font-size-footer-heading)' }}
              className="font-extrabold uppercase tracking-widest text-santic-red"
            >
              Sports Repository
            </h4>
            <ul
              style={{ fontSize: 'var(--font-size-footer-body)' }}
              className="space-y-2 text-slate-400"
            >
              <li>• Intercollegiate Sports Calendar</li>
              <li>• Inter-Zonal Sports Calendar</li>
              <li>• Tournament Draws & Fixtures</li>
              <li>• Competition Results</li>
              <li>• PCZSC Souvenirs & Reports</li>
              <li>• Board of Sports & PE (SPPU)</li>
            </ul>
          </div>

          {/* Column 4: University Affiliation */}
          <div className="lg:col-span-2 space-y-4">
            <h4
              style={{ fontSize: 'var(--font-size-footer-heading)' }}
              className="font-extrabold uppercase tracking-widest text-santic-red"
            >
              Affiliation
            </h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-white block">
                Savitribai Phule Pune University
              </span>
              <p
                style={{ fontSize: 'var(--font-size-footer-body)' }}
                className="text-slate-400 leading-normal"
              >
                {footerConfig.affiliationText}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerConfig.copyrightText}</p>
          <p className="text-[11px] text-slate-600">
            Powered by Inline CMS & Savitribai Phule Pune University
          </p>
        </div>
      </div>

      {showConfigModal && <AdminConfigModals activeTab="footer" onClose={() => setShowConfigModal(false)} />}
    </footer>
  );
};
