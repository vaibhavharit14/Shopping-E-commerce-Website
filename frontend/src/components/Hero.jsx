import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className='relative overflow-hidden bg-gray-50 rounded-[40px] border border-gray-100 shadow-2xl mt-8'>
            {/* Background elements */}
            <div className='absolute top-0 right-0 w-1/2 h-full bg-slate-50 opacity-50 -z-10 skew-x-[-12deg] translate-x-20'></div>
            
            <div className='flex flex-col lg:flex-row items-center min-h-[600px]'>
                {/* Text Content */}
                <div className='w-full lg:w-1/2 px-8 py-16 lg:px-16 flex flex-col justify-center'>
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='self-start inline-flex items-center gap-4 px-6 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-xl shadow-black/20'
                    >
                        <div className='flex items-center gap-2'>
                            <p className='font-black'>Our Best Sellers</p>
                        </div>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='prata-regular text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-gray-900 mb-8'
                    >
                        Latest <br /> 
                        <span className='text-blue-600'>Arrivals</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className='text-gray-500 text-lg mb-10 max-w-md leading-relaxed'
                    >
                        Discover our curated collection of premium essentials designed for the modern individual.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className='flex flex-wrap gap-5'
                    >
                        <Link to='/collection' className='group bg-black text-white px-8 py-5 rounded-2xl flex items-center gap-3 font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20'>
                            SHOP COLLECTION 
                            <ShoppingBag size={20} className='group-hover:scale-110 transition-transform' />
                        </Link>
                        <Link to='/about' className='px-8 py-5 rounded-2xl flex items-center gap-3 font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all'>
                            LEARN MORE
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className='mt-16 flex gap-10 border-t border-gray-100 pt-10'
                    >
                        <div>
                            <p className='text-2xl font-black italic'>10k+</p>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Happy Customers</p>
                        </div>
                        <div>
                            <p className='text-2xl font-black italic'>200+</p>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Premium Products</p>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image */}
                <div className='w-full lg:w-1/2 h-full min-h-[400px] lg:min-h-0 relative px-8 pb-16 lg:p-0'>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className='relative h-full w-full'
                    >
                        {/* Decorative background for image */}
                        <div className='absolute -inset-4 bg-blue-600/5 rounded-[40px] -z-10 translate-x-4 translate-y-4'></div>
                        <img 
                            className='w-full h-full object-cover rounded-[32px] lg:rounded-none lg:rounded-l-[60px] shadow-2xl saturate-110 contrast-110' 
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
                            alt="Premium Collection" 
                        />
                        
                        {/* Floating elements */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className='absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white max-w-xs hidden md:block'
                        >
                            <div className='flex items-center gap-4 mb-2'>
                                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Trending Now</p>
                            </div>
                            <p className='text-sm font-bold text-gray-900'>Premium Cotton Essentials have just landed in store.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Hero;
