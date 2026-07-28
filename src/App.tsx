import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdminBar } from './components/AdminBar';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  return (
    <ToastProvider>
      <CMSProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-santic-red selection:text-white">
              <AdminBar />
              <Header />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to="/en/home" replace />} />
                  <Route path="/en/home" element={<HomePage />} />
                  <Route path="/en/about-us" element={<AboutUsPage />} />
                  <Route path="/en/documents" element={<DocumentsPage />} />
                  <Route path="/en/gallery" element={<GalleryPage />} />
                  <Route path="/en/contact-us" element={<ContactUsPage />} />
                  <Route path="/en/theme-editor" element={<Navigate to="/en/admin?tab=theme" replace />} />
                  <Route path="/en/admin" element={<AdminDashboardPage />} />
                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/en/home" replace />} />
                </Routes>
              </div>
              <Footer />
              <ScrollToTop />
            </div>
          </Router>
        </ThemeProvider>
      </CMSProvider>
    </ToastProvider>
  );
}

export default App;
