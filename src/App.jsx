import { useState, useEffect, useRef } from 'react';
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
import AvailableSidebar from './components/ui/AvailableSidebar';
import ScrollToTop from './components/ui/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';

function AppInner() {
  useTheme();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const prevPathRef = useRef(null);

  useEffect(() => {
    // Trigger splash animation on first visit or whenever returning/navigating to homepage ('/')
    if (location.pathname === '/' && prevPathRef.current !== null && prevPathRef.current !== '/') {
      setShowSplash(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash-screen"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>
      <ScrollToTop />
      <CustomCursor />
      <ScrollProgress />
      <ClickSpark />
      <AvailableSidebar />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
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