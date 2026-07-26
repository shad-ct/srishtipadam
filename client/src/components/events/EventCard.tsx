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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-surface border border-border flex flex-col h-full overflow-hidden rounded-md hover:shadow-lg cursor-pointer"
      onClick={() => {
        if (onEventClick) onEventClick(event);
      }}
    >
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-background border-b border-border">
        <div className="absolute top-4 left-4 z-20 bg-background/95 px-3 py-2 border border-border flex flex-col items-center justify-center min-w-[3.5rem] rounded-md shadow-sm">
          <span className="text-primary font-bold font-heading text-xl leading-none">
            {new Date(event.date).getDate()}
          </span>
          <span className="text-text/70 /70 text-xs font-medium uppercase tracking-wider mt-1">
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
                alt={`${event.name.en} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </AnimatePresence>
            {event.images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <button onClick={prevImage} className="bg-background/80 hover:bg-background text-text p-2 rounded-full backdrop-blur-sm transition-colors border border-border shadow-sm" aria-label="Previous image">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button onClick={nextImage} className="bg-background/80 hover:bg-background text-text p-2 rounded-full backdrop-blur-sm transition-colors border border-border shadow-sm" aria-label="Next image">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            )}
            {event.images.length > 1 && (
              <div className="absolute bottom-4 left-4 z-20 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-text border border-border shadow-sm">
                {currentImageIndex + 1} / {event.images.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center p-4">
            <span className="font-heading text-xl text-primary/30 /30 text-center">No Image</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${event.isUpcoming ? 'bg-accent/20 text-accent' : 'bg-surface-raised text-text/60 /60 border border-border'}`}>
            {event.isUpcoming ? 'Upcoming' : 'Past'}
          </span>
          <span className="text-text/50 /50 text-sm">{event.time}</span>
        </div>

        <h3 className="font-heading text-2xl font-bold text-text mb-3 leading-tight">{event.name?.en}</h3>
        {event.description?.en && (
          <p className="font-body text-text/70 /70 mb-6 line-clamp-3 leading-relaxed">{event.description.en}</p>
        )}

        <div className="mt-auto flex items-center gap-2 text-primary text-sm font-medium pt-4 border-t border-border">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {event.place.en}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
