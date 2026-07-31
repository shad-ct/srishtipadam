import StatCard from '../../components/admin/StatCard';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: books } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books');
      return data;
    }
  });

  const { data: events } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/events');
      return data;
    }
  });

  const { data: magazines } = useQuery({
    queryKey: ['adminMagazines'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/magazines');
      return data;
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-text mb-8">{t('admin.overview')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Books"
          value={books?.length ?? '...'}
          icon="📚"
        />
        <StatCard
          title="Active Events"
          value={events?.length ?? '...'}
          icon="🎫"
        />
        <StatCard
          title="Magazines"
          value={magazines?.length ?? '...'}
          icon="📰"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">


        <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:bg-gray-800">
          <h3 className="text-lg font-heading font-bold text-text mb-4">{t('admin.quickActions')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/books', { state: { openAddModal: true } })}
              className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group"
            >
              <span className="text-xl">📖</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{t('admin.addNewBook')}</span>
            </button>
            <button 
              onClick={() => navigate('/admin/events', { state: { openAddModal: true } })}
              className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group"
            >
              <span className="text-xl">📅</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{t('admin.createEvent')}</span>
            </button>
            <button 
              onClick={() => navigate('/admin/magazines', { state: { openAddModal: true } })}
              className="p-4 border border-border rounded-md text-left hover:bg-surface transition-colors flex flex-col gap-2 group"
            >
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
