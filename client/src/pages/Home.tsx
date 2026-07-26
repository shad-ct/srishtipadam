import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BookCard from '../components/books/BookCard';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const Home = () => {
  const { t } = useTranslation();
  const [showMalayalam, setShowMalayalam] = useState(true);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books');
      return data;
    }
  });

  // Animated typography effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMalayalam(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-background overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="h-24 mb-4 flex items-end">
                <AnimatePresence mode="wait">
                  {showMalayalam ? (
                    <motion.div
                      key="ml"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-primary font-heading text-xl sm:text-2xl md:text-3xl font-medium tracking-wide"
                    >
                      വാക്കുകളുടെയും മഷിയുടെയും ഒരു കൂട്ടായ്മ
                    </motion.div>
                  ) : (
                    <motion.div
                      key="en"
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="text-primary font-heading text-xl sm:text-2xl md:text-3xl font-medium tracking-wide"
                    >
                      A Collective of Words and Ink
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text font-heading mb-8 leading-tight"
              >
                Srishti<span className="text-primary">padam</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg md:text-xl text-text/80 /80 mb-10 max-w-lg font-body leading-relaxed"
              >
                {t('home.tagline')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap items-center gap-6"
              >
                <Link
                  to="/books"
                  className="group relative inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-surface font-medium text-lg px-8 py-4 shadow-sm transition-all duration-300"
                >
                  <span className="relative z-10">{t('home.cta')}</span>
                  <div className="absolute inset-0 border border-primary/20 scale-105 group-hover:scale-100 transition-transform duration-300" />
                </Link>

                <Link to="/magazines" className="text-text font-medium underline decoration-accent decoration-2 underline-offset-8 hover:text-accent transition-colors duration-300">
                  Read our Magazine
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Featured Book Parallax */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end relative"
            >
              <div className="relative w-64 md:w-80 lg:w-[400px] aspect-[2/3] group perspective-[1000px]">
                <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
                <motion.div
                  whileHover={{ rotateY: -15, rotateX: 5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full h-full bg-surface-dark/5 dark:bg-surface/5 border border-primary/20 shadow-2xl relative preserve-3d overflow-hidden flex flex-col"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Spine hint */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />

                  {/* Book Cover Image Placeholder */}
                  <div className="h-[75%] w-full bg-surface relative">
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
                      alt="Featured Book"
                      className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                    />
                  </div>

                  {/* Book Title Area */}
                  <div className="h-[25%] bg-primary p-6 flex flex-col justify-center">
                    <h3 className="text-surface font-heading text-xl">The Kerala Story</h3>
                    <p className="text-surface/70 /60 font-body text-sm mt-1">Srishtipadam Publications</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Torn Paper Edge Bottom Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 transform translate-y-[1px]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className="fill-surface transition-colors duration-300"></path>
          </svg>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 bg-surface relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-text font-heading"
          >
            Featured <span className="text-primary italic">Books</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {isLoading ? (
              <div className="col-span-full text-center text-text-secondary py-12">Loading collection...</div>
            ) : error ? (
              <div className="col-span-full text-center text-error py-12">Failed to load collection.</div>
            ) : books && books.length > 0 ? (
              books.slice(0, 3).map((book: any, index: number) => (
                <BookCard key={book._id} book={book} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center text-text-secondary py-12">No featured books available.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
