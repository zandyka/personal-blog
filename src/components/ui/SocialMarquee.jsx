import React from 'react';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Instagram,
  Github,
  Mail,
  MessageCircle,
  Send as TelegramIcon,
  Music,
  Gamepad2,
  ArrowUpRight,
} from 'lucide-react';
import { useSoundContext } from './SoundProvider';

/**
 * Watermark SVG silhouettes rendered subtly behind each card (matching reference image)
 */
const Watermarks = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <rect x="2" y="2" width="20" height="20" rx="6" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28m-1.4 9.74h2.79v-8.37H5.06v8.37Z" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.676.15-.2.3-.776.979-.952 1.18-.175.2-.351.226-.652.075s-1.271-.469-2.42-1.493c-.894-.797-1.498-1.782-1.674-2.083-.175-.3-.019-.463.132-.613.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.234-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376s-1.053 1.029-1.053 2.508 1.078 2.909 1.228 3.109c.15.2 2.122 3.24 5.141 4.544 3.02 1.304 3.02.869 3.572.819.552-.05 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351z" />
      <path d="M12 21.5a9.5 9.5 0 1 0-9.5-9.5c0 1.66.425 3.22 1.171 4.58L2.5 21.5l5.06-1.127A9.467 9.467 0 0 0 12 21.5z" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  ),
  Spotify: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14.5c2.5-1 5.5-.8 8 .5" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11.8c3.2-1.3 6.8-1 10 .6" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 9c4-1.5 8.2-1.2 12 .8" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

const ROW_1_CHANNELS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: '@zacky-andyka',
    subtitle: 'Zacky Andyka',
    href: 'https://www.linkedin.com/in/zacky-andyka/',
    icon: Linkedin,
    iconBg: '#ffffff',
    iconColor: '#0A66C2',
    Watermark: Watermarks.LinkedIn,
    color: '#0A66C2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@zandyka._',
    subtitle: 'Creative & Personal',
    href: 'https://www.instagram.com/zandyka._/',
    icon: Instagram,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#ffffff',
    Watermark: Watermarks.Instagram,
    color: '#E1306C',
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: '@zandyka',
    subtitle: 'Code Repositories',
    href: 'https://github.com/zandyka',
    icon: Github,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#ffffff',
    Watermark: Watermarks.GitHub,
    color: '#FF3B1D',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+62 822-7415-4948',
    subtitle: 'Quick Discussion',
    href: 'https://wa.me/6282274154948?text=Halo%20Zacky,%20saya%20tertarik%20untuk%20berdiskusi%20dengan%20Anda.',
    icon: MessageCircle,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#25D366',
    Watermark: Watermarks.WhatsApp,
    color: '#25D366',
  },
];

const ROW_2_CHANNELS = [
  {
    id: 'email',
    name: 'Email',
    handle: 'zackyandyka1@gmail.com',
    subtitle: 'Official Inquiries',
    href: 'mailto:zackyandyka1@gmail.com',
    icon: Mail,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#FFAA00',
    Watermark: Watermarks.Mail,
    color: '#FFAA00',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    handle: '@zndykk',
    subtitle: 'Direct Message',
    href: 'https://t.me/zndykk',
    icon: TelegramIcon,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#229ED9',
    Watermark: Watermarks.Telegram,
    color: '#229ED9',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    handle: '@zackyandyka',
    subtitle: 'Coding & Focus Jams',
    href: 'https://open.spotify.com/',
    icon: Music,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#1DB954',
    Watermark: Watermarks.Spotify,
    color: '#1DB954',
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'zndykk',
    subtitle: 'Dev Community & Voice',
    href: 'https://discord.com/',
    icon: Gamepad2,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#5865F2',
    Watermark: Watermarks.Discord,
    color: '#5865F2',
  },
];

const SocialCard = ({ item }) => {
  const { playHover, playClick } = useSoundContext();
  const Icon = item.icon;
  const Watermark = item.Watermark;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={playClick}
      onMouseEnter={playHover}
      className="social-channel-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '300px',
        minWidth: '300px',
        height: '144px',
        borderRadius: '22px',
        background: 'rgba(14, 14, 20, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35)',
        padding: '16px 20px',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Background Watermark SVG Logo */}
      <div
        style={{
          position: 'absolute',
          right: '-14px',
          bottom: '-18px',
          width: '135px',
          height: '135px',
          opacity: 0.075,
          color: '#ffffff',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
        className="watermark-wrapper"
      >
        <Watermark />
      </div>

      {/* Top Row: Squircle App Icon + Platform Title & Subtitle */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: item.iconBg,
            border: item.iconBg === '#ffffff' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: item.iconColor,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Icon size={24} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              fontSize: '1.12rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            {item.name}
          </span>
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              lineHeight: 1.3,
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.handle}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.08)',
          margin: '10px 0 6px',
        }}
      />

      {/* Bottom Row: CONNECT label + External Arrow */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.2s ease',
          }}
          className="connect-label"
        >
          CONNECT
        </span>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.45)',
            transition: 'transform 0.25s ease, color 0.2s ease',
          }}
          className="connect-icon"
        >
          <ArrowUpRight size={16} />
        </div>
      </div>
    </a>
  );
};

export default function SocialMarquee() {
  const row1Repeated = [...ROW_1_CHANNELS, ...ROW_1_CHANNELS, ...ROW_1_CHANNELS];
  const row2Repeated = [...ROW_2_CHANNELS, ...ROW_2_CHANNELS, ...ROW_2_CHANNELS];

  return (
    <div
      className="social-marquee-section"
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 0 32px',
      }}
    >
      {/* Edge gradient fade masks for cinematic softness */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'clamp(36px, 8vw, 120px)',
          background: 'linear-gradient(90deg, var(--bg) 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'clamp(36px, 8vw, 120px)',
          background: 'linear-gradient(-90deg, var(--bg) 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      <div
        className="social-marquee-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* ROW 1 — Scrolls Left */}
        <div
          className="social-marquee-track marquee-scroll-left"
          style={{
            display: 'flex',
            gap: '18px',
            width: 'max-content',
          }}
        >
          {row1Repeated.map((item, idx) => (
            <SocialCard key={`row1-${item.id}-${idx}`} item={item} />
          ))}
        </div>

        {/* ROW 2 — Scrolls Right */}
        <div
          className="social-marquee-track marquee-scroll-right"
          style={{
            display: 'flex',
            gap: '18px',
            width: 'max-content',
          }}
        >
          {row2Repeated.map((item, idx) => (
            <SocialCard key={`row2-${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes marqueeScrollRight {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-scroll-left {
          animation: marqueeScrollLeft 36s linear infinite;
        }

        .marquee-scroll-right {
          animation: marqueeScrollRight 40s linear infinite;
        }

        /* Hover Pause */
        .social-marquee-container:hover .social-marquee-track {
          animation-play-state: paused;
        }

        /* Card Interactive Hover */
        .social-channel-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(255, 59, 29, 0.45) !important;
          background: rgba(22, 22, 32, 0.88) !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(255, 59, 29, 0.16) !important;
        }

        .social-channel-card:hover .watermark-wrapper {
          opacity: 0.15 !important;
          transform: scale(1.06) rotate(-2deg);
        }

        .social-channel-card:hover .connect-label {
          color: var(--accent) !important;
        }

        .social-channel-card:hover .connect-icon {
          color: var(--accent) !important;
          transform: translate(3px, -3px);
        }

        @media (max-width: 640px) {
          .social-channel-card {
            width: 260px !important;
            min-width: 260px !important;
            height: 136px !important;
            padding: 14px 16px !important;
          }
          .marquee-scroll-left {
            animation-duration: 25s;
          }
          .marquee-scroll-right {
            animation-duration: 28s;
          }
        }
      `}</style>
    </div>
  );
}
