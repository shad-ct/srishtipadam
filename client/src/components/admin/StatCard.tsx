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
      whileHover={{ y: -2 }}
      className="bg-surface-raised border border-border p-6 rounded-md shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-widest">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold font-heading text-text">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend.positive ? 'text-success' : 'text-error'}`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
