import React from 'react';
import { motion } from 'framer-motion';

interface MemberCardProps {
  member: any;
  index: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-surface dark:border-surface-dark shadow-md group-hover:shadow-xl transition-all duration-500">
        <div className="absolute inset-0 bg-primary/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
        {member.photo?.url ? (
          <img 
            src={member.photo.url} 
            alt={member.name} 
            className="w-full h-full object-cover filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
          />
        ) : (
          <div className="w-full h-full bg-surface-raised flex items-center justify-center">
            <span className="font-heading text-4xl text-text-secondary">{member.name?.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <h3 className="font-heading text-2xl font-bold text-text mb-1">{member.name}</h3>
      <span className="text-primary font-medium text-sm uppercase tracking-wider mb-3">
        {member.role?.en}
      </span>
      <p className="font-body text-text/70 /70 text-sm max-w-xs line-clamp-3">
        {member.description?.en}
      </p>
    </motion.div>
  );
};

export default MemberCard;
