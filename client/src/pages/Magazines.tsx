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
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C97B4E]/07 dark:bg-[#C97B4E]/04 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-[#3DB86B]/06 dark:bg-[#3DB86B]/04 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 pb-8 border-b border-[#DCE8DF] dark:border-[#1E3626]"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#E0A176] mb-4 px-3 py-1 rounded-full bg-[#E0A176]/10 border border-[#E0A176]/20">
            Publications
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Our <span className="text-[#E0A176]">Magazine</span>
          </h1>
          <p className="text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl text-lg font-medium">
            Periodic publications featuring articles, poems, and discussions on literature and culture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-[#9CB3A6] py-12">Loading magazines...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-400 py-12">Failed to load magazines.</div>
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
