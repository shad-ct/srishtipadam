import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/auth/login', { username, password });
      // Use 'true' as token indicator, actual JWT is in HttpOnly cookie
      login('true', { username: res.data.username });
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-raised border border-border p-8 rounded-md shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Srishtipadam Admin</h1>
          <p className="text-text-secondary text-sm">{t('admin.login')}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.username')}</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:border-primary text-text transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('admin.password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-md focus:outline-none focus:border-primary text-text transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover text-surface-raised font-medium py-3 rounded-md transition-colors"
          >
            {t('admin.signIn')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
