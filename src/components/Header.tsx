import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Trophy, Edit } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminConfigModals } from './AdminConfigModals';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const location = useLocation();
  const { headerConfig, isAdmin, isEditMode, logout } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3.5 shadow-sm'
            : 'bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-transparent py-5'
        }`}
      >
        <div className="santic-container flex items-center justify-between">
          {/* PCZSC Logo & Title Branding (Editable by Admin) */}
          <div className="flex items-center gap-2 group">
            <Link to="/en/home" className="flex items-center gap-3 shrink-0">
              {headerConfig.logoIconUrl ? (
                <img
                  src={headerConfig.logoIconUrl}
                  alt={headerConfig.logoTitle}
                  className="w-10 h-10 object-contain rounded-2xl bg-slate-900/80 p-1 border border-white/20 shadow-lg group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-santic-red flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
              )}
              <div>
                <span
                  style={{ fontSize: 'var(--font-size-logo)' }}
                  className={`font-extrabold tracking-tight block leading-none ${isScrolled ? 'text-slate-900' : 'text-white'}`}
                >
                  {headerConfig.logoTitle}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mt-1 ${isScrolled ? 'text-slate-500' : 'text-white/70'}`}>
                  {headerConfig.logoSubtitle}
                </span>
              </div>
            </Link>

            {isEditMode && (
              <button
                onClick={() => setShowConfigModal(true)}
                className="p-1.5 rounded-lg bg-santic-red text-white hover:scale-110 transition-transform shadow-md"
                title="Edit Header & Logo"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Links (Editable by Admin) */}
          <nav className="hidden xl:flex items-center gap-8 font-medium">
            {headerConfig.navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{ fontSize: 'var(--font-size-menu)' }}
                  className={`transition-colors duration-200 ${
                    isScrolled
                      ? isActive
                        ? 'text-santic-red font-extrabold'
                        : 'text-slate-800 hover:text-santic-red font-medium'
                      : isActive
                      ? 'text-santic-red font-extrabold'
                      : 'text-white/90 hover:text-white font-medium'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Actions: Contact CTA Button */}
          <div className="hidden xl:flex items-center gap-4 shrink-0">
            <Link
              to={headerConfig.ctaPath}
              className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-bold px-5 py-2 rounded-full transition-all duration-300 shadow-md shadow-santic-red/20 uppercase tracking-wider"
            >
              {headerConfig.ctaText}
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-3 xl:hidden">
            <Link
              to={headerConfig.ctaPath}
              className="text-xs bg-santic-red text-white font-medium px-3.5 py-1.5 rounded-full shadow-sm"
            >
              {headerConfig.ctaText}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 focus:outline-none ${isScrolled ? 'text-slate-900' : 'text-white'}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-0 top-[64px] bg-white z-40 flex flex-col justify-between overflow-y-auto p-6 animate-fade-in border-t border-slate-200 shadow-2xl">
            <div className="flex flex-col gap-4">
              {headerConfig.navItems.map((item) => (
                <div key={item.name} className="border-b border-slate-100 pb-3">
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-slate-900 hover:text-santic-red transition-colors"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col gap-3">
              {isAdmin ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold text-xs uppercase"
                >
                  Admin Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center border border-slate-300 text-slate-800 py-3 rounded-xl font-bold text-xs uppercase"
                >
                  Admin Login
                </button>
              )}

              <Link
                to={headerConfig.ctaPath}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-santic-red text-white py-3 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md shadow-red-500/20"
              >
                {headerConfig.ctaText}
              </Link>
            </div>
          </div>
        )}
      </header>

      {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} />}
      {showConfigModal && <AdminConfigModals activeTab="header" onClose={() => setShowConfigModal(false)} />}
    </>
  );
};
