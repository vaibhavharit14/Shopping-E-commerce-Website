import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LatestCollection = () => {
    const { allProducts, apiProducts } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            setLatestProducts(allProducts.slice(0, 10));
        } else {
            setLatestProducts([]);
        }
    }, [allProducts])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className='my-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <div className='flex flex-col items-center text-center mb-12'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className='inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-black/10'
                >
                    <div className='flex items-center gap-2'>
                        <Sparkles size={12} className='text-yellow-400' />
                        The New Era
                    </div>
                    {apiProducts.length > 0 && (
                        <div className='flex items-center gap-2 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30'>
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            <span className='text-[8px] font-black text-green-400 uppercase tracking-widest'>Live</span>
                        </div>
                    )}
                </motion.div>
                
                <div className='text-3xl sm:text-4xl md:text-5xl mb-6'>
                    <div className='inline-flex gap-4 items-center relative'>
                        <Title text1={'NEW'} text2={'ARRIVALS'} />
                    </div>
                </div>
                
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='max-w-2xl text-xs sm:text-sm md:text-base text-gray-500 font-medium leading-relaxed uppercase tracking-widest opacity-60'
                >
                    {apiProducts.length > 0 
                        ? "Discover our latest drops, curated for the modern aesthetic and crafted with precision." 
                        : "Our exclusive next-gen collection is currently in final curation. Stay tuned."}
                </motion.p>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8 gap-y-12'
            >
                {
                    latestProducts.length > 0 ? (
                        latestProducts.map((product, index) => (
                            <motion.div key={product._id} variants={item}>
                                <ProductItem id={product._id} image={product.image} name={product.name} price={product.price} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                            <div className='flex flex-col items-center gap-4 opacity-30'>
                                <div className='w-16 h-16 bg-gray-200 rounded-full animate-pulse' />
                                <p className='text-[10px] font-black uppercase tracking-[0.3em]'>Synchronizing Backend Assets...</p>
                            </div>
                        </div>
                    )
                }
            </motion.div>
        </div>
    )
}

export default LatestCollection
