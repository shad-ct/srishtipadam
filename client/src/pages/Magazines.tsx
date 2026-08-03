import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagazineCard from '../components/magazines/MagazineCard';
import MagazineDetailsModal from '../components/magazines/MagazineDetailsModal';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { useTranslation } from 'react-i18next';

const Magazines = () => {
  const { t, i18n } = useTranslation();
  const isMl = i18n.language === 'ml';

  const { data: magazines, isLoading, error } = useQuery({
    queryKey: ['magazines'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/magazines');
      return data;
    }
  });

  const { data: priceData } = useQuery({
    queryKey: ['quarterlyMagazinePrice'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/settings/quarterlyMagazinePrice');
      return data;
    }
  });

  const price = priceData?.value || '150';
  const [selectedMagazine, setSelectedMagazine] = useState<any>(null);
  const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false);

  // ESC close and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAnnualModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isAnnualModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAnnualModalOpen]);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919446771277';
  const prefilledMessage = isMl
    ? "ഹലോ, സൃഷ്ടിപഥം ത്രൈമാസിക വാങ്ങാൻ എനിക്ക് താല്പര്യമുണ്ട്. കൂടുതൽ വിവരങ്ങൾ ലഭ്യമാക്കുമല്ലോ."
    : "Hello. I am willing to buy Srishtipadham's Quarterly Magazine. Give me more details about it.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`;

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
          <p className="text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl text-lg font-medium mb-6">
            Periodic publications featuring articles, poems, and discussions on literature and culture.
          </p>

          {/* Buy Quarterly Magazine CTA Button */}
          <motion.button
            onClick={() => setIsAnnualModalOpen(true)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#22C55E] hover:bg-[#1eb053] text-white font-bold text-[15px] tracking-wide transition-all duration-300 shadow-lg shadow-[#22C55E]/20 hover:shadow-[#22C55E]/40 cursor-pointer overflow-hidden border border-white/10"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>{isMl ? 'ഞങ്ങളുടെ ത്രൈമാസിക വാങ്ങുക' : 'Buy Our Quarterly Magazine'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 shrink-0">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.button>
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

      {/* Magazine Details Modal */}
      <AnimatePresence>
        {selectedMagazine && (
          <MagazineDetailsModal magazine={selectedMagazine} onClose={() => setSelectedMagazine(null)} />
        )}
      </AnimatePresence>

      {/* Quarterly Magazine Modal / Bottom Sheet */}
      <AnimatePresence>
        {isAnnualModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAnnualModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/45 backdrop-blur-md cursor-pointer"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', duration: 0.55 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[720px] lg:max-w-[760px] rounded-t-[28px] md:rounded-[28px] overflow-hidden bg-[#F4F1EA] dark:bg-[#070E0B] border-t md:border border-[#3DB86B]/15 shadow-2xl relative flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] mt-auto md:mt-0 cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAnnualModalOpen(false)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Left Banner Column (Cover Image) - Responsive sizes */}
              <div className="relative w-full md:w-[220px] lg:w-[250px] h-[140px] sm:h-[160px] md:h-auto bg-gradient-to-b from-[#112218] to-[#070E0B] flex items-center justify-center overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(61,184,107,0.18)_0%,transparent_65%)]" />
                <motion.div
                  initial={{ y: 15, rotateY: 5, opacity: 0 }}
                  animate={{ y: 0, rotateY: -8, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
                  className="relative w-[80px] h-[115px] sm:w-[90px] sm:h-[130px] md:w-[140px] md:h-[200px] rounded-r-lg overflow-hidden shadow-[12px_20px_40px_rgba(0,0,0,0.6)]"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10 z-10 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/30 z-10" />
                  <img src="/assets/images/annual_cover.png" alt="Quarterly Magazine Cover" className="w-full h-full object-cover" />
                </motion.div>
              </div>

              {/* Right Content Column */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-5 py-6 md:p-6 space-y-6">
                  
                  {/* Header info */}
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-[#3DB86B] bg-[#3DB86B]/10 border border-[#3DB86B]/20 px-3 py-1 rounded-full uppercase">
                      {isMl ? 'ത്രൈമാസിക' : 'Quarterly Magazine'}
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#1F3E2F] dark:text-white mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>
                      {isMl ? 'സൃഷ്ടിപഥം ത്രൈമാസിക' : 'Srishtipadham Quarterly Magazine'}
                    </h2>
                    <p 
                      className={`leading-relaxed mt-3 ${isMl ? 'text-[#1F3E2F] dark:text-white' : 'text-[#5B7566] dark:text-[#9CB3A6]'}`}
                      style={isMl ? {
                        fontFamily: 'Georgia, serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        letterSpacing: '0.01em',
                      } : {
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {isMl
                        ? 'കേരളത്തിലെ പ്രഗത്ഭരായ എഴുത്തുകാരുടെ കവിതകൾ, കഥകൾ, ഉപന്യാസങ്ങൾ, യാത്രാവിവരണങ്ങൾ, ഓർമ്മക്കുറിപ്പുകൾ, സാഹിത്യസൃഷ്ടികൾ എന്നിവയുടെ മികച്ച ശേഖരം.'
                        : 'A premium collection of poetry, stories, essays, travel writing, memoirs and literary works from talented writers across Kerala.'}
                    </p>
                  </div>

                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Language */}
                    <div className="p-4 rounded-2xl bg-[#3DB86B]/03 dark:bg-white/03 border border-[#3DB86B]/10 backdrop-blur-sm flex flex-col items-start">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B] mb-2 shrink-0">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                      <div className="text-[10px] text-[#5B7566] dark:text-[#9CB3A6]/60 font-semibold uppercase tracking-wider">
                        {isMl ? 'ഭാഷ' : 'Language'}
                      </div>
                      <div className="text-sm font-bold text-[#1F3E2F] dark:text-white mt-0.5">
                        {isMl ? 'മലയാളം' : 'Malayalam'}
                      </div>
                    </div>
                    {/* Format */}
                    <div className="p-4 rounded-2xl bg-[#3DB86B]/03 dark:bg-white/03 border border-[#3DB86B]/10 backdrop-blur-sm flex flex-col items-start">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B] mb-2 shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      <div className="text-[10px] text-[#5B7566] dark:text-[#9CB3A6]/60 font-semibold uppercase tracking-wider">
                        {isMl ? 'രൂപം' : 'Format'}
                      </div>
                      <div className="text-sm font-bold text-[#1F3E2F] dark:text-white mt-0.5">
                        {isMl ? 'പ്രിന്റ് ചെയ്ത പതിപ്പ്' : 'Printed Edition'}
                      </div>
                    </div>
                    {/* Contents */}
                    <div className="p-4 rounded-2xl bg-[#3DB86B]/03 dark:bg-white/03 border border-[#3DB86B]/10 backdrop-blur-sm col-span-2 sm:col-span-1 flex flex-col items-start">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B] mb-2 shrink-0">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      </svg>
                      <div className="text-[10px] text-[#5B7566] dark:text-[#9CB3A6]/60 font-semibold uppercase tracking-wider">
                        {isMl ? 'ഉള്ളടക്കം' : 'Contents'}
                      </div>
                      <div className="text-xs font-bold text-[#1F3E2F] dark:text-white mt-1 flex flex-wrap gap-1">
                        {(isMl
                          ? ['കവിത', 'കഥകൾ', 'ഉപന്യാസം', 'യാത്ര', 'ലേഖനങ്ങൾ']
                          : ['Poetry', 'Stories', 'Essays', 'Travel', 'Articles']
                        ).map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-[#3DB86B]/10 text-[#3DB86B] font-semibold text-[9px]">{c}</span>
                        ))}
                      </div>
                    </div>
                    {/* Delivery */}
                    <div className="p-4 rounded-2xl bg-[#3DB86B]/03 dark:bg-white/03 border border-[#3DB86B]/10 backdrop-blur-sm flex flex-col items-start">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B] mb-2 shrink-0">
                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      <div className="text-[10px] text-[#5B7566] dark:text-[#9CB3A6]/60 font-semibold uppercase tracking-wider">
                        {isMl ? 'വിതരണം' : 'Delivery'}
                      </div>
                      <div className="text-sm font-bold text-[#1F3E2F] dark:text-white mt-0.5">
                        {isMl ? 'കേരളത്തിലുടനീളം' : 'Across Kerala'}
                      </div>
                    </div>
                    {/* Price */}
                    <div className="p-4 rounded-2xl bg-[#3DB86B]/10 border border-[#3DB86B]/25 backdrop-blur-sm col-span-2 sm:col-span-2 flex flex-col items-start">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3DB86B] mb-2 shrink-0">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      <div className="text-[10px] text-[#3DB86B] font-bold uppercase tracking-wider">
                        {isMl ? 'വില' : 'Price'}
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#1F3E2F] dark:text-white mt-0.5 flex items-baseline gap-1.5 flex-wrap">
                        <span>₹{price}</span>
                        <span className="text-sm font-semibold text-[#5B7566] dark:text-[#9CB3A6]/80">
                          / {isMl ? 'വർഷം' : 'year'}
                        </span>
                        <span className="text-[11px] font-medium text-[#5B7566]/60 dark:text-[#9CB3A6]/40 ml-1">
                          {isMl ? '(പരിമിതമായ കോപ്പികൾ)' : '(Limited copies)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Description */}
                  <div className="relative p-5 rounded-2xl bg-white/5 border border-[#3DB86B]/10 backdrop-blur-sm">
                    <div className="absolute top-1 right-2 text-[#3DB86B]/10 font-serif text-5xl select-none pointer-events-none">”</div>
                    <p className="text-[13px] sm:text-sm italic leading-relaxed text-[#1F3E2F]/90 dark:text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {isMl
                        ? '"സർഗ്ഗാത്മകതയെയും ഭാഷയെയും സംസ്കാരത്തെയും അടയാളപ്പെടുത്തുന്ന ശ്രദ്ധാപൂർവ്വം ക്രോഡീകരിച്ച സാഹിത്യ സമാഹാരമാണ് സൃഷ്ടിപഥം ത്രൈമാസിക. ഓരോ ലക്കവും വളർന്നുവരുന്നവരും പ്രശസ്തരുമായ എഴുത്തുകാരുടെ ഉൽകൃഷ്ട കൃതികളെ അവതരിപ്പിക്കുന്നു, ഇത് ഏതൊരു വായനക്കാരന്റെയും ശേഖരത്തിൽ സൂക്ഷിച്ചുവെക്കാവുന്ന ഒന്നാണ്."'
                        : '"The Srishtipadham Quarterly Magazine is a carefully curated literary collection celebrating creativity, language, and culture. Every copy showcases outstanding works from emerging and established writers, making it a timeless addition to every reader\'s collection."'}
                    </p>
                  </div>

                  {/* Feature Chips */}
                  <div className="flex flex-wrap gap-2">
                    {(isMl
                      ? ['മികച്ച പ്രിന്റ് ക്വാളിറ്റി', 'മനോഹരമായ ലേഔട്ട്', 'പരിമിതമായ ത്രൈമാസിക പതിപ്പ്', 'കമ്മ്യൂണിറ്റി പബ്ലിക്കേഷൻ', 'എഴുത്തുകാർക്ക് പിന്തുണ']
                      : ['Premium Print Quality', 'Beautiful Layout', 'Limited Quarterly Edition', 'Community Publication', 'Supports Emerging Writers']
                    ).map(f => (
                      <span key={f} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-[#3DB86B]/10 text-[#3DB86B] border border-[#3DB86B]/15">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sticky bottom CTA */}
                <div className="border-t border-[#3DB86B]/10 p-4 md:p-5 bg-[#F4F1EA]/80 dark:bg-[#070E0B]/80 backdrop-blur-md sticky bottom-0 z-20 flex-shrink-0">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#15A347] text-white font-bold text-base shadow-lg shadow-[#22C55E]/20 hover:shadow-[#22C55E]/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
                  >
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110 shrink-0">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.96 9.96 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.99-9.985A9.99 9.99 0 0 0 12.012 2zm4.957 14.238c-.273.767-1.561 1.405-2.146 1.483-.518.069-1.196.128-3.418-.79-2.842-1.173-4.673-4.057-4.814-4.244-.143-.186-1.144-1.52-1.144-2.9 0-1.38.718-2.06 1.023-2.358.304-.298.665-.373.886-.373.22 0 .443.003.638.012.2.01.472-.075.738.566.27.653.924 2.257 1.003 2.418.08.162.133.35.025.567-.108.217-.162.35-.325.538-.162.186-.34.417-.487.56-.162.155-.33.324-.14.653.19.324.843 1.393 1.807 2.253.963.86 1.77 1.127 2.09 1.286.32.16.507.133.696-.084.19-.217.81-.94.945-1.263.136-.324.27-.27.457-.2.187.072 1.186.56 1.39.66.204.1.34.15.39.233.05.084.05.483-.223 1.25z"/>
                    </svg>
                    <span>{isMl ? 'വാട്സാപ്പിലൂടെ വാങ്ങുക' : 'Buy Now via WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Magazines;
