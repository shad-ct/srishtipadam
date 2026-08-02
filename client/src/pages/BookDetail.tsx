import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BookDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
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
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#F4F1EA] dark:bg-[#070E0B]">
        <div className="text-[#9CB3A6] animate-pulse font-medium">Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#F4F1EA] dark:bg-[#070E0B]">
        <h2 className="text-3xl font-extrabold text-red-400 mb-4">Book Not Found</h2>
        <Link to="/books" className="text-[#3DB86B] hover:underline underline-offset-4 font-semibold">
          ← Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#3DB86B]/06 dark:bg-[#3DB86B]/04 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/03 blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <Link to="/books" className="inline-flex items-center text-[#5B7566] dark:text-[#9CB3A6] hover:text-[#3DB86B] transition-colors mb-12 font-semibold">
          <span className="mr-2">←</span> Back to Collection
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Book cover with glory glow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full md:w-5/12 lg:w-1/3"
          >
            <div className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-[#DCE8DF] dark:border-[#1E3626] bg-white dark:bg-[#0D1C13] shadow-2xl">
              {/* Glory top edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DB86B] to-transparent z-20" />
              {/* Glory glow orb behind cover */}
              <div className="absolute -inset-4 bg-[#3DB86B]/08 dark:bg-[#3DB86B]/06 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/15 to-transparent border-r border-[#DCE8DF] dark:border-[#1E3626] z-10 pointer-events-none" />
              {/* Resolve coverImage from both string and {url} object shapes */}
              {(() => {
                const ci = book.coverImage;
                const imgUrl = typeof ci === 'string' && ci.startsWith('http') ? ci
                  : (ci?.url || ci?.secure_url || null);
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={book.name?.en || book.name?.ml || 'Unknown Title'}
                    className="w-full h-full object-cover rounded-r-sm opacity-95 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-[#3DB86B]/10 flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-extrabold text-2xl text-[#3DB86B] mb-4 leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {book.name?.en || book.name?.ml || 'Unknown Title'}
                    </span>
                    <span className="text-[#9CB3A6] text-sm font-medium">{book.writer?.en || book.writer?.ml}</span>
                  </div>
                );
              })()}
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
              <span className="text-[10px] uppercase tracking-widest text-[#3DB86B] mb-3 font-extrabold border border-[#3DB86B]/25 bg-[#3DB86B]/08 inline-block w-max px-3 py-1 rounded-full"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {book.category}
              </span>
            )}

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-4 leading-tight tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
            >
              {book.name?.en || book.name?.ml || 'Unknown Title'}
            </h1>

            <p className="text-xl md:text-2xl font-medium text-[#5B7566] dark:text-[#9CB3A6] mb-8 pb-8 border-b border-[#DCE8DF] dark:border-[#1E3626]">
              By <span className="font-bold text-[#1F3E2F] dark:text-white">{book.writer?.en || book.writer?.ml || 'Unknown Author'}</span>
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

            <div className="mt-auto bg-white dark:bg-[#0D1C13] border border-[#DCE8DF] dark:border-[#1E3626] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl relative overflow-hidden">
              {/* Glory glow on order box */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3DB86B]/50 to-transparent" />
              <div>
                <span className="block text-[11px] text-[#9CB3A6] font-bold uppercase tracking-widest mb-1">Price</span>
                <span className="font-extrabold text-4xl text-[#1F3E2F] dark:text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{book.price}</span>
              </div>
              <button
                className="w-full sm:w-auto text-white font-bold text-base px-10 py-4 rounded-full transition-all duration-300 hover:scale-[1.04] hover:shadow-xl active:scale-95"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: 'linear-gradient(135deg, #3DB86B 0%, #2d9d57 100%)',
                  boxShadow: '0 4px 20px rgba(61,184,107,0.3)',
                }}
              >
                Order Copy
              </button>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BookDetail;
