# HandSpeak — Portfolio Context

> Proyek Tugas Akhir Teknik Informatika, Universitas Sumatera Utara (USU) Vokasi
> Lulus dengan predikat **Cumlaude** — 2026

---

## Tentang Proyek

**HandSpeak** adalah aplikasi mobile Android yang mampu mendeteksi dan menerjemahkan gesture huruf Bahasa Isyarat Indonesia (BISINDO) secara *real-time* langsung di perangkat pengguna, tanpa memerlukan koneksi internet. Aplikasi ini dikembangkan menggunakan Flutter dan mengintegrasikan model *machine learning* berbasis TensorFlow Lite dengan pipeline ekstraksi fitur dari MediaPipe Hand Landmarker.

---

## Latar Belakang

Penyandang tunarungu di Indonesia menggunakan BISINDO sebagai media komunikasi utama. Namun, keterbatasan pemahaman masyarakat umum terhadap bahasa isyarat ini menciptakan hambatan komunikasi yang signifikan dalam kehidupan sehari-hari — mulai dari akses layanan publik hingga interaksi sosial sederhana.

Di sisi lain, belum tersedia aplikasi mobile berbasis AI yang secara khusus mengenali huruf BISINDO secara *real-time* dan dapat beroperasi sepenuhnya *on-device* tanpa bergantung pada server atau koneksi internet. Sebagian besar solusi yang ada dikembangkan untuk bahasa isyarat internasional (ASL) atau menggunakan SIBI (Sistem Isyarat Bahasa Indonesia) yang berbeda dari BISINDO, serta umumnya berjalan di PC dan memerlukan infrastruktur cloud.

---

## Rumusan Masalah

1. Bagaimana merancang dan melatih model *machine learning* yang mampu mengenali gesture huruf BISINDO (A–Z) dengan akurasi tinggi?
2. Bagaimana mengimplementasikan model tersebut ke dalam aplikasi mobile Android secara *on-device* menggunakan TensorFlow Lite tanpa memerlukan koneksi internet?
3. Bagaimana merancang antarmuka aplikasi yang mendukung penerjemahan gesture secara *real-time* sekaligus menyediakan sistem pembelajaran BISINDO yang interaktif dan gamifikatif?

---

## Solusi yang Dibangun

HandSpeak menjawab permasalahan di atas melalui tiga komponen utama:

### 1. Pipeline ML On-Device
- **MediaPipe Hand Landmarker** mengekstraksi 21 titik landmark tangan 3D dari frame kamera
- Koordinat landmark diproses menjadi **vektor fitur 176 dimensi** yang scale-invariant (tidak terpengaruh ukuran/posisi tangan)
- Model **Dense Neural Network** (176D → 768 → 384 → 192 → 26) dilatih dengan TensorFlow/Keras selama 80 epoch pada dataset BISINDO (Sanjaya, 2024)
- Model dikonversi ke **TensorFlow Lite** untuk inferensi ringan di perangkat Android

### 2. Sistem Deteksi Real-Time
- Memproses ~9 frame per detik dengan mekanisme *frame skipping* untuk efisiensi CPU
- **Dual-threshold system**: *live display* (skor ≥ 0.55) dan *commit* huruf (skor ≥ 0.65)
- Mekanisme **anti-duplikat** (cooldown 650ms) dan **frame consistency** (≥2 dari 5 frame) untuk meminimalkan prediksi yang tidak disengaja
- Koreksi otomatis untuk kamera depan (*mirror flip*)

### 3. Ekosistem Pembelajaran BISINDO
- **Kamus visual** huruf A–Z dengan gambar referensi gesture
- **4 mode quiz**: tebak gambar huruf, tebak gambar kosakata, peragakan gesture (kamera), susun kata (kamera)
- **Gamifikasi**: sistem XP, level progression, streak harian, dan achievement
- **Progress tracker**: statistik belajar, mistake tracker, grafik perkembangan

---

## Hasil & Capaian

| Metrik | Nilai |
|---|---|
| Best Validation Accuracy | **94.71%** |
| Macro F1-Score | **0.95** |
| Validation Loss | 0.3088 |
| Epoch Pelatihan | 80 |
| Jumlah Kelas | 26 (A–Z) |
| Skenario Pengujian Fungsional | 14/14 ✅ |
| Platform | Android (Infinix X676C) |

Kelas dengan performa sempurna (F1 = 1.00): **G, R, Z**
Kelas dengan tantangan terbesar: **M dan N** (kemiripan bentuk gesture)

---

## Tech Stack

**Mobile & Frontend**
- Flutter (SDK ^3.11.0) + Dart
- `tflite_flutter` ^0.12.1
- `hand_landmarker` ^2.2.0 (MediaPipe)
- `camera` ^0.11.2+1
- `fl_chart`, `flutter_tts`, `shared_preferences`

**AI / Machine Learning**
- Python, TensorFlow/Keras (training)
- TensorFlow Lite (deployment)
- MediaPipe Hand Landmarker (feature extraction)

**Metodologi**
- Agile/Scrum — 4 sprint
- Dataset: Sanjaya, S. A. (2024). *BISINDO Indonesian Sign Language: Alphabet Image Data* (V1). Mendeley Data. https://doi.org/10.17632/ywnjpbcz8m.1

---

## Arsitektur Model Neural Network

```
Input (176D)
    → Batch Normalization
    → Dense 768 + ReLU + L2 + Dropout 35%
    → Dense 384 + ReLU + L2 + Dropout 30%
    → Dense 192 + ReLU + Dropout 20%
    → Dense 26 + Softmax
Output: Probabilitas 26 kelas huruf A–Z
```

**Optimizer**: Adam (lr=0.001) | **Loss**: Categorical Crossentropy

---

## Arsitektur Pipeline Deteksi

```
Kamera HP (frame YUV420)
    → Frame Selector (setiap 3 frame, min. 110ms)
    → MediaPipe Hand Landmarker (21 landmark 3D)
    → HandFeatureExtractor (vektor 176D)
    → BisindoLetterClassifier (TFLite inference)
    → Dual-Threshold Handler (live display + commit)
    → UI Update (ValueNotifier → minimal rebuild)
```

---

## Struktur Aplikasi

```
lib/
├── pages/
│   ├── translate/     ← Deteksi gesture real-time (fitur utama)
│   ├── quiz/          ← 4 mode quiz interaktif
│   ├── dictionary/    ← Kamus visual BISINDO A–Z
│   ├── progress/      ← Statistik & achievement
│   └── models/        ← Visualisasi metrik model AI
├── services/
│   ├── ai/            ← BisindoLetterClassifier, HandFeatureExtractor
│   ├── camera/        ← Konfigurasi kamera
│   └── speech/        ← Text-to-Speech
└── core/              ← Konstanta, tema, enums
```

---

*Muhammad Daffa Zacky Andyka — Teknik Informatika, USU Vokasi, 2026*
