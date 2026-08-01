import { useState } from 'react';
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
      const text = `Hello, I would like to join Srishtipadham.\nName: ${data.name}\nDistrict: ${data.district}\nMobile: ${data.mobile}\nReason: ${data.reason}`;
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
    <div className="w-full min-h-screen bg-[#F4F1EA] dark:bg-[#070E0B] pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#3DB86B]/07 dark:bg-[#3DB86B]/05 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/03 blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl border border-[#DCE8DF] dark:border-[#1E3626] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        {/* Sidebar */}
        <div className="p-8 md:w-1/3 text-white flex flex-col justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #3DB86B 0%, #1F7A45 100%)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-3 relative z-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join Us</h2>
          <p className="mb-6 opacity-90 text-sm font-medium relative z-10">Become a part of our literary and nature community.</p>
          <ul className="space-y-4 relative z-10">
            {['Exclusive Magazines', 'Community Events', 'Book Discussions'].map(item => (
              <li key={item} className="flex items-center gap-3 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 md:w-2/3 bg-white dark:bg-[#0D1C13]">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3DB86B 0%, #2d9d57 100%)', boxShadow: '0 4px 20px rgba(61,184,107,0.4)' }}>✓</div>
              <h3 className="text-2xl font-extrabold mb-2 text-[#1F3E2F] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Thank You!</h3>
              <p className="text-[#5B7566] dark:text-[#9CB3A6] font-medium">
                Please complete sending the message on WhatsApp to finalize your request.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {[
                { label: 'Full Name', name: 'name' as const, type: 'text', placeholder: 'Your Name' },
                { label: 'District', name: 'district' as const, type: 'text', placeholder: 'Your District' },
                { label: 'Mobile Number', name: 'mobile' as const, type: 'tel', placeholder: 'Your Mobile Number' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-[#1F3E2F] dark:text-[#9CB3A6] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{field.label}</label>
                  <input
                    {...register(field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8DF] dark:border-[#1E3626] bg-[#F4F1EA] dark:bg-[#112218] text-[#1F3E2F] dark:text-white placeholder-[#9CB3A6] focus:ring-2 focus:ring-[#3DB86B]/40 focus:border-[#3DB86B] outline-none transition-all font-medium"
                  />
                  {errors[field.name] && <p className="text-red-400 text-xs mt-1 font-medium">{errors[field.name]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#1F3E2F] dark:text-[#9CB3A6] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why do you want to join?</label>
                <textarea
                  {...register('reason')}
                  rows={4}
                  placeholder="Tell us a little bit about yourself"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8DF] dark:border-[#1E3626] bg-[#F4F1EA] dark:bg-[#112218] text-[#1F3E2F] dark:text-white placeholder-[#9CB3A6] focus:ring-2 focus:ring-[#3DB86B]/40 focus:border-[#3DB86B] outline-none transition-all font-medium resize-none"
                />
                {errors.reason && <p className="text-red-400 text-xs mt-1 font-medium">{errors.reason.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: 'linear-gradient(135deg, #3DB86B 0%, #2d9d57 100%)',
                  boxShadow: '0 4px 20px rgba(61,184,107,0.25)',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Join via WhatsApp'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Join;
