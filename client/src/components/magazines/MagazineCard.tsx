import React from 'react';
import { motion } from 'framer-motion';

interface MagazineCardProps {
  magazine: any;
  index: number;
  onMagazineClick?: (magazine: any) => void;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ magazine, index, onMagazineClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col h-full cursor-pointer"
      onClick={() => onMagazineClick && onMagazineClick(magazine)}
    >
      <div className="relative bg-background border border-border rounded-sm shadow-sm flex flex-col h-full overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface border-b border-border flex items-center justify-center p-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full relative shadow-md"
          >
            {magazine.coverImage?.url ? (
              <img src={magazine.coverImage.url} alt={magazine.title.en} className="w-full h-full object-cover rounded-sm opacity-95 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center p-4 rounded-sm">
                <span className="font-heading text-xl text-primary text-center">{magazine.title.en}</span>
              </div>
            )}
          </motion.div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <span className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Issue {magazine.issueNumber}</span>
          <h3 className="font-heading text-xl font-bold text-text mb-2">{magazine.title.ml}</h3>
          <p className="font-body text-text/70 /70 text-sm mb-4 line-clamp-2">{magazine.description.en}</p>
          <div className="mt-auto pt-4 border-t border-border">
            <button className="text-primary font-medium text-sm hover:underline underline-offset-4 flex items-center gap-2 transition-all">
              Read Magazine <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MagazineCard;
