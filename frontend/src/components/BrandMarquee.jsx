import React from 'react'
import { motion } from 'framer-motion'

const BrandMarquee = () => {
    const brands = [
        "VOGUE", "HARPER'S BAZAAR", "GQ", "ELLE", "FORBES FASHION", "VANITY FAIR", "ESQUIRE"
    ]

    return (
        <div className='py-24 border-y border-gray-100 bg-gray-50 overflow-hidden'>
            <div className='flex items-center gap-2 px-4 sm:px-[5vw] mb-12 justify-center'>
                <div className='h-[1px] w-12 bg-gray-100' />
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4'>Featured In</p>
                <div className='h-[1px] w-12 bg-gray-100' />
            </div>
            
            <div className='flex relative overflow-hidden'>
                <motion.div 
                    animate={{ x: [0, -1000] }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    className='flex gap-24 whitespace-nowrap px-12'
                >
                    {[...brands, ...brands].map((brand, index) => (
                        <span 
                            key={index}
                            className='text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-gray-200 hover:text-black transition-colors duration-500 cursor-default'
                        >
                            {brand}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default BrandMarquee
