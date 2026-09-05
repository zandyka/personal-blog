import { motion } from 'framer-motion';
import About from '../components/About';
import SkillRadarChart from '../components/SkillRadarChart';
import AcademicHighlights from '../components/AcademicHighlights';
import SkillsTechStack from '../components/SkillsTechStack';
import JourneyMap from '../components/JourneyMap';

export default function AboutPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* 1. Core Bio, Interactive 3D Lanyard & High-Level Stats */}
        <About />

        {/* 2. Multi-Disciplinary Competency: Skill Radar Chart */}
        <SkillRadarChart />

        {/* 3. Academic Foundation, Cum Laude & AI Research Spotlight */}
        <AcademicHighlights />

        {/* 4. Complete Technology Stack & Tooling Catalog */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <SkillsTechStack />
        </div>

        {/* 5. Interactive Mobility & Field Work Location Map (Medan) */}
        <JourneyMap />
      </motion.div>
    </div>
  );
}