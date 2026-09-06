/**
 * Daftar label kelas HandSpeak (Huruf & Kosakata)
 */

// 1. Mode Huruf (26 kelas alfabet A-Z)
export const BISINDO_LETTER_LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Alias untuk backward compatibility
export const BISINDO_LABELS = BISINDO_LETTER_LABELS;

// 2. Mode Kosakata Penuh (38 kata sehari-hari)
export const BISINDO_WORD_LABELS_38 = [
  'ambil', 'apa', 'bantu', 'berdoa', 'berhenti', 'berjalan', 'berpikir', 'betul',
  'bisindo', 'buat', 'hati-hati', 'ingat', 'jangan', 'janji', 'kamu', 'keren',
  'maaf', 'melihat', 'membaca', 'menggambar', 'menulis', 'minta', 'mulai', 'nama',
  'paham', 'perkenalkan', 'sabar', 'salah', 'sama-sama', 'saya', 'semangat', 'siapa',
  'terima kasih', 'terlambat', 'tolong', 'tunggu', 'waktu', 'ya'
];

// 3. Mode Kosakata Top-10 (10 kata terpopuler dengan akurasi 95.20%)
export const BISINDO_WORD_LABELS_TOP10 = [
  'bisindo', 'kamu', 'keren', 'nama', 'paham',
  'perkenalkan', 'saya', 'siapa', 'terlambat', 'waktu'
];