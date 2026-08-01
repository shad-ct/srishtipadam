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
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 mx-auto">
            <img src="/favicon.svg" alt="Srishtipadam logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            {/* Fallback ring if no favicon */}
            <div className="w-full h-full bg-[#112218] dark:bg-[#0D1A11] flex items-center justify-center absolute inset-0 -z-10">
              <svg viewBox="0 0 24 24" className="w-14 h-14 text-[#4C9A6A]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 12s1-3 4-3 4 3 4 3"/>
                <path d="M12 9v6"/>
              </svg>
            </div>
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
          Srishtipadam
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
      <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white pt-24 pb-24 overflow-hidden">
        {/* Wave Divider - Top, Layer 1 */}
        <div className="absolute top-0 left-0 w-[200vw] overflow-hidden leading-none z-20 transform -translate-y-[99%] flex">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 26 }}
            className="flex w-full"
          >
            {[0, 1].map((i) => (
              <svg key={i} className="block w-[100vw] h-[60px] md:h-[90px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,60 C150,110 300,10 450,55 C600,100 750,20 900,60 C1000,85 1100,45 1200,60 V120 H0 Z" className="fill-[#173121] dark:fill-[#0A1910] opacity-50 transition-colors duration-300"/>
              </svg>
            ))}
          </motion.div>
        </div>
        {/* Wave Divider - Top, Layer 2 */}
        <div className="absolute top-0 left-0 w-[200vw] overflow-hidden leading-none z-20 transform -translate-y-[97%] flex">
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
            className="flex w-full"
          >
            {[0, 1].map((i) => (
              <svg key={i} className="block w-[100vw] h-[70px] md:h-[110px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,50 C200,0 350,90 550,50 C700,20 850,90 1000,55 C1080,40 1150,60 1200,50 V120 H0 Z" className="fill-[#173121] dark:fill-[#0A1910] transition-colors duration-300"/>
              </svg>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
            <h2 className="text-3xl md:text-[2rem] text-white font-extrabold flex items-center gap-3" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Curated Reads for You <span className="w-8 border-b-2 border-[#5B7B68] mb-1"></span><span className="text-[#A3D9B1] text-xl opacity-80 -ml-1">🍃</span>
            </h2>
            <div className="flex items-center gap-4">
              <Link to="/books" className="flex items-center gap-3 text-[#A3D9B1] hover:text-white transition-colors font-medium text-sm">
                View all Books
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group/carousel">
            <button type="button" onClick={() => scrollByCards(booksScrollerRef, -1)} aria-label="Scroll left" className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#244631] hover:bg-[#2C563D] text-[#A3D9B1] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" onClick={() => scrollByCards(booksScrollerRef, 1)} aria-label="Scroll right" className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#244631] hover:bg-[#2C563D] text-[#A3D9B1] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <motion.div ref={booksScrollerRef} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {isLoading ? (
                <div className="col-span-full text-center text-white/60 py-12">Loading collection...</div>
              ) : error ? (
                <div className="col-span-full text-center text-red-400 py-12">Failed to load collection.</div>
              ) : books && books.length > 0 ? (
                books.map((book: any, index: number) => (
                  <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} key={book._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]">
                    <Link to={`/books/${book._id}`} className="block w-full h-full">
                      <img src={(typeof book.coverImage === 'string' && book.coverImage !== '') ? book.coverImage : (book.coverImage?.url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index}`)} alt={book.name?.en || book.name?.ml || 'Book'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"/>
                      <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                        <h3 className="text-white font-bold text-xl leading-tight mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{book.name?.en || book.name?.ml || 'Book'}</h3>
                        {(book.name?.ml && book.name.ml !== book.name?.en) && <p className="text-white/90 font-medium mb-2">{book.name.ml}</p>}
                        <p className="text-[11px] text-white/70 uppercase tracking-wide mb-1">By {book.writer?.en || 'Unknown'} {(book.writer?.ml && book.writer.ml !== book.writer?.en) ? `(${book.writer.ml})` : ''}</p>
                        <p className="text-[11px] text-[#A3D9B1] uppercase tracking-wide">{book.category || 'Collection'} • ₹{book.price || 0}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-white/60 py-12">No books available.</div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── MAGAZINES ──────────────────────────────────────────────────────── */}
      <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white py-12 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
            <h2 className="text-3xl md:text-[2rem] text-white font-extrabold flex items-center gap-3" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Our Magazines <span className="w-8 border-b-2 border-[#D5C2A4] mb-1"></span><span className="text-[#D5C2A4] text-xl opacity-80 -ml-1">📖</span>
            </h2>
            <div className="flex items-center gap-4">
              <Link to="/magazines" className="flex items-center gap-3 text-[#D5C2A4] hover:text-white transition-colors font-medium text-sm">
                View all Magazines
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group/carousel">
            <button type="button" onClick={() => scrollByCards(magsScrollerRef, -1)} aria-label="Scroll left" className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#3D3024] hover:bg-[#4A3B2C] text-[#D5C2A4] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button type="button" onClick={() => scrollByCards(magsScrollerRef, 1)} aria-label="Scroll right" className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#3D3024] hover:bg-[#4A3B2C] text-[#D5C2A4] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <motion.div ref={magsScrollerRef} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {isLoadingMags ? (
                <div className="col-span-full text-center text-white/60 py-12">Loading magazines...</div>
              ) : magsError ? (
                <div className="col-span-full text-center text-red-400 py-12">Failed to load magazines.</div>
              ) : magazines && magazines.length > 0 ? (
                magazines.map((mag: any, index: number) => (
                  <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} key={mag._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]">
                    <Link to="/magazines" className="block w-full h-full">
                      <img src={(typeof mag.coverImage === 'string' && mag.coverImage !== '') ? mag.coverImage : (mag.coverImage?.url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 50}`)} alt={mag.title?.en || mag.title?.ml || 'Magazine'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"/>
                      <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                        <h3 className="text-white font-bold text-xl leading-tight mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{mag.title?.en || mag.title?.ml || 'Magazine'}</h3>
                        {(mag.title?.ml && mag.title.ml !== mag.title?.en) && <p className="text-white/90 font-medium mb-2">{mag.title.ml}</p>}
                        <p className="text-[11px] text-[#D5C2A4] uppercase tracking-wide">Issue {mag.issueNumber} {mag.pages ? `• ${mag.pages} Pages` : ''}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-white/60 py-12">No magazines available.</div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── EVENTS ─────────────────────────────────────────────────────────── */}
      {(() => {
        const upcomingEvents = !isLoadingEvents && !eventsError && events
          ? events.filter((ev: any) => ev.date && new Date(ev.date) >= today)
          : [];
        if (!isLoadingEvents && upcomingEvents.length === 0) return null;
        return (
          <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white pt-12 pb-32 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
                <h2 className="text-3xl md:text-[2rem] text-white font-extrabold flex items-center gap-3" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  Upcoming Events <span className="w-8 border-b-2 border-[#8CC69A] mb-1"></span><span className="text-[#8CC69A] text-xl opacity-80 -ml-1">🎉</span>
                </h2>
                <div className="flex items-center gap-4">
                  <Link to="/events" className="flex items-center gap-3 text-[#8CC69A] hover:text-white transition-colors font-medium text-sm">
                    View all Events
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative group/carousel">
                <button type="button" onClick={() => scrollByCards(eventsScrollerRef, -1)} aria-label="Scroll left" className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#263D31] hover:bg-[#2C4A3C] text-[#8CC69A] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" onClick={() => scrollByCards(eventsScrollerRef, 1)} aria-label="Scroll right" className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#263D31] hover:bg-[#2C4A3C] text-[#8CC69A] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>

                <motion.div ref={eventsScrollerRef} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {isLoadingEvents ? (
                    <div className="col-span-full text-center text-white/60 py-12">Loading events...</div>
                  ) : eventsError ? (
                    <div className="col-span-full text-center text-red-400 py-12">Failed to load events.</div>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((ev: any, index: number) => (
                      <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} key={ev._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]">
                        <Link to="/events" className="block w-full h-full">
                          <img src={(ev.images && ev.images.length > 0) ? ev.images[0].url : `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 100}`} alt={ev.name?.en || ev.name?.ml || 'Event'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"/>
                          <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                            <h3 className="text-white font-bold text-xl leading-tight mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{ev.name?.en || ev.name?.ml || 'Event'}</h3>
                            {(ev.name?.ml && ev.name.ml !== ev.name?.en) && <p className="text-white/90 font-medium mb-2">{ev.name.ml}</p>}
                            <p className="text-[11px] text-[#8CC69A] uppercase tracking-wide">{ev.date ? new Date(ev.date).toLocaleDateString() : 'Upcoming'} {ev.time ? `• ${ev.time}` : ''}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : null}
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 w-[200vw] overflow-hidden leading-none z-20 transform translate-y-[97%] flex rotate-180">
              <motion.div animate={{ x: [0, "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} className="flex w-full">
                {[0, 1].map((i) => (
                  <svg key={i} className="block w-[100vw] h-[60px] md:h-[90px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,55 C180,15 320,95 500,55 C650,25 800,90 950,60 C1050,40 1130,65 1200,55 V120 H0 Z" className="fill-[#173121] dark:fill-[#0A1910] transition-colors duration-300"/>
                  </svg>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })()}
    </div>
  );
};

export default Home;