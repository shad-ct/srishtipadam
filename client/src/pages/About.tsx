import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

/* ─── Animated Counter ───────────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Timeline Data ──────────────────────────────────────────────────────── */
const milestones = [
  {
    year: '2018',
    title: 'Founded',
    titleMl: 'ആരംഭം',
    desc: 'Started as a Facebook literary community bringing together writers and readers across Kerala.',
    descMl: 'കേരളത്തിലെ എഴുത്തുകാരെയും വായനക്കാരെയും ഒന്നിപ്പിക്കുന്നതിനായി ഒരു ഫേസ്ബുക്ക് സാഹിത്യ കൂട്ടായ്മയായി ആരംഭിച്ചു.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    year: '2021',
    title: 'Official Registration',
    titleMl: 'ഔദ്യോഗിക രജിസ്ട്രേഷൻ',
    desc: 'Registered as a literary and cultural organization, gaining formal recognition.',
    descMl: 'ഒരു സാഹിത്യ-സാംസ്കാരിക സംഘടനയായി രജിസ്റ്റർ ചെയ്യുകയും ഔദ്യോഗിക അംഗീകാരം നേടുകയും ചെയ്തു.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 12l2 2 4-4"/>
        <path d="M8 7h8M8 17h4"/>
      </svg>
    ),
  },
  {
    year: '2023',
    title: 'District Expansion',
    titleMl: 'ജില്ലാ വ്യാപ്തി',
    desc: 'District units established across Kerala, forming a statewide literary network.',
    descMl: 'കേരളത്തിലുടനീളം ജില്ലാ ഘടകങ്ങൾ സ്ഥാപിക്കുകയും സംസ്ഥാനവ്യാപകമായ സാഹിത്യ ശൃംഖല രൂപീകരിക്കുകയും ചെയ്തു.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    year: '2025',
    title: 'Printed Quarterly Magazine',
    titleMl: 'ത്രൈമാസിക',
    desc: 'First printed quarterly magazine officially launched, marking a new chapter in publishing.',
    descMl: 'ആദ്യത്തെ അച്ചടിച്ച ത്രൈമാസിക പതിപ്പ് ഔദ്യോഗികമായി പുറത്തിറക്കി, പ്രസിദ്ധീകരണ രംഗത്ത് പുതിയ അധ്യായം കുറിച്ചു.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    year: 'Present',
    title: 'Growing Every Day',
    titleMl: 'ദിനംപ്രതി വളരുന്നു',
    desc: 'Publications, Digital Magazine, YouTube, literary competitions, and a thriving statewide community.',
    descMl: 'നിരവധി പുസ്തകങ്ങൾ, ഡിജിറ്റൽ മാഗസിൻ, യൂട്യൂബ് ചാനൽ, സാഹിത്യ മത്സരങ്ങൾ, ഒപ്പം സജീവമായ ഒരു വലിയ സംസ്ഥാനവ്യാപക കൂട്ടായ്മ.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
  },
];

/* ─── Highlight Cards ────────────────────────────────────────────────────── */
const highlights = [
  {
    num: 75, suffix: '+',
    label: 'Books Published',
    labelMl: 'പ്രസിദ്ധീകരിച്ച പുസ്തകങ്ങൾ',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    num: 20000, suffix: '+',
    label: 'Community Members',
    labelMl: 'കൂട്ടായ്മയിലെ അംഗങ്ങൾ',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: 51, suffix: '-Day',
    label: 'Signature Poetry Challenge',
    labelMl: 'കവിതാ മത്സരം',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    num: 12, suffix: '/yr',
    label: 'Monthly Digital Magazine',
    labelMl: 'മാസിക ഡിജിറ്റൽ പതിപ്പുകൾ',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
];

/* ─── Social Links ───────────────────────────────────────────────────────── */
const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/groups/211210942820900/',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/srishtipadham_publications?igsh=cXhrbjM3Z200bWpi',
    color: '#E1306C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@srishtipadhammedia9488?si=l7WIFFYR6IMdGhUJ',
    color: '#FF0000',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:srishtipadham@gmail.com',
    color: '#EA4335',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

/* ─── Timeline vertical line (desktop center / mobile left) ──────────── */
function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  return (
    <div ref={ref} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ zIndex: 0 }}>
      {/* Faint track */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(61,184,107,0.15) 8%, rgba(61,184,107,0.15) 92%, transparent)' }} />
      {/* Scroll-driven fill */}
      <motion.div
        className="absolute top-0 left-0 w-full origin-top"
        style={{
          scaleY,
          background: 'linear-gradient(to bottom, rgba(61,184,107,0.9), rgba(61,184,107,0.4))',
          boxShadow: '0 0 8px rgba(61,184,107,0.7)',
          height: '100%',
        }}
      />
    </div>
  );
}

/* ─── Single Timeline Card ─────────────────────────────────────── */
const GlassCard = ({ children, inView, fromLeft }: { children: React.ReactNode; inView: boolean; fromLeft: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -5, transition: { duration: 0.28 } }}
    className="group relative rounded-3xl p-5 sm:p-6 cursor-default w-full"
    style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(61,184,107,0.15)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    }}
  >
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ boxShadow: '0 0 40px rgba(61,184,107,0.12), inset 0 0 20px rgba(61,184,107,0.04)' }} />
    <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.6), transparent)' }} />
    {children}
  </motion.div>
);

const MilestoneNode = ({ inView, icon }: { inView: boolean; icon: React.ReactNode }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={inView ? { scale: 1, opacity: 1 } : {}}
    transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 220 }}
    className="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 bg-white/95 dark:bg-[#070e0b]/95"
    style={{
      border: '1.5px solid rgba(61,184,107,0.45)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 0 18px rgba(61,184,107,0.28)',
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full"
      style={{ background: 'rgba(61,184,107,0.2)' }}
    />
    <span className="text-[#3DB86B] relative z-10" style={{ transform: 'scale(0.85)' }}>{icon}</span>
  </motion.div>
);

const CardContent = ({ m }: { m: typeof milestones[0] }) => {
  const { i18n } = useTranslation();
  const isMl = i18n.language === 'ml';
  const title = isMl ? m.titleMl : m.title;
  const desc = isMl ? m.descMl : m.desc;
  const yearLabel = isMl && m.year === 'Present' ? 'നിലവിൽ' : m.year;

  return (
    <>
      <span
        className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3"
        style={{ background: 'rgba(61,184,107,0.12)', border: '1px solid rgba(61,184,107,0.25)', color: '#3DB86B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {yearLabel}
      </span>
      <h3
        className="text-[#1F3E2F] dark:text-white font-bold text-base sm:text-lg mb-2 leading-tight"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[#5B7566] dark:text-[#9CB3A6]">
        {desc}
      </p>
    </>
  );
};

function MilestoneCard({ m, index }: { m: typeof milestones[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} style={{ marginBottom: '48px' }}>

      {/* ── MOBILE: vertical line on left + node + connector + card ── */}
      <div className="flex md:hidden items-start">
        {/* Node column — fixed 40px to align with the left line */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
          <MilestoneNode inView={inView} icon={m.icon} />
        </div>

        {/* Horizontal connector from node to card */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
          className="origin-left flex-shrink-0"
          style={{
            width: '14px',
            height: '1px',
            marginTop: '20px',
            background: 'linear-gradient(90deg, rgba(61,184,107,0.6), rgba(61,184,107,0.15))',
          }}
        />

        {/* Card */}
        <div className="flex-1 min-w-0">
          <GlassCard inView={inView} fromLeft={true}>
            <CardContent m={m} />
          </GlassCard>
        </div>
      </div>

      {/* ── DESKTOP: alternating two-column layout ─────────────────── */}
      <div className="hidden md:grid md:grid-cols-2 items-center relative" style={{ minHeight: '120px' }}>

        {/* Left slot */}
        <div className="flex justify-end items-center pr-10">
          {isLeft ? (
            <>
              <div className="max-w-sm w-full">
                <GlassCard inView={inView} fromLeft={true}>
                  <CardContent m={m} />
                </GlassCard>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="origin-right h-px flex-shrink-0"
                style={{ width: '36px', background: 'linear-gradient(90deg, rgba(61,184,107,0.15), rgba(61,184,107,0.55))' }}
              />
            </>
          ) : null}
        </div>

        {/* Center node */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20">
          <MilestoneNode inView={inView} icon={m.icon} />
        </div>

        {/* Right slot */}
        <div className="flex justify-start items-center pl-10">
          {!isLeft ? (
            <>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="origin-left h-px flex-shrink-0"
                style={{ width: '36px', background: 'linear-gradient(90deg, rgba(61,184,107,0.55), rgba(61,184,107,0.15))' }}
              />
              <div className="max-w-sm w-full">
                <GlassCard inView={inView} fromLeft={false}>
                  <CardContent m={m} />
                </GlassCard>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}



/* ─── WhatsApp District Card ─────────────────────────────────────────────── */
function DistrictCard({ group, onCardClick }: { group: any; onCardClick: (g: any) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onCardClick(group)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.06, y: -8, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
      className="relative cursor-pointer flex flex-col items-center overflow-hidden select-none"
      style={{
        borderRadius: '20px',
        paddingTop: '22px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '42px',
        background: 'rgba(255,255,255,0.07)',
        border: hovered ? '1px solid rgba(61,184,107,0.5)' : '1px solid rgba(61,184,107,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: hovered
          ? '0 20px 60px rgba(61,184,107,0.18), 0 0 0 1px rgba(61,184,107,0.12)'
          : '0 8px 32px rgba(0,0,0,0.10)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        minHeight: '160px',
      }}
    >
      {/* Cursor-follow radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-400 rounded-[20px]"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(61,184,107,0.12) 0%, transparent 65%)`,
        }}
      />

      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full pointer-events-none transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.8), transparent)',
        }}
      />

      {/* District icon */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-all duration-400"
        style={{
          background: hovered ? 'rgba(61,184,107,0.18)' : 'rgba(61,184,107,0.09)',
          border: '1px solid rgba(61,184,107,0.22)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3DB86B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>

      {/* District name */}
      <p
        className="text-[#1F3E2F] dark:text-white font-bold text-center leading-tight mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', letterSpacing: '-0.01em' }}
      >
        {group.district}
      </p>
      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', color: '#3DB86B', textTransform: 'uppercase' }}>
        District Unit
      </p>

      {/* WhatsApp icon fade in on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.3 }}
        className="absolute top-3 right-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.96 9.96 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.99-9.985A9.99 9.99 0 0 0 12.012 2zm4.957 14.238c-.273.767-1.561 1.405-2.146 1.483-.518.069-1.196.128-3.418-.79-2.842-1.173-4.673-4.057-4.814-4.244-.143-.186-1.144-1.52-1.144-2.9 0-1.38.718-2.06 1.023-2.358.304-.298.665-.373.886-.373.22 0 .443.003.638.012.2.01.472-.075.738.566.27.653.924 2.257 1.003 2.418.08.162.133.35.025.567-.108.217-.162.35-.325.538-.162.186-.34.417-.487.56-.162.155-.33.324-.14.653.19.324.843 1.393 1.807 2.253.963.86 1.77 1.127 2.09 1.286.32.16.507.133.696-.084.19-.217.81-.94.945-1.263.136-.324.27-.27.457-.2.187.072 1.186.56 1.39.66.204.1.34.15.39.233.05.084.05.483-.223 1.25z"/>
        </svg>
      </motion.div>

      {/* Slide-up "Contact Admin" label */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 py-2 rounded-b-[20px]"
        style={{ background: 'rgba(61,184,107,0.12)', borderTop: '1px solid rgba(61,184,107,0.2)' }}
      >
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#3DB86B', letterSpacing: '0.08em' }}>
          CONTACT ADMIN
        </span>
        <motion.span
          animate={{ x: hovered ? 2 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: '#3DB86B' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ─── District Modal ─────────────────────────────────────────────────────── */
function DistrictModal({ group, onClose }: { group: any; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const hasNumber = group.whatsappNumber && group.whatsappNumber.trim() !== '';
  const waLink = hasNumber ? `https://wa.me/91${group.whatsappNumber}` : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(7,14,11,0.55)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden cursor-default bg-white dark:bg-[#0f1c14]"
        style={{
          borderRadius: '28px',
          border: '1px solid rgba(61,184,107,0.25)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.2), 0 0 60px rgba(61,184,107,0.06)',
          padding: '36px 32px 28px',
        }}
      >
        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(61,184,107,0.2) 0%, transparent 70%)' }} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* WhatsApp icon */}
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 relative"
          style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute inset-0 rounded-3xl"
            style={{ background: 'rgba(37,211,102,0.15)' }}
          />
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#25D366">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.96 9.96 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.99-9.985A9.99 9.99 0 0 0 12.012 2zm4.957 14.238c-.273.767-1.561 1.405-2.146 1.483-.518.069-1.196.128-3.418-.79-2.842-1.173-4.673-4.057-4.814-4.244-.143-.186-1.144-1.52-1.144-2.9 0-1.38.718-2.06 1.023-2.358.304-.298.665-.373.886-.373.22 0 .443.003.638.012.2.01.472-.075.738.566.27.653.924 2.257 1.003 2.418.08.162.133.35.025.567-.108.217-.162.35-.325.538-.162.186-.34.417-.487.56-.162.155-.33.324-.14.653.19.324.843 1.393 1.807 2.253.963.86 1.77 1.127 2.09 1.286.32.16.507.133.696-.084.19-.217.81-.94.945-1.263.136-.324.27-.27.457-.2.187.072 1.186.56 1.39.66.204.1.34.15.39.233.05.084.05.483-.223 1.25z"/>
          </svg>
        </div>

        {/* District name */}
        <h3 className="text-[#1F3E2F] dark:text-white text-center font-extrabold mb-1"
          style={{ fontSize: '22px', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {group.district}
        </h3>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#3DB86B', textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px' }}>
          District WhatsApp Unit
        </p>

        {/* Welcome message */}
        <p className="text-center mb-6 text-[#5B7566] dark:text-[#9CB3A6]" style={{ fontSize: '14px', lineHeight: 1.6 }}>
          Connect with our {group.district} district admin to join the local writers' community and participate in literary activities.
        </p>

        {/* CTA */}
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 24px rgba(37,211,102,0.25)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.96 9.96 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.99-9.985A9.99 9.99 0 0 0 12.012 2zm4.957 14.238c-.273.767-1.561 1.405-2.146 1.483-.518.069-1.196.128-3.418-.79-2.842-1.173-4.673-4.057-4.814-4.244-.143-.186-1.144-1.52-1.144-2.9 0-1.38.718-2.06 1.023-2.358.304-.298.665-.373.886-.373.22 0 .443.003.638.012.2.01.472-.075.738.566.27.653.924 2.257 1.003 2.418.08.162.133.35.025.567-.108.217-.162.35-.325.538-.162.186-.34.417-.487.56-.162.155-.33.324-.14.653.19.324.843 1.393 1.807 2.253.963.86 1.77 1.127 2.09 1.286.32.16.507.133.696-.084.19-.217.81-.94.945-1.263.136-.324.27-.27.457-.2.187.072 1.186.56 1.39.66.204.1.34.15.39.233.05.084.05.483-.223 1.25z"/>
            </svg>
            Contact the Admin
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '13px', color: 'rgba(155,179,166,0.6)' }}>Admin contact not yet assigned</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── WhatsApp Floating Particle ─────────────────────────────────────────── */
function WaParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: 'rgba(37,211,102,0.12)' }}
      animate={{ y: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── WhatsApp Community Section ─────────────────────────────────────────── */
function WhatsAppCommunitySection() {
  const { data: districts, isLoading } = useQuery({
    queryKey: ['districtGroups'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/district-groups');
      return data;
    }
  });

  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const particles = [
    { delay: 0, x: 5, y: 20, size: 6 },
    { delay: 1.2, x: 90, y: 10, size: 8 },
    { delay: 0.6, x: 15, y: 75, size: 5 },
    { delay: 2, x: 80, y: 60, size: 7 },
    { delay: 1.8, x: 50, y: 5, size: 4 },
    { delay: 0.3, x: 70, y: 85, size: 6 },
    { delay: 2.5, x: 30, y: 90, size: 5 },
  ];

  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(61,184,107,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        {/* Botanical line illustration */}
        <svg className="absolute bottom-10 left-0 opacity-[0.04]" width="300" height="300" viewBox="0 0 300 300" fill="none">
          <path d="M10 290 Q80 200 150 150 Q220 100 290 10" stroke="#3DB86B" strokeWidth="1"/>
          <path d="M10 250 Q70 180 130 140 Q190 100 250 40" stroke="#3DB86B" strokeWidth="0.8"/>
          <path d="M50 290 Q100 230 150 200" stroke="#3DB86B" strokeWidth="0.6"/>
          <circle cx="150" cy="150" r="3" fill="#3DB86B"/>
          <circle cx="80" cy="220" r="2" fill="#3DB86B"/>
          <circle cx="220" cy="80" r="2" fill="#3DB86B"/>
        </svg>
        <svg className="absolute top-10 right-0 opacity-[0.04]" width="240" height="240" viewBox="0 0 240 240" fill="none">
          <path d="M230 10 Q160 100 120 120 Q80 140 10 230" stroke="#3DB86B" strokeWidth="1"/>
          <path d="M230 50 Q170 120 130 140 Q90 160 30 230" stroke="#3DB86B" strokeWidth="0.8"/>
          <circle cx="120" cy="120" r="3" fill="#3DB86B"/>
        </svg>
        {/* Floating particles */}
        {particles.map((p, i) => <WaParticle key={i} {...p} />)}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#25D366] mb-5 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.22)' }}>
            Community
          </span>
          <h2 className="text-[#1F3E2F] dark:text-white mb-4"
            style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Our <span style={{ color: '#25D366' }}>WhatsApp</span> Community
          </h2>
          {/* Pull quote subtitle */}
          <p className="mx-auto max-w-2xl mb-6 italic text-[#5B7566] dark:text-[#9CB3A6]"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', fontFamily: 'Georgia, serif', lineHeight: 1.65 }}>
            "Connecting writers across Kerala through daily literary discussions, competitions, mentorship, and creative collaboration."
          </p>
          <p className="mx-auto max-w-2xl text-[#5B7566] dark:text-[#9CB3A6]" style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.8 }}>
            Our WhatsApp Community is a vibrant space where aspiring and experienced writers come together to learn, improve, and share their creativity. Members participate in daily literary discussions, receive writing guidance, and take part in various poetry and writing competitions organized throughout the year.
          </p>
        </motion.div>

        {/* District Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-[#9CB3A6]">Loading district groups...</div>
        ) : districts && districts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {districts.map((group: any, i: number) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <DistrictCard group={group} onCardClick={setSelectedGroup} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#9CB3A6]">
            District groups will appear here once added by the admin.
          </div>
        )}
      </div>

      {/* District Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <DistrictModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Facebook Community Section ─────────────────────────────────────────── */
function FacebookCommunitySection() {
  return (
    <section className="relative px-6 py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(24,119,242,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(24,119,242,0.15)',
            backdropFilter: 'blur(20px)',
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: Facebook icon + glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative shrink-0"
            >
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
                style={{ background: 'rgba(24,119,242,0.12)', border: '1px solid rgba(24,119,242,0.25)' }}>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: 'rgba(24,119,242,0.15)' }}
                />
                <svg width="42" height="42" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </motion.div>

            {/* Right: content */}
            <div className="flex-1 text-center md:text-left flex flex-col gap-4">
              <h2 className="text-[#1F3E2F] dark:text-white"
                style={{ fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Our <span style={{ color: '#1877F2' }}>Facebook</span> Community
              </h2>
              <p className="text-[#5B7566] dark:text-[#9CB3A6]" style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.8 }}>
                Our Facebook Community is a welcoming platform where writers can share their literary works with thousands of readers. Once your request to join is approved by our administrators, you can publish your writings while following the community guidelines.
              </p>
              <p className="text-[#5B7566]/80 dark:text-[#9CB3A6]/80" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.75 }}>
                We regularly organize poetry competitions, creative writing activities, and literary discussions that encourage writers to improve their skills and receive recognition for outstanding contributions.
              </p>

              {/* CTA button */}
              <div className="flex justify-center md:justify-start mt-2">
                <motion.a
                  href="https://www.facebook.com/groups/211210942820900/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-white text-[15px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1877F2 0%, #0d5bcc 100%)',
                    boxShadow: '0 8px 28px rgba(24,119,242,0.28)',
                  }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out" />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Join Our Facebook Community</span>
                  <motion.span
                    animate={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.25 }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </motion.span>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const About = () => {
  const { i18n } = useTranslation();
  const isMl = i18n.language === 'ml';

  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed top-0 left-1/3 w-[700px] h-[500px] rounded-full opacity-100"
        style={{ background: 'radial-gradient(ellipse, rgba(61,184,107,0.06) 0%, transparent 65%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(44,196,120,0.04) 0%, transparent 65%)', filter: 'blur(100px)', zIndex: 0 }} />

      <div className="relative z-10">

        {/* ── SECTION HEADER ───────────────────────────────────────── */}
        <section className="pt-36 pb-24 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-2 h-2 rounded-full bg-[#3DB86B]" style={{ boxShadow: '0 0 8px rgba(61,184,107,0.9)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3DB86B' }}>
                {isMl ? 'ഞങ്ങൾ ആരാണ്' : 'Who We Are'}
              </span>
            </div>
            <h1 className="text-[#1F3E2F] dark:text-white mb-6"
              style={{ fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              About <span style={{ color: '#3DB86B' }}>Srishtipadham</span>
            </h1>
            <p className="max-w-2xl mx-auto dark:!text-[rgba(155,179,166,0.75)]" style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(91,117,102,0.85)', fontWeight: 400 }}>
              {isMl
                ? 'എഴുത്തുകാരെ പിന്തുണയ്ക്കാനും മലയാള സാഹിത്യം പ്രോത്സാഹിപ്പിക്കാനുമായി ആരംഭിച്ച സാംസ്കാരിക കൂട്ടായ്മയാണ് സൃഷ്ടിപഥം. ഏറ്റവും കുറഞ്ഞ ചെലവിൽ മികച്ച ഗുണമേന്മയോടെ സാധാരണക്കാരായ എഴുത്തുകാരുടെ പുസ്തകങ്ങൾ പ്രസിദ്ധീകരിച്ചുകൊണ്ട് പബ്ലിക്കേഷൻസ് രംഗത്തും ഞങ്ങൾ സജീവമാണ്.'
                : "From a humble Facebook literary community to one of Kerala's growing literary organizations, empowering writers and preserving Malayalam literature."}
            </p>
          </motion.div>
        </section>

        {/* ── OUR JOURNEY TIMELINE ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-[#1F3E2F] dark:text-white"
                style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.025em' }}>
                {isMl ? 'ഞങ്ങളുടെ യാത്ര' : 'Our Journey'}
              </h2>
              <div className="mt-3 mx-auto w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.6), transparent)' }} />
            </motion.div>

            {/* Timeline — left-side line on mobile, center line on desktop */}
            <div className="relative">
              {/* Mobile line: left=20px (center of 40px node col) */}
              <div className="md:hidden">
                <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '1px', zIndex: 0,
                  background: 'linear-gradient(to bottom, transparent, rgba(61,184,107,0.5) 5%, rgba(61,184,107,0.5) 95%, transparent)',
                  boxShadow: '0 0 6px rgba(61,184,107,0.3)' }} />
              </div>
              {/* Desktop line: center */}
              <div className="hidden md:block">
                <TimelineLine />
              </div>
              {milestones.map((m, i) => (
                <MilestoneCard key={m.year} m={m} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR STORY + MOTTO ────────────────────────────────────── */}
        <section className="px-6 pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-[#1F3E2F] dark:text-white mb-6"
                style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.025em' }}>
                {isMl ? 'ഞങ്ങളുടെ ചരിത്രം' : 'Our Story'}
              </h2>
              <p style={{ fontSize: '17px', lineHeight: 1.85, color: 'rgba(91,117,102,0.85)', fontWeight: 400 }}
                className="dark:!text-[rgba(155,179,166,0.75)] mb-14">
                {isMl
                  ? 'സ്വന്തം അക്ഷരങ്ങൾക്ക് അച്ചടിമഷി പുരളുക എന്ന എഴുത്തുകാരുടെ സ്വപ്നം സാക്ഷാത്കരിക്കാൻ സാധാരണക്കാരന്റെ സ്വന്തം പബ്ലിക്കേഷനായി നിലകൊള്ളുന്നതാണ് സൃഷ്ടിപഥം പബ്ലിക്കേഷൻസ്. ഏറ്റവും കുറഞ്ഞ ചെലവിൽ മികച്ച ഗുണമേന്മയിൽ ഇതിനോടകം 75-ൽ പരം പുസ്തകങ്ങൾ പ്രകാശനം ചെയ്യാൻ ഞങ്ങൾക്ക് സാധിച്ചിട്ടുണ്ട്. ഈ നീണ്ട ഏഴ് വർഷത്തെ യാത്രയിൽ കേരളത്തിലുടനീളമുള്ള ഒരുപറ്റം സാരഥികളുടെ അക്ഷീണമായ പ്രവർത്തനങ്ങളും, വായനക്കാരായ നിങ്ങളുടെ സ്നേഹവുമാണ് സൃഷ്ടിപഥത്തിന്റെ വിജയത്തിന്റെ രഹസ്യം.'
                  : 'Srishtipadham is a literary organization dedicated to nurturing creativity and promoting Malayalam language and literature. Founded in 2018, it has grown from a Facebook literary community into a vibrant platform connecting thousands of writers, readers, and literature enthusiasts across Kerala.'}
              </p>
            </motion.div>

            {/* Motto quotation block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto rounded-3xl p-6 sm:p-10 text-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(61,184,107,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(61,184,107,0.06)',
                maxWidth: '560px',
              }}
            >
              {/* Emerald left accent line */}
              <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(61,184,107,0.7), transparent)' }} />
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.4), transparent)' }} />

              {/* Floating quote marks */}
              <div className="absolute -top-4 left-4 sm:left-8 text-5xl sm:text-6xl leading-none select-none pointer-events-none"
                style={{ color: 'rgba(61,184,107,0.2)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</div>
              <div className="absolute -bottom-7 right-4 sm:right-8 text-5xl sm:text-6xl leading-none select-none pointer-events-none rotate-180"
                style={{ color: 'rgba(61,184,107,0.2)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</div>

              <p className="text-[#1F3E2F] dark:text-white mb-4 leading-relaxed text-lg sm:text-[22px]"
                style={{ fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'Georgia, serif' }}>
                സർഗ്ഗാത്മകതയ്ക്കൊരു സമഗ്രാവിഷ്കാരം
              </p>
              <p style={{ fontSize: '12px', sm: '14px', color: 'rgba(61,184,107,0.85)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                A Complete Expression of Creativity
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── QUICK HIGHLIGHTS ─────────────────────────────────────── */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="text-[#1F3E2F] dark:text-white"
                style={{ fontWeight: 800, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.025em' }}>
                By the Numbers
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative rounded-3xl p-5 sm:p-7 text-center cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(61,184,107,0.13)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 0 40px rgba(61,184,107,0.10)' }} />
                  <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(61,184,107,0.5), transparent)' }} />

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#3DB86B] transition-transform duration-300 group-hover:rotate-6"
                    style={{ background: 'rgba(61,184,107,0.10)', border: '1px solid rgba(61,184,107,0.2)' }}>
                    {h.icon}
                  </div>

                  {/* Number */}
                  <div className="text-[#1F3E2F] dark:text-white mb-1"
                    style={{ fontWeight: 800, fontSize: 'clamp(20px, 4vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <Counter target={h.num} suffix={h.suffix} />
                  </div>

                  {/* Label */}
                  <p style={{ fontSize: '13px', color: 'rgba(91,117,102,0.8)', fontWeight: 500, marginTop: '8px', lineHeight: 1.4 }}
                    className="dark:!text-[rgba(155,179,166,0.7)]">
                    {h.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHATSAPP COMMUNITY ───────────────────────────────────── */}
        <WhatsAppCommunitySection />

        {/* ── FACEBOOK COMMUNITY ──────────────────────────────────── */}
        <FacebookCommunitySection />

        {/* ── SOCIAL LINKS ─────────────────────────────────────────── */}
        <section className="px-6 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3DB86B', marginBottom: '16px' }}>
                Connect With Us
              </p>
              <h2 className="text-[#1F3E2F] dark:text-white mb-10"
                style={{ fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.025em' }}>
                Find Us Online
              </h2>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {socials.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.25 } }}
                    className="group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)',
                      color: 'rgba(91,117,102,0.9)',
                    }}
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110" style={{ color: s.color }}>
                      {s.icon}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#1F3E2F] dark:text-white">
                      {s.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
