// Serverless Edge / Node function for Ask Zacky AI
// Supports Google Gemini 1.5 Flash (default) and Groq Llama 3.3 70B

const SYSTEM_PROMPT = `Anda adalah "Ask Zacky AI", asisten pintar representasi resmi dari portofolio Muhammad Daffa Zacky Andyka.

PROFIL UTAMA:
- Nama Lengkap: Muhammad Daffa Zacky Andyka (biasa dipanggil Zacky).
- Pendidikan: S1 Teknik Informatika dari Universitas Sumatera Utara (USU). Masuk tahun 2023, lulus dengan predikat Cum Laude (IPK 3.84 / 4.00). (PENTING: Jangan pernah menyebutkan D3 atau tahun 2021).
- Status Ketersediaan: Available Immediately (siap langsung bergabung).
- Mobilitas Kerja: Siap bekerja On-Site, Hybrid, maupun Remote, dan SANGAT BERSEDIA RELOKASI ke Jakarta atau kota besar lainnya.
- Domisili: Medan, Sumatera Utara.
- Kontak: Email: zackyandyka1@gmail.com, LinkedIn: linkedin.com/in/zackyandyka.

PENGALAMAN MAGANG & KERJA (4 Institusi):
1. PT. Bank Sumut (Operational Division):
   - Menjalankan SOP operasional perbankan harian, penanganan kliring transaksi, dan rekonsiliasi data keuangan.
   - Mengembangkan dashboard visualisasi analitik data rekap transaksi operasional cabang.
2. PT. Bank Syariah Indonesia (BSI KCP Medan Area - Back Office):
   - Verifikasi data nasabah & dokumen pembiayaan syariah dengan standar kepatuhan (*compliance*) tinggi.
   - Manajemen kearsipan legal perbankan dan administrasi berkas back-office.
3. BPJS Ketenagakerjaan Medan Kota (IT / Admin Support):
   - Mengembangkan SIGMA (Sistem Informasi & Monitoring Magang MBKM) berbasis React.js & Laravel 11.
   - Troubleshooting kendala teknis aplikasi mobile JMO (Jamsostek Mobile) dan rekonsiliasi data kepesertaan.
4. PT. Telkom Akses (Fiber Technician):
   - Fusion splicing kabel fiber optik, pengujian redaman sinyal dengan OPM/OTDR, dan pemeliharaan jaringan GPON.

PROYEK & RISET UNGGULAN:
1. Handspeak — BISINDO Sign Language Translator:
   - Aplikasi mobile AI penerjemah bahasa isyarat Indonesia secara real-time untuk membantu teman tuli.
   - Teknologi: Flutter, Python, TensorFlow Lite, dan Computer Vision (MediaPipe Hands).
2. SIGMA BPJSTK:
   - Web application enterprise monitoring mahasiswa MBKM di BPJS Ketenagakerjaan Medan Kota (React.js, Laravel 11, Tailwind CSS, MySQL).
3. Mahaasyik Resto:
   - Web restoran interaktif modern dengan integrasi payment gateway Midtrans.
4. Visualisasi Rekapan Bank Sumut:
   - Dashboard analitik data transaksi dan operasional perbankan.

SERTIFIKASI:
- SKKNI BNSP: Junior Web Developer & Junior Mobile Programmer
- Google Gemini Certified Student
- Huawei ICT Academy

ATURAN KOMUNIKASI & GAYA BICARA:
- Bersikap ramah, sopan, percaya diri, lugas, dan profesional.
- JANGAN bertele-tele atau membuat paragraf raksasa (ikuti prinsip: ringkas, padat, berbobot).
- Gunakan format markdown seperti **tebal** untuk poin penting dan bullet point bila menjabarkan daftar.
- Sesuaikan bahasa dengan pengguna (Bahasa Indonesia secara default, atau Bahasa Inggris jika user bertanya dalam bahasa Inggris).
- JANGAN PERNAH mengarang data palsu (*no hallucinations*). Jika ada hal di luar profil Zacky yang ditanyakan, katakan dengan sopan bahwa Anda fokus mewakili profil profesional Zacky atau sarankan menghubungi Zacky langsung via email.`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const userMessage = message.trim();
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

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
        const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-1.5-flash'];
        let replyText = '';
        let usedModel = 'Gemini 2.5 Flash';

        for (const model of modelsToTry) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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
        { label: 'Kirim Email', link: 'mailto:zackyandyka1@gmail.com' },
        { label: 'Buka LinkedIn', link: 'https://linkedin.com/in/zackyandyka' },
      ],
    };
  }

  return {
    badge: 'Ask Zacky AI',
    actions: [
      { label: 'Lihat Pengalaman Kerja', link: '/experience' },
      { label: 'Kirim Pesan', link: 'mailto:zackyandyka1@gmail.com' },
    ],
  };
}

// Built-in offline fallback if API keys are not configured yet
function generateLocalFallback(query) {
  const q = query.toLowerCase();

  if (q.includes('magang') || q.includes('bank') || q.includes('pengalaman') || q.includes('kerja')) {
    return {
      text: 'Zacky memiliki 4 pengalaman magang yang solid:\n\n1. **PT. Bank Sumut (Operational Division)**: Mengelola transaksi operasional SOP, kliring, dan membuat dashboard analitik transaksi.\n2. **PT. Bank Syariah Indonesia (BSI KCP Medan Area - Back Office)**: Verifikasi data perbankan, administrasi dokumen pembiayaan, dan kearsipan berstandar kepatuhan tinggi.\n3. **BPJS Ketenagakerjaan Medan Kota (IT / Admin Support)**: Membangun sistem monitoring MBKM SIGMA (React.js & Laravel 11) dan troubleshooting aplikasi mobile JMO.\n4. **PT. Telkom Akses (Fiber Technician)**: Fusion splicing kabel fiber optik, pengujian OPM/OTDR, dan pemeliharaan jaringan GPON.',
      badge: '4 Institusi Terkemuka',
      actions: [{ label: 'Buka Halaman Experience', link: '/experience' }],
    };
  }

  if (q.includes('handspeak') || q.includes('proyek') || q.includes('project') || q.includes('ai') || q.includes('karya')) {
    return {
      text: 'Proyek unggulan riset Zacky adalah **Handspeak — BISINDO Sign Language Translator**:\n\n• Aplikasi mobile AI yang menerjemahkan bahasa isyarat Indonesia secara real-time untuk membantu teman tuli.\n• Dibangun dengan **Flutter, Python, TensorFlow Lite, dan Computer Vision (MediaPipe)**.\n\nSelain itu, Zacky juga membangun **SIGMA BPJSTK** (sistem monitoring MBKM enterprise), **Mahaasyik Resto** (aplikasi web restoran dengan payment gateway Midtrans), dan **Visualisasi Rekapan Bank Sumut**.',
      badge: 'Computer Vision & Fullstack',
      actions: [{ label: 'Lihat Semua Proyek', link: '/projects' }],
    };
  }

  if (q.includes('ipk') || q.includes('kampus') || q.includes('kuliah') || q.includes('usu') || q.includes('pendidikan')) {
    return {
      text: 'Zacky adalah lulusan **Teknik Informatika dari Universitas Sumatera Utara (USU)** dengan predikat **Cum Laude (IPK 3.84 / 4.00)**.\n\nZacky juga meraih sertifikasi kompetensi nasional SKKNI BNSP (Junior Web Developer & Junior Mobile Programmer), Google Gemini Certified Student, serta Huawei ICT Academy.',
      badge: 'Cum Laude (IPK 3.84)',
      actions: [{ label: 'Buka Halaman About', link: '/about' }],
    };
  }

  if (q.includes('relokasi') || q.includes('jakarta') || q.includes('luar kota') || q.includes('tersedia') || q.includes('notice') || q.includes('hire')) {
    return {
      text: 'Zacky berstatus **Available Immediately** (siap bergabung secepatnya)!\n\nZacky sangat bersedia untuk bekerja secara **On-Site, Hybrid, maupun Remote**, dan siap **relokasi ke Jakarta atau kota lainnya** untuk peluang karir profesional di bidang Software Engineering, IT Support/Banking, atau Data Analytics.',
      badge: 'Available Immediately',
      actions: [{ label: 'Kirim Email ke Zacky', link: 'mailto:zackyandyka1@gmail.com' }],
    };
  }

  if (q.includes('kontak') || q.includes('email') || q.includes('wa') || q.includes('hubungi') || q.includes('whatsapp') || q.includes('telepon')) {
    return {
      text: 'Anda bisa menghubungi Zacky secara langsung melalui:\n\n• **Email**: zackyandyka1@gmail.com\n• **LinkedIn**: linkedin.com/in/zackyandyka\n• **WhatsApp**: Tersedia via tombol kontak langsung\n• **Lokasi Domisili**: Medan, Sumatera Utara (Siap Relokasi)',
      badge: 'Respon < 24 Jam',
      actions: [
        { label: 'Kirim Email', link: 'mailto:zackyandyka1@gmail.com' },
        { label: 'Buka LinkedIn', link: 'https://linkedin.com/in/zackyandyka' },
      ],
    };
  }

  return {
    text: 'Halo! Zacky Andyka adalah profesional Software Engineering & Banking Operations lulusan TI USU (IPK 3.84 Cum Laude).\n\nZacky berpengalaman di bidang Full-Stack Web (React, Laravel), Mobile AI (Flutter, TensorFlow), pemrosesan data operasional perbankan, dan desain visual komersial.\n\nApa yang ingin Anda tanyakan seputar pengalaman magang, proyek AI, atau peluang kerja sama dengan Zacky?',
    badge: 'Profil Lengkap',
    actions: [
      { label: 'Lihat Pengalaman Kerja', link: '/experience' },
      { label: 'Hubungi Zacky', link: 'mailto:zackyandyka1@gmail.com' },
    ],
  };
}
