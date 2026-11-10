import { Smartphone, Globe, BarChart3, Layers, Building2, FileSpreadsheet } from 'lucide-react';

// context: dikerjakan di mana / dalam rangka apa (hanya diisi bila faktanya jelas).
// ratio: lebar / tinggi gambar asli, supaya desain tampil utuh di masonry.
// 1. Featured Software Projects (from user's 'projek' folder)
export const SOFTWARE_PROJECTS = [
  {
    id: 'handspeak',
    context: 'Tugas akhir · Universitas Sumatera Utara',
    title: 'Handspeak — BISINDO Sign Language Translator',
    category: 'Mobile AI Application',
    typeIcon: Smartphone,
    accent: 'var(--accent)',
    description:
      'Aplikasi mobile Android penerjemah bahasa isyarat Indonesia (BISINDO) dua tangan secara real-time mencapai akurasi validasi 94.71% pada 26 kelas alfabet (A–Z) berbasis TensorFlow Lite, ekstraksi 21 titik koordinat MediaPipe Hand Landmarker, dan inferensi on-device dengan feature vector 176 dimensi.',
    techStack: ['Flutter', 'Python', 'TensorFlow Lite', 'MediaPipe Hands', 'Computer Vision', 'Mobile AI'],
    image: '/projects/handspeak.webp',
    previewUrl: '/playground#handspeak',
  },
  {
    id: 'dashboard-dsps-ptpn3',
    context: 'Magang · PTPN III Holding · 2026',
    title: 'Dashboard Eksekutif DSPS — PT Perkebunan Nusantara III (Persero) Holding',
    category: 'Enterprise Executive Dashboard',
    typeIcon: Building2,
    accent: '#15803D',
    description:
      'Platform digital terpadu Divisi Strategi & Pengembangan SDM (DSPS) PTPN III (Persero) Holding untuk memusatkan monitoring operasional harian: dashboard eksekutif, task management dengan penanggung jawab & label prioritas, agenda dan kalender terpadu, progres proyek strategis, monitoring inisiatif HECTO terhubung API, basis data peserta magang, repositori Kebijakan & SOP dengan pratinjau dokumen Word, serta pengingat tugas otomatis via WhatsApp setiap hari kerja pukul 09.00 WIB.',
    techStack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Supabase', 'WhatsApp API'],
    image: '/projects/dashboard-dsps-ptpn3.webp',
  },
  {
    id: 'portal-lm-entitas',
    context: 'Magang · PTPN III Holding · 2026',
    title: 'Portal LM Entitas — Pelaporan & Konsolidasi Laporan Manajemen PTPN Group',
    category: 'Enterprise Reporting Portal',
    typeIcon: FileSpreadsheet,
    accent: '#0F766E',
    description:
      'Portal tempat entitas anak perusahaan PTPN Group mengisi Laporan Manajemen (LM) bulanan yang kemudian ditinjau dan dikonsolidasikan oleh holding. Dilengkapi tabel utama konsolidasi lintas entitas, import data LM dari Excel, jadwal & kunci masa pengisian per bulan, status Done/Fix per entitas, log aktivitas, serta hak akses berbasis peran yang ditegakkan langsung di database lewat Row Level Security (RLS) Supabase.',
    techStack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Supabase RLS', 'SheetJS'],
    image: '/projects/portal-lm-entitas-ptpn.webp',
  },
  {
    id: 'rekap-magang-ptpn',
    context: 'Magang · PTPN III Holding · 2026',
    title: 'Dashboard Rekap Penyerapan Magang PTPN Group',
    category: 'Data Dashboard & Google Sheets Integration',
    typeIcon: BarChart3,
    accent: '#CA8A04',
    description:
      'Dashboard terintegrasi Google Sheets untuk memonitor dan merekap penyerapan peserta magang (Magenta BUMN, Magang Kemnaker, Magang Mandiri) di 11 entitas dan 27 unit PTPN Group. Menyajikan KPI dan grafik komparasi antar-entitas, tabel master rekapitulasi berformat laporan Direksi SDM & Umum dengan ekspor CSV, editor data per entitas dengan perhitungan otomatis, serta sinkronisasi dua arah Google Sheets API v4 dengan fallback cache lokal.',
    techStack: ['Next.js 16', 'React 19', 'Google Sheets API v4', 'Recharts', 'Tailwind CSS', 'RBAC'],
    image: '/projects/rekap-magang-ptpn.webp',
  },
  {
    id: 'mahaasyik',
    title: 'Mahaasyik Resto — Sistem Manajemen & Pemesanan Restoran Berbasis Web',
    category: 'Full-Stack Web & Payment Gateway',
    typeIcon: Globe,
    accent: 'var(--accent-2)',
    description:
      'Platform aplikasi web manajemen dan pemesanan restoran komprehensif berstandar production-ready dengan arsitektur decoupled (React.js SPA & Laravel 11 REST API). Mendigitalkan operasional kuliner mulai dari katalog menu interaktif, reservasi meja cerdas dengan down payment (DP) otomatis, integrasi Midtrans Snap payment gateway (QRIS, e-wallet, VA) dengan automated webhook callbacks, deployed on Vercel & Railway.',
    techStack: ['React.js 18', 'Laravel 11', 'TailwindCSS', 'Midtrans Snap', 'MySQL 8', 'RESTful API'],
    image: '/projects/Mahaasyik.webp',
  },
  {
    id: 'sigma-bpjstk',
    context: 'Magang · BPJS Ketenagakerjaan · 2025',
    title: 'SIGMA BPJSTK — Sistem Informasi & Monitoring Aktivitas MBKM BPJS Ketenagakerjaan',
    category: 'Enterprise Web & Monitoring System',
    typeIcon: Layers,
    accent: '#10B981',
    description:
      'Platform web terpadu berarsitektur decoupled (React.js SPA & Laravel RESTful API) untuk mendigitalkan, memonitor, dan mengevaluasi seluruh siklus program MBKM BPJS Ketenagakerjaan. Dilengkapi presensi geotagging GPS, kurikulum 6 modul jaminan sosial, pusat penilaian (grading center), audit log, serta role-based access control (RBAC) untuk 198 mahasiswa peserta, mentor koordinator, dan administrator.',
    techStack: ['React.js', 'Laravel 11', 'TailwindCSS', 'MySQL', 'Geolocation API', 'RBAC'],
    image: '/projects/sigma-bpjstk.webp',
  },
  {
    id: 'bank-sumut',
    context: 'Magang · Bank Sumut · 2025',
    title: 'Visualisasi Rekapan Operasional Bank Sumut',
    category: 'Banking Analytics & Operational Dashboard',
    typeIcon: BarChart3,
    accent: '#0284C7',
    description:
      'Dashboard web visualisasi dan analitik data rekapan transaksi operasional harian PT Bank Sumut. Menyajikan pemantauan transaksi tunai & non-tunai per unit kantor cabang, rasio produktivitas teller, tren volume transaksi bulanan, serta rekapitulasi data kliring dan payment perbankan secara terstruktur dan real-time.',
    techStack: ['Web Dashboard', 'Data Analytics', 'Chart.js', 'Banking Operations', 'Financial Reporting'],
    image: '/projects/visualisasi-bank-sumut.webp',
  },
];

// 2. Physical & Print Designs (from user's 'hasil desain fisik' folder)
export const PHYSICAL_DESIGNS = [
  {
    id: 'lanyard-id-himpunan',
    title: 'Desain Lanyard & ID Card Pengurus HIMTI',
    category: 'Merchandise & Identitas',
    accent: 'var(--accent)',
    description:
      'Identitas resmi fungsionaris kepengurusan Himpunan Mahasiswa Teknik Informatika (HIMTI) dengan tipografi tegas, tata letak modern, dan palet warna kontras.',
    tools: ['Figma', 'Vector Design', 'Sublimation Print'],
    image: '/designs/physical/Lanyard_ID_himpunan.webp',
    ratio: 1350 / 1800,
  },
  {
    id: 'lanyard-panitia-pkkmb',
    title: 'Lanyard Panitia PKKMB Fakultas Vokasi USU 2025',
    category: 'Kepanitiaan Kampus',
    accent: '#3B82F6',
    description:
      'Desain tali lanyard resmi seluruh panitia masa orientasi PKKMB Vokasi USU 2025 dengan kombinasi warna almamater dan identitas acara.',
    tools: ['Figma', 'Event Branding', 'Sublimation Print'],
    image: '/designs/physical/lanyard_panitia_pkkmb.webp',
    ratio: 1350 / 1800,
  },
  {
    id: 'id-card-panitia-pkkmb',
    title: 'ID Card Panitia PKKMB Fakultas Vokasi USU 2025',
    category: 'Kepanitiaan Kampus',
    accent: '#10B981',
    description:
      'Desain kartu tanda pengenal PVC panitia pelaksana kegiatan orientasi mahasiswa baru Vokasi USU dengan kode divisi dan hierarki informasi terstruktur.',
    tools: ['Figma', 'PVC Card', 'Event Signage'],
    image: '/designs/physical/id_card_panitia_pkkmb.webp',
    ratio: 1800 / 1350,
  },
  {
    id: 'design-id-card-internship',
    title: 'Desain ID Card Staff Internship',
    category: 'Identitas Perusahaan',
    accent: '#C084FC',
    description:
      'Desain kartu tanda pengenal resmi staf magang dengan layout profesional, barcode verifikasi, dan standar hierarki visual institusi.',
    tools: ['Figma', 'Corporate Identity', 'Card Design'],
    image: '/designs/physical/design_id_card_internship_4_3.webp',
    ratio: 1024 / 768,
  },
  {
    id: 'poster-handspeak',
    title: 'Poster Promosi & Peluncuran Aplikasi Handspeak',
    category: 'Poster Inovasi AI',
    accent: 'var(--accent)',
    description:
      'Media publikasi cetak dan promosi fitur unggulan aplikasi penerjemah bahasa isyarat BISINDO berbasis Computer Vision AI.',
    tools: ['Figma', 'Product Showcase', 'Visual Layout'],
    image: '/designs/physical/poster_aplikasi_handspeak.webp',
    ratio: 1800 / 1350,
  },
  {
    id: 'poster-menu-himti-games',
    title: 'Poster Menu Tenant & Konsumsi HIMTI Games',
    category: 'Event Signage',
    accent: 'var(--accent-2)',
    description:
      'Desain daftar menu tenant makanan dan minuman pada venue acara kompetisi dengan layout harga yang mudah dibaca pengunjung.',
    tools: ['Graphic Design', 'Menu Layout', 'Typography'],
    image: '/designs/physical/poster_menu_makanan_di_event_himti_games.webp',
    ratio: 1800 / 1350,
  },
  {
    id: 'lanyard-himti-games',
    title: 'Lanyard & Tali ID Event HIMTI Games',
    category: 'Event Merchandise',
    accent: '#F59E0B',
    description:
      'Desain tali lanyard cetak ganda dengan motif visual khas ajang kompetisi olahraga dan e-sports HIMTI Games.',
    tools: ['Vector Art', 'Sublimation Lanyard', 'Event Branding'],
    image: '/designs/physical/lanyard_event_himti_games.webp',
    ratio: 1800 / 1152,
  },
  {
    id: 'spanduk-pelantikan',
    title: 'Spanduk Utama Pelantikan Pengurus HIMTI',
    category: 'Backdrop & Spanduk',
    accent: '#3B82F6',
    description:
      'Spanduk panggung seremoni pelantikan resmi badan pengurus harian HIMTI USU dengan kesan formal, berwibawa, dan megah.',
    tools: ['Large Format Banner', 'Vector Layout', 'Outdoor Print'],
    image: '/designs/physical/spanduk_pelantikan_himpunan.webp',
    ratio: 1800 / 1200,
  },
  {
    id: 'x-banner-produk',
    title: 'X-Banner Pameran Karya Produk Inovasi',
    category: 'Standing X-Banner',
    accent: '#10B981',
    description:
      'Standing banner vertikal untuk ekshibisi pameran inovasi teknologi dengan infografis alur sistem dan fitur unggulan.',
    tools: ['Figma', 'Exhibition Display', 'Vector Infographic'],
    image: '/designs/physical/x_banner_produk_inovasi_1_1.webp',
    ratio: 1000 / 1000,
  },
  {
    id: 'banner-sidang',
    title: 'Banner Apresiasi Sidang Sarjana / Ahli Madya',
    category: 'Banner Selebrasi',
    accent: '#EC4899',
    description:
      'Desain banner selebrasi kelulusan sidang tugas akhir dengan komposisi grafis elegan, ceria, dan tipografi modern.',
    tools: ['Figma', 'Celebration Banner', 'Print Media'],
    image: '/designs/physical/banner_sidang_1_1.webp',
    ratio: 1000 / 1000,
  },
  {
    id: 'banner-wisuda-sirkel-1',
    title: 'Banner Wisuda Graduation Circles (Edisi I)',
    category: 'Banner Wisuda',
    accent: '#F59E0B',
    description:
      'Spanduk visual selebrasi kelulusan wisuda universitas dengan foto potret wisudawan dan elemen grafis selebrasi hangat.',
    tools: ['Figma', 'Outdoor Banner', 'Graduation Kit'],
    image: '/designs/physical/banner_wisuda_sirkel.webp',
    ratio: 1800 / 1500,
  },
  {
    id: 'banner-wisuda-sirkel-2',
    title: 'Banner Wisuda Graduation Circles (Edisi II)',
    category: 'Banner Wisuda',
    accent: '#C084FC',
    description:
      'Desain banner ucapan selamat wisuda bertema selebrasi kelulusan penuh keceriaan untuk teman-teman terdekat.',
    tools: ['Figma', 'Large Format Banner', 'Photo Collage'],
    image: '/designs/physical/banner_wisuda_another_sirkel.webp',
    ratio: 1800 / 1500,
  },
];

// 3. Digital & Social Media Designs (from user's 'desain ig' folder)
export const DIGITAL_DESIGNS = [
  {
    id: 'ig-himti',
    title: 'Desain Feed & Identitas Media Sosial HIMTI USU',
    category: 'Social Media & Brand Identity',
    accent: 'var(--accent)',
    platform: 'Instagram (@himti_fvusu)',
    url: 'https://www.instagram.com/himti_fvusu/',
    description:
      'Perancangan sistem konten feed Instagram resmi organisasi HIMTI USU mencakup infografis teknologi, ucapan hari besar, rekap kegiatan, dan feed karusel berkesinambungan yang profesional.',
    tools: ['Figma', 'Grid Feed System', 'Content Strategy'],
    image: '/designs/digital/ig_himti.webp',
    ratio: 1024 / 768,
  },
  {
    id: 'ig-pkkmb',
    title: 'Desain Feed & Informasi Resmi PKKMB Vokasi USU 2025',
    category: 'Social Media & Event Campaign',
    accent: 'var(--accent-2)',
    platform: 'Instagram (@simarmuda.fv.usu)',
    url: 'https://www.instagram.com/simarmuda.fv.usu/',
    description:
      'Desain visual feed informasi panduan mahasiswa baru, penugasan orientasi kampus, pengumuman jadwal, dan publikasi dokumentasi resmi masa orientasi PKKMB Vokasi USU 2025.',
    tools: ['Figma', 'Social Media Kit', 'Visual Campaign', 'Typography'],
    image: '/designs/digital/ig_pkkmb.webp',
    ratio: 2560 / 1440,
  },
];
