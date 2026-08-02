import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { FeaturesAndStats } from '../components/FeaturesAndStats';

/* ─── Particle canvas — works in both light and dark themes ─────────────── */
function ParticleCanvas({ dark = false }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 100;
    const particles = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 3.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.12,
      dx:    (Math.random() - 0.5) * 0.28,
      dy:    (Math.random() - 0.5) * 0.28,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Dark mode: bright green  |  Light mode: deep forest green (more opaque)
    const [r, g, b] = dark ? [76, 210, 140] : [47, 120, 80];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now() / 1000;
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.alpha * (0.65 + 0.35 * Math.sin(now * 1.1 + p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: dark ? 0.78 : 0.45 }}
    />
  );
}

const Home = () => {
  const booksScrollerRef = useRef(null);
  const magsScrollerRef = useRef(null);
  const eventsScrollerRef = useRef(null);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['allBooks'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books');
      return data;
    }
  });

  const featuredBook = books && books.length > 0 ? books[0] : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: magazines, isLoading: isLoadingMags, error: magsError } = useQuery({
    queryKey: ['allMagazines'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/magazines');
      return data;
    }
  });

  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['allEvents'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/events');
      return data;
    }
  });

  const scrollByCards = (ref: any, direction: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F1EA] dark:bg-[#070E0B] text-[#1F3E2F] dark:text-[#EAF4EE] font-sans selection:bg-[#4C9A6A] selection:text-white transition-colors duration-300 overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">

        {/* Particle layer — always visible, theme-aware colour */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark-mode canvas + center glow */}
          <div className="dark:block hidden w-full h-full relative">
            <ParticleCanvas dark={true} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(76,154,106,0.07)_0%,transparent_70%)]" />
          </div>
          {/* Light-mode canvas + soft warm glow */}
          <div className="dark:hidden block w-full h-full relative">
            <ParticleCanvas dark={false} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_40%,rgba(76,154,106,0.06)_0%,transparent_65%)]" />
            <div className="absolute -top-40 -left-40 w-[540px] h-[540px] rounded-full bg-[#4C9A6A]/08 blur-[100px]" />
            <div className="absolute top-10 right-0 w-[380px] h-[380px] rounded-full bg-[#C97B4E]/06 blur-[80px]" />
          </div>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mb-8"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-2xl mx-auto"
            style={{ border: '3px solid rgba(61,184,107,0.35)', boxShadow: '0 0 40px rgba(61,184,107,0.20), 0 20px 60px rgba(0,0,0,0.5)' }}>
            <img src="/logo.png" alt="Srishtipadham logo" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Headline — bold sans-serif matching reference image */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#1F3E2F] dark:text-white mb-5 leading-[1.05]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
        >
          Srishtipadham
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="relative z-10 text-lg md:text-xl text-[#3B5A4B] dark:text-[#9DB3A6] mb-10 font-medium tracking-wide max-w-md"
        >
          Empowering Writers, Preserving Literature
        </motion.p>

        {/* CTA Buttons — matching reference image style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/books"
            className="px-7 py-3.5 rounded-full bg-[#3DB86B] hover:bg-[#35a55f] text-white font-bold text-[15px] tracking-wide transition-all duration-300 shadow-lg shadow-[#3DB86B]/30 hover:shadow-[#3DB86B]/50 hover:scale-[1.03] active:scale-95"
          >
            Explore Books
          </Link>
          <Link
            to="/join"
            className="px-7 py-3.5 rounded-full border border-white/20 dark:border-white/25 bg-white/5 dark:bg-white/5 backdrop-blur-sm text-[#1F3E2F] dark:text-white font-bold text-[15px] tracking-wide hover:bg-white/15 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Join Our Community
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#4C9A6A]/70 dark:text-[#4C9A6A]/60 font-medium">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-[#4C9A6A]/30 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-[#4C9A6A]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── PREMIUM FEATURES + STATS ────────────────────────────────────────── */}
      <FeaturesAndStats />

      {/* ── CURATED READS ──────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#EFF5F0] dark:bg-[#070E0B] py-28 overflow-hidden">
        {/* Ambient emerald blob */}
        <div className="absolute pointer-events-none top-0 left-1/3 w-[700px] h-[500px] rounded-full opacity-100"
          style={{ background: 'radial-gradient(ellipse, rgba(61,184,107,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute pointer-events-none bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(44,196,120,0.04) 0%, transparent 65%)', filter: 'blur(100px)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-2 h-2 rounded-full bg-[#3DB86B]" style={{ boxShadow: '0 0 8px rgba(61,184,107,0.9)' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3DB86B' }}>
                  Editorial Selection
                </span>
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--tw-prose-headings, #1F3E2F)' }} className="text-[#1F3E2F] dark:text-white mb-3">
                Curated <span style={{ color: '#3DB86B' }}>Reads</span> for You
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 400, color: 'rgba(91,117,102,0.8)' }} className="dark:!text-[rgba(155,179,166,0.75)]">
                Handpicked stories that inspire, connect, and endure.
              </p>
            </div>
            <Link to="/books" className="group flex items-center gap-2 shrink-0 pb-1 relative"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#3DB86B', letterSpacing: '0.01em' }}>
              View All Books
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#3DB86B] transition-all duration-400 ease-out" />
            </Link>
          </motion.div>

          {/* Cards carousel */}
          <div className="relative group/carousel">
            <button type="button" onClick={() => scrollByCards(booksScrollerRef, -1)} aria-label="Scroll left"
              className="hidden md:flex absolute -left-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
              style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(61,184,107,0.25)', backdropFilter: 'blur(12px)', color: '#3DB86B', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" onClick={() => scrollByCards(booksScrollerRef, 1)} aria-label="Scroll right"
              className="hidden md:flex absolute -right-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
              style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(61,184,107,0.25)', backdropFilter: 'blur(12px)', color: '#3DB86B', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <motion.div
              ref={booksScrollerRef}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[42%] md:auto-cols-[32%] lg:auto-cols-[24%] xl:auto-cols-[20%] gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {isLoading ? (
                <div className="text-center text-white/50 py-16">Loading collection...</div>
              ) : error ? (
                <div className="text-center text-red-400 py-16">Failed to load collection.</div>
              ) : books && books.length > 0 ? (
                books.map((book: any, index: number) => (
                  <motion.div
                    key={book._id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                    className="group relative snap-start"
                    style={{ willChange: 'transform' }}
                  >
                    <Link to={`/books/${book._id}`} className="block">
                      <motion.div
                        whileHover={{ y: -8, rotateY: -3, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
                        style={{ transformStyle: 'preserve-3d', perspective: 900 }}
                        className="relative rounded-3xl overflow-hidden"
                      >
                        {/* Cover image container */}
                        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-3xl"
                          style={{ background: '#0D1C13', boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)' }}>
                          <img
                            src={(() => {
                              const ci = book.coverImage;
                              if (!ci) return `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index}`;
                              if (typeof ci === 'string' && ci.startsWith('http')) return ci;
                              if (typeof ci === 'object') return ci.url || ci.secure_url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index}`;
                              return `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index}`;
                            })()}
                            alt={book.name?.en || book.name?.ml || 'Book'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            style={{ filter: 'brightness(0.88) contrast(1.06) saturate(1.08)' }}
                          />
                          {/* Spine shadow */}
                          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
                          {/* Cinematic vignette */}
                          <div className="absolute inset-0 pointer-events-none z-10"
                            style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                          {/* Top edge shine */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                          {/* Glass reflection */}
                          <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none z-10"
                            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
                          {/* Genre badge */}
                          {book.category && (
                            <div className="absolute top-4 left-4 z-20">
                              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3DB86B', background: 'rgba(7,14,11,0.80)', border: '1px solid rgba(61,184,107,0.30)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: '20px' }}>
                                {book.category}
                              </span>
                            </div>
                          )}
                          {/* Ambient glow behind card on hover */}
                          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                            style={{ boxShadow: 'inset 0 -40px 60px rgba(61,184,107,0.08)' }} />
                        </div>

                        {/* Glass info panel */}
                        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 pt-8 rounded-b-3xl"
                          style={{ background: 'linear-gradient(to top, rgba(5,12,8,0.96) 0%, rgba(5,12,8,0.85) 60%, transparent 100%)', backdropFilter: 'blur(2px)' }}>
                          <h3 className="font-bold text-white leading-tight mb-1 line-clamp-2"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700 }}>
                            {book.name?.en || book.name?.ml || 'Book'}
                          </h3>
                          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', color: 'rgba(155,179,166,0.75)', marginBottom: '10px' }}>
                            {book.writer?.en || book.writer?.ml || 'Unknown Author'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                              ₹{book.price || 0}
                            </span>
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map(s => (
                                <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= 4 ? '#3DB86B' : 'none'} stroke="#3DB86B" strokeWidth="2">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-white/50 py-16">No books available.</div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAGAZINES ──────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#EFF5F0] dark:bg-[#070E0B] py-20 overflow-hidden">
        <div className="absolute pointer-events-none top-0 right-1/4 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,123,78,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.8 }}
                  className="w-2 h-2 rounded-full" style={{ background: '#E0A176', boxShadow: '0 0 8px rgba(224,161,118,0.9)' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E0A176' }}>
                  Publications
                </span>
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.03em' }} className="text-[#1F3E2F] dark:text-white mb-3">
                Our <span style={{ color: '#E0A176' }}>Magazines</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', color: 'rgba(91,117,102,0.8)' }} className="dark:!text-[rgba(155,179,166,0.75)]">
                Periodic editions celebrating literature, culture, and nature.
              </p>
            </div>
            <Link to="/magazines" className="group flex items-center gap-2 shrink-0 pb-1 relative"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#E0A176' }}>
              View All Magazines
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#E0A176] transition-all duration-400" />
            </Link>
          </motion.div>

          <div className="relative group/carousel">
            <button type="button" onClick={() => scrollByCards(magsScrollerRef, -1)} aria-label="Scroll left"
              className="hidden md:flex absolute -left-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
              style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(224,161,118,0.25)', backdropFilter: 'blur(12px)', color: '#E0A176', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" onClick={() => scrollByCards(magsScrollerRef, 1)} aria-label="Scroll right"
              className="hidden md:flex absolute -right-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
              style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(224,161,118,0.25)', backdropFilter: 'blur(12px)', color: '#E0A176', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <motion.div
              ref={magsScrollerRef}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[42%] md:auto-cols-[32%] lg:auto-cols-[24%] xl:auto-cols-[20%] gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {isLoadingMags ? (
                <div className="text-center text-white/50 py-16">Loading magazines...</div>
              ) : magsError ? (
                <div className="text-center text-red-400 py-16">Failed to load magazines.</div>
              ) : magazines && magazines.length > 0 ? (
                magazines.map((mag: any, index: number) => (
                  <motion.div
                    key={mag._id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                    className="group relative snap-start"
                  >
                    <Link to="/magazines" className="block">
                      <motion.div
                        whileHover={{ y: -8, rotateY: -3, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
                        style={{ transformStyle: 'preserve-3d', perspective: 900 }}
                        className="relative rounded-3xl overflow-hidden"
                      >
                        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl"
                          style={{ background: '#0D1C13', boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)' }}>
                          <img
                            src={(typeof mag.coverImage === 'string' && mag.coverImage !== '') ? mag.coverImage : (mag.coverImage?.url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 50}`)}
                            alt={mag.title?.en || 'Magazine'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            style={{ filter: 'brightness(0.88) contrast(1.06) saturate(1.05)' }}
                          />
                          <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                          <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
                            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)' }} />
                          <div className="absolute top-4 left-4">
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E0A176', background: 'rgba(7,14,11,0.80)', border: '1px solid rgba(224,161,118,0.30)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: '20px' }}>
                              Issue {mag.issueNumber}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 pt-8 rounded-b-3xl"
                          style={{ background: 'linear-gradient(to top, rgba(5,12,8,0.96) 0%, rgba(5,12,8,0.85) 60%, transparent 100%)' }}>
                          <h3 className="font-bold text-white leading-tight mb-1 line-clamp-2"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700 }}>
                            {mag.title?.ml || mag.title?.en || 'Magazine'}
                          </h3>
                          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', color: 'rgba(224,161,118,0.75)' }}>
                            {mag.pages ? `${mag.pages} pages` : 'Periodic edition'}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-white/50 py-16">No magazines available.</div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ─────────────────────────────────────────────────────────── */}
      {(() => {
        const upcomingEvents = !isLoadingEvents && !eventsError && events
          ? events.filter((ev: any) => ev.date && new Date(ev.date) >= today)
          : [];
        if (!isLoadingEvents && upcomingEvents.length === 0) return null;
        return (
          <section className="relative w-full bg-[#EFF5F0] dark:bg-[#070E0B] py-20 pb-32 overflow-hidden">
            <div className="absolute pointer-events-none bottom-0 left-1/3 w-[600px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(61,184,107,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.3 }}
                      className="w-2 h-2 rounded-full" style={{ background: '#4ECCA3', boxShadow: '0 0 8px rgba(78,204,163,0.9)' }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ECCA3' }}>
                      Community
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.03em' }} className="text-[#1F3E2F] dark:text-white mb-3">
                    Upcoming <span style={{ color: '#4ECCA3' }}>Events</span>
                  </h2>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', color: 'rgba(91,117,102,0.8)' }} className="dark:!text-[rgba(155,179,166,0.75)]">
                    Join us for readings, launches, and cultural gatherings.
                  </p>
                </div>
                <Link to="/events" className="group flex items-center gap-2 shrink-0 pb-1 relative"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#4ECCA3' }}>
                  View All Events
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#4ECCA3] transition-all duration-400" />
                </Link>
              </motion.div>

              <div className="relative group/carousel">
                <button type="button" onClick={() => scrollByCards(eventsScrollerRef, -1)} aria-label="Scroll left"
                  className="hidden md:flex absolute -left-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                  style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(78,204,163,0.25)', backdropFilter: 'blur(12px)', color: '#4ECCA3', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" onClick={() => scrollByCards(eventsScrollerRef, 1)} aria-label="Scroll right"
                  className="hidden md:flex absolute -right-5 top-[38%] z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:scale-110"
                  style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(78,204,163,0.25)', backdropFilter: 'blur(12px)', color: '#4ECCA3', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>

                <motion.div
                  ref={eventsScrollerRef}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[46%] md:auto-cols-[36%] lg:auto-cols-[28%] xl:auto-cols-[24%] gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {isLoadingEvents ? (
                    <div className="text-center text-white/50 py-16">Loading events...</div>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((ev: any, index: number) => (
                      <motion.div
                        key={ev._id}
                        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                        className="group relative snap-start"
                      >
                        <Link to="/events" className="block">
                          <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.4 } }}
                            className="relative rounded-3xl overflow-hidden"
                            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.40)' }}
                          >
                            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl"
                              style={{ background: '#0D1C13' }}>
                              <img
                                src={(ev.images && ev.images.length > 0) ? ev.images[0].url : `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 100}`}
                                alt={ev.name?.en || 'Event'}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                                style={{ filter: 'brightness(0.82) contrast(1.08)' }}
                              />
                              <div className="absolute inset-0"
                                style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.60) 100%)' }} />
                              <div className="absolute top-0 left-0 right-0 h-1/4"
                                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)' }} />
                              {/* Date badge */}
                              <div className="absolute top-4 right-4 flex flex-col items-center"
                                style={{ background: 'rgba(7,14,11,0.85)', border: '1px solid rgba(78,204,163,0.25)', backdropFilter: 'blur(12px)', borderRadius: '12px', padding: '8px 12px', minWidth: '52px' }}>
                                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: '#4ECCA3', lineHeight: 1 }}>
                                  {new Date(ev.date).getDate()}
                                </span>
                                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(78,204,163,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>
                                  {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                                </span>
                              </div>
                            </div>
                            {/* Info panel */}
                            <div className="absolute bottom-0 left-0 right-0 z-30 p-5 pt-10 rounded-b-3xl"
                              style={{ background: 'linear-gradient(to top, rgba(5,12,8,0.97) 0%, rgba(5,12,8,0.85) 60%, transparent 100%)' }}>
                              <h3 className="font-bold text-white leading-tight mb-1 line-clamp-2"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 700 }}>
                                {ev.name?.en || ev.name?.ml || 'Event'}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(78,204,163,0.7)" strokeWidth="2">
                                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', color: 'rgba(78,204,163,0.70)' }}>
                                  {ev.place?.en || 'Kerala'}{ev.time ? ` · ${ev.time}` : ''}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))
                  ) : null}
                </motion.div>
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
};

export default Home;
