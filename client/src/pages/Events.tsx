import React, { useState } from 'react';
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
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-border pb-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text font-heading mb-4">
            Gatherings & <span className="italic text-primary">Events</span>
          </h1>
          <p className="font-body text-text/70 /70 max-w-2xl mx-auto text-lg">
            Join us in our celebrations, book launches, and cultural meets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-text-secondary py-12">Loading events...</div>
          ) : error ? (
            <div className="col-span-full text-center text-error py-12">Failed to load events.</div>
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
