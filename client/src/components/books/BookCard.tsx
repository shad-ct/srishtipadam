import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Book {
  _id: string;
  name: { en?: string; ml?: string };
  writer: { en?: string; ml?: string };
  price: number;
  coverImage?: { url: string; secure_url?: string } | string;
  category?: string;
}

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative flex flex-col h-full"
    >
      <Link to={`/books/${book._id}`} className="block h-full w-full outline-none">
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative flex flex-col h-full overflow-hidden rounded-xl border border-[#DCE8DF] dark:border-[#1E3626] bg-white dark:bg-[#0D1C13] shadow-md transition-all duration-300"
          style={{
            boxShadow: '0 4px 24px rgba(31,62,47,0.06)',
          }}
        >
          {/* Glory glow on hover — green top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DB86B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
          {/* Bottom glow bloom */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#3DB86B]/0 group-hover:bg-[#3DB86B]/20 blur-xl transition-all duration-500 rounded-full pointer-events-none z-0" />

          {/* Cover image */}
          <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#F4F1EA] dark:bg-[#112218] flex items-center justify-center p-5">
            <motion.div
              whileHover={{ rotateY: -8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative w-full h-full shadow-xl"
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/35 to-transparent z-20 pointer-events-none rounded-l" />
              {(() => {
                const ci = book.coverImage;
                const imgUrl = typeof ci === 'string' && ci.startsWith('http') ? ci
                  : typeof ci === 'object' ? (ci?.url || (ci as any)?.secure_url) : null;
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={book.name?.en || book.name?.ml || 'Unknown Title'}
                    className="w-full h-full object-cover rounded-r-md opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[#3DB86B]/10 dark:bg-[#3DB86B]/08 flex flex-col items-center justify-center p-4 rounded-r-md">
                    <span className="font-bold text-lg text-[#3DB86B] text-center leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {book.name?.en || book.name?.ml || 'Untitled'}
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col flex-grow relative z-10">
            {book.category && (
              <span className="text-[10px] uppercase tracking-widest text-[#3DB86B] mb-2 font-bold">
                {book.category}
              </span>
            )}
            <h3 className="font-bold text-[#1F3E2F] dark:text-white text-lg mb-1 line-clamp-2 leading-snug"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {book.name?.en || book.name?.ml || 'Unknown Title'}
            </h3>
            <p className="text-[#5B7566] dark:text-[#9CB3A6] text-sm mb-3 line-clamp-1">
              {book.writer?.en || book.writer?.ml || 'Unknown Author'}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-extrabold text-lg text-[#1F3E2F] dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ₹{book.price}
              </span>
              <span className="text-[#3DB86B] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-semibold text-sm flex items-center gap-1">
                View →
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
