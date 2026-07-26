import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventDetailsModalProps {
  event: any;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
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
          className="absolute top-4 right-4 z-50 bg-background/50 hover:bg-background text-text p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 h-64 md:h-full bg-background relative flex-shrink-0 border-b md:border-b-0 md:border-r border-border">
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
                  alt={`${event.name.en} image`}
                  className="absolute inset-0 w-full h-full object-contain bg-black/5"
                />
              </AnimatePresence>

              {event.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {event.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-primary/5 flex items-center justify-center p-4">
              <span className="font-heading text-2xl text-primary/30 text-center">No Image</span>
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-surface">
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm ${event.isUpcoming ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-surface-raised text-text/60 border border-border'}`}>
              {event.isUpcoming ? 'Upcoming Event' : 'Past Event'}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4 leading-tight">
            {event.name?.en}
          </h2>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-text/70 font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>{new Date(event.date).toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>{event.place?.en}</span>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-auto md:mt-0">
            <h3 className="text-lg font-bold text-text mb-3">About this event</h3>
            {event.description?.en ? (
              <p className="text-text/80 whitespace-pre-line leading-relaxed">
                {event.description.en}
              </p>
            ) : (
              <p className="text-text/40 italic">No description available.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailsModal;
