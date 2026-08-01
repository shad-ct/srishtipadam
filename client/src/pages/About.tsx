import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#3DB86B]/07 dark:bg-[#3DB86B]/05 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/03 blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#3DB86B] mb-4 px-3 py-1 rounded-full bg-[#3DB86B]/10 border border-[#3DB86B]/20">
            Who We Are
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            About <span className="text-[#3DB86B]">Srishtipadam</span>
          </h1>
          <p className="text-xl text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl mx-auto font-medium leading-relaxed">
            A literary and cultural organization dedicated to promoting reading, writing, and a deep appreciation for nature.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {[
            {
              title: 'Our Mission',
              color: '#3DB86B',
              content: 'To foster a community of readers and writers who are deeply connected to their cultural roots and the natural environment. We believe in the power of literature to inspire change and build a sustainable future.'
            },
            {
              title: 'What We Do',
              color: '#E0A176',
              list: ['Publish books and magazines', 'Organize literary events and discussions', 'Promote environmental awareness', 'Support emerging writers']
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group p-8 rounded-2xl border border-[#DCE8DF] dark:border-[#1E3626] bg-white/70 dark:bg-[#0D1C13]/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ boxShadow: `0 0 0 0 ${card.color}00` }}
            >
              {/* Glow edge on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px 0 ${card.color}15, 0 0 40px 0 ${card.color}10` }} />
              <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${card.color}80, transparent)` }} />

              <h3
                className="text-2xl font-extrabold mb-5 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: card.color }}
              >
                {card.title}
              </h3>
              {card.content ? (
                <p className="text-[#3B5A4B] dark:text-[#9CB3A6] leading-relaxed font-medium">{card.content}</p>
              ) : (
                <ul className="space-y-3">
                  {card.list?.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-[#3B5A4B] dark:text-[#9CB3A6] font-medium">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={{ background: card.color }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
