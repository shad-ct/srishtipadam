import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

/* ─────────────────────────────────────────────────────────
   Firefly Dot  (tiny glowing orb that drifts around)
───────────────────────────────────────────────────────── */
interface Fly { id: number; cx: number; cy: number; r: number; dur: number; delay: number; dx: number; dy: number }

const Fireflies: React.FC = () => {
  const [flies, setFlies] = useState<Fly[]>([]);
  useEffect(() => {
    setFlies(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        cx: Math.random() * 100,
        cy: Math.random() * 100,
        r: Math.random() * 2.5 + 1,
        dur: Math.random() * 8 + 6,
        delay: Math.random() * 10,
        dx: (Math.random() - 0.5) * 14,
        dy: (Math.random() - 0.5) * 14,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {flies.map((f) => (
        <motion.span
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.cx}%`,
            top: `${f.cy}%`,
            width: f.r * 2,
            height: f.r * 2,
            background: 'rgba(74,154,104,0.85)',
            boxShadow: `0 0 ${f.r * 5}px ${f.r * 2}px rgba(74,154,104,0.45)`,
          }}
          animate={{
            x: [0, f.dx, -f.dx * 0.6, f.dx * 0.4, 0],
            y: [0, f.dy, -f.dy * 0.8, f.dy * 0.3, 0],
            opacity: [0, 0.9, 0.3, 0.7, 0],
            scale: [0.5, 1.4, 0.7, 1.1, 0.5],
          }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Leaf SVG decoration (matches the illustrated dark leaves)
───────────────────────────────────────────────────────── */
const LeafDecor: React.FC<{
  style?: React.CSSProperties;
  className?: string;
  flip?: boolean;
  delay?: number;
  opacity?: number;
}> = ({ style, className = '', flip = false, delay = 0, opacity = 0.22 }) => (
  <motion.div
    className={`absolute pointer-events-none select-none ${className}`}
    style={{ opacity, ...style }}
    animate={{ y: [0, -12, 4, -6, 0], rotate: flip ? [0, 4, -2, 3, 0] : [0, -3, 2, -4, 0] }}
    transition={{ duration: 9, delay, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M70 10 C30 35 10 90 20 140 C30 175 55 192 70 195 C85 192 110 175 120 140 C130 90 110 35 70 10Z"
        fill="#2d5a3a" />
      <path d="M70 10 C30 35 10 90 20 140 C30 175 55 192 70 195"
        stroke="#3a7a50" strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="70" y1="10" x2="70" y2="195" stroke="#3a7a50" strokeWidth="1.2" opacity="0.45" />
      <line x1="70" y1="60" x2="38" y2="88" stroke="#3a7a50" strokeWidth="0.9" opacity="0.35" />
      <line x1="70" y1="85" x2="102" y2="110" stroke="#3a7a50" strokeWidth="0.9" opacity="0.35" />
      <line x1="70" y1="110" x2="40" y2="130" stroke="#3a7a50" strokeWidth="0.9" opacity="0.35" />
      <line x1="70" y1="130" x2="100" y2="148" stroke="#3a7a50" strokeWidth="0.9" opacity="0.35" />
    </svg>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   Stat chip (Books / Members / Readers)
───────────────────────────────────────────────────────── */
const StatChip: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  delay?: number;
}> = ({ icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay }}
    className="flex items-center gap-3 px-5 py-4 rounded-xl flex-1 min-w-[110px]"
    style={{ background: 'var(--color-stat-card)', border: '1px solid var(--color-border-base)' }}
  >
    <span className="text-2xl" style={{ color: 'var(--color-brand-primary)' }}>{icon}</span>
    <div>
      <p className="font-heading font-bold text-xl leading-none" style={{ color: 'var(--color-text-base)' }}>{value}</p>
      <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   Feature pill (Nature Inspired / Words / Community)
───────────────────────────────────────────────────────── */
const FeaturePill: React.FC<{ icon: string; title: string; desc: string; delay?: number }> = ({ icon, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4 px-6 py-7"
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: 'rgba(74,154,104,0.15)', border: '1px solid rgba(74,154,104,0.25)' }}>
      {icon}
    </div>
    <div>
      <p className="font-heading font-bold text-base mb-1" style={{ color: 'var(--color-text-base)' }}>{title}</p>
      <p className="text-sm leading-relaxed font-body" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   Book Card for carousel (portrait, gradient overlay)
───────────────────────────────────────────────────────── */
const CarouselBookCard: React.FC<{ book: any; idx: number }> = ({ book, idx }) => (
  <Link to={`/books/${book._id}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer"
      style={{ width: 176, aspectRatio: '2/3' }}
    >
      {/* Background */}
      {book.coverImage?.url ? (
        <img src={book.coverImage.url} alt={book.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4"
          style={{ background: 'linear-gradient(135deg, #1a3a25 0%, #0c1810 100%)' }}>
          <p className="font-heading text-center text-sm leading-snug" style={{ color: 'var(--color-brand-primary)' }}>{book.name}</p>
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      {/* Category badge at bottom */}
      {book.category && (
        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm"
          style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--color-brand-primary)', border: '1px solid rgba(74,154,104,0.3)' }}>
          {book.category}
        </span>
      )}
      {/* Title overlay */}
      <div className="absolute top-4 left-3 right-3">
        <p className="font-heading text-white text-sm font-bold leading-snug line-clamp-3">{book.name}</p>
        {book.writer && <p className="text-white/55 text-xs mt-1 font-body">{book.writer}</p>}
      </div>
    </motion.div>
  </Link>
);

/* ─────────────────────────────────────────────────────────
   Event Card
───────────────────────────────────────────────────────── */
const EventCard: React.FC<{ event: any; idx: number; lang: 'ml' | 'en' }> = ({ event, idx, lang }) => {
  const d = new Date(event.date);
  const mon = d.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.08 }}
      whileHover={{ y: -5 }}
      className="flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
      style={{ width: 256, border: '1px solid var(--color-border-base)' }}
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--color-surface-raised)' }}>
        {event.images?.[0]?.url ? (
          <img src={event.images[0].url} alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-surface-raised) 0%, var(--color-surface-base) 100%)' }}>
            <span className="text-5xl opacity-20">📅</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Date pill */}
        <div className="absolute top-3 left-3 rounded-lg w-11 h-11 flex flex-col items-center justify-center"
          style={{ background: 'var(--color-brand-primary)' }}>
          <span className="text-[8px] font-bold tracking-widest text-white leading-none">{mon}</span>
          <span className="text-lg font-bold text-white leading-tight">{day}</span>
        </div>
        {event.isUpcoming && (
          <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm"
            style={{ background: 'rgba(197,123,78,0.8)', color: '#fff' }}>
            Upcoming
          </span>
        )}
      </div>
      {/* Info area */}
      <div className="px-4 py-3" style={{ background: 'var(--color-surface-raised)' }}>
        <p className="font-heading font-semibold text-sm line-clamp-2 leading-snug" style={{ color: 'var(--color-text-base)' }}>
          {event.name?.[lang] || event.name?.en || 'Untitled Event'}
        </p>
        {event.place?.[lang] && (
          <p className="text-xs mt-1.5 font-body flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <span>📍</span>{event.place[lang]}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   Section Header with "View all" link
───────────────────────────────────────────────────────── */
const SectionHeader: React.FC<{ eyebrow: string; title: React.ReactNode; href: string; linkLabel: string }> = ({ eyebrow, title, href, linkLabel }) => (
  <div className="flex items-end justify-between mb-8 px-4 md:px-0">
    <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
      <p className="text-xs uppercase tracking-widest font-bold mb-2 font-body" style={{ color: 'var(--color-brand-primary)' }}>{eyebrow}</p>
      <h2 className="font-heading font-bold text-3xl md:text-4xl" style={{ color: 'var(--color-text-base)' }}>{title}</h2>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.15 }}>
      <Link to={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:gap-2.5 rounded-full px-4 py-2"
        style={{ color: 'var(--color-brand-primary)', background: 'rgba(74,154,104,0.12)', border: '1px solid rgba(74,154,104,0.25)' }}>
        {linkLabel} <span>→</span>
      </Link>
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   Scrollable Row with arrow nav buttons
───────────────────────────────────────────────────────── */
const ScrollRow: React.FC<{ children: React.ReactNode; fromBg: string }> = ({ children, fromBg }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => rowRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  return (
    <div className="relative">
      {/* Left arrow */}
      <button onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-base)', color: 'var(--color-text-base)' }}>
        ‹
      </button>
      {/* Scroll container */}
      <div ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory pl-2 pr-2"
        style={{ scrollPaddingLeft: '8px' }}>
        {children}
      </div>
      {/* Right arrow */}
      <button onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-base)', color: 'var(--color-text-base)' }}>
        ›
      </button>
      {/* Right fade */}
      <div className={`absolute right-0 top-0 bottom-4 w-16 pointer-events-none bg-gradient-to-l ${fromBg} to-transparent`} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ml' | 'en';
  const [showML, setShowML] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowML(false), 2600);
    return () => clearTimeout(t);
  }, []);

  const { data: books = [] } = useQuery({
    queryKey: ['books-home'],
    queryFn: async () => { const { data } = await axiosClient.get('/books'); return data; },
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events-home'],
    queryFn: async () => { const { data } = await axiosClient.get('/events'); return data; },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => { const { data } = await axiosClient.get('/stats'); return data; },
  });

  const featuredBook = books.find((b: any) => b.coverImage?.url) || books[0];

  return (
    <div className="w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex items-center overflow-hidden"
        style={{ background: 'var(--color-bg-base)', paddingTop: 64 }}
      >
        {/* Background radial gradient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Deep green radial glow — top left (matches image) */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.32, 0.22] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{
              width: 640, height: 640,
              top: '-15%', left: '-10%',
              background: 'radial-gradient(circle, rgba(42,100,65,0.55) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Secondary glow — right */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.14, 0.22, 0.14] }}
            transition={{ duration: 12, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{
              width: 500, height: 500,
              bottom: '5%', right: '-5%',
              background: 'radial-gradient(circle, rgba(42,100,65,0.4) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
          {/* Dot grid texture */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(74,154,104,0.07) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }} />
        </div>

        {/* Fireflies */}
        <Fireflies />

        {/* Botanical leaves */}
        <LeafDecor style={{ width: 130, height: 195, top: 72, left: -24 }} delay={0} opacity={0.28} />
        <LeafDecor style={{ width: 88, height: 130, top: 24, left: 88 }} delay={2.5} opacity={0.18} />
        <LeafDecor style={{ width: 70, height: 105, top: 56, left: 176 }} delay={4} opacity={0.14} flip />
        <LeafDecor style={{ width: 60, height: 90, top: 16, right: 40 }} delay={1.2} opacity={0.12} flip />
        <LeafDecor style={{ width: 100, height: 148, bottom: 80, right: -16 }} delay={3} opacity={0.16} />

        {/* ── Main layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* ── LEFT COLUMN ── */}
            <div className="w-full lg:w-[52%] flex flex-col items-start">

              {/* Animated tagline */}
              <div className="h-8 mb-5 overflow-hidden">
                <AnimatePresence mode="wait">
                  {showML ? (
                    <motion.p key="ml"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.65 }}
                      className="font-heading italic text-lg md:text-xl font-medium"
                      style={{ color: 'var(--color-brand-primary)' }}>
                      വാക്കുകളുടെയും മഷിയുടെയും ഒരു കൂട്ടായ്മ
                    </motion.p>
                  ) : (
                    <motion.p key="en"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65 }}
                      className="font-heading italic text-lg md:text-xl font-medium"
                      style={{ color: 'var(--color-brand-primary)' }}>
                      A Collective of Words and Ink
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Big heading */}
              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-bold leading-[0.92] tracking-tight mb-5"
                style={{
                  fontSize: 'clamp(3.4rem, 9vw, 7.5rem)',
                  color: 'var(--color-text-base)',
                }}
              >
                Srishti<span style={{ color: 'var(--color-brand-primary)' }}>padham</span>
              </motion.h1>

              {/* Separator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="h-px mb-5"
                style={{ background: 'var(--color-border-base)' }}
              />

              {/* Sub-tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.75 }}
                className="font-body text-base md:text-lg mb-9 max-w-md leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}>
                Discover Literature, Embrace Nature
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.9 }}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <Link
                  to="/books"
                  className="group inline-flex items-center gap-2 font-medium px-6 py-3 rounded-xl transition-all duration-250 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--color-brand-primary)',
                    color: '#fff',
                    boxShadow: '0 4px 18px rgba(74,154,104,0.3)',
                  }}>
                  Browse Books <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/magazines"
                  className="inline-flex items-center gap-2 font-medium text-sm px-5 py-3 rounded-xl transition-all duration-250"
                  style={{
                    color: 'var(--color-text-base)',
                    border: '1px solid var(--color-border-base)',
                    background: 'rgba(255,255,255,0.04)',
                  }}>
                  📖 Read our Magazine
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 1.1 }}
                className="flex flex-wrap gap-3 w-full"
              >
                <StatChip
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  }
                  value={stats ? `${stats.books}+` : '—'}
                  label="Books"
                  delay={1.2}
                />
                <StatChip
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  }
                  value={stats ? `${stats.members}+` : '—'}
                  label="Members"
                  delay={1.3}
                />
                <StatChip
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  }
                  value="1k+"
                  label="Readers"
                  delay={1.4}
                />
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN — Featured Book Card ── */}
            <motion.div
              initial={{ opacity: 0, x: 44 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.05, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[48%] flex justify-center lg:justify-end"
            >
              {featuredBook ? (
                <Link to={`/books/${featuredBook._id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: -3, rotateX: 2 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    style={{
                      width: 'min(380px, 90vw)',
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Cover Image */}
                    <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                      {featuredBook.coverImage?.url ? (
                        <img src={featuredBook.coverImage.url} alt={featuredBook.name}
                          className="w-full h-full object-cover" style={{ display: 'block' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #1a3a25 0%, #0c1810 100%)' }}>
                          <span className="font-heading text-2xl text-center px-6" style={{ color: 'var(--color-brand-primary)' }}>
                            {featuredBook.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                    </div>

                    {/* Book info strip */}
                    <div className="relative px-6 py-5 flex items-end justify-between"
                      style={{ background: 'var(--color-surface-raised)' }}>
                      <div>
                        {/* FEATURED label */}
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: 'var(--color-brand-primary)' }}>
                          Featured
                        </p>
                        <h3 className="font-heading text-xl font-bold mb-0.5" style={{ color: 'var(--color-text-base)' }}>
                          {featuredBook.name}
                        </h3>
                        <p className="text-sm font-body" style={{ color: 'var(--color-text-muted)' }}>
                          Srishtipadham Publications
                        </p>
                      </div>
                      {/* Arrow button */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-200 group-hover:scale-110"
                        style={{ background: 'var(--color-brand-primary)', color: '#fff' }}>
                        →
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                /* Placeholder card */
                <div style={{
                  width: 'min(380px, 90vw)', borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
                }}>
                  <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #1a3a25 0%, #0c1810 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-brand-primary)', opacity: 0.5, fontSize: 48 }}>📚</span>
                  </div>
                  <div className="px-6 py-5" style={{ background: 'var(--color-surface-raised)' }}>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-brand-primary)' }}>Featured</p>
                    <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--color-text-base)' }}>The Kerala Story</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Srishtipadham Publications</p>
                  </div>
                </div>
              )}
            </motion.div>

          </div>{/* end flex row */}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES STRIP
      ══════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--color-surface-base)', borderTop: '1px solid var(--color-border-base)', borderBottom: '1px solid var(--color-border-base)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ '--tw-divide-color': 'var(--color-border-base)' } as React.CSSProperties}>
            <FeaturePill icon="🌿" title="Nature Inspired" desc="Stories that celebrate the beauty of our world." delay={0} />
            <FeaturePill icon="📖" title="Words that Connect" desc="Uniting readers and writers through the power of words." delay={0.1} />
            <FeaturePill icon="👥" title="A Creative Community" desc="A platform for ideas, expression and collaboration." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST BOOKS carousel
      ══════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: 'var(--color-bg-base)' }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-10">
          <SectionHeader
            eyebrow="Our Collection"
            title={<>Latest <span className="italic" style={{ color: 'var(--color-brand-primary)' }}>Books</span> —</>}
            href="/books"
            linkLabel="View all Books"
          />
          {books.length > 0 ? (
            <ScrollRow fromBg="from-[var(--color-bg-base)]">
              {books.slice(0, 10).map((b: any, i: number) => (
                <div key={b._id} className="snap-start"><CarouselBookCard book={b} idx={i} /></div>
              ))}
            </ScrollRow>
          ) : (
            <div className="flex gap-4 overflow-hidden pb-4">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="flex-shrink-0 animate-pulse rounded-2xl"
                  style={{ width: 176, aspectRatio: '2/3', background: 'var(--color-surface-raised)' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST EVENTS carousel
      ══════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: 'var(--color-surface-base)' }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-10">
          <SectionHeader
            eyebrow="Happening Around"
            title={<>Latest <span className="italic" style={{ color: 'var(--color-brand-primary)' }}>Events</span> —</>}
            href="/events"
            linkLabel="View all Events"
          />
          {events.length > 0 ? (
            <ScrollRow fromBg="from-[var(--color-surface-base)]">
              {events.slice(0, 8).map((ev: any, i: number) => (
                <div key={ev._id} className="snap-start"><EventCard event={ev} idx={i} lang={lang} /></div>
              ))}
            </ScrollRow>
          ) : (
            <div className="flex gap-4 overflow-hidden pb-4">
              {[0,1,2,3].map(i => (
                <div key={i} className="flex-shrink-0 animate-pulse rounded-2xl"
                  style={{ width: 256, height: 220, background: 'var(--color-surface-raised)' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          JOIN CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
        {/* Glow */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="rounded-full" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(42,100,65,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </motion.div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4" style={{ color: 'var(--color-text-base)' }}>
              Join the <span className="italic" style={{ color: 'var(--color-brand-primary)' }}>Community</span>
            </h2>
            <p className="font-body text-base md:text-lg mb-10 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Become part of Srishtipadham — a family of readers, writers, and nature lovers united by the power of literature.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center gap-3 font-medium px-10 py-4 rounded-xl transition-all duration-250 hover:-translate-y-0.5 text-lg"
              style={{
                background: 'var(--color-brand-primary)',
                color: '#fff',
                boxShadow: '0 8px 28px rgba(74,154,104,0.35)',
              }}>
              Join Now 🌿
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
