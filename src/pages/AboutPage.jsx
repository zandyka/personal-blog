import { motion } from 'framer-motion';
import AboutIntro from '../components/about/AboutIntro';
import AboutToolkit from '../components/about/AboutToolkit';
import JourneyMap from '../components/JourneyMap';
import '../components/home/home.css';
import '../components/about/about.css';

// Gaya mengikuti homepage (h-page): kepala section bernomor, judul besar, aksen miring.
export default function AboutPage() {
  return (
    <motion.div
      className="page-container h-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AboutIntro />
      <AboutToolkit />
      <JourneyMap />
    </motion.div>
  );
}
