// Serverless Node function for Ask Zacky AI
// Supports Google Gemini 2.5 Flash (default) and Groq Llama 3.3 70B (fallback)

import { profile } from '../src/data/profile.js';

// Kontak diambil dari satu sumber (src/data/profile.js) agar tidak pernah beda dengan isi website.
const CONTACT_EMAIL = profile.email;
const MAILTO = `mailto:${CONTACT_EMAIL}`;
const LINKEDIN_URL = profile.linkedin;
const LINKEDIN_DISPLAY = LINKEDIN_URL.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// --- Batasan untuk mencegah penyalahgunaan kuota API ---
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_ITEMS = 6;
const MAX_HISTORY_ITEM_CHARS = 1500;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
// Domain tambahan yang boleh memanggil API ini (selain domain website sendiri),
// dipisah koma, contoh: ALLOWED_ORIGINS=domainku.com,www.domainku.com
const EXTRA_ALLOWED_HOSTS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((h) => h.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''))
  .filter(Boolean);

const SYSTEM_PROMPT = `Anda adalah "Ask Zacky AI", asisten pintar representasi resmi dari portofolio Muhammad Daffa Zacky Andyka.

PROFIL UTAMA:
- Nama Lengkap: Muhammad Daffa Zacky Andyka (biasa dipanggil Zacky).
- Pendidikan: S1 Teknik Informatika dari Universitas Sumatera Utara (USU). Masuk tahun 2023, lulus dengan predikat Cum Laude (IPK 3.84 / 4.00). (PENTING: Jangan pernah menyebutkan D3 atau tahun 2021).
- Status Ketersediaan: Available Immediately (siap langsung bergabung).
- Mobilitas Kerja: Siap bekerja On-Site di Jakarta & sekitarnya, Hybrid, maupun Remote.
- Domisili: Jakarta, Indonesia.
- Kontak: Email: ${CONTACT_EMAIL}, LinkedIn: ${LINKEDIN_DISPLAY}.

PENGALAMAN MAGANG & KERJA (5 Institusi):
1. PT Perkebunan Nusantara III Holding (Persero) — Divisi Strategi dan Pengembangan SDM (Officer Data Support Intern - Sep 2026 – Sekarang, Jakarta):
   - Mengembangkan sistem dashboard Learning & Development (L&D) terpusat untuk monitoring data pelatihan seluruh PTPN Group (Holding, Subholding, dan anak perusahaan).
   - Mengonsolidasikan anggaran RKAP ke dalam dashboard pelaporan korporat terpusat.
   - Mengotomasi alur pemrosesan data manual untuk meningkatkan efisiensi dan akurasi pelaporan.
2. BPJS Ketenagakerjaan Cabang Medan Kota (IT Team Coordinator & Admin Support - Agu 2025 – Des 2025):
   - Mengembangkan SIGMA (Sistem Informasi & Monitoring Magang MBKM) berbasis React.js & Laravel 11.
   - Troubleshooting kendala teknis aplikasi mobile JMO (Jamsostek Mobile) dan rekonsiliasi data kepesertaan.
3. PT. Bank Sumut (Operational Division - Jun 2025 – Jul 2025):
   - Menjalankan SOP operasional perbankan harian, penanganan kliring transaksi, dan rekonsiliasi data keuangan.
   - Mengembangkan dashboard visualisasi analitik data rekap transaksi operasional cabang.
4. PT. Bank Syariah Indonesia (BSI KCP Medan Area - Back Office - Mar 2025 – Jun 2025):
   - Verifikasi data nasabah & dokumen pembiayaan syariah dengan standar kepatuhan (*compliance*) tinggi.
   - Manajemen kearsipan legal perbankan dan administrasi berkas back-office.
5. PT. Telkom Akses Indonesia (Fiber Technician - Feb 2022 – Apr 2022):
   - Fusion splicing kabel fiber optik, pengujian redaman sinyal dengan OPM/OTDR, dan pemeliharaan jaringan GPON.

PROYEK & RISET UNGGULAN:
1. Handspeak — BISINDO Sign Language Translator:
   - Aplikasi mobile Android penerjemah bahasa isyarat BISINDO dua tangan secara real-time dengan akurasi validasi 94.71% pada 26 kelas alfabet (A–Z).
   - Teknologi: Flutter, Python, TensorFlow Lite, dan Computer Vision MediaPipe Hand Landmarker (ekstraksi 21 titik koordinat, feature vector 176 dimensi).
2. Mahaasyik Resto:
   - Platform web manajemen restoran full-stack production-ready (React.js Vite + Tailwind CSS, Laravel 11 RESTful API, MySQL) terintegrasi Midtrans Snap payment gateway dengan automated webhook callback, dideploy di Vercel & Railway.
3. SIGMA BPJSTK:
   - Web application enterprise monitoring mahasiswa MBKM di BPJS Ketenagakerjaan Medan Kota (React.js, Laravel 11, Tailwind CSS, MySQL).
4. Visualisasi Rekapan Bank Sumut:
   - Dashboard analitik data transaksi dan operasional perbankan.

SERTIFIKASI:
- Huawei ICT Academy: Overview of AI (Cert ID: ICT20251111001963) & HCIA-Datacom V1.0 Course (Cert ID: EBG20260519040762)
- SKKNI BNSP: Junior Web Developer (Cert ID: 19391021040-30/VSGA/BLSDM.Kominfo/2024) & Junior Mobile Programmer (Cert ID: 19362161040-17/VSGA/BLSDM.Kominfo/2023)
- Google Gemini Certified Student & Claude AI Certified Practitioner
- Fiber Technician Certified Internship (PT Telkom Akses Indonesia)

ATURAN KOMUNIKASI & GAYA BICARA:
- Bersikap ramah, sopan, percaya diri, lugas, dan profesional.
- JANGAN bertele-tele atau membuat paragraf raksasa (ikuti prinsip: ringkas, padat, berbobot).
- Gunakan format markdown seperti **tebal** untuk poin penting dan bullet point bila menjabarkan daftar.
- Sesuaikan bahasa dengan pengguna (Bahasa Indonesia secara default, atau Bahasa Inggris jika user bertanya dalam bahasa Inggris).
- JANGAN PERNAH mengarang data palsu (*no hallucinations*). Jika ada hal di luar profil Zacky yang ditanyakan, katakan dengan sopan bahwa Anda fokus mewakili profil profesional Zacky atau sarankan menghubungi Zacky langsung via email.`;

// Pembatas request per IP (best-effort: tersimpan di memori instance serverless yang sedang "hangat").
// Untuk perlindungan penuh, aktifkan juga Rate Limiting di Vercel Firewall.
const rateLimitStore = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  if (rateLimitStore.size > 5000) {
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(key);
    }
  }
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Hanya halaman dari domain website sendiri (atau ALLOWED_ORIGINS) yang boleh memanggil API.
function getAllowedOrigin(req) {
  const source = req.headers.origin || req.headers.referer;
  if (!source) return null;
  let sourceUrl;
  try {
    sourceUrl = new URL(source);
  } catch {
    return null;
  }
  const ownHost = req.headers['x-forwarded-host'] || req.headers.host;
  if (sourceUrl.host === ownHost || EXTRA_ALLOWED_HOSTS.includes(sourceUrl.host)) {
    return sourceUrl.origin;
  }
  return null;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (item) =>
        item &&
        (item.sender === 'user' || item.sender === 'bot') &&
        typeof item.text === 'string' &&
        item.text.trim()
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({ sender: item.sender, text: item.text.slice(0, MAX_HISTORY_ITEM_CHARS) }));
}

export default async function handler(req, res) {
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.status(allowedOrigin ? 204 : 403).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!allowedOrigin) {
    return res.status(403).json({ error: 'Origin tidak diizinkan' });
  }

  if (isRateLimited(getClientIp(req))) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi beberapa menit lagi.' });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      return res.status(413).json({ error: `Pesan maksimal ${MAX_MESSAGE_CHARS} karakter` });
    }

    const history = sanitizeHistory(req.body.history);
    const userMessage = message.trim();
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    // 1. Prioritize Google Gemini API
    if (geminiApiKey) {
      try {
        // Format history for Gemini API
        const contents = [];
        if (Array.isArray(history) && history.length > 0) {
          history.slice(-6).forEach((item) => {
            if (item.sender === 'user') {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'bot' && item.text) {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          });
        }
        contents.push({ role: 'user', parts: [{ text: userMessage }] });

        // Models to try in order of capability & availability
        const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest'];
        let replyText = '';
        let usedModel = 'Gemini 2.5 Flash';

        for (const model of modelsToTry) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

            // API key dikirim lewat header (bukan query string) agar tidak tercatat di log URL.
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiApiKey },
              body: JSON.stringify({
                contents,
                systemInstruction: {
                  parts: [{ text: SYSTEM_PROMPT }],
                },
                generationConfig: {
                  temperature: 0.65,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 800,
                },
              }),
            });

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (replyText) {
                usedModel = model;
                break;
              }
            } else {
              const errData = await geminiRes.json().catch(() => ({}));
              console.warn(`Model ${model} failed, status:`, geminiRes.status, errData?.error?.message);
            }
          } catch (modelErr) {
            console.warn(`Error trying model ${model}:`, modelErr);
          }
        }

        if (replyText) {
          const contextMeta = extractContextMeta(userMessage, replyText);
          return res.status(200).json({
            text: replyText,
            badge: contextMeta.badge,
            actions: contextMeta.actions,
            provider: usedModel,
          });
        }
      } catch (geminiErr) {
        console.error('Gemini API error, attempting fallback:', geminiErr);
      }
    }

    // 2. Alternative: Groq API (Llama 3.3 70B)
    if (groqApiKey) {
      try {
        const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        if (Array.isArray(history) && history.length > 0) {
          history.slice(-6).forEach((item) => {
            if (item.sender === 'user') {
              messages.push({ role: 'user', content: item.text });
            } else if (item.sender === 'bot' && item.text) {
              messages.push({ role: 'assistant', content: item.text });
            }
          });
        }
        messages.push({ role: 'user', content: userMessage });

        const groqRes = await fetch(groqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.65,
            max_tokens: 800,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const replyText = data.choices?.[0]?.message?.content || '';

          if (replyText) {
            const contextMeta = extractContextMeta(userMessage, replyText);
            return res.status(200).json({
              text: replyText,
              badge: contextMeta.badge,
              actions: contextMeta.actions,
              provider: 'Groq Llama 3.3',
            });
          }
        }
      } catch (groqErr) {
        console.error('Groq API error, attempting fallback:', groqErr);
      }
    }

    // 3. Graceful Fallback if no API key or network error
    const fallbackResponse = generateLocalFallback(userMessage);
    return res.status(200).json({
      text: fallbackResponse.text,
      badge: fallbackResponse.badge,
      actions: fallbackResponse.actions,
      provider: 'Local Knowledge Base',
      isFallback: true,
    });
  } catch (err) {
    console.error('API /chat error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Extract contextual quick action buttons based on conversation
function extractContextMeta(query, reply) {
  const text = (query + ' ' + reply).toLowerCase();

  if (text.includes('handspeak') || text.includes('proyek') || text.includes('project') || text.includes('sigma') || text.includes('portfolio')) {
    return {
      badge: 'Proyek & Riset AI',
      actions: [{ label: 'Lihat Semua Proyek', link: '/projects' }],
    };
  }

  if (text.includes('magang') || text.includes('bank sumut') || text.includes('bsi') || text.includes('bpjs') || text.includes('kerja') || text.includes('pengalaman')) {
    return {
      badge: 'Pengalaman Profesional',
      actions: [{ label: 'Buka Halaman Experience', link: '/experience' }],
    };
  }

  if (text.includes('ipk') || text.includes('usu') || text.includes('kuliah') || text.includes('sertifikat') || text.includes('pendidikan') || text.includes('about')) {
    return {
      badge: 'Pendidikan & Profil',
      actions: [{ label: 'Buka Halaman About', link: '/about' }],
    };
  }

  if (text.includes('kontak') || text.includes('email') || text.includes('hubungi') || text.includes('whatsapp') || text.includes('hire') || text.includes('relokasi')) {
    return {
      badge: 'Kontak Langsung',
      actions: [
        { label: 'Kirim Email', link: MAILTO },
        { label: 'Buka LinkedIn', link: LINKEDIN_URL },
      ],
    };
  }

  return {
    badge: 'Ask Zacky AI',
    actions: [
      { label: 'Lihat Pengalaman Kerja', link: '/experience' },
      { label: 'Kirim Pesan', link: MAILTO },
    ],
  };
}

// Built-in offline fallback if API keys are not configured yet
function generateLocalFallback(query) {
  const q = query.toLowerCase();

  if (q.includes('magang') || q.includes('bank') || q.includes('ptpn') || q.includes('holding') || q.includes('pengalaman') || q.includes('kerja')) {
    return {
      text: 'Zacky memiliki 5 rekam jejak pengalaman magang profesional yang solid:\n\n1. **PT Perkebunan Nusantara III Holding (Persero)** *(Officer Data Support Intern - Sep 2026 – Sekarang, Jakarta)*: Mengembangkan sistem dashboard Learning & Development (L&D) terpusat seluruh PTPN Group, konsolidasi anggaran RKAP, dan otomasi alur pemrosesan data korporat.\n2. **BPJS Ketenagakerjaan Medan Kota (IT Team Coordinator & Admin Support)**: Membangun sistem monitoring MBKM SIGMA (React.js & Laravel 11) dan troubleshooting aplikasi mobile JMO.\n3. **PT. Bank Sumut (Operational Division)**: Mengelola transaksi operasional SOP, kliring, dan membuat dashboard analitik transaksi.\n4. **PT. Bank Syariah Indonesia (BSI KCP Medan Area - Back Office)**: Verifikasi data perbankan, administrasi dokumen pembiayaan syariah, dan kearsipan berstandar kepatuhan tinggi.\n5. **PT. Telkom Akses Indonesia (Fiber Technician)**: Fusion splicing kabel fiber optik, pengujian OPM/OTDR, dan pemeliharaan jaringan GPON.',
      badge: 'Pengalaman Magang & Korporat',
      actions: [{ label: 'Buka Halaman Experience', link: '/experience' }],
    };
  }

  if (q.includes('handspeak') || q.includes('proyek') || q.includes('project') || q.includes('ai') || q.includes('karya')) {
    return {
      text: 'Proyek unggulan riset Zacky adalah **Handspeak — BISINDO Sign Language Translator**:\n\n• Aplikasi mobile Android AI yang menerjemahkan bahasa isyarat Indonesia secara real-time dengan akurasi validasi **94.71% pada 26 kelas alfabet (A–Z)**.\n• Dibangun menggunakan **Flutter, Python, TensorFlow Lite, dan MediaPipe Hands** (ekstraksi 21 titik koordinat, feature vector 176 dimensi).\n\nSelain itu, Zacky juga membangun **Mahaasyik Resto** (aplikasi restoran full-stack React.js Vite + Laravel 11 + Midtrans Snap), **SIGMA BPJSTK** (sistem monitoring MBKM enterprise), dan **Visualisasi Rekapan Bank Sumut**.',
      badge: 'Riset Handspeak & Proyek AI',
      actions: [{ label: 'Lihat Semua Proyek', link: '/projects' }],
    };
  }

  if (q.includes('ipk') || q.includes('kampus') || q.includes('kuliah') || q.includes('usu') || q.includes('pendidikan')) {
    return {
      text: 'Zacky adalah lulusan **Teknik Informatika dari Universitas Sumatera Utara (USU)** dengan predikat **Cum Laude (IPK 3.84 / 4.00)**.\n\nZacky juga meraih sertifikasi Huawei ICT Academy (Overview of AI & HCIA-Datacom), sertifikasi kompetensi nasional SKKNI BNSP (Junior Web Developer & Junior Mobile Programmer), Google Gemini Certified Student, serta Claude AI Certified Practitioner.',
      badge: 'TI USU Cum Laude (IPK 3.84)',
      actions: [{ label: 'Buka Halaman About', link: '/about' }],
    };
  }

  if (q.includes('relokasi') || q.includes('jakarta') || q.includes('luar kota') || q.includes('tersedia') || q.includes('notice') || q.includes('hire') || q.includes('domisili') || q.includes('lokasi')) {
    return {
      text: 'Zacky berstatus **Available Immediately** (siap bergabung secepatnya)!\n\nSaat ini Zacky berdomisili di **Jakarta, Indonesia** dan sangat terbuka untuk bekerja secara **On-Site (Jakarta & sekitarnya), Hybrid, maupun Remote** untuk peluang karir profesional di bidang Software Engineering, IT Support/Banking, atau Data Analytics.',
      badge: 'Available Immediately (Jakarta)',
      actions: [{ label: 'Kirim Email ke Zacky', link: MAILTO }],
    };
  }

  if (q.includes('kontak') || q.includes('email') || q.includes('wa') || q.includes('hubungi') || q.includes('whatsapp') || q.includes('telepon')) {
    return {
      text: 'Anda bisa menghubungi Zacky secara langsung melalui:\n\n• **Email**: zackyandyka1@gmail.com\n• **LinkedIn**: linkedin.com/in/zacky-andyka\n• **WhatsApp**: Tersedia via tombol kontak langsung\n• **Lokasi Domisili**: Jakarta, Indonesia',
      badge: 'Kontak Resmi',
      actions: [
        { label: 'Kirim Email', link: MAILTO },
        { label: 'Buka LinkedIn', link: LINKEDIN_URL },
      ],
    };
  }

  return {
    text: 'Halo! Zacky Andyka adalah profesional Software Engineering & Banking Operations lulusan TI USU (IPK 3.84 Cum Laude).\n\nZacky berpengalaman di bidang Full-Stack Web (React, Laravel), Mobile AI (Flutter, TensorFlow), pemrosesan data operasional perbankan, dan desain visual komersial.\n\nApa yang ingin Anda tanyakan seputar pengalaman magang, proyek AI, atau peluang kerja sama dengan Zacky?',
    badge: 'Ask Zacky AI',
    actions: [
      { label: 'Lihat Pengalaman Kerja', link: '/experience' },
      { label: 'Hubungi Zacky', link: MAILTO },
    ],
  };
}
