import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';

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
    desc: 'Started as a Facebook literary community bringing together writers and readers across Kerala.',
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
    desc: 'Registered as a literary and cultural organization, gaining formal recognition.',
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
    desc: 'District units established across Kerala, forming a statewide literary network.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    year: '2025',
    title: 'Printed Annual Edition',
    desc: 'First printed annual edition officially launched, marking a new chapter in publishing.',
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
    desc: 'Publications, Digital Magazine, YouTube, literary competitions, and a thriving statewide community.',
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
    num: 75, suffix: '+', label: 'Books Published',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    num: 20000, suffix: '+', label: 'Community Members',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: 51, suffix: '-Day', label: 'Signature Poetry Challenge',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    num: 12, suffix: '/yr', label: 'Monthly Digital Magazine',
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
    href: 'https://facebook.com/srishtipadham',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/srishtipadham',
    color: '#E1306C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@srishtipadham',
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
    className="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10"
    style={{
      background: 'rgba(7,14,11,0.92)',
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

const CardContent = ({ m }: { m: typeof milestones[0] }) => (
  <>
    <span
      className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3"
      style={{ background: 'rgba(61,184,107,0.12)', border: '1px solid rgba(61,184,107,0.25)', color: '#3DB86B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {m.year}
    </span>
    <h3
      className="text-[#1F3E2F] dark:text-white font-bold text-base sm:text-lg mb-2 leading-tight"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {m.title}
    </h3>
    <p className="text-sm leading-relaxed text-[#5B7566] dark:text-[#9CB3A6]">
      {m.desc}
    </p>
  </>
);

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


/* ─── Main Component ─────────────────────────────────────────────────────── */
const About = () => {
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
                Who We Are
              </span>
            </div>
            <h1 className="text-[#1F3E2F] dark:text-white mb-6"
              style={{ fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              About <span style={{ color: '#3DB86B' }}>Srishtipadham</span>
            </h1>
            <p className="max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(91,117,102,0.85)', fontWeight: 400 }}
              className="dark:!text-[rgba(155,179,166,0.75)] max-w-2xl mx-auto">
              From a humble Facebook literary community to one of Kerala's growing literary organizations, empowering writers and preserving Malayalam literature.
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
                Our Journey
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
                Our Story
              </h2>
              <p style={{ fontSize: '17px', lineHeight: 1.85, color: 'rgba(91,117,102,0.85)', fontWeight: 400 }}
                className="dark:!text-[rgba(155,179,166,0.75)] mb-14">
                Srishtipadham is a literary organization dedicated to nurturing creativity and promoting Malayalam language and literature. Founded in 2018, it has grown from a Facebook literary community into a vibrant platform connecting thousands of writers, readers, and literature enthusiasts across Kerala.
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
