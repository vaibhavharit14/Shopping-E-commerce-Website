import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ text1, text2 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='inline-flex gap-3 items-center mb-6 group'
        >
            <div className='flex flex-col'>
                <p className='text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase leading-none mb-1 group-hover:text-blue-500 transition-colors duration-500'>Premium Selection</p>
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-none'>
                    <span className='text-gray-400 font-light not-italic'>{text1}</span> {text2}
                </h2>
            </div>
            <div className='w-12 sm:w-20 h-[3px] bg-black mt-4 rounded-full origin-left group-hover:w-24 transition-all duration-700' />
        </motion.div>
    )
}

export default Title;
