import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

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
    <div className="w-full min-h-screen bg-[#F4F1EA] dark:bg-[#0B1E14] text-[#1F3E2F] dark:text-[#EAF4EE] font-sans selection:bg-[#1F3E2F] selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Decorative Elements - Leaves on edges */}
        <div className="absolute top-10 left-0 w-64 h-96 bg-[url('https://images.unsplash.com/photo-1542317148-8b4bdcca75bd?q=80&w=200&auto=format&fit=crop')] bg-contain bg-no-repeat opacity-[0.03] dark:opacity-[0.01] pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-20 right-0 w-64 h-96 bg-[url('https://images.unsplash.com/photo-1542317148-8b4bdcca75bd?q=80&w=200&auto=format&fit=crop')] bg-contain bg-no-repeat opacity-[0.03] dark:opacity-[0.01] pointer-events-none translate-x-1/2 rotate-180" />

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[55%] flex flex-col items-start z-10 lg:pl-10"
        >
          <span className="text-[#2F5A41] dark:text-[#A3D9B1] font-bold text-[13px] tracking-wide mb-3">
            A Collective of Words and Ink
          </span>

          <h1 className="text-6xl sm:text-7xl md:text-[5.5rem] font-serif italic font-medium text-[#1F3E2F] dark:text-[#EAF4EE] mb-2 tracking-tight leading-[1.05]">
            Srishtipadam
          </h1>

          <div className="w-16 h-[2px] bg-[#C1A57B] mb-6"></div>

          <p className="text-xl text-[#3B5A4B] dark:text-[#9DB3A6] mb-10 font-medium">
            Discover Literature, Embrace Nature
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-16">
            <Link
              to="/books"
              className="bg-[#1F3E2F] dark:bg-[#A3D9B1] dark:text-[#0B1E14] text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-3 hover:bg-[#152E22] dark:hover:bg-[#8CC69A] transition-colors shadow-lg shadow-[#1F3E2F]/10"
            >
              Browse Books <span className="text-lg">→</span>
            </Link>

            <Link
              to="/magazines"
              className="text-[#1F3E2F] dark:text-[#EAF4EE] font-bold flex items-center gap-2 hover:opacity-80 transition-opacity border-b-[2px] border-[#1F3E2F] dark:border-[#EAF4EE] pb-0.5"
            >
              Read our Magazine <span className="text-xl">📖</span>
            </Link>
          </div>

          {/* Stats container */}
          <div className="w-full bg-white/70 dark:bg-[#16281F]/70 backdrop-blur-md rounded-2xl p-6 flex flex-wrap justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mb-8 border border-[#E8E2D2] dark:border-[#24392C]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EAEFEB] dark:bg-[#24392C] text-[#2F5A41] dark:text-[#A3D9B1] rounded-xl flex items-center justify-center text-xl">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg>
              </div>
              <div>
                <div className="font-serif font-bold text-2xl text-[#1F3E2F] dark:text-white">500+</div>
                <div className="text-sm text-[#5B7566] dark:text-[#9DB3A6] font-medium">Books</div>
              </div>
            </div>
            <div className="w-[1px] h-12 bg-[#E8E2D2] dark:bg-[#24392C] hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EAEFEB] dark:bg-[#24392C] text-[#2F5A41] dark:text-[#A3D9B1] rounded-xl flex items-center justify-center text-xl">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7zm0-4h10v2H7zm0 8h10v2H7z" /></svg>
              </div>
              <div>
                <div className="font-serif font-bold text-2xl text-[#1F3E2F] dark:text-white">20+</div>
                <div className="text-sm text-[#5B7566] dark:text-[#9DB3A6] font-medium">Magazines</div>
              </div>
            </div>
            <div className="w-[1px] h-12 bg-[#E8E2D2] dark:bg-[#24392C] hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EAEFEB] dark:bg-[#24392C] text-[#2F5A41] dark:text-[#A3D9B1] rounded-xl flex items-center justify-center text-xl">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
              </div>
              <div>
                <div className="font-serif font-bold text-2xl text-[#1F3E2F] dark:text-white">1k+</div>
                <div className="text-sm text-[#5B7566] dark:text-[#9DB3A6] font-medium">Readers</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Featured Card */}
        {featuredBook && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[45%] flex justify-center lg:justify-end z-10 relative mt-10 lg:mt-0"
          >
            <Link to={`/books/${featuredBook._id}`} className="relative w-[90%] max-w-[540px] aspect-[4/3.5] rounded-[2rem] overflow-hidden shadow-2xl group block">
              <img src={(typeof featuredBook.coverImage === 'string' && featuredBook.coverImage !== '') ? featuredBook.coverImage : (featuredBook.coverImage?.url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop")} alt={featuredBook.name?.en || featuredBook.name?.ml || 'Featured Book' || 'Featured Book'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#162D1F]/90 via-[#162D1F]/30 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 flex flex-col items-start justify-end">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-4">
                  FEATURED
                </div>
                <div className="flex items-end justify-between w-full gap-4">
                  <div>
                    <h3 className="font-serif text-3xl sm:text-4xl text-white mb-2">{featuredBook.name?.en || featuredBook.name?.ml || 'Featured Book'}</h3>
                    <p className="text-white/70 text-sm sm:text-base font-medium">{featuredBook.writer?.en || featuredBook.writer?.ml || 'Srishtipadam Publications'}</p>
                  </div>
                  <button className="w-12 h-12 shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all group-hover:translate-x-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </section>

      {/* Features Row - Centered and Spaced Out */}
      <section className="w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 z-30 relative mb-[-40px] md:mb-[-50px] pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
          <div className="flex flex-col items-center text-center gap-3 p-6 bg-[#FBF9F4]/90 dark:bg-[#16281F]/90 rounded-xl border border-[#E8E2D2] dark:border-[#24392C]/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none backdrop-blur-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#EAEFEB] dark:bg-[#1E3326] rounded-full flex items-center justify-center text-[#2F5A41] dark:text-[#A3D9B1] shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
            </div>
            <div>
              <div className="font-serif font-bold text-[#1F3E2F] dark:text-[#EAF4EE] text-base mb-1 tracking-wide">Nature Inspired</div>
              <div className="text-[13px] text-[#5B7566] dark:text-[#9DB3A6] leading-relaxed">Stories that celebrate the beauty of our world.</div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-3 p-6 bg-[#F6EFE3]/90 dark:bg-[#2A231C]/90 rounded-xl border border-[#D5C2A4]/40 dark:border-[#4A3B2C]/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none backdrop-blur-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#DCCBB4] dark:bg-[#3D3024] rounded-full flex items-center justify-center text-[#4A3B2C] dark:text-[#D5C2A4] shrink-0 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            </div>
            <div>
              <div className="font-serif font-bold text-[#1F3E2F] dark:text-[#EAF4EE] text-base mb-1 tracking-wide">Words that Connect</div>
              <div className="text-[13px] text-[#5B7566] dark:text-[#9DB3A6] leading-relaxed">Uniting readers and writers through the power of words.</div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-3 p-6 bg-[#EEF2F0]/90 dark:bg-[#1C2C23]/90 rounded-xl border border-[#C8D3CC]/50 dark:border-[#24392C]/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none backdrop-blur-md transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#C8D3CC] dark:bg-[#263D31] rounded-full flex items-center justify-center text-[#2F5A41] dark:text-[#A3D9B1] shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div>
              <div className="font-serif font-bold text-[#1F3E2F] dark:text-[#EAF4EE] text-base mb-1 tracking-wide">A Creative Community</div>
              <div className="text-[13px] text-[#5B7566] dark:text-[#9DB3A6] leading-relaxed">A platform for ideas, expression and collaboration.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Reads for You Section (Books) */}
      <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white pt-32 pb-24 overflow-hidden mt-6">
        {/* Wave Divider - Top, Layer 1 */}
        <div className="absolute top-0 left-0 w-[200vw] overflow-hidden leading-none z-20 transform -translate-y-[99%] flex">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 26 }}
            className="flex w-full"
          >
            {[0, 1].map((i) => (
              <svg
                key={i}
                className="block w-[100vw] h-[60px] md:h-[90px] shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,60 C150,110 300,10 450,55 C600,100 750,20 900,60 C1000,85 1100,45 1200,60 V120 H0 Z"
                  className="fill-[#173121] dark:fill-[#0A1910] opacity-50 transition-colors duration-300"
                />
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
              <svg
                key={i}
                className="block w-[100vw] h-[70px] md:h-[110px] shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,50 C200,0 350,90 550,50 C700,20 850,90 1000,55 C1080,40 1150,60 1200,50 V120 H0 Z"
                  className="fill-[#173121] dark:fill-[#0A1910] transition-colors duration-300"
                />
              </svg>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
            <h2 className="text-3xl md:text-[2rem] text-white font-serif flex items-center gap-3">
              Curated Reads for You <span className="w-8 border-b-2 border-[#5B7B68] mb-1"></span><span className="text-[#A3D9B1] text-xl opacity-80 -ml-1">🍃</span>
            </h2>

            <div className="flex items-center gap-4">
              <Link to="/books" className="flex items-center gap-3 text-[#A3D9B1] hover:text-white transition-colors font-medium text-sm">
                View all Books
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group/carousel">
            <button
              type="button"
              onClick={() => scrollByCards(booksScrollerRef, -1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#244631] hover:bg-[#2C563D] text-[#A3D9B1] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(booksScrollerRef, 1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#244631] hover:bg-[#2C563D] text-[#A3D9B1] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <motion.div
              ref={booksScrollerRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {isLoading ? (
                <div className="col-span-full text-center text-white/60 py-12">Loading collection...</div>
              ) : error ? (
                <div className="col-span-full text-center text-red-400 py-12">Failed to load collection.</div>
              ) : books && books.length > 0 ? (
                books.map((book: any, index: number) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    key={book._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]"
                  >
                    <Link to={`/books/${book._id}`} className="block w-full h-full">
                      <img
                        src={(typeof book.coverImage === 'string' && book.coverImage !== '') ? book.coverImage : (book.coverImage?.url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index}`)}
                        alt={book.name?.en || book.name?.ml || 'Book'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                      <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                        <h3 className="text-white font-serif text-xl leading-tight mb-1">{book.name?.en || book.name?.ml || 'Book'}</h3>
                        {(book.name?.ml && book.name.ml !== book.name?.en) && <p className="text-white/90 font-medium mb-2">{book.name.ml}</p>}
                        <p className="text-[11px] text-white/70 uppercase tracking-wide mb-1">
                          By {book.writer?.en || 'Unknown'} {(book.writer?.ml && book.writer.ml !== book.writer?.en) ? `(${book.writer.ml})` : ''}
                        </p>
                        <p className="text-[11px] text-[#A3D9B1] uppercase tracking-wide">
                          {book.category || 'Collection'} • ₹{book.price || 0}
                        </p>
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

      {/* Featured Magazines Section */}
      <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
            <h2 className="text-3xl md:text-[2rem] text-white font-serif flex items-center gap-3">
              Our Magazines <span className="w-8 border-b-2 border-[#D5C2A4] mb-1"></span><span className="text-[#D5C2A4] text-xl opacity-80 -ml-1">📖</span>
            </h2>

            <div className="flex items-center gap-4">
              <Link to="/magazines" className="flex items-center gap-3 text-[#D5C2A4] hover:text-white transition-colors font-medium text-sm">
                View all Magazines
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative group/carousel">
            <button
              type="button"
              onClick={() => scrollByCards(magsScrollerRef, -1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#3D3024] hover:bg-[#4A3B2C] text-[#D5C2A4] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(magsScrollerRef, 1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#3D3024] hover:bg-[#4A3B2C] text-[#D5C2A4] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <motion.div
              ref={magsScrollerRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {isLoadingMags ? (
                <div className="col-span-full text-center text-white/60 py-12">Loading magazines...</div>
              ) : magsError ? (
                <div className="col-span-full text-center text-red-400 py-12">Failed to load magazines.</div>
              ) : magazines && magazines.length > 0 ? (
                magazines.map((mag: any, index: number) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    key={mag._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]"
                  >
                    <Link to="/magazines" className="block w-full h-full">
                      <img
                        src={(typeof mag.coverImage === 'string' && mag.coverImage !== '') ? mag.coverImage : (mag.coverImage?.url || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 50}`)}
                        alt={mag.title?.en || mag.title?.ml || 'Magazine'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                      <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                        <h3 className="text-white font-serif text-xl leading-tight mb-1">{mag.title?.en || mag.title?.ml || 'Magazine'}</h3>
                        {(mag.title?.ml && mag.title.ml !== mag.title?.en) && <p className="text-white/90 font-medium mb-2">{mag.title.ml}</p>}
                        <p className="text-[11px] text-[#D5C2A4] uppercase tracking-wide">
                          Issue {mag.issueNumber} {mag.pages ? `• ${mag.pages} Pages` : ''}
                        </p>
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

      {/* Upcoming Events Section - only shown when there are upcoming events */}
      {(() => {
        const upcomingEvents = !isLoadingEvents && !eventsError && events
          ? events.filter((ev: any) => ev.date && new Date(ev.date) >= today)
          : [];
        if (!isLoadingEvents && upcomingEvents.length === 0) return null;
        return (
          <section className="relative bg-[#173121] dark:bg-[#0A1910] text-white pt-12 pb-32 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 px-4">
                <h2 className="text-3xl md:text-[2rem] text-white font-serif flex items-center gap-3">
                  Upcoming Events <span className="w-8 border-b-2 border-[#8CC69A] mb-1"></span><span className="text-[#8CC69A] text-xl opacity-80 -ml-1">🎉</span>
                </h2>

                <div className="flex items-center gap-4">
                  <Link to="/events" className="flex items-center gap-3 text-[#8CC69A] hover:text-white transition-colors font-medium text-sm">
                    View all Events
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative group/carousel">
                <button
                  type="button"
                  onClick={() => scrollByCards(eventsScrollerRef, -1)}
                  aria-label="Scroll left"
                  className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#263D31] hover:bg-[#2C4A3C] text-[#8CC69A] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards(eventsScrollerRef, 1)}
                  aria-label="Scroll right"
                  className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#263D31] hover:bg-[#2C4A3C] text-[#8CC69A] items-center justify-center transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>

                <motion.div
                  ref={eventsScrollerRef}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  className="grid grid-flow-col auto-cols-[65%] sm:auto-cols-[40%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {isLoadingEvents ? (
                    <div className="col-span-full text-center text-white/60 py-12">Loading events...</div>
                  ) : eventsError ? (
                    <div className="col-span-full text-center text-red-400 py-12">Failed to load events.</div>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((ev: any, index: number) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 40 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        key={ev._id} className="relative aspect-[1/1.45] rounded-2xl overflow-hidden group snap-start bg-[#0A1910]"
                      >
                        <Link to="/events" className="block w-full h-full">
                          <img
                            src={(ev.images && ev.images.length > 0) ? ev.images[0].url : `https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&sig=${index + 100}`}
                            alt={ev.name?.en || ev.name?.ml || 'Event'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                          <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end">
                            <h3 className="text-white font-serif text-xl leading-tight mb-1">{ev.name?.en || ev.name?.ml || 'Event'}</h3>
                            {(ev.name?.ml && ev.name.ml !== ev.name?.en) && <p className="text-white/90 font-medium mb-2">{ev.name.ml}</p>}
                            <p className="text-[11px] text-[#8CC69A] uppercase tracking-wide">
                              {ev.date ? new Date(ev.date).toLocaleDateString() : 'Upcoming'} {ev.time ? `• ${ev.time}` : ''}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : null}
                </motion.div>
              </div>
            </motion.div>

            {/* Wave Divider - Bottom (mirrors the top so the band flows back out cleanly) */}
            <div className="absolute bottom-0 left-0 w-[200vw] overflow-hidden leading-none z-20 transform translate-y-[97%] flex rotate-180">
              <motion.div
                animate={{ x: [0, "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="flex w-full"
              >
                {[0, 1].map((i) => (
                  <svg
                    key={i}
                    className="block w-[100vw] h-[60px] md:h-[90px] shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,55 C180,15 320,95 500,55 C650,25 800,90 950,60 C1050,40 1130,65 1200,55 V120 H0 Z"
                      className="fill-[#173121] dark:fill-[#0A1910] transition-colors duration-300"
                    />
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