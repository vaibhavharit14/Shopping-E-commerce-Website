import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-hidden"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]"></div>

          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative bg-white/10 border border-white/20 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter"
            >
                ORDER <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">SUCCESS!</span>
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg mb-10 font-medium"
            >
              Your premium package is being prepared with care and will reach you soon.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-gray-100 transition-colors"
              >
                View My Orders <ArrowRight size={18} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <ShoppingBag size={18} /> Shop More
              </motion.button>
            </div>

            {/* Micro Details */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-8"
            >
                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Tracking</p><p className="text-sm text-white font-bold">In Progress</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Shipping</p><p className="text-sm text-white font-bold">Standard</p></div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccess;
