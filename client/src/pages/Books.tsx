import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import BookCard from '../components/books/BookCard';

const Books = () => {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books');
      return data;
    }
  });

  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#3DB86B]/06 dark:bg-[#3DB86B]/04 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/03 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 pb-8 border-b border-[#DCE8DF] dark:border-[#1E3626]"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#3DB86B] mb-4 px-3 py-1 rounded-full bg-[#3DB86B]/10 border border-[#3DB86B]/20">
            Our Collection
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-4 tracking-tight leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Explore <span className="text-[#3DB86B]">Books</span>
          </h1>
          <p className="text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl text-lg font-medium">
            Curated literature, poetry, and cultural essays from our library.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">
          {isLoading ? (
            <div className="col-span-full text-center text-[#9CB3A6] py-12">Loading collection...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-400 py-12">Failed to load collection.</div>
          ) : (
            books?.map((book: any, idx: number) => (
              <div key={book._id} className="h-[320px]">
                <BookCard book={book} index={idx} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
