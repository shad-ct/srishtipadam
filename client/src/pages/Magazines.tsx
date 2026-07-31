import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagazineCard from '../components/magazines/MagazineCard';
import MagazineDetailsModal from '../components/magazines/MagazineDetailsModal';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const Magazines = () => {
  const { data: magazines, isLoading, error } = useQuery({
    queryKey: ['magazines'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/magazines');
      return data;
    }
  });

  const [selectedMagazine, setSelectedMagazine] = useState<any>(null);

  return (
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-border pb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text font-heading mb-4">
            Our <span className="italic text-primary">Magazine</span>
          </h1>
          <p className="font-body text-text/70 /70 max-w-2xl text-lg">
            Dive into our periodic publication featuring articles, poems, and discussions on literature and culture.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-text-secondary py-12">Loading magazines...</div>
          ) : error ? (
            <div className="col-span-full text-center text-error py-12">Failed to load magazines.</div>
          ) : (
            magazines?.map((mag: any, idx: number) => (
              <div key={mag._id} className="h-[420px]">
                <MagazineCard magazine={mag} index={idx} onMagazineClick={setSelectedMagazine} />
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedMagazine && (
          <MagazineDetailsModal magazine={selectedMagazine} onClose={() => setSelectedMagazine(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Magazines;
