import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

const BestSeller = () => {

    const { allProducts } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (allProducts && Array.isArray(allProducts)) {
            const bestProduct = allProducts.filter((item) => (item.bestSeller));
            setBestSeller(bestProduct.slice(0, 5))
        }
    }, [allProducts])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <div className='my-24 relative overflow-hidden px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            {/* Background Accent */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-gray-50/50 to-transparent -z-10 rounded-[100px] blur-3xl' />

            <div className='flex flex-col items-center text-center mb-16'>
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='flex items-center gap-3 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100 mb-6 group'
                >
                    <div className='flex items-center gap-2'>
                        <TrendingUp size={14} className='animate-bounce' />
                        <span className='text-[10px] font-black uppercase tracking-[0.2em]'>Trending Now</span>
                    </div>
                    <Sparkles className='text-amber-500 w-4 h-4 animate-pulse' />
                </motion.div>
                
                <div className='text-3xl sm:text-4xl md:text-5xl mb-6'>
                    <div className='inline-flex gap-4 items-center'>
                        <Title text1={'BEST'} text2={'SELLERS'} />
                    </div>
                </div>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className='max-w-xl text-[10px] sm:text-xs md:text-sm text-gray-400 font-bold uppercase tracking-[0.25em] leading-relaxed'
                >
                    The definitive collection of our most coveted pieces. 
                    Meticulously crafted, universally admired.
                </motion.p>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-10'
            >
                {
                    bestSeller.map((product, index) => (
                        <motion.div key={product._id} variants={item}>
                            <ProductItem id={product._id} name={product.name} image={product.image} price={product.price} />
                        </motion.div>
                    ))
                }
            </motion.div>
            
            {bestSeller.length === 0 && (
                <div className="py-20 text-center opacity-20 filter grayscale">
                    <p className='text-[10px] font-black uppercase tracking-[0.3em]'>Curating Trends...</p>
                </div>
            )}
        </div>
    )
}

export default BestSeller
