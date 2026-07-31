import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: { value: number; label: string; positive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface border border-border/50 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:bg-gray-800 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-widest">{title}</h3>
        {icon && <span className="text-2xl p-2 bg-primary/10 rounded-lg text-primary">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-4 mt-2">
        <span className="text-4xl font-bold font-heading text-text dark:text-white">{value}</span>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend.positive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
