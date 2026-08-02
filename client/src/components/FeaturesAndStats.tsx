import { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─── Tiny floating particle ─────────────────────────────────────────────── */
const Particle = ({ x, y, size, duration, delay }: { x: number; y: number; size: number; duration: number; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: 'rgba(61,184,107,0.55)',
      filter: 'blur(1px)',
    }}
    animate={{ y: [0, -80, 0], opacity: [0, 0.7, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
  />
);

/* ─── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, duration = 1.6) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, target, duration]);
  return count;
}

/* ─── Feature card with all micro-interactions ───────────────────────────── */
const FEATURES = [
  {
    label: 'Nature Inspired',
    desc: 'Stories that celebrate the beauty of our world and our deep connection with nature.',
    color: '#3DB86B',
    iconPath: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
  },
  {
    label: 'Words that Connect',
    desc: 'Uniting readers and writers through the transformative power of the written word.',
    color: '#4ECCA3',
    iconPath: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  },
  {
    label: 'A Creative Community',
    desc: 'A living platform for ideas, expression, and inspired collaboration across Kerala.',
    color: '#7DE2A0',
    iconPath: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

const STATS = [
  { target: 500, suffix: '+', label: 'Books Published', icon: '📚', sublabel: 'Across all genres & dialects', pct: 82 },
  { target: 20,  suffix: '+', label: 'Magazines Issued', icon: '📖', sublabel: 'Periodic literary editions', pct: 55 },
  { target: 1000, suffix: '+', label: 'Active Readers', icon: '👥', sublabel: 'Growing community of voices', pct: 70 },
];

/* ─── Individual feature card with 3D mouse tilt ─────────────────────────── */
const FeatureCard = ({ feat, index, isDark }: { feat: typeof FEATURES[0]; index: number; isDark: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotX.set(((e.clientY - cy) / rect.height) * -10);
    rotY.set(((e.clientX - cx) / rect.width) * 10);
  }, [rotX, rotY]);

  const handleMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    setHovered(false);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ y: -8 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-default"
    >
      {/* Outer glow bloom */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: hovered ? `0 20px 50px rgba(44,196,120,0.15), 0 0 60px rgba(44,196,120,0.08)` : 'none',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Glass card body */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 flex flex-col items-center text-center gap-6 h-full"
        style={{
          transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          background: isDark
            ? (hovered ? 'rgba(13,28,20,0.20)' : 'rgba(13,28,20,0.11)')
            : (hovered ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.40)'),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: hovered
            ? `1px solid rgba(61,184,107,0.38)`
            : isDark
              ? `1px solid rgba(46,90,69,0.22)`
              : `1px solid rgba(61,184,107,0.18)`,
          boxShadow: hovered
            ? (isDark
              ? `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 40px rgba(61,184,107,0.05), 0 20px 50px rgba(44,196,120,0.12)`
              : `inset 0 1px 0 rgba(255,255,255,0.80), 0 20px 50px rgba(44,196,120,0.12), 0 4px 20px rgba(0,0,0,0.06)`)
            : (isDark
              ? `inset 0 1px 0 rgba(255,255,255,0.05)`
              : `inset 0 1px 0 rgba(255,255,255,0.70), 0 4px 16px rgba(0,0,0,0.04)`),
        }}
      >
        {/* Top highlight reflection */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Radial glow behind icon */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${feat.color}22 0%, transparent 70%)`,
            filter: 'blur(12px)',
            opacity: hovered ? 1 : 0.5,
          }}
        />

        {/* Floating icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 + index * 0.5, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: hovered ? 5 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${feat.color}30 0%, ${feat.color}15 100%)`,
              boxShadow: `0 0 20px ${feat.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${feat.color}30`,
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke={feat.color}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {feat.iconPath}
            </svg>
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="relative z-10 space-y-3">
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '19px',
              fontWeight: 700,
              color: isDark ? '#ffffff' : '#1F3E2F',
            }}
          >
            {feat.label}
          </h3>
          <p
            style={{
              color: isDark ? 'rgba(234,244,238,0.70)' : 'rgba(31,62,47,0.68)',
              fontSize: '15px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: '1.65',
            }}
          >
            {feat.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── STATS PANEL — single long glass card ───────────────────────────────── */
const STAT_DATA = [
  { target: 500,  suffix: '+', label: 'Books Published',   desc: 'Across all genres & dialects' },
  { target: 20,   suffix: '+', label: 'Magazines Issued',  desc: 'Periodic literary editions'   },
  { target: 1000, suffix: '+', label: 'Active Readers',    desc: 'Growing community of voices'  },
];

// Floating sparkle dot
const Sparkle = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: 'rgba(61,184,107,0.7)' }}
    animate={{ scale: [0, 1.4, 0], opacity: [0, 0.8, 0] }}
    transition={{ repeat: Infinity, duration: 2.8, delay, ease: 'easeInOut' }}
  />
);

interface StatsPanelProps {
  statsRef: React.RefObject<HTMLDivElement>;
  counts: number[];
  isDark: boolean;
}

const StatsPanel = ({ statsRef, counts, isDark }: StatsPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 120, damping: 18 });
  const springRotY = useSpring(rotY, { stiffness: 120, damping: 18 });
  const glowCursorX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const glowCursorY = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const glowOffsetX = useTransform(glowCursorX, v => v - 150);
  const glowOffsetY = useTransform(glowCursorY, v => v - 150);

  const handlePanelMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotX.set(((e.clientY - cy) / rect.height) * -4);
    rotY.set(((e.clientX - cx) / rect.width) * 4);
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }, [rotX, rotY, cursorX, cursorY]);

  const handlePanelLeave = useCallback(() => {
    rotX.set(0); rotY.set(0);
    setHovered(false);
  }, [rotX, rotY]);

  // Random sparkles
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    x: 5 + Math.random() * 90, y: 5 + Math.random() * 90,
    size: Math.random() * 2.5 + 1.5,
    delay: Math.random() * 3,
    id: i,
  }));

  return (
    <motion.div
      ref={statsRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4"
    >
      <motion.div
        ref={panelRef}
        onMouseMove={handlePanelMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handlePanelLeave}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
          perspective: 1200,
        }}
        whileHover={{ y: -10, transition: { duration: 0.35 } }}
        className="relative w-full overflow-hidden cursor-default"
      >
        {/* The glass card */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            borderRadius: '24px',
            background: isDark
              ? 'rgba(8,19,15,0.55)'
              : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(61,184,107,0.15)',
            boxShadow: hovered
              ? isDark
                ? '0 30px 80px rgba(61,184,107,0.10), 0 0 0 1px rgba(61,184,107,0.22), inset 0 1px 0 rgba(255,255,255,0.07)'
                : '0 30px 80px rgba(61,184,107,0.12), 0 0 0 1px rgba(61,184,107,0.22), inset 0 1px 0 rgba(255,255,255,0.85)'
              : isDark
                ? '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.80)',
            transition: 'box-shadow 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          {/* Glass reflection strip at very top */}
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: isDark
              ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(61,184,107,0.3) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(61,184,107,0.4) 50%, rgba(255,255,255,0.9) 60%, transparent 100%)'
            }} />

          {/* Hover top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.8), rgba(125,226,160,0.6), rgba(61,184,107,0.8), transparent)',
            }} />

          {/* Ambient large background glow blobs */}
          <motion.div className="absolute pointer-events-none"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            style={{ top: '-60%', left: '-10%', width: '400px', height: '400px',
              background: 'radial-gradient(circle, rgba(61,184,107,0.09) 0%, transparent 65%)', filter: 'blur(40px)' }} />
          <motion.div className="absolute pointer-events-none"
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 7.5, delay: 1.5, ease: 'easeInOut' }}
            style={{ bottom: '-60%', right: '10%', width: '350px', height: '350px',
              background: 'radial-gradient(circle, rgba(78,204,163,0.07) 0%, transparent 65%)', filter: 'blur(50px)' }} />

          {/* Faint grain texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }} />

          {/* Floating sparkles */}
          {sparkles.map(sp => <Sparkle key={sp.id} {...sp} />)}

          {/* Cursor-follow radial glow */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              x: glowOffsetX,
              y: glowOffsetY,
              width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(61,184,107,0.08) 0%, transparent 70%)',
              filter: 'blur(20px)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* Faint botanical leaf silhouettes */}
          <svg className="absolute right-8 top-0 bottom-0 h-full opacity-[0.04] pointer-events-none" viewBox="0 0 120 240" fill="none">
            <path d="M60 220 C30 180 10 140 20 100 C30 60 60 40 60 20 C60 40 90 60 100 100 C110 140 90 180 60 220Z" fill="currentColor" className="text-[#3DB86B]"/>
            <path d="M40 200 C20 170 15 130 25 95 C35 60 55 45 55 25" stroke="currentColor" className="text-[#3DB86B]" strokeWidth="0.8" fill="none"/>
            <path d="M80 200 C100 170 105 130 95 95 C85 60 65 45 65 25" stroke="currentColor" className="text-[#3DB86B]" strokeWidth="0.8" fill="none"/>
            <path d="M35 150 Q60 130 85 150" stroke="currentColor" className="text-[#3DB86B]" strokeWidth="0.6" fill="none" opacity="0.6"/>
            <path d="M28 120 Q60 100 92 120" stroke="currentColor" className="text-[#3DB86B]" strokeWidth="0.6" fill="none" opacity="0.5"/>
          </svg>

          {/* Stats content — horizontal layout */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x"
            style={{ divideColor: 'rgba(61,184,107,0.10)' }}>
            {STAT_DATA.map((s, i) => {
              const displayCount = i === 2
                ? (counts[i] >= 1000 ? '1k' : counts[i])
                : counts[i];
              return (
                <div key={i} className="group/stat relative flex-1 flex flex-col justify-between p-10 sm:p-12 overflow-hidden"
                  style={{ borderRight: i < 2 ? '1px solid rgba(61,184,107,0.10)' : 'none' }}>
                  {/* Breathing radial glow behind number */}
                  <motion.div
                    className="absolute pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ repeat: Infinity, duration: 4 + i * 0.7, ease: 'easeInOut' }}
                    style={{
                      top: '10%', left: '-10%',
                      width: '260px', height: '180px',
                      background: 'radial-gradient(ellipse, rgba(61,184,107,1) 0%, transparent 70%)',
                      filter: 'blur(50px)',
                    }}
                  />

                  {/* Glowing divider line (vertical on desktop) */}
                  {i > 0 && (
                    <div className="hidden sm:block absolute left-0 top-8 bottom-8 w-[1px]"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(61,184,107,0.25) 40%, rgba(61,184,107,0.25) 60%, transparent)' }} />
                  )}

                  <div className="relative z-10 flex flex-col gap-4">
                    {/* Tiny glowing dot beside title */}
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, ease: 'easeInOut' }}
                        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                        style={{ background: '#3DB86B', boxShadow: '0 0 6px rgba(61,184,107,0.8)' }}
                      />
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: isDark ? 'rgba(61,184,107,0.70)' : 'rgba(31,120,70,0.70)',
                      }}>
                        {i === 0 ? 'Literature' : i === 1 ? 'Editions' : 'Community'}
                      </span>
                    </div>

                    {/* THE NUMBER — primary visual element */}
                    <motion.div
                      animate={hovered ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(64px, 6vw, 88px)',
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        background: 'linear-gradient(135deg, #4ECCA3 0%, #3DB86B 45%, #2AAF5D 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: isDark
                          ? 'drop-shadow(0 0 20px rgba(61,184,107,0.35))'
                          : 'drop-shadow(0 0 12px rgba(61,184,107,0.25))',
                      }}
                    >
                      {displayCount}{s.suffix}
                    </motion.div>

                    {/* Label — high contrast */}
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: '20px',
                      letterSpacing: '-0.01em',
                      color: isDark ? 'rgba(234,244,238,0.92)' : 'rgba(15,35,25,0.88)',
                      marginTop: '-4px',
                    }}>
                      {s.label}
                    </div>

                    {/* Description — 65% opacity */}
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: '15px',
                      color: isDark ? 'rgba(155,179,166,0.65)' : 'rgba(60,90,75,0.65)',
                      lineHeight: 1.6,
                    }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */
export const FeaturesAndStats = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  // Mouse-follow glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const glowLeft = useTransform(glowX, v => v - 200);
  const glowTop  = useTransform(glowY, v => v - 200);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 5,
    id: i,
  }));

  // Count-up values
  const count0 = useCountUp(STATS[0].target, statsInView);
  const count1 = useCountUp(STATS[1].target, statsInView);
  const count2 = useCountUp(STATS[2].target, statsInView);
  const counts = [count0, count1, count2];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{
        // Dark: solid #070E0B — identical to hero, so sections blend seamlessly
        // Light: warm cream gradient
        background: isDark
          ? '#070E0B'
          : 'linear-gradient(180deg, #F4F1EA 0%, #EFF5F0 50%, #F4F1EA 100%)',
        padding: '100px 16px 80px',
      }}
    >

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => <Particle key={p.id} {...p} />)}
      </div>

      {/* Large emerald blobs */}
      <div className="absolute pointer-events-none -top-40 left-1/4 w-[700px] h-[500px] rounded-full opacity-100"
        style={{ background: 'radial-gradient(ellipse, rgba(61,184,107,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute pointer-events-none bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(61,184,107,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(78,204,163,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Radial spotlight */}
      <div className="absolute pointer-events-none inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(61,184,107,0.04) 0%, transparent 65%)' }} />

      {/* Vignette */}
      <div className="absolute pointer-events-none inset-0"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(7,14,11,0.25) 100%)' }} />

      {/* Mouse-follow glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          x: glowLeft,
          y: glowTop,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(61,184,107,0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-5"
            style={{
              color: '#3DB86B',
              background: 'rgba(61,184,107,0.10)',
              border: '1px solid rgba(61,184,107,0.20)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Why Srishtipadham
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: isDark ? '#ffffff' : '#1F3E2F',
              marginBottom: '16px',
              lineHeight: 1.1,
            }}
          >
            Built for <span style={{ color: '#3DB86B' }}>Readers</span> &amp; Writers
          </h2>
          <p style={{
            color: isDark ? 'rgba(155,179,166,1)' : 'rgba(91,117,102,1)',
            fontSize: '18px',
            maxWidth: '480px',
            margin: '0 auto',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
          }}>
            Where literature, nature, and community converge.
          </p>
        </motion.div>

        {/* ─── Feature cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20 px-4">
          {FEATURES.map((feat, i) => (
          <FeatureCard key={i} feat={feat} index={i} isDark={isDark} />
        ))}
        </div>

        {/* ─── Premium Stats Panel — single long glass card ─── */}
        <StatsPanel statsRef={statsRef} counts={counts} isDark={isDark} />
      </div>        {/* end max-w container */}
    </section>
  );
};
