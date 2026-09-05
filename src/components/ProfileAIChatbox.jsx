import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
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

  if (q.includes('halo') || q.includes('hai') || q.includes('siapa') || q.includes('pagi') || q.includes('siang') || q.includes('malam')) {
    return {
      text: 'Halo! Saya asisten pintar portofolio **Muhammad Daffa Zacky Andyka**.\n\nSaya siap menjawab pertanyaan seputar riwayat pendidikan di USU (IPK 3.84), pengalaman magang di Bank Sumut, BSI KCP Medan Area, BPJS Ketenagakerjaan Medan Kota, proyek AI Handspeak, hingga kesiapan kerja dan kontak langsung. Apa yang ingin Anda ketahui?',
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

// Helper to format text with **bold** markers safely during streaming
function formatMarkdownText(text, isBot) {
  if (!text) return null;
  const parts = text.split('**');
  return parts.map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: isBot ? 'var(--accent)' : '#ffffff', fontWeight: 700 }}>
        {chunk}
      </strong>
    ) : (
      chunk
    )
  );
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
      isStreaming: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingIntervalRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Smooth autoscroll strictly inside chat container
  const scrollChatToBottom = (instant = false) => {
    if (chatBodyRef.current) {
      if (instant) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      } else {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    scrollChatToBottom(isStreaming);
  }, [messages, isTyping, isStreaming]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping || isStreaming) return;

    // Clear any active streaming timer
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }

    if (playClick) playClick();

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI Thinking delay (~650ms), then begin typewriter streaming
    setTimeout(() => {
      const responseData = generateAIResponse(query);
      const fullText = responseData.text;
      const botMsgId = `bot-${Date.now()}`;

      // Insert empty bot message with streaming active
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: '',
          badge: responseData.badge,
          actions: responseData.actions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        },
      ]);
      setIsTyping(false);
      setIsStreaming(true);

      // Character-by-character typewriter effect (~2 chars every 16ms = ~120 chars/sec)
      let charIdx = 0;
      const chunkSize = 2;
      const speed = 16;

      streamingIntervalRef.current = setInterval(() => {
        charIdx += chunkSize;
        if (charIdx >= fullText.length) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, text: fullText, isStreaming: false }
                : msg
            )
          );
        } else {
          const currentChunk = fullText.slice(0, charIdx);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, text: currentChunk }
                : msg
            )
          );
        }
      }, speed);
    }, 650);
  };

  const handleResetChat = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setIsTyping(false);
    setIsStreaming(false);
    if (playClick) playClick();

    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Obrolan telah di-reset. Silakan tanyakan hal baru seputar profil dan pengalaman Zacky!',
        badge: 'Online',
        actions: [],
        timestamp: 'Baru saja',
        isStreaming: false,
      },
    ]);
  };

  const isBusy = isTyping || isStreaming;

  return (
    <section className="chatbox-section">
      {/* Container Card */}
      <div className="chatbox-card">
        {/* Chatbox Header */}
        <div className="chatbox-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="chatbox-header-avatar">
              <Bot size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                <h3 className="chatbox-title">
                  Ask Zacky AI
                </h3>
                <span className="chatbox-badge-online">
                  <span className="chatbox-badge-dot" />
                  Live Assistant
                </span>
              </div>
              <p className="chatbox-subtitle">
                Knowledge base profil, magang & proyek Zacky
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            onMouseEnter={playHover}
            title="Reset Obrolan"
            className="chatbox-reset-btn"
          >
            <RefreshCw size={13} />
            <span className="reset-btn-label">Reset</span>
          </button>
        </div>

        {/* Chat Messages Body */}
        <div ref={chatBodyRef} className="chatbox-body">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`chat-message-row ${isBot ? 'is-bot' : 'is-user'}`}
              >
                {/* Bot Icon */}
                {isBot && (
                  <div className="chat-avatar bot-avatar">
                    <Bot size={15} />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
                  {/* Badge Header if bot */}
                  {isBot && msg.badge && (
                    <div className="chat-bot-badge-tag">
                      <Sparkles size={11} />
                      <span>{msg.badge}</span>
                    </div>
                  )}

                  {/* Message Text with Typewriter Cursor */}
                  <div className="chat-text-content">
                    {formatMarkdownText(msg.text, isBot)}
                    {isBot && msg.isStreaming && <span className="streaming-cursor" />}
                  </div>

                  {/* Action Quick Links - revealed once generation completes */}
                  {msg.actions && msg.actions.length > 0 && !msg.isStreaming && (
                    <div className="chat-actions-container">
                      {msg.actions.map((act, i) => (
                        <a
                          key={i}
                          href={act.link}
                          target={act.link.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="chat-action-link"
                        >
                          <span>{act.label}</span>
                          <Zap size={10} style={{ color: 'var(--accent)' }} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="chat-timestamp">
                    {msg.timestamp}
                  </div>
                </div>

                {/* User Icon */}
                {!isBot && (
                  <div className="chat-avatar user-avatar">
                    <User size={15} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Typing Indicator with AI Loading Animation */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="chat-typing-indicator"
            >
              <div className="chat-typing-avatar">
                <Bot size={13} className="bot-pulse-icon" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Ask Zacky AI sedang memproses
                </span>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '180ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '360ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chatbox-suggestions-bar">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => !isBusy && handleSendMessage(sug)}
              onMouseEnter={playHover}
              disabled={isBusy}
              className="chatbox-sug-chip"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isBusy) handleSendMessage();
          }}
          className="chatbox-input-form"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isBusy}
            placeholder={isBusy ? "Sedang memproses respon AI..." : "Tanyakan profil Zacky..."}
            className="chatbox-input-field"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isBusy}
            className="chatbox-submit-btn"
          >
            {isBusy ? (
              <>
                <span className="btn-ai-spinner" />
                <span className="btn-send-label">Tunggu</span>
              </>
            ) : (
              <>
                <span className="btn-send-label">Kirim</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .chatbox-section {
          padding: 24px 20px 64px;
          max-width: 860px;
          margin: 0 auto;
          box-sizing: border-box;
          width: 100%;
        }

        .chatbox-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow: 0 16px 48px var(--shadow-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }

        .chatbox-header {
          padding: 14px 18px;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          box-sizing: border-box;
        }

        .chatbox-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .chatbox-title {
          margin: 0;
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .chatbox-badge-online {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .chatbox-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #34d399;
        }

        .chatbox-subtitle {
          margin: 2px 0 0;
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chatbox-reset-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 10px;
          color: var(--text-muted);
          font-size: 11.5px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .chatbox-reset-btn:hover {
          color: var(--text);
          border-color: var(--accent-border);
        }

        .chatbox-body {
          padding: 18px 20px;
          min-height: 320px;
          max-height: 420px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          width: 100%;
        }

        .chat-message-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          box-sizing: border-box;
        }
        .chat-message-row.is-bot {
          align-self: flex-start;
          max-width: 88%;
        }
        .chat-message-row.is-user {
          align-self: flex-end;
          max-width: 84%;
        }

        .chat-avatar {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .chat-avatar.bot-avatar {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--accent);
        }
        .chat-avatar.user-avatar {
          background: var(--accent);
          color: #ffffff;
        }

        .chat-bubble {
          border-radius: 16px;
          padding: 11px 15px;
          font-size: 0.86rem;
          line-height: 1.58;
          box-sizing: border-box;
          word-break: break-word;
        }
        .chat-bubble.bot-bubble {
          background: var(--surface-2);
          color: var(--text);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .chat-bubble.user-bubble {
          background: var(--accent);
          color: #ffffff;
          border: 1px solid var(--accent);
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .chat-bot-badge-tag {
          font-size: 10.5px;
          color: var(--accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .chat-text-content {
          white-space: pre-line;
        }

        .streaming-cursor {
          display: inline-block;
          width: 6px;
          height: 14px;
          background: var(--accent);
          margin-left: 3px;
          vertical-align: -2px;
          border-radius: 1px;
          animation: cursorBlink 0.7s infinite;
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .chat-actions-container {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed var(--border);
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chat-action-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .chat-action-link:hover {
          border-color: var(--accent-border);
          color: var(--accent);
        }

        .chat-timestamp {
          font-size: 10px;
          opacity: 0.6;
          margin-top: 5px;
          text-align: right;
        }

        .chat-typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          padding: 8px 14px;
          border-radius: 16px;
          align-self: flex-start;
          width: fit-content;
          box-shadow: 0 4px 16px var(--shadow-color);
        }

        .chat-typing-avatar {
          width: 22px;
          height: 22px;
          border-radius: 7px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

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
          40% { transform: translateY(-4px); opacity: 1; box-shadow: 0 0 6px var(--accent); }
        }

        .bot-pulse-icon {
          animation: botPulse 1.4s infinite ease-in-out;
        }
        @keyframes botPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }

        .chatbox-suggestions-bar {
          padding: 9px 16px;
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          display: flex;
          gap: 6px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
        }
        .chatbox-suggestions-bar::-webkit-scrollbar {
          display: none;
        }

        .chatbox-sug-chip {
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 11px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.18s;
        }
        .chatbox-sug-chip:hover:not(:disabled) {
          border-color: var(--accent-border);
          color: var(--text);
        }
        .chatbox-sug-chip:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .chatbox-input-form {
          padding: 12px 16px;
          background: var(--surface);
          border-top: 1px solid var(--border);
          display: flex;
          gap: 8px;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
        }

        .chatbox-input-field {
          flex: 1;
          min-width: 0;
          padding: 10px 14px;
          border-radius: 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .chatbox-input-field:focus {
          border-color: var(--accent);
        }
        .chatbox-input-field:disabled {
          opacity: 0.65;
        }

        .chatbox-submit-btn {
          padding: 10px 16px;
          border-radius: 12px;
          background: var(--accent);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .chatbox-submit-btn:disabled {
          background: var(--surface-2);
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-ai-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          display: inline-block;
          animation: spinLoader 0.8s linear infinite;
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }

        /* Responsive Mobile Layout Adjustments (Anti-Cramped / Anti-Mepet) */
        @media (max-width: 640px) {
          .chatbox-section {
            padding: 12px 10px 48px !important;
          }
          .chatbox-card {
            border-radius: 16px !important;
          }
          .chatbox-header {
            padding: 10px 12px !important;
          }
          .chatbox-header-avatar {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
          }
          .chatbox-title {
            font-size: 0.9rem !important;
          }
          .chatbox-subtitle {
            display: none !important;
          }
          .reset-btn-label {
            display: none !important;
          }
          .chatbox-reset-btn {
            padding: 6px 7px !important;
            border-radius: 7px !important;
          }
          .chatbox-body {
            padding: 12px 10px !important;
            min-height: 270px !important;
            max-height: 370px !important;
            gap: 10px !important;
          }
          .chat-message-row.is-bot,
          .chat-message-row.is-user {
            max-width: 95% !important;
            gap: 6px !important;
          }
          .chat-avatar {
            width: 26px !important;
            height: 26px !important;
            border-radius: 7px !important;
          }
          .chat-bubble {
            padding: 9px 12px !important;
            font-size: 0.82rem !important;
            line-height: 1.52 !important;
          }
          .chatbox-suggestions-bar {
            padding: 7px 10px !important;
            gap: 5px !important;
          }
          .chatbox-sug-chip {
            padding: 4px 9px !important;
            font-size: 10.5px !important;
          }
          .chatbox-input-form {
            padding: 8px 10px !important;
            gap: 6px !important;
          }
          .chatbox-input-field {
            padding: 8px 10px !important;
            font-size: 0.82rem !important;
          }
          .btn-send-label {
            display: none !important;
          }
          .chatbox-submit-btn {
            padding: 0 !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 9px !important;
          }
        }
      `}</style>
    </section>
  );
}
