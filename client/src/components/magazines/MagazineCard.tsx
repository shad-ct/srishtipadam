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
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
      className="group relative flex flex-col h-full cursor-pointer"
      onClick={() => onMagazineClick && onMagazineClick(magazine)}
    >
      <div className="relative flex flex-col h-full overflow-hidden rounded-xl border border-[#DCE8DF] dark:border-[#1E3626] bg-white dark:bg-[#0D1C13] shadow-md transition-all duration-300">
        {/* Glory glow — amber top edge (matches magazines warm tone) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E0A176] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        {/* Bottom amber glow bloom */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-[#E0A176]/0 group-hover:bg-[#E0A176]/15 blur-xl transition-all duration-500 rounded-full pointer-events-none z-0" />
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 50px 0 rgba(224,161,118,0.07), 0 0 30px 0 rgba(224,161,118,0.08)' }} />

        {/* Cover */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F4F1EA] dark:bg-[#112218] flex items-center justify-center p-5">
          <motion.div
            whileHover={{ scale: 1.06, rotateY: -5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="w-full h-full relative shadow-xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {magazine.coverImage?.url ? (
              <img
                src={magazine.coverImage.url}
                alt={magazine.title?.en}
                className="w-full h-full object-cover rounded-md opacity-95 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-[#E0A176]/10 dark:bg-[#E0A176]/07 flex items-center justify-center p-4 rounded-md">
                <span className="font-bold text-lg text-[#E0A176] text-center"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {magazine.title?.en || magazine.title?.ml}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-grow relative z-10">
          <span className="text-[10px] font-extrabold text-[#E0A176] uppercase tracking-widest mb-2">
            Issue {magazine.issueNumber}
          </span>
          <h3 className="font-extrabold text-[#1F3E2F] dark:text-white text-lg mb-2 leading-snug"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {magazine.title?.ml || magazine.title?.en}
          </h3>
          <p className="text-[#5B7566] dark:text-[#9CB3A6] text-sm mb-4 line-clamp-2 font-medium">
            {magazine.description?.en}
          </p>
          <div className="mt-auto pt-4 border-t border-[#DCE8DF] dark:border-[#1E3626]">
            <button className="text-[#E0A176] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
              Read Magazine <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MagazineCard;
