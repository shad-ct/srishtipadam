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
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-border pb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text font-heading mb-4">
            Our <span className="italic text-primary">Collection</span>
          </h1>
          <p className="font-body text-text/70 /70 max-w-2xl text-lg">
            Explore our curated selection of literature, poetry, and cultural essays.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-12">
          {isLoading ? (
            <div className="col-span-full text-center text-text-secondary py-12">Loading collection...</div>
          ) : error ? (
            <div className="col-span-full text-center text-error py-12">Failed to load collection.</div>
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
