// Semua konten homepage di satu tempat, supaya mudah diedit.

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

// Section "Dua sisi meja": kartu balik — depan = kampus, belakang = kantor.
export const SIDES = [
  {
    id: 'make',
    tag: 'Sisi A — kampus',
    hud: 'A — Kampus',
    verb: 'belajar & memimpin',
    image: '/gallery/Pelantikan HIMTI.webp',
    imageAlt: 'Pengurus HIMTI saat pelantikan di Fakultas Vokasi USU',
  },
  {
    id: 'run',
    tag: 'Sisi B — kantor',
    hud: 'B — Kantor',
    verb: 'bekerja di lapangan',
    image: '/journey/aboutptpn.png',
    imageAlt: 'Zacky di kantor PT Perkebunan Nusantara III',
  },
];

// Kutipan besar setelah "Dua sisi meja" (gaya tipografi seperti homepage awal):
// baris 1 tebal, baris 2 tebal berwarna aksen, baris 3 serif miring berwarna aksen kedua.
export const OUTRO_QUOTE = ['Kode yang bekerja.', 'Visual yang diingat.', 'dalam satu proyek'];

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
    id: 'dsps-ptpn3',
    title: 'Dashboard Eksekutif',
    subtitle: 'DSPS PTPN III',
    kind: 'Dasbor enterprise',
    summary:
      'Pusat kendali Divisi Strategi & Pengembangan SDM PTPN III Holding: tugas dan penanggung jawabnya, agenda dan kalender terpadu, progres proyek strategis, inisiatif HECTO, data magang, serta repositori SOP.',
    tech: ['React 19', 'TypeScript', 'Supabase', 'Tailwind v4'],
    figure: '09.00',
    figureLabel: 'pengingat tugas otomatis via WhatsApp tiap hari kerja',
    image: '/projects/dashboard-dsps-ptpn3.webp',
    imagePos: 'left center', // kartu desktop memotong cover lebar; jaga logo & judul tetap terlihat
    to: '/projects',
  },
  {
    id: 'lm-entitas',
    title: 'Portal LM Entitas',
    subtitle: 'PTPN Group',
    kind: 'Portal pelaporan',
    summary:
      'Anak perusahaan mengisi Laporan Manajemen bulanan, holding meninjau dan mengonsolidasikannya. Masa pengisian dijadwalkan dan dikunci per bulan, hak aksesnya ditegakkan langsung di database.',
    tech: ['React 19', 'TypeScript', 'Supabase RLS', 'SheetJS'],
    figure: 'Bulanan',
    figureLabel: 'siklus isi, tinjau, lalu kunci per entitas',
    image: '/projects/portal-lm-entitas-ptpn.webp',
    imagePos: 'left center', // kartu desktop memotong cover lebar; jaga logo & judul tetap terlihat
    to: '/projects',
  },
  {
    id: 'rekap-magang',
    title: 'Rekap Magang',
    subtitle: 'PTPN Group',
    kind: 'Dasbor data',
    summary:
      'Rekap penyerapan peserta Magenta BUMN, Magang Kemnaker, dan Magang Mandiri. Tiap entitas mengedit datanya sendiri, dan semuanya tersinkron dua arah dengan Google Sheets.',
    tech: ['Next.js 16', 'Google Sheets API', 'Recharts'],
    figure: '27',
    figureLabel: 'unit kerja di 11 entitas dalam satu rekap',
    image: '/projects/rekap-magang-ptpn.webp',
    imagePos: 'left center', // kartu desktop memotong cover lebar; jaga logo & judul tetap terlihat
    to: '/projects',
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
  { value: 5, decimals: 0, suffix: '', label: 'Pengalaman magang', note: 'PTPN III, BPJS TK, Bank Sumut, BSI, Telkom Akses' },
  { value: 14, decimals: 0, suffix: '', label: 'Sertifikasi', note: 'Huawei, Kominfo, BNSP, Google, Dicoding' },
  { value: 14, decimals: 0, suffix: '', label: 'Karya desain', note: 'Lanyard, ID card, banner, feed Instagram' },
];
