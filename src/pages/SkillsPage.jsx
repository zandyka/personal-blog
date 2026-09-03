import Skills from '../components/Skills';
import { motion } from 'framer-motion';

export default function SkillsPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Skills />
      </motion.div>
    </div>
  );
}