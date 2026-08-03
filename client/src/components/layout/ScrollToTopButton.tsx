import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [hasAppeared, setHasAppeared] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* ── Direction-aware show/hide + 4s auto-hide ──────────────────────── */
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };

    const scheduleHide = () => {
      clearHideTimer();
      hideTimer.current = setTimeout(() => setVisible(false), 4000);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      if (currentY <= 300) {
        // Near the top — always hide
        setVisible(false);
        clearHideTimer();
      } else if (scrollingDown) {
        // Scrolling down past threshold — show and reset the 4s timer
        setVisible(true);
        if (!hasAppeared) setHasAppeared(true);
        scheduleHide();
      } else {
        // Scrolling up — hide immediately
        setVisible(false);
        clearHideTimer();
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearHideTimer();
    };
  }, [hasAppeared]);

  /* ── Cursor-follow highlight ───────────────────────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  /* ── Click handler ─────────────────────────────────────────────────── */
  const handleClick = () => {
    setClicked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setClicked(false), 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.88, transition: { duration: 0.25, ease: 'easeIn' } }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed bottom-8 right-8 z-[9999]"
          style={{ pointerEvents: 'auto' }}
        >


          {/* Outer breathing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: hovered
                ? '0 0 0 8px rgba(34,197,94,0.18), 0 0 0 16px rgba(34,197,94,0.07)'
                : ['0 0 0 0px rgba(34,197,94,0)', '0 0 0 6px rgba(34,197,94,0.10)', '0 0 0 0px rgba(34,197,94,0)'],
            }}
            transition={hovered
              ? { duration: 0.3 }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
          />

          {/* Main Button */}
          <motion.button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={handleMouseMove}
            aria-label="Scroll to top"
            title="Back to Top"
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#22C55E]/40 rounded-full"
            style={{
              width: 'clamp(52px, 6vw, 60px)',
              height: 'clamp(52px, 6vw, 60px)',
              background: 'linear-gradient(145deg, #22C55E 0%, #16A34A 100%)',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: hovered
                ? '0 12px 40px rgba(34,197,94,0.45), 0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)'
                : '0 6px 24px rgba(34,197,94,0.28), 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Cursor-follow radial highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                opacity: hovered ? 1 : 0,
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.2) 0%, transparent 65%)`,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* Glass top reflection */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, transparent 100%)',
              }}
            />

            {/* Click ripple */}
            <AnimatePresence>
              {clicked && (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'rgba(255,255,255,0.35)' }}
                />
              )}
            </AnimatePresence>

            {/* Arrow icon */}
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                y: hovered ? -2 : clicked ? -4 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </motion.svg>
          </motion.button>

          {/* First-appearance sparkle dots */}
          {hasAppeared && (
            <>
              {[
                { angle: 45, delay: 0 },
                { angle: 135, delay: 0.07 },
                { angle: 225, delay: 0.14 },
                { angle: 315, delay: 0.05 },
              ].map(({ angle, delay }) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 34;
                const y = Math.sin(rad) * 34;
                return (
                  <motion.div
                    key={angle}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], x, y, scale: [0, 1, 0] }}
                    transition={{ duration: 0.6, delay, ease: 'easeOut', once: true }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#22C55E] pointer-events-none"
                    style={{ boxShadow: '0 0 4px rgba(34,197,94,0.8)' }}
                  />
                );
              })}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
