import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  GraduationCap,
  Briefcase,
  Code2,
  Mail,
  Zap,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const SUGGESTIONS = [
  'Ceritakan pengalaman magang perbankan Zacky',
  'Apa proyek unggulan Handspeak AI?',
  'Berapa IPK dan asal kampus Zacky?',
  'Apakah Zacky siap relokasi kerja?',
  'Bagaimana cara menghubungi Zacky?',
];

// Profile knowledge base for instant natural responses
function generateAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('magang') || q.includes('bank') || q.includes('pengalaman') || q.includes('kerja')) {
    return {
      text: 'Zacky memiliki 4 pengalaman magang yang solid:\n\n1. **PT. Bank Sumut (Operational Division)**: Mengelola transaksi operasional SOP, kliring, dan membuat dashboard analitik transaksi.\n2. **PT. Bank Syariah Indonesia (BSI - Back Office)**: Verifikasi data perbankan, administrasi dokumen pembiayaan, dan kearsipan berstandar kepatuhan tinggi.\n3. **BPJS Ketenagakerjaan (IT / Admin Support)**: Membangun sistem monitoring MBKM SIGMA (React.js & Laravel 11) dan troubleshooting aplikasi mobile JMO.\n4. **PT. Telkom Akses (Fiber Technician)**: Fusion splicing kabel fiber optik, pengujian OPM/OTDR, dan pemeliharaan jaringan GPON.',
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

  if (q.includes('halo') || q.includes('hai') || q.includes('siapa') || q.includes('pagi') || q.includes('siang') || q.includes('malam')) {
    return {
      text: 'Halo! Saya asisten pintar portofolio **Muhammad Daffa Zacky Andyka**.\n\nSaya siap menjawab pertanyaan seputar riwayat pendidikan di USU (IPK 3.84), pengalaman magang di Bank Sumut, BSI, BPJS TK, proyek AI Handspeak, hingga kesiapan kerja dan kontak langsung. Apa yang ingin Anda ketahui?',
      badge: 'Zacky AI Assistant',
      actions: [],
    };
  }

  // Default response
  return {
    text: `Terima kasih pertanyaannya! Zacky Andyka adalah profesional Software Engineering & Banking Operations lulusan TI USU (IPK 3.84 Cum Laude).\n\nZacky memiliki keahlian di bidang Full-Stack Web (React, Laravel), Mobile AI (Flutter, TensorFlow), pemrosesan data operasional perbankan, dan desain visual komersial.\n\nApakah Anda ingin mengetahui detail magang, proyek AI, atau cara menghubungi Zacky?`,
    badge: 'Profil Lengkap',
    actions: [
      { label: 'Lihat Pengalaman Kerja', link: '/experience' },
      { label: 'Hubungi Zacky', link: 'mailto:zackyandyka1@gmail.com' },
    ],
  };
}

export default function ProfileAIChatbox() {
  const { playClick, playHover } = useSoundContext();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya asisten AI profil Zacky Andyka. Tanyakan apa saja seputar pengalaman magang perbankan, proyek AI Handspeak, skill teknis, IPK, atau kesiapan kerja Zacky!',
      badge: 'Online',
      actions: [],
      timestamp: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    playClick();

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking and typing response with realistic delay
    setTimeout(() => {
      const responseData = generateAIResponse(query);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseData.text,
        badge: responseData.badge,
        actions: responseData.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 1400);
  };

  const handleResetChat = () => {
    playClick();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Obrolan telah di-reset. Silakan tanyakan hal baru seputar profil dan pengalaman Zacky!',
        badge: 'Online',
        actions: [],
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <section
      style={{
        padding: '20px 20px 60px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      {/* Container Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 16px 48px var(--shadow-color)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chatbox Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                  Ask Zacky AI
                </h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10.5px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: '#34d399',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                  Live Assistant
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Didukung knowledge base lengkap seputar profil Zacky Andyka
              </span>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            onMouseEnter={playHover}
            title="Reset Obrolan"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: 'var(--text-muted)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Chat Messages Body */}
        <div
          ref={chatBodyRef}
          style={{
            padding: '20px',
            minHeight: '340px',
            maxHeight: '440px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                }}
              >
                {/* Bot Icon */}
                {isBot && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={16} />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  style={{
                    background: isBot ? 'var(--surface-2)' : 'var(--accent)',
                    color: isBot ? 'var(--text)' : '#ffffff',
                    border: isBot ? '1px solid var(--border)' : '1px solid var(--accent)',
                    borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    boxShadow: isBot ? 'none' : '0 4px 14px var(--accent-glow)',
                  }}
                >
                  {/* Badge Header if bot */}
                  {isBot && msg.badge && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--accent)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{msg.badge}</span>
                    </div>
                  )}

                  {/* Message Text (Markdown-like formatting support) */}
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {msg.text.split('**').map((chunk, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} style={{ color: isBot ? 'var(--accent)' : '#ffffff' }}>
                          {chunk}
                        </strong>
                      ) : (
                        chunk
                      )
                    )}
                  </div>

                  {/* Action Quick Links if available */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px dashed var(--border)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      {msg.actions.map((act, i) => (
                        <a
                          key={i}
                          href={act.link}
                          target={act.link.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            fontSize: '11px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span>{act.label}</span>
                          <Zap size={10} style={{ color: 'var(--accent)' }} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: '10px',
                      opacity: 0.6,
                      marginTop: '6px',
                      textAlign: 'right',
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* User Icon */}
                {!isBot && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Typing Indicator with AI Loading Animation */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                padding: '10px 16px',
                borderRadius: '18px',
                alignSelf: 'flex-start',
                width: 'fit-content',
                boxShadow: '0 4px 16px var(--shadow-color)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Bot size={14} className="bot-pulse-icon" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Ask Zacky AI sedang memproses...
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '180ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '360ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: '10px 16px',
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => !isTyping && handleSendMessage(sug)}
              onMouseEnter={playHover}
              disabled={isTyping}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: isTyping ? 'var(--text-dim)' : 'var(--text-muted)',
                fontSize: '11px',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                opacity: isTyping ? 0.6 : 1,
                transition: 'all 0.18s',
              }}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isTyping) handleSendMessage();
          }}
          style={{
            padding: '14px 16px',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? "Sedang memproses respon AI..." : "Tanyakan sesuatu seputar profil Zacky..."}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '0.88rem',
              outline: 'none',
              opacity: isTyping ? 0.7 : 1,
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: inputText.trim() && !isTyping ? 'var(--accent)' : 'var(--surface-2)',
              color: inputText.trim() && !isTyping ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              opacity: isTyping ? 0.8 : (inputText.trim() ? 1 : 0.6),
            }}
          >
            {isTyping ? (
              <>
                <span className="btn-ai-spinner" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Kirim</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
          animation: dotBounce 1.2s infinite ease-in-out;
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 1; box-shadow: 0 0 8px var(--accent); }
        }
        .bot-pulse-icon {
          animation: botPulse 1.4s infinite ease-in-out;
        }
        @keyframes botPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        .btn-ai-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          display: inline-block;
          animation: spinLoader 0.8s linear infinite;
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}