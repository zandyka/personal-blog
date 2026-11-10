import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from '../home/SectionHead';
import InteractiveLanyard from '../InteractiveLanyard';
import GithubGraph from '../GithubGraph';
import { WORK } from '../home/homeData';
import { CERTIFICATIONS } from '../../data/certifications';
import { profile } from '../../data/profile';

const EASE = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: i * 0.08 } }),
};

// Angka dihitung dari data situs supaya tidak basi saat proyek / sertifikat bertambah.
const FACTS = [
  { value: '3.84', label: 'IPK, lulus cum laude dari D3 Teknik Informatika USU' },
  { value: '5', label: 'tempat magang — BUMN, perbankan, jaminan sosial, telekomunikasi' },
  { value: String(WORK.length), label: 'proyek software, dari aplikasi AI sampai dasbor korporat' },
  { value: String(CERTIFICATIONS.length), label: 'sertifikat & penghargaan — Huawei, Kominfo, BNSP, dan lainnya' },
];

export default function AboutIntro() {
  const { playHover, playClick } = useSoundContext();

  return (
    <section className="ab-sec ab-sec--first" id="about">
      <div className="h-wrap">
        <SectionHead index="01" label="Tentang" aside="Medan — Jakarta">
          Kenalan <em>dulu</em>.
        </SectionHead>

        <div className="ab-intro">
          <motion.div
            className="ab-intro__badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1 }}
          >
            <InteractiveLanyard />
          </motion.div>

          <div className="ab-intro__body">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              <motion.p className="ab-lead" variants={rise}>
                Saya Zacky — developer yang terbiasa bekerja di tengah <em>BUMN</em> dan perbankan.
              </motion.p>
              <div className="ab-copy">
                <motion.p variants={rise} custom={1}>
                  Sejak September 2026 saya menjadi <strong>Officer Data Support Intern</strong> di Divisi Strategi &amp;
                  Pengembangan SDM <strong>PTPN III (Persero) Holding</strong>. Di sana saya membangun dasbor eksekutif divisi
                  serta portal pelaporan untuk entitas-entitas PTPN Group, sekaligus mengubah alur data manual menjadi
                  otomatis.
                </motion.p>
                <motion.p variants={rise} custom={2}>
                  Sebelumnya saya mengoordinasikan tim IT magang di BPJS Ketenagakerjaan, ikut operasional harian di Bank
                  Sumut dan back office BSI, dan memasang jaringan serat optik di Telkom Akses. Dari situ saya terbiasa
                  memegang dua sisi: menulis kodenya, dan memahami alur kerja orang yang memakainya.
                </motion.p>
                <motion.p variants={rise} custom={3}>
                  Di luar kode, saya mendesain materi visual dan memotret — pernah memimpin Divisi Media Kreatif HIMTI USU.
                </motion.p>
              </div>

              <motion.div className="ab-cta" variants={rise} custom={4}>
                <a
                  href={profile.cvUrl}
                  download
                  className="ab-btn"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  <Download size={16} /> Unduh CV
                </a>
                <Link to="/contact" className="h-link h-link--accent" onMouseEnter={playHover} onClick={playClick}>
                  Hubungi saya <ArrowUpRight size={16} />
                </Link>
                <Link to="/projects" className="h-link" onMouseEnter={playHover} onClick={playClick}>
                  Lihat proyek <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              <ul className="ab-facts">
                {FACTS.map((f, i) => (
                  <motion.li key={f.label} className="ab-fact" variants={rise} custom={i}>
                    <strong>{f.value}</strong>
                    <span>{f.label}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.p className="h-mono ab-langs" variants={rise} custom={FACTS.length}>
                Bahasa — Indonesia (native) · Inggris (intermediate)
              </motion.p>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="ab-github"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <GithubGraph githubUsername="zandyka" title="Kontribusi GitHub" subtitle="52 minggu terakhir" />
        </motion.div>
      </div>
    </section>
  );
}
