import { motion } from 'framer-motion';
import MemberCard from '../components/committee/MemberCard';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

const Committee = () => {
  const { data: committee, isLoading, error } = useQuery({
    queryKey: ['committee'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/committee');
      return data;
    }
  });
  return (
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text font-heading mb-6 relative inline-block">
            Our <span className="italic text-primary">Committee</span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent/50"></div>
          </h1>
          <p className="font-body text-text/70 /70 max-w-2xl mx-auto text-lg mt-8">
            The dedicated minds behind Srishtipadham, working together to preserve and promote our literary heritage.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-16">
          {isLoading ? (
            <div className="col-span-full text-center text-text-secondary py-12">Loading committee...</div>
          ) : error ? (
            <div className="col-span-full text-center text-error py-12">Failed to load committee.</div>
          ) : (
            committee?.sort((a: any, b: any) => a.order - b.order).map((member: any, idx: number) => (
              <MemberCard key={member._id} member={member} index={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Committee;
