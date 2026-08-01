import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventCardProps {
  event: any;
  index: number;
  onEventClick?: (event: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, index, onEventClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[#DCE8DF] dark:border-[#1E3626] bg-white dark:bg-[#0D1C13] cursor-pointer transition-all duration-300"
      style={{ boxShadow: '0 4px 20px rgba(31,62,47,0.06)' }}
      onClick={() => onEventClick && onEventClick(event)}
    >
      {/* Glory glow — top edge sweep */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DB86B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />
      {/* Side glow bloom */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ boxShadow: 'inset 0 0 60px 0 rgba(61,184,107,0.06), 0 0 40px 0 rgba(61,184,107,0.08)' }} />

      {/* Image area */}
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#F4F1EA] dark:bg-[#112218] border-b border-[#DCE8DF] dark:border-[#1E3626]">
        {/* Date badge */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-[#070E0B]/90 backdrop-blur-sm px-3 py-2 border border-[#DCE8DF] dark:border-[#1E3626] flex flex-col items-center justify-center min-w-[3.5rem] rounded-xl shadow-sm">
          <span className="text-[#3DB86B] font-extrabold text-xl leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {new Date(event.date).getDate()}
          </span>
          <span className="text-[#5B7566] dark:text-[#9CB3A6] text-[10px] font-bold uppercase tracking-wider mt-1">
            {new Date(event.date).toLocaleString('default', { month: 'short' })}
          </span>
        </div>

        {event.images && event.images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={event.images[currentImageIndex].url}
                alt={`${event.name?.en} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </AnimatePresence>
            {event.images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <button onClick={prevImage} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors" aria-label="Previous image">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={nextImage} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors" aria-label="Next image">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}
            {event.images.length > 1 && (
              <div className="absolute bottom-4 left-4 z-20 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-[11px] font-bold text-white">
                {currentImageIndex + 1} / {event.images.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-[#3DB86B]/05 flex items-center justify-center p-4">
            <span className="text-[#3DB86B]/40 text-xl font-bold text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            event.isUpcoming
              ? 'bg-[#3DB86B]/15 text-[#3DB86B] border border-[#3DB86B]/30'
              : 'bg-[#DCE8DF]/50 dark:bg-[#1E3626]/50 text-[#5B7566] dark:text-[#9CB3A6] border border-[#DCE8DF] dark:border-[#1E3626]'
          }`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {event.isUpcoming ? 'Upcoming' : 'Past'}
          </span>
          <span className="text-[#9CB3A6] text-sm font-medium">{event.time}</span>
        </div>

        <h3 className="font-extrabold text-[#1F3E2F] dark:text-white text-xl mb-3 leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {event.name?.en}
        </h3>
        {event.description?.en && (
          <p className="text-[#5B7566] dark:text-[#9CB3A6] mb-5 line-clamp-3 leading-relaxed text-sm font-medium">
            {event.description.en}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 text-[#3DB86B] text-sm font-semibold pt-4 border-t border-[#DCE8DF] dark:border-[#1E3626]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {event.place?.en}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
