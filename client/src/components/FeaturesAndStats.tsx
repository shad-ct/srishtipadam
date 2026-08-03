import { useRef, useState, useEffect } from 'react';
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
    label: 'Promoting Malayalam Literature',
    desc: 'Dedicated to celebrating and preserving the richness of Malayalam language and literary heritage through books, magazines, and cultural events.',
    color: '#3DB86B',
    iconPath: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
  },
  {
    label: 'Empowering Writers',
    desc: 'Publishing books through Srishtipadham Publications, running a monthly digital magazine, and hosting literary competitions to uplift emerging poets and authors.',
    color: '#4ECCA3',
    iconPath: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  },
  {
    label: 'A Statewide Community',
    desc: 'With district units across Kerala, a YouTube channel, and 20,000+ members, Srishtipadham is a thriving platform for creative voices of all ages.',
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


/* ─── Stats card icons ───────────────────────────────────────────────────── */
const STAT_CARDS = [
  {
    num: 75, suffix: '+', label: 'Books Published', sublabel: 'Srishtipadham Publications',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    num: 20000, suffix: '+', label: 'Community Members', sublabel: 'Writers & readers across Kerala',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: 51, suffix: '-Day', label: 'Poetry Challenge', sublabel: 'Signature literary competition',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    num: 12, suffix: '/yr', label: 'Digital Magazines', sublabel: 'Monthly literary edition',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
];

/* ─── Single stat card ───────────────────────────────────────────────────── */
function StatCard({ card, index, statsInView }: { card: typeof STAT_CARDS[0]; index: number; statsInView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!statsInView) return;
    let start = 0;
    const duration = 1800;
    const step = card.num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= card.num) { setCount(card.num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [statsInView, card.num]);

  const display = card.num >= 10000
    ? (count >= 1000 ? `${Math.floor(count / 1000)}k` : count)
    : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={statsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative rounded-3xl p-7 text-center cursor-default"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(61,184,107,0.13)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: '0 0 40px rgba(61,184,107,0.10)' }} />
      {/* Top shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.5), transparent)' }} />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#3DB86B] transition-transform duration-300 group-hover:rotate-6"
        style={{ background: 'rgba(61,184,107,0.10)', border: '1px solid rgba(61,184,107,0.2)' }}
      >
        {card.icon}
      </div>

      {/* Number */}
      <div
        className="text-[#1F3E2F] dark:text-white mb-1"
        style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {display}{card.suffix}
      </div>

      {/* Label */}
      <p
        className="dark:text-[rgba(155,179,166,0.75)]"
        style={{ fontSize: '14px', color: 'rgba(31,62,47,0.75)', fontWeight: 600, marginTop: '8px', lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {card.label}
      </p>

      {/* Sublabel */}
      <p
        className="dark:text-[rgba(155,179,166,0.5)]"
        style={{ fontSize: '12px', color: 'rgba(91,117,102,0.6)', fontWeight: 400, marginTop: '4px', lineHeight: 1.4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {card.sublabel}
      </p>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export const FeaturesAndStats = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section
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
            Founded <span style={{ color: '#3DB86B' }}>2018</span> · Growing Every Day
          </h2>
          <p style={{
            color: isDark ? 'rgba(155,179,166,1)' : 'rgba(91,117,102,1)',
            fontSize: '18px',
            maxWidth: '520px',
            margin: '0 auto',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            lineHeight: 1.7,
          }}>
            From a Facebook literary community to one of Kerala's growing literary organizations — promoting Malayalam language, literature, and creativity.
          </p>
        </motion.div>

        {/* ─── Feature cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20 px-4">
          {FEATURES.map((feat, i) => (
          <FeatureCard key={i} feat={feat} index={i} isDark={isDark} />
        ))}
        </div>

        {/* ─── Stats grid — 4 cards matching About page ─── */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5 px-4">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={i} card={card} index={i} statsInView={statsInView} />
          ))}
        </div>
      </div>        {/* end max-w container */}
    </section>
  );
};
