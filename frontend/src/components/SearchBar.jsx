import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Search, X, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false);
        }
    }, [location])

    return (
        <AnimatePresence>
            {showSearch && visible && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='border-b bg-white/80 backdrop-blur-xl text-center sticky top-20 z-40 py-8 px-4 shadow-sm'
                >
                    <div className='max-w-3xl mx-auto'>
                        <div className='flex items-center gap-3 mb-6 justify-center'>
                            <Sparkles size={14} className='text-blue-500' />
                            <p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500'>Discover Your Next Essentials</p>
                        </div>
                        
                        <div className='relative group'>
                            <div className='absolute inset-y-0 left-6 flex items-center pointer-events-none'>
                                <Search className='h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors' />
                            </div>
                            <input 
                                value={search} 
                                onChange={(e)=>setSearch(e.target.value)} 
                                className='w-full bg-gray-50/50 border border-gray-100 pl-16 pr-16 py-5 rounded-[22px] text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all uppercase tracking-widest' 
                                type="text" 
                                placeholder='SEARCH COLLECTIONS...'
                                autoFocus
                            />
                            <button 
                                onClick={()=>setShowSearch(false)}
                                className='absolute inset-y-0 right-4 flex items-center px-4 hover:scale-110 transition-transform'
                            >
                                <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all'>
                                    <X size={16} />
                                </div>
                            </button>
                        </div>

                        <div className='mt-6 flex flex-wrap justify-center gap-4'>
                            {['Winter Wear', 'Elite Series', 'New Arrivals'].map((tag) => (
                                <button 
                                    key={tag}
                                    onClick={() => setSearch(tag)}
                                    className='text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:border-black hover:text-black transition-all'
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SearchBar
