import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import logo from '../assets/logo.png';

// ─── Firefly Particle Component ───────────────────────────────────────────────
interface Firefly { id: number; x: number; y: number; size: number; duration: number; delay: number; }

const FireflyCanvas: React.FC = () => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  useEffect(() => {
    const flies: Firefly[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 8,
    }));
    setFireflies(flies);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-primary/70 dark:bg-primary/60"
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.size, height: f.size, boxShadow: `0 0 ${f.size * 3}px ${f.size}px currentColor`, filter: 'blur(0.3px)' }}
          animate={{
            x: [0, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 80, 0],
            y: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 60, 0],
            opacity: [0, 0.9, 0.4, 0.8, 0],
            scale: [0.6, 1.4, 0.8, 1.2, 0.6],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ─── Leaf Decoration ─────────────────────────────────────────────────────────
const FloatingLeaf: React.FC<{ className?: string; delay?: number; rotate?: number }> = ({ className, delay = 0, rotate = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none opacity-20 dark:opacity-15 text-primary ${className}`}
    animate={{ y: [0, -18, 0], rotate: [rotate, rotate + 8, rotate - 4, rotate], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg viewBox="0 0 80 100" fill="currentColor" className="w-full h-full">
      <path d="M40 5 C10 20 5 60 40 95 C75 60 70 20 40 5Z" />
      <line x1="40" y1="5" x2="40" y2="95" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="40" y1="35" x2="20" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="50" x2="60" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  </motion.div>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string; delay?: number }> = ({ icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="flex items-center gap-3 bg-surface-raised/60 dark:bg-surface-raised/40 backdrop-blur-md border border-border rounded-xl px-5 py-4 flex-1 min-w-[120px]"
  >
    <div className="text-primary text-xl flex-shrink-0">{icon}</div>
    <div>
      <p className="font-heading font-bold text-xl text-text leading-none">{value}</p>
      <p className="text-text-secondary text-xs mt-0.5 font-body">{label}</p>
    </div>
  </motion.div>
);

// ─── Feature Pill ────────────────────────────────────────────────────────────
const FeaturePill: React.FC<{ icon: string; title: string; desc: string; delay?: number }> = ({ icon, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex items-start gap-4 p-5"
  >
    <div className="w-11 h-11 rounded-xl bg-primary/15 dark:bg-primary/20 border border-primary/25 flex items-center justify-center text-xl flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-heading font-semibold text-text text-base mb-1">{title}</h3>
      <p className="text-text-secondary text-sm font-body leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// ─── Compact Book Card ───────────────────────────────────────────────────────
const CompactBookCard: React.FC<{ book: any; index: number }> = ({ book, index }) => (
  <Link to={`/books/${book._id}`}>
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative rounded-xl overflow-hidden aspect-[2/3] w-44 md:w-48 flex-shrink-0 group cursor-pointer shadow-lg"
    >
      {book.coverImage?.url ? (
        <img src={book.coverImage.url} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-primary/20 flex items-center justify-center p-3">
          <span className="font-heading text-primary text-center text-sm leading-snug">{book.name}</span>
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {book.category && (
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-primary-hover dark:text-primary font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-sm">
          {book.category}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="font-heading text-white text-sm font-semibold line-clamp-2 leading-snug">{book.name}</p>
        <p className="text-white/60 text-xs mt-0.5 font-body">{book.writer}</p>
      </div>
    </motion.div>
  </Link>
);

// ─── Compact Event Card ──────────────────────────────────────────────────────
const CompactEventCard: React.FC<{ event: any; index: number; lang: 'ml' | 'en' }> = ({ event, index, lang }) => {
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative rounded-xl overflow-hidden flex-shrink-0 w-64 md:w-72 group"
    >
      <div className="relative h-44 bg-surface-raised overflow-hidden">
        {event.images?.[0]?.url ? (
          <img src={event.images[0].url} alt={event.name?.en || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-5xl opacity-30">📅</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-primary text-white rounded-lg w-12 h-12 flex flex-col items-center justify-center shadow-lg">
          <span className="text-[9px] font-bold tracking-widest leading-none">{month}</span>
          <span className="text-xl font-bold leading-tight">{day}</span>
        </div>
        {event.isUpcoming && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-white font-bold bg-accent/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            Upcoming
          </span>
        )}
      </div>
      <div className="bg-surface-raised/80 dark:bg-surface-raised/60 backdrop-blur-sm border border-border border-t-0 rounded-b-xl px-4 py-3">
        <p className="font-heading font-semibold text-text text-sm line-clamp-2 leading-snug">
          {event.name?.[lang] || event.name?.en || 'Untitled Event'}
        </p>
        {event.place?.[lang] && (
          <p className="text-text-secondary text-xs mt-1 font-body flex items-center gap-1">
            <span>📍</span> {event.place[lang]}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ml' | 'en';
  const [showMalayalam, setShowMalayalam] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const { data: books } = useQuery({
    queryKey: ['books-home'],
    queryFn: async () => { const { data } = await axiosClient.get('/books'); return data; },
  });

  const { data: events } = useQuery({
    queryKey: ['events-home'],
    queryFn: async () => { const { data } = await axiosClient.get('/events'); return data; },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => { const { data } = await axiosClient.get('/stats'); return data; },
  });

  // Featured book = first book with coverImage, else first book
  const featuredBook = books?.find((b: any) => b.coverImage?.url) || books?.[0];
  const latestBooks = books?.slice(0, 8) || [];
  const latestEvents = events?.slice(0, 6) || [];

  useEffect(() => {
    const t = setTimeout(() => setShowMalayalam(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex items-center overflow-hidden pt-16"
        style={{ background: 'var(--hero-bg)' }}
      >
        {/* Dynamic radial light blobs */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
          {/* Deep background */}
          <div className="absolute inset-0 bg-background" />
          {/* Glowing orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/25 dark:bg-primary/15 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 11, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[110px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 14, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-accent/15 dark:bg-accent/10 blur-[80px]"
          />
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, var(--color-brand-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </motion.div>

        {/* Fireflies */}
        <FireflyCanvas />

        {/* Floating botanical leaves */}
        <FloatingLeaf className="w-32 h-40 -left-8 top-24" delay={0} rotate={-20} />
        <FloatingLeaf className="w-20 h-28 left-20 top-10" delay={2} rotate={15} />
        <FloatingLeaf className="w-16 h-20 right-10 top-16" delay={1} rotate={25} />
        <FloatingLeaf className="w-24 h-32 right-0 bottom-32" delay={3} rotate={-10} />
        <FloatingLeaf className="w-12 h-16 left-1/3 top-8" delay={5} rotate={30} />

        {/* Main layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left column */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              {/* Animated tagline */}
              <div className="h-9 mb-4 flex items-center">
                <AnimatePresence mode="wait">
                  {showMalayalam ? (
                    <motion.p key="ml" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.7 }} className="text-primary font-heading text-lg md:text-xl font-medium italic">
                      വാക്കുകളുടെയും മഷിയുടെയും ഒരു കൂട്ടായ്മ
                    </motion.p>
                  ) : (
                    <motion.p key="en" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }} className="text-primary font-heading text-lg md:text-xl font-medium italic">
                      A Collective of Words and Ink
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-heading text-text leading-[0.9] mb-6 tracking-tight"
              >
                Srishti<span className="text-primary">padham</span>
              </motion.h1>

              {/* Divider line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '3rem' }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="h-0.5 bg-primary mb-5"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-text-secondary font-body text-lg md:text-xl mb-10 max-w-md leading-relaxed"
              >
                Discover Literature, Embrace Nature
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="flex flex-wrap items-center gap-4 mb-12"
              >
                <Link
                  to="/books"
                  className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium px-7 py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Browse Books
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
                <Link
                  to="/magazines"
                  className="inline-flex items-center gap-2 text-text font-medium px-5 py-3.5 border border-border rounded-xl bg-surface/40 backdrop-blur-sm hover:bg-surface/60 hover:border-primary/40 transition-all duration-300"
                >
                  <span>📖</span> Read our Magazine
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.3 }}
                className="flex flex-wrap gap-3 w-full"
              >
                <StatCard
                  icon={<span>📚</span>}
                  value={stats ? `${stats.books}+` : '—'}
                  label="Books"
                  delay={1.4}
                />
                <StatCard
                  icon={<span>👥</span>}
                  value={stats ? `${stats.members}+` : '—'}
                  label="Members"
                  delay={1.5}
                />
                <StatCard
                  icon={<span>🌿</span>}
                  value="1k+"
                  label="Readers"
                  delay={1.6}
                />
              </motion.div>
            </div>

            {/* Right column – Featured Book */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            >
              {featuredBook ? (
                <Link to={`/books/${featuredBook._id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: -3 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative w-72 md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60 group cursor-pointer"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {featuredBook.coverImage?.url ? (
                      <img
                        src={featuredBook.coverImage.url}
                        alt={featuredBook.name}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center p-8">
                        <img src={logo} alt="Srishtipadham" className="w-32 h-32 object-contain opacity-50" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    {/* Featured badge */}
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-primary font-bold bg-black/60 backdrop-blur-sm px-3 py-1 rounded-sm border border-primary/30">
                      Featured
                    </span>
                    {/* Book info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white mb-0.5">{featuredBook.name}</h3>
                        <p className="text-white/60 text-sm font-body">Srishtipadham Publications</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                        →
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                // Placeholder if no book yet
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-72 md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60"
                >
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-primary/20 to-surface flex items-center justify-center">
                    <img src={logo} alt="Srishtipadham" className="w-40 h-40 object-contain opacity-60" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-0.5">The Kerala Story</h3>
                    <p className="text-white/60 text-sm font-body">Srishtipadham Publications</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <FeaturePill icon="🌿" title="Nature Inspired" desc="Stories that celebrate the beauty of our world." delay={0} />
            <FeaturePill icon="📖" title="Words that Connect" desc="Uniting readers and writers through the power of words." delay={0.1} />
            <FeaturePill icon="👥" title="A Creative Community" desc="A platform for ideas, expression and collaboration." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── LATEST BOOKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-primary text-sm font-medium uppercase tracking-widest mb-1 font-body">Our Collection</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text font-heading">
                Latest <span className="italic text-primary">Books</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm bg-primary/10 hover:bg-primary/15 border border-primary/25 px-4 py-2 rounded-full transition-all duration-200 hover:gap-3"
              >
                View all Books <span>→</span>
              </Link>
            </motion.div>
          </div>

          {latestBooks.length > 0 ? (
            <div className="relative">
              <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {latestBooks.map((book: any, idx: number) => (
                  <div key={book._id} className="snap-start flex-shrink-0">
                    <CompactBookCard book={book} index={idx} />
                  </div>
                ))}
              </div>
              {/* Fade edges */}
              <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-44 aspect-[2/3] rounded-xl bg-surface animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LATEST EVENTS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-primary text-sm font-medium uppercase tracking-widest mb-1 font-body">Happening Around</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text font-heading">
                Latest <span className="italic text-primary">Events</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm bg-primary/10 hover:bg-primary/15 border border-primary/25 px-4 py-2 rounded-full transition-all duration-200 hover:gap-3"
              >
                View all Events <span>→</span>
              </Link>
            </motion.div>
          </div>

          {latestEvents.length > 0 ? (
            <div className="relative">
              <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {latestEvents.map((event: any, idx: number) => (
                  <div key={event._id} className="snap-start flex-shrink-0">
                    <CompactEventCard event={event} index={idx} lang={lang} />
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64 rounded-xl bg-background animate-pulse" style={{ height: 220 }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── JOIN CTA ───────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-background overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[600px] h-[600px] rounded-full bg-primary/15 dark:bg-primary/10 blur-[120px]" />
        </motion.div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img src={logo} alt="Srishtipadham" className="w-20 h-20 object-contain rounded-full mx-auto mb-8 shadow-lg shadow-primary/20" />
            <h2 className="text-4xl md:text-5xl font-bold text-text font-heading mb-4">
              Join the <span className="italic text-primary">Community</span>
            </h2>
            <p className="text-text-secondary font-body text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Become part of Srishtipadham — a family of readers, writers, and nature lovers united by the power of literature.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white font-medium px-10 py-4 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/35 hover:-translate-y-0.5 text-lg"
            >
              Join Now
              <span className="text-xl">🌿</span>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
