import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const GenericPage: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const location = useLocation();

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 text-slate-900">
      <div className="santic-container max-w-4xl">
        <Link
          to="/en/home"
          className="inline-flex items-center gap-2 text-xs font-bold text-santic-red hover:text-slate-900 uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="p-8 md:p-14 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-santic-red px-3 py-1 bg-red-50 rounded-full border border-red-200">
            Path: {location.pathname}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            {title}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
            {subtitle}
          </p>
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
            <Link
              to="/en/home"
              className="bg-santic-red hover:bg-santic-hoverRed text-white text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-wider transition-all shadow-md shadow-red-500/20"
            >
              Explore Santic Home
            </Link>
            <Link
              to="/en/contact-us"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-wider border border-slate-200 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
