import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on home page
    if (location.pathname === '/') return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -20 }}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="fixed bottom-10 left-6 sm:left-10 z-[150] group flex items-center gap-3"
            >
                <div className="w-14 h-14 bg-white/70 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-full flex items-center justify-center text-gray-900 overflow-hidden relative">
                    <motion.div 
                        initial={false}
                        className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"
                    />
                    <ArrowLeft size={24} className="relative z-10 transition-transform group-hover:-translate-x-1" />
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                    <div className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                        Navigate Back
                    </div>
                </div>
            </motion.button>
        </AnimatePresence>
    );
};

export default BackButton;
