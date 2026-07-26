import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../api/axiosClient';

const joinSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  district: z.string().min(1, 'District is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  reason: z.string().min(1, 'Reason is required')
});

type JoinFormData = z.infer<typeof joinSchema>;

const Join = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema)
  });

  const onSubmit = async (data: JoinFormData) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post('/join', data);
      
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
      const text = `Hello, I would like to join Srishtipadam.\nName: ${data.name}\nDistrict: ${data.district}\nMobile: ${data.mobile}\nReason: ${data.reason}`;
      const encodedText = encodeURIComponent(text);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to submit join request', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col md:flex-row"
      >
        <div className="bg-primary p-8 md:w-1/3 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join Us</h2>
          <p className="mb-6 opacity-90">Become a part of our literary and nature community.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
              Exclusive Magazines
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
              Community Events
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
              Book Discussions
            </li>
          </ul>
        </div>
        
        <div className="p-8 md:w-2/3">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-text-secondary">
                Please complete sending the message on WhatsApp to finalize your request.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-md border border-border bg-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">District</label>
                <input 
                  {...register('district')}
                  className="w-full px-4 py-2 rounded-md border border-border bg-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Your District"
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input 
                  {...register('mobile')}
                  className="w-full px-4 py-2 rounded-md border border-border bg-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Your Mobile Number"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Why do you want to join?</label>
                <textarea 
                  {...register('reason')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-border bg-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Tell us a little bit about yourself"
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Join via WhatsApp'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Join;
