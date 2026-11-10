import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

// Kepala section bergaya katalog: (nomor) — label di kiri, judul serif di kanan.
// whileInView dipasang di <h2> (bukan di teks yang digeser), karena teks yang
// dimulai di luar area overflow:hidden tidak pernah dianggap "terlihat".
// wide: judul panjang memakai lebar penuh grid dan tidak boleh patah baris.
export default function SectionHead({ index, label, children, aside, wide = false }) {
  return (
    <motion.div
      className={`h-grid h-head${wide ? ' h-head--wide' : ''}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className="h-mono h-head__idx"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } }}
      >
        ({index}) — {label}
      </motion.span>
      <div className="h-head__row">
        <h2 className="h-head__title" style={{ overflow: 'hidden', paddingBottom: '0.08em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1.1, ease: EASE } } }}
          >
            {children}
          </motion.span>
        </h2>
        {aside && (
          <motion.span
            className="h-mono h-head__aside"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } } }}
          >
            {aside}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
