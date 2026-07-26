import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Book {
  _id: string;
  name: string;
  writer: string;
  price: number;
  coverImage?: { url: string };
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="group relative flex flex-col h-full perspective-[1200px]"
    >
      <Link to={`/books/${book._id}`} className="block h-full w-full outline-none">
        {/* Book Container with physical lift effect */}
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative bg-background border border-border rounded-sm shadow-sm flex flex-col h-full transform-style-3d group-hover:shadow-xl transition-shadow duration-300"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Decorative left spine hint */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary/5 border-r border-border z-10" />

          {/* Image Container with Parallax Tilt */}
          <div className="relative w-full aspect-[2/3] overflow-hidden bg-surface border-b border-border p-6 flex items-center justify-center">
            
            {/* The actual book cover with 3D rotation on hover */}
            <motion.div
              whileHover={{ rotateY: -10, rotateX: 5, scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full h-full shadow-md preserve-3d"
              style={{ transformOrigin: "left center", transformStyle: 'preserve-3d' }}
            >
              {/* Book Spine shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
              
              {book.coverImage?.url ? (
                <img 
                  src={book.coverImage.url} 
                  alt={book.name} 
                  className="w-full h-full object-cover rounded-r-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center p-4 rounded-r-sm">
                   <span className="font-heading text-xl text-primary text-center leading-snug">{book.name}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex flex-col flex-grow ml-3">
            {book.category && (
              <span className="text-xs uppercase tracking-wider text-primary mb-2 font-medium">
                {book.category}
              </span>
            )}
            <h3 className="font-heading text-2xl font-semibold text-text mb-1 line-clamp-2">
              {book.name}
            </h3>
            <p className="font-body text-text/70 /70 text-sm mb-4">
              {book.writer}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-body font-bold text-lg text-text">
                ₹{book.price}
              </span>
              <span className="text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-medium text-sm flex items-center gap-1">
                View Details <span className="text-lg leading-none">→</span>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
