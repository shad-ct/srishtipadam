import React from 'react';
import { motion } from 'framer-motion';

interface MagazineDetailsModalProps {
  magazine: any;
  onClose: () => void;
}

const MagazineDetailsModal: React.FC<MagazineDetailsModalProps> = ({ magazine, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-surface border border-border w-full max-w-5xl max-h-[90vh] md:h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-background/50 hover:bg-background text-text p-2 rounded-full backdrop-blur-md transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Left Side: Cover Image */}
        <div className="w-full md:w-1/2 h-64 md:h-full bg-background relative flex-shrink-0 border-b md:border-b-0 md:border-r border-border">
          {magazine.coverImage?.url ? (
            <img 
              src={magazine.coverImage.url}
              alt={`${magazine.title?.en} cover`}
              className="absolute inset-0 w-full h-full object-contain bg-black/5"
            />
          ) : (
            <div className="w-full h-full bg-primary/5 flex items-center justify-center p-4">
              <span className="font-heading text-2xl text-primary/30 text-center">No Cover Image</span>
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-surface">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm bg-accent/20 text-accent border border-accent/20">
              Issue {magazine.issueNumber}
            </span>
            {magazine.publishedDate && (
              <span className="text-text/60 text-sm font-medium">
                {new Date(magazine.publishedDate).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-2 leading-tight">
            {magazine.title?.en}
          </h2>
          {magazine.title?.ml && (
            <h3 className="text-xl md:text-2xl font-heading font-medium text-text/80 mb-6 leading-tight">
              {magazine.title.ml}
            </h3>
          )}

          <div className="border-t border-border pt-6 mb-8 flex-grow">
            <h3 className="text-lg font-bold text-text mb-3">About this issue</h3>
            {magazine.description?.en ? (
              <p className="text-text/80 whitespace-pre-line leading-relaxed">
                {magazine.description.en}
              </p>
            ) : (
              <p className="text-text/40 italic">No description available.</p>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            {magazine.pdf?.url ? (
              <a 
                href={magazine.pdf.url} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-primary hover:bg-primary-hover text-surface-raised font-bold py-4 px-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Read Full Magazine
              </a>
            ) : (
              <button 
                disabled
                className="w-full text-center bg-surface-raised text-text/40 font-bold py-4 px-8 rounded-lg border border-border cursor-not-allowed"
              >
                PDF Not Available
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MagazineDetailsModal;
