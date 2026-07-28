import React from 'react';
import { ThemeControlsSidebar } from '../components/admin/theme/ThemeControlsSidebar';
import { LivePreviewPane } from '../components/admin/theme/LivePreviewPane';
import { SubPageHero } from '../components/SubPageHero';

export const ThemeEditorPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      <SubPageHero
        pageKey="about"
        category="Admin Studio"
        title="Website Appearance & Theme Editor"
        subtitle="Complete customization studio with 10 presets, real-time live preview, CSS variable generation, and WCAG AA accessibility compliance."
      />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-140px)] min-h-[750px] overflow-hidden border-t border-slate-800">
        <ThemeControlsSidebar />
        <LivePreviewPane />
      </div>
    </main>
  );
};
