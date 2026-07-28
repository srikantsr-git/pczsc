import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 bg-slate-900/90 hover:bg-santic-red text-white p-3.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 group flex items-center justify-center gap-1.5 px-4 text-xs font-extrabold uppercase tracking-wider"
      title="Scroll to top"
    >
      <ChevronUp className="w-4 h-4 text-santic-red group-hover:text-white transition-colors animate-bounce" />
      <span className="hidden sm:inline">Back to Top</span>
    </button>
  );
};
