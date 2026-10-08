import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Calendar, GitCommit, Sparkles } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

/* --------------------------- deterministic PRNG -------------------------- */
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateContributionData(weeks, daysPerWeek, emptyChance, seed) {
  const rand = mulberry32(seed);
  const totalDays = weeks * daysPerWeek;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const flatDays = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i);
    let level = 0;
    if (rand() > emptyChance) {
      const r = rand();
      level = r > 0.85 ? 4 : r > 0.65 ? 3 : r > 0.35 ? 2 : 1;
    }
    const count = level === 0 ? 0 : Math.round(level * (2 + rand() * 4));
    flatDays.push({
      date: d.toISOString().slice(0, 10),
      level,
      count,
    });
  }
  const result = [];
  for (let w = 0; w < weeks; w++) {
    result.push(flatDays.slice(w * daysPerWeek, w * daysPerWeek + daysPerWeek));
  }
  return result;
}

/* ---------------------------- real GitHub data ---------------------------- */
function normalizeGithubUsername(raw) {
  let value = (raw || '').trim();
  const urlMatch = value.match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (urlMatch) value = urlMatch[1];
  value = value.replace(/^@/, '');
  return value;
}

async function fetchGithubContributions(username, signal) {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { signal }
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`"${username}" wasn't found on GitHub`);
    throw new Error(`GitHub data request failed (${res.status})`);
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.contributions)) {
    throw new Error('Unexpected response from contributions service');
  }
  const map = new Map();
  for (const day of data.contributions) {
    const level = Math.max(0, Math.min(4, Number(day.level)));
    map.set(day.date, {
      count: Number(day.count) || 0,
      level,
    });
  }
  return {
    map,
    totalLastYear: data.total?.lastYear ?? null,
  };
}

function buildGridFromRealData(map, weeks, daysPerWeek) {
  const totalDays = weeks * daysPerWeek;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const flatDays = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = map.get(key);
    flatDays.push({
      date: key,
      level: found ? found.level : 0,
      count: found ? found.count : 0,
    });
  }
  const result = [];
  for (let w = 0; w < weeks; w++) {
    result.push(flatDays.slice(w * daysPerWeek, w * daysPerWeek + daysPerWeek));
  }
  return result;
}

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function GithubGraph(props) {
  const {
    githubUsername = 'zandyka',
    title = 'GitHub Contribution Activity',
    subtitle = 'Aktivitas commit & kontribusi kode 52 minggu terakhir',
    showFrame = true,
    background = '#0d1117',
    textColor = '#c9d1d9',
    accentColor = '#39d353',
    radius = 16,
    padding = 24,
    weeks = 52,
    daysPerWeek = 7,
    seed = 42,
    emptyChance = 0.35,
    colorEmpty = '#161b22',
    colorLevel1 = '#0e4429',
    colorLevel2 = '#006d32',
    colorLevel3 = '#26a641',
    colorLevel4 = '#39d353',
    cellSize = 12,
    gap = 3,
    cellRadius = 2.5,
    showWeekdayLabels = true,
    showMonthLabels = true,
    showLegend = true,
    animate = true,
    animationDuration = 450,
    animationStagger = 5,
    replayOnView = true,
    style,
  } = props;

  const soundContext = useSoundContext?.() || {};
  const playHover = soundContext.playHover || (() => {});
  const playClick = soundContext.playClick || (() => {});

  const colors = [colorEmpty, colorLevel1, colorLevel2, colorLevel3, colorLevel4];
  const uidRef = useRef('cg' + Math.random().toString(36).slice(2, 9));
  const uid = uidRef.current;
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const [inView, setInView] = useState(!replayOnView);
  const [hovered, setHovered] = useState(null);
  const cleanUsername = useMemo(() => normalizeGithubUsername(githubUsername), [githubUsername]);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [liveMap, setLiveMap] = useState(null);
  const [totalContributions, setTotalContributions] = useState(null);
  const cacheRef = useRef(new Map());

  // Scroll to the end (most recent weeks) by default on mount/view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks, inView]);

  useEffect(() => {
    if (!cleanUsername) {
      setStatus('idle');
      setLiveMap(null);
      setErrorMessage('');
      return;
    }
    const cacheKey = cleanUsername.toLowerCase();
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setLiveMap(cached.map);
      setTotalContributions(cached.totalLastYear);
      setStatus('success');
      setErrorMessage('');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    setErrorMessage('');

    fetchGithubContributions(cleanUsername, controller.signal)
      .then(({ map, totalLastYear }) => {
        cacheRef.current.set(cacheKey, { map, totalLastYear });
        setLiveMap(map);
        setTotalContributions(totalLastYear);
        setStatus('success');
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setLiveMap(null);
        setStatus('error');
        setErrorMessage(err?.message || "Couldn't load GitHub contributions");
      });

    return () => controller.abort();
  }, [cleanUsername]);

  const placeholderGrid = useMemo(
    () => generateContributionData(weeks, daysPerWeek, emptyChance, seed),
    [weeks, daysPerWeek, emptyChance, seed]
  );

  const usingRealData = Boolean(cleanUsername) && status === 'success' && !!liveMap;
  const grid = useMemo(() => {
    if (usingRealData && liveMap) {
      return buildGridFromRealData(liveMap, weeks, daysPerWeek);
    }
    return placeholderGrid;
  }, [usingRealData, liveMap, placeholderGrid, weeks, daysPerWeek]);

  // Observer for in-view animation
  useEffect(() => {
    if (!replayOnView || !containerRef.current) {
      setInView(true);
      return;
    }
    const el = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [replayOnView]);

  const monthLabels = useMemo(() => {
    if (!showMonthLabels) return [];
    const labels = [];
    let lastMonth = -1;
    grid.forEach((week, weekIndex) => {
      const firstDated = week.find((d) => d.date);
      if (!firstDated?.date) return;
      const month = new Date(firstDated.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex, label: MONTH_NAMES[month] });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid, showMonthLabels]);

  const totalCells = weeks * daysPerWeek;
  const shouldAnimate = animate;

  // Format date helper for tooltip
  const formatTooltipDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: showFrame
          ? 'linear-gradient(180deg, rgba(13, 17, 23, 0.95) 0%, rgba(10, 14, 20, 0.98) 100%)'
          : 'transparent',
        borderRadius: showFrame ? `${radius}px` : 0,
        padding: showFrame ? `${padding}px` : 0,
        border: showFrame ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        boxShadow: showFrame ? '0 12px 36px rgba(0, 0, 0, 0.35)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        color: textColor,
        ...style,
      }}
      className="github-graph-card"
    >
      <style>{`
        ${
          shouldAnimate
            ? `
          @keyframes contribPop-${uid} {
            0%   { transform: scale(0.3); opacity: 0; }
            65%  { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `
            : ''
        }
        .contrib-grid-${uid} {
          display: grid;
          grid-template-columns: repeat(${weeks}, minmax(0, 1fr));
          grid-auto-rows: 1fr;
          gap: ${gap}px;
          width: 100%;
        }
        .contrib-cell-${uid} {
          aspect-ratio: 1 / 1;
          width: 100%;
          border-radius: ${cellRadius}px;
          transform-origin: center;
          transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1), outline 120ms ease, box-shadow 120ms ease;
        }
        ${
          shouldAnimate
            ? `
          .contrib-cell-${uid}.animated {
            animation-name: contribPop-${uid};
            animation-duration: ${animationDuration}ms;
            animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
            animation-fill-mode: backwards;
          }
        `
            : ''
        }
        .contrib-cell-${uid}:hover {
          outline: 1.5px solid rgba(255, 255, 255, 0.85);
          outline-offset: 1px;
          transform: scale(1.22);
          z-index: 10;
        }
        .contrib-scroll-${uid} {
          overflow-x: auto;
          padding-bottom: 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        .contrib-scroll-${uid}::-webkit-scrollbar {
          height: 5px;
        }
        .contrib-scroll-${uid}::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 999px;
        }
        .contrib-scroll-${uid}::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
        }
        .contrib-scroll-${uid}::-webkit-scrollbar-thumb:hover {
          background: var(--accent, #818cf8);
        }
      `}</style>

      {/* Header with Title, Live Badge, and Profile Link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '18px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            <Github size={20} />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </h3>

              {totalContributions !== null && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(57, 211, 83, 0.15)',
                    color: '#39d353',
                    border: '1px solid rgba(57, 211, 83, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <GitCommit size={11} />
                  <span>{totalContributions} kontribusi</span>
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted, #94a3b8)',
                margin: '2px 0 0',
                fontWeight: 400,
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* GitHub External Button & Pulse Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {cleanUsername && (
            <a
              href={`https://github.com/${cleanUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <span>@{cleanUsername}</span>
              <ExternalLink size={12} style={{ opacity: 0.7 }} />
            </a>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: status === 'loading' ? '#f59e0b' : '#39d353',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: status === 'loading' ? '#f59e0b' : '#39d353',
                boxShadow:
                  status === 'loading'
                    ? '0 0 8px #f59e0b'
                    : '0 0 8px #39d353',
                display: 'inline-block',
                animation: 'pulse 2s infinite',
              }}
            />
            <span>{status === 'loading' ? 'Memuat…' : 'Live Sync'}</span>
          </div>
        </div>
      </div>

      {/* Main Graph Grid in Scroll Container */}
      <div className={`contrib-scroll-${uid}`} ref={scrollRef}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            minWidth: weeks * (cellSize + gap) + (showWeekdayLabels ? 30 : 0),
            paddingBottom: '2px',
          }}
        >
          {/* Weekday Labels (Mon, Wed, Fri) */}
          {showWeekdayLabels && (
            <div
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${daysPerWeek}, 1fr)`,
                gap: `${gap}px`,
                fontSize: 9,
                opacity: 0.55,
                paddingTop: showMonthLabels ? 18 : 0,
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              {Array.from({ length: daysPerWeek }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: 4,
                  }}
                >
                  {WEEKDAY_LABELS[i % 7]}
                </div>
              ))}
            </div>
          )}

          {/* Month Labels + Cells Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {showMonthLabels && (
              <div
                style={{
                  position: 'relative',
                  height: 18,
                  fontSize: 10,
                  opacity: 0.65,
                  userSelect: 'none',
                  marginBottom: '2px',
                }}
              >
                {monthLabels.map(({ weekIndex, label }) => (
                  <span
                    key={`${label}-${weekIndex}`}
                    style={{
                      position: 'absolute',
                      left: `${(weekIndex / weeks) * 100}%`,
                      transform: 'translateX(0)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className={`contrib-grid-${uid}`}>
              {grid.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  const cellIndex = weekIndex * daysPerWeek + dayIndex;
                  const delay = shouldAnimate
                    ? Math.min(cellIndex, totalCells) * animationStagger
                    : 0;

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`contrib-cell-${uid}${shouldAnimate && inView ? ' animated' : ''}`}
                      style={{
                        backgroundColor: colors[day.level],
                        animationDelay: `${delay}ms`,
                        gridColumn: weekIndex + 1,
                        gridRow: dayIndex + 1,
                        cursor: 'pointer',
                        boxShadow:
                          day.level >= 3
                            ? `0 0 6px ${colors[day.level]}55`
                            : 'none',
                      }}
                      onMouseEnter={(e) => {
                        playHover();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHovered({
                          day,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Legend & Status Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.74rem',
        }}
      >
        <div style={{ color: 'var(--text-muted, #94a3b8)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={12} style={{ color: '#39d353' }} />
          <span>
            {status === 'loading'
              ? `Sinkronisasi data @${cleanUsername} dari GitHub…`
              : status === 'error'
              ? `${errorMessage} (menampilkan data simulasi)`
              : `Terhubung langsung dengan profil GitHub @${cleanUsername}`}
          </span>
        </div>

        {showLegend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '0.72rem',
              userSelect: 'none',
            }}
          >
            <span>Less</span>
            {colors.map((c, i) => (
              <span
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: c,
                  display: 'inline-block',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              />
            ))}
            <span>More</span>
          </div>
        )}
      </div>

      {/* Floating Interactive Tooltip */}
      {hovered && (
        <div
          style={{
            position: 'fixed',
            left: hovered.x,
            top: hovered.y - 10,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(22, 27, 34, 0.95)',
            color: '#f0f6fc',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.72rem',
            padding: '5px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontWeight: 600, color: '#39d353' }}>
            {hovered.day.count ?? 0} {hovered.day.count === 1 ? 'kontribusi' : 'kontribusi'}
          </div>
          {hovered.day.date && (
            <div style={{ fontSize: '0.66rem', color: '#8b949e' }}>
              {formatTooltipDate(hovered.day.date)}
            </div>
          )}
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid rgba(22, 27, 34, 0.95)',
            }}
          />
        </div>
      )}
    </div>
  );
}
