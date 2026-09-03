import About from '../components/About';
import Gallery from '../components/Gallery';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <About />
        <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
          <Gallery />
        </section>
      </motion.div>
    </div>
  );
}