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

// Ticker di bawah hero: bidang yang dikerjakan. em = kata yang dicetak miring & berwarna.
export const TICKER_FACTS = [
  { text: 'Web', em: 'Development' },
  { text: 'Mobile', em: 'Apps' },
  { text: 'AI', em: 'on-device' },
  { text: 'UI/UX', em: 'Design' },
  { text: 'Graphic', em: 'Design' },
  { text: 'Dashboard &', em: 'Data' },
  { text: 'Event', em: 'Branding' },
  { text: 'Product', em: 'Photography' },
];

// Section "Dua sisi meja": sisi kode (depan kartu) dan sisi visual (belakang kartu).
export const SIDES = [
  {
    id: 'make',
    tag: 'Sisi A — kode',
    hud: 'A — Kode',
    verb: 'menulis kode',
    lede: 'Dari aplikasi web dan mobile sampai model AI yang berjalan langsung di ponsel, tanpa server.',
    items: [
      ['Web', 'React & Laravel — Mahaasyik Resto, SIGMA'],
      ['Mobile', 'Flutter — aplikasi HandSpeak'],
      ['AI', 'TensorFlow Lite & MediaPipe, on-device'],
      ['Data', 'Dasbor operasional & L&D korporat'],
    ],
    image: '/projects/handspeak.webp',
    imageAlt: 'Rancangan sistem aplikasi HandSpeak',
  },
  {
    id: 'run',
    tag: 'Sisi B — visual',
    hud: 'B — Visual',
    verb: 'merancang visual',
    lede: 'Identitas acara, materi cetak, dan konten media sosial untuk organisasi dan kepanitiaan kampus.',
    items: [
      ['Identitas', 'Lanyard & ID card HIMTI dan PKKMB'],
      ['Cetak', 'Banner, spanduk, X-banner, poster'],
      ['Digital', 'Feed Instagram HIMTI & PKKMB'],
      ['Foto', 'Juara 3 lomba foto produk Coca-Cola'],
    ],
    image: '/designs/physical/id_card_panitia_pkkmb.webp',
    imageAlt: 'Desain ID card panitia PKKMB Vokasi USU 2025',
  },
];

// *teks* = penekanan (miring & berwarna)
export const SIDES_OUTRO =
  'Dua sisi itu bertemu di setiap proyek: kode yang *bekerja dengan baik*, dibungkus visual yang *enak dilihat*.';

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

export const STATS = [
  { value: 4, decimals: 0, suffix: '', label: 'Aplikasi dirilis', note: 'Mobile AI, web full-stack, dan dua dasbor' },
  { value: 198, decimals: 0, suffix: '', label: 'Peserta dipantau', note: 'Lewat SIGMA di BPJS Ketenagakerjaan' },
  { value: 26, decimals: 0, suffix: '', label: 'Huruf BISINDO', note: 'Dikenali HandSpeak langsung di ponsel' },
  { value: 14, decimals: 0, suffix: '', label: 'Karya desain', note: 'Lanyard, ID card, banner, feed Instagram' },
];

export const TECH = [
  'React', 'JavaScript', 'Flutter', 'Dart', 'Laravel', 'PHP', 'Python', 'TensorFlow Lite',
  'MediaPipe', 'MySQL', 'Firebase', 'Node.js', 'Figma', 'Tailwind', 'Git', 'REST API',
  'Java', 'C++', 'Android Studio', 'Bootstrap', 'MariaDB', 'Chart.js', 'Vite', 'Midtrans',
  'Photoshop', 'GPON',
];
