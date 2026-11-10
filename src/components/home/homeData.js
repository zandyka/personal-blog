// Semua konten homepage di satu tempat, supaya mudah diedit.

export const HERO_PORTRAIT = '/gallery/potret sidang dengan papan bunga 9_16.webp';

// Foto yang diputar di "viewfinder" splash screen. Yang terakhir sengaja
// sama dengan potret hero, jadi splash berakhir tepat di foto yang lalu "dicetak".
export const SPLASH_FRAMES = [
  { src: '/gallery/fotografi produk coca cola (9_16).webp', caption: 'Foto produk — Coca-Cola' },
  { src: '/gallery/event himti games (9_16).webp', caption: 'HIMTI Games' },
  { src: '/gallery/tim publikasi dan dokumentasi pkkmb vokasi 2025 9_16.webp', caption: 'Tim dokumentasi PKKMB' },
  { src: '/gallery/magang bpjs 9_16.webp', caption: 'Magang BPJS Ketenagakerjaan' },
  { src: '/gallery/fotbar sidang 9_16.webp', caption: 'Hari sidang' },
  { src: HERO_PORTRAIT, caption: 'Sidang TA, USU' },
];

export const TICKER_FACTS = [
  { lead: 'IPK 3.84', rest: 'cum laude, Teknik Informatika USU' },
  { lead: '5×', rest: 'magang — PTPN III, BPJS TK, Bank Sumut, BSI, Telkom Akses' },
  { lead: '94.71%', rest: 'akurasi model HandSpeak' },
  { lead: 'Juara 1', rest: 'IT Network Configuration' },
  { lead: 'Juara 3', rest: 'lomba foto produk Coca-Cola' },
  { lead: 'Kadiv', rest: 'Media Kreatif HIMTI USU' },
  { lead: 'HCIA', rest: 'Datacom — Huawei ICT Academy' },
];

// *teks* = penekanan (serif miring)
export const STATEMENT =
  'Saya membangun perangkat lunak — *web, mobile, dan AI* yang berjalan langsung di ponsel. Saya juga pernah berada di sisi yang memakainya: back office bank, operasional BPJS, dan kini data pelatihan seluruh grup PTPN. Karena itu yang saya buat bukan sekadar jalan, tapi *masuk akal* bagi orang yang memakainya setiap hari. Di sela-selanya, saya *mendesain* poster dan identitas acara, dan memotret.';

export const FACTS = [
  { label: 'Pendidikan', value: 'Teknik Informatika, Universitas Sumatera Utara', note: 'IPK 3.84 — cum laude' },
  { label: 'Sekarang', value: 'Officer Data Support Intern', note: 'PTPN III Holding (Persero), Jakarta' },
  { label: 'Bahasa', value: 'Indonesia & Inggris', note: 'Native, menengah' },
];

export const WORK = [
  {
    id: 'handspeak',
    title: 'HandSpeak',
    subtitle: 'penerjemah BISINDO',
    kind: 'Mobile AI',
    summary:
      'Menerjemahkan bahasa isyarat BISINDO secara real-time dari kamera ponsel. MediaPipe membaca 21 titik tangan, lalu model TensorFlow Lite menebak hurufnya — semuanya on-device, tanpa server.',
    tech: ['Flutter', 'TensorFlow Lite', 'MediaPipe', 'Python'],
    figure: '94.71%',
    figureLabel: 'akurasi validasi, 26 kelas huruf A–Z',
    image: '/projects/handspeak.webp',
    to: '/playground',
  },
  {
    id: 'sigma',
    title: 'SIGMA BPJSTK',
    subtitle: 'monitoring MBKM',
    kind: 'Sistem enterprise',
    summary:
      'Satu sistem untuk seluruh siklus program magang MBKM BPJS Ketenagakerjaan: presensi dengan geotagging GPS, 6 modul jaminan sosial, pusat penilaian, dan hak akses per peran.',
    tech: ['React', 'Laravel 11', 'MySQL', 'Geolocation API'],
    figure: '198',
    figureLabel: 'peserta magang dipantau dalam satu dasbor',
    image: '/projects/sigma-bpjstk.png',
    to: '/projects',
  },
  {
    id: 'mahaasyik',
    title: 'Mahaasyik Resto',
    subtitle: 'pemesanan & manajemen',
    kind: 'Full-stack web',
    summary:
      'Katalog menu, reservasi meja dengan DP otomatis, dan pembayaran Midtrans (QRIS, e-wallet, VA) dengan webhook. Frontend React dan API Laravel dipisah, di-deploy di Vercel dan Railway.',
    tech: ['React 18', 'Laravel 11', 'Midtrans Snap', 'MySQL 8'],
    figure: 'Live',
    figureLabel: 'deploy di Vercel & Railway, bayar via Midtrans',
    image: '/projects/Mahaasyik.webp',
    to: '/projects',
  },
  {
    id: 'banksumut',
    title: 'Rekap Operasional',
    subtitle: 'Bank Sumut',
    kind: 'Dasbor perbankan',
    summary:
      'Dasbor untuk memantau transaksi tunai dan non-tunai per cabang, produktivitas teller, tren bulanan, serta rekap kliring — dari data operasional harian.',
    tech: ['Web Dashboard', 'Chart.js', 'Data Analytics'],
    figure: 'Harian',
    figureLabel: 'rekap transaksi & kliring per cabang',
    image: '/projects/visualisasi-bank-sumut.png',
    to: '/projects',
  },
];

export const EXPERIENCE = [
  { year: '2026', company: 'PTPN III Holding', role: 'Officer Data Support Intern — dasbor L&D seluruh grup PTPN', when: 'Sep 2026 — kini', image: '/journey/aboutptpn.png' },
  { year: '2025', company: 'BPJS Ketenagakerjaan', role: 'IT Team Coordinator & Admin Support', when: 'Agu — Des 2025', image: '/journey/aboutbpjs.png' },
  { year: '2025', company: 'Bank Sumut', role: 'Divisi Operasional', when: 'Jun — Jul 2025', image: '/journey/aboutbanksumut.png' },
  { year: '2025', company: 'Bank Syariah Indonesia', role: 'Back Office', when: 'Mar — Jun 2025', image: '/journey/aboutsbi.png' },
  { year: '2024', company: 'HIMTI USU', role: 'Kepala Divisi Media Kreatif', when: 'Sep 2024 — Sep 2025', image: '/gallery/Pelantikan HIMTI.webp' },
  { year: '2022', company: 'Telkom Akses', role: 'Fiber Technician — magang bersertifikat', when: 'Feb — Apr 2022', image: '/journey/abouttelom.png' },
];

export const ARCHIVE = [
  { src: '/designs/physical/Lanyard_ID_himpunan.webp', caption: 'Lanyard & ID card pengurus HIMTI', kind: 'Desain', to: '/projects' },
  { src: '/gallery/fotografi produk coca cola (9_16).webp', caption: 'Foto produk Coca-Cola — juara 3', kind: 'Foto', to: '/album' },
  { src: '/designs/physical/poster_aplikasi_handspeak.webp', caption: 'Poster aplikasi HandSpeak', kind: 'Desain', to: '/projects' },
  { src: '/gallery/event himti games (9_16).webp', caption: 'HIMTI Games', kind: 'Foto', to: '/album' },
  { src: '/designs/physical/id_card_panitia_pkkmb.webp', caption: 'ID card panitia PKKMB 2025', kind: 'Desain', to: '/projects' },
  { src: '/gallery/expo vokasi usu 2024 4_3.webp', caption: 'Expo Vokasi USU 2024', kind: 'Foto', to: '/album' },
  { src: '/designs/physical/lanyard_panitia_pkkmb.webp', caption: 'Lanyard panitia PKKMB', kind: 'Desain', to: '/projects' },
  { src: '/gallery/Pelantikan HIMTI.webp', caption: 'Pelantikan HIMTI', kind: 'Foto', to: '/album' },
  { src: '/designs/physical/poster_menu_makanan_di_event_himti_games.webp', caption: 'Poster menu HIMTI Games', kind: 'Desain', to: '/projects' },
  { src: '/gallery/mengajar komputer di pkbm bintula 16_9.webp', caption: 'Mengajar komputer di PKBM', kind: 'Foto', to: '/album' },
  { src: '/designs/physical/banner_wisuda_sirkel.webp', caption: 'Banner wisuda', kind: 'Desain', to: '/projects' },
  { src: '/gallery/fotbar wisuda.webp', caption: 'Wisuda', kind: 'Foto', to: '/album' },
  { src: '/designs/digital/ig_himti.webp', caption: 'Feed Instagram HIMTI', kind: 'Desain', to: '/projects' },
  { src: '/gallery/foto bersama karyawan (magang di BSI).webp', caption: 'Magang di BSI', kind: 'Foto', to: '/album' },
];
