import React from 'react';
import StatCard from '../../components/admin/StatCard';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-text mb-8">{t('admin.overview')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title={t('admin.totalBooks')} 
          value="24" 
          icon="📚" 
          trend={{ value: 12, label: "this month", positive: true }} 
        />
        <StatCard 
          title={t('admin.upcomingEvents')} 
          value="2" 
          icon="🎫" 
        />
        <StatCard 
          title={t('admin.members')} 
          value="156" 
          icon="👥" 
          trend={{ value: 5, label: "this week", positive: true }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-raised border border-border rounded-md p-6">
          <h3 className="text-lg font-heading font-bold text-text mb-4">{t('admin.recentActivity')}</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start border-b border-border pb-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
              <div>
                <p className="text-text font-medium text-sm">Event "Poetry Reading" updated</p>
                <span className="text-xs text-text-secondary">5 hours ago</span>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="text-text font-medium text-sm">New member registration</p>
                <span className="text-xs text-text-secondary">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-raised border border-border rounded-md p-6">
          <h3 className="text-lg font-heading font-bold text-text mb-4">{t('admin.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group">
              <span className="text-xl">📖</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{t('admin.addNewBook')}</span>
            </button>
            <button className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group">
              <span className="text-xl">📅</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{t('admin.createEvent')}</span>
            </button>
            <button className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group">
              <span className="text-xl">📰</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{t('admin.publishMagazine')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
