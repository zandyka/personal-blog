import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SoundProvider } from './components/ui/SoundProvider';
import { useTheme } from './hooks/useTheme';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import ClickSpark from './components/ui/ClickSpark';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingPet from './components/ui/FloatingPet';
import ScrollToTop from './components/ui/ScrollToTop';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './components/ErrorBoundary';
import { setSplashActive } from './lib/splashStore';

// Setiap halaman dimuat terpisah (code splitting) agar kunjungan pertama tidak
// ikut mengunduh Three.js, MediaPipe, OGL, dll. milik halaman lain.
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AlbumPage = lazy(() => import('./pages/AlbumPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));

function PageFallback() {
  return <div style={{ minHeight: '100vh' }} aria-busy="true" />;
}

function AppInner() {
  useTheme();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  // Kunjungan pertama: splash lengkap. Kembali ke Home: versi singkat.
  const [splashVariant, setSplashVariant] = useState('full');
  const prevPathRef = useRef(null);

  useEffect(() => {
    // Trigger splash animation on first visit or whenever returning/navigating to homepage ('/')
    if (location.pathname === '/' && prevPathRef.current !== null && prevPathRef.current !== '/') {
      setSplashVariant('short');
      setShowSplash(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    setSplashActive(showSplash);
  }, [showSplash]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash-screen"
            variant={splashVariant}
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>
      <ScrollToTop />
      <CustomCursor />
      <ScrollProgress />
      <ClickSpark />
      <FloatingPet />
      <Navbar />
      <ErrorBoundary locationKey={location.pathname}>
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/album" element={<AlbumPage />} />
              <Route path="/gallery" element={<AlbumPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <BackToTop />
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppInner />
    </SoundProvider>
  );
}