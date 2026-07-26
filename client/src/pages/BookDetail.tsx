import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BookDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ml' | 'en';

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const { data } = await axiosClient.get(`/books/${id}`);
        return data || null;
      } catch (e) {
        throw new Error('Book not found');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-background">
        <div className="text-text-secondary animate-pulse">Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-background">
        <h2 className="text-3xl font-heading text-error mb-4">Book Not Found</h2>
        <Link to="/books" className="text-primary hover:underline underline-offset-4">
          ← Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        
        <Link to="/books" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-12 font-medium">
          <span className="mr-2">←</span> Back to Collection
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left Column - Book Cover (Physical representation) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-5/12 lg:w-1/3"
          >
            <div className="relative w-full aspect-[2/3] bg-surface-raised border border-border rounded-sm shadow-xl flex items-center justify-center perspective-[1200px]">
              {/* Decorative left spine hint */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/10 to-transparent border-r border-border z-10 pointer-events-none" />
              
              {book.coverImage?.url ? (
                <img 
                  src={book.coverImage.url} 
                  alt={book.name} 
                  className="w-full h-full object-cover rounded-r-sm opacity-95 hover:opacity-100 transition-opacity" 
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center p-6 rounded-r-sm text-center">
                  <span className="font-heading text-2xl text-primary mb-4 leading-snug">{book.name}</span>
                  <span className="font-body text-text-secondary text-sm">{book.writer}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details & Order */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-7/12 lg:w-2/3 flex flex-col"
          >
            {book.category && (
              <span className="text-xs uppercase tracking-widest text-primary mb-3 font-bold border border-primary/20 bg-primary/5 inline-block w-max px-3 py-1 rounded-sm">
                {book.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text font-heading mb-4 leading-tight">
              {book.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-body text-text-secondary mb-8 border-b border-border pb-8">
              By <span className="font-semibold text-text">{book.writer}</span>
            </p>

            <div className="prose prose-lg text-text/80 mb-10 font-body leading-relaxed max-w-prose">
              {book.description ? (
                <p>{book.description[lang] || book.description.ml}</p>
              ) : (
                <p>
                  No detailed description available for this title. This is a placeholder description 
                  demonstrating the typeset layout of a book detail page in Srishtipadham.
                </p>
              )}
              {book.pages && <p className="text-sm mt-4 text-text-secondary">Pages: {book.pages}</p>}
            </div>

            <div className="mt-auto bg-surface-raised border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <span className="block text-sm text-text-secondary font-medium uppercase tracking-widest mb-1">Price</span>
                <span className="font-body font-bold text-4xl text-text">₹{book.price}</span>
              </div>
              
              <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-surface-raised font-medium text-lg px-10 py-4 shadow-sm transition-all duration-300 relative group">
                <span className="relative z-10">Order Copy</span>
                <div className="absolute inset-0 border border-primary/20 scale-105 group-hover:scale-100 transition-transform duration-300" />
              </button>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BookDetail;
