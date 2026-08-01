import React from 'react';
import { motion } from 'framer-motion';

interface MemberCardProps {
  member: any;
  index: number;
}

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Facebook SVG icon
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const name = typeof member.name === 'object' ? member.name?.en : member.name;
  const description = typeof member.description === 'object' ? member.description?.en : member.description;
  const role = typeof member.role === 'object' ? member.role?.en : member.role;

  const whatsappUrl = member.whatsapp
    ? `https://wa.me/${member.whatsapp.replace(/\D/g, '')}`
    : null;
  const facebookUrl = member.facebook || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col items-center text-center"
    >
      {/* Avatar with ring glow on hover */}
      <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-white/60 dark:border-white/10 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 ring-2 ring-transparent group-hover:ring-primary/30">
        <div className="absolute inset-0 bg-primary/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
        {member.photo?.url || member.image ? (
          <img
            src={member.photo?.url || member.image}
            alt={name}
            className="w-full h-full object-cover filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-surface-raised flex items-center justify-center">
            <span className="font-heading text-4xl text-text-secondary">{name?.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-heading text-2xl font-bold text-text mb-1 tracking-tight">{name}</h3>

      {/* Role */}
      {role && (
        <span className="text-primary font-semibold text-xs uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/15">
          {role}
        </span>
      )}

      {/* Description */}
      {description && (
        <p className="font-sans text-text-secondary text-sm max-w-xs line-clamp-3 mt-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Social Links */}
      {(whatsappUrl || facebookUrl) && (
        <div className="flex items-center gap-3 mt-4">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${name}`}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#25D366]/25"
            >
              <WhatsAppIcon />
            </a>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Facebook ${name}`}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/25"
            >
              <FacebookIcon />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MemberCard;
