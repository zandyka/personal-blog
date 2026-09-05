import { motion } from 'framer-motion';
import About from '../components/About';
import AcademicHighlights from '../components/AcademicHighlights';
import SkillsTechStack from '../components/SkillsTechStack';
import JourneyMap from '../components/JourneyMap';

export default function AboutPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* 1. Core Bio, Interactive 3D Lanyard & High-Level Stats */}
        <About />

        {/* 2. Academic Foundation, Cum Laude & HandSpeak AI Research Spotlight */}
        <AcademicHighlights />

        {/* 3. Complete Technology Stack & Tooling Catalog */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <SkillsTechStack />
        </div>

        {/* 4. Interactive Mobility & Field Work Location Map (Medan) */}
        <JourneyMap />
      </motion.div>
    </div>
  );
}