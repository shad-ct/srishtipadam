import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/events/EventCard';
import EventDetailsModal from '../components/events/EventDetailsModal';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const Events = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/events');
      return data;
    }
  });

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#3DB86B]/07 dark:bg-[#3DB86B]/05 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/03 blur-[100px]" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 pb-8 border-b border-[#DCE8DF] dark:border-[#1E3626] text-center"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#3DB86B] mb-4 px-3 py-1 rounded-full bg-[#3DB86B]/10 border border-[#3DB86B]/20">
            Community Gatherings
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Gatherings &amp; <span className="text-[#3DB86B]">Events</span>
          </h1>
          <p className="text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl mx-auto text-lg font-medium">
            Join us in our celebrations, book launches, and cultural meets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-[#9CB3A6] py-12">Loading events...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-400 py-12">Failed to load events.</div>
          ) : (
            events?.map((event: any, idx: number) => (
              <EventCard key={event._id} event={event} index={idx} onEventClick={setSelectedEvent} />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
