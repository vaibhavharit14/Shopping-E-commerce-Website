import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Title from './Title'

const Testimonials = () => {
    const reviews = [
        {
            name: "Alexander Rossi",
            role: "Fashion Curator",
            comment: "The quality of fabrics and the precision in tailoring is something I haven't seen in online retail for a long time. Forever truly understands luxury.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
        },
        {
            name: "Elena Gilbert",
            role: "Lifestyle Blogger",
            comment: "Shopping at Forever is an experience. The website is beautiful, and the products are even better in person. My go-to for essentials.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
        },
        {
            name: "Marcus Thorne",
            role: "Creative Director",
            comment: "Minimalism meets durability. Forever's collections are timeless. It's rare to find a brand that delivers on both style and quality consistently.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop"
        }
    ]

    return (
        <section className='my-40 relative px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <div className='absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -z-10' />
            
            <div className='flex flex-col items-center text-center mb-24'>
                <Title text1={'ELITE'} text2={'VOICES'} />
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] -mt-4'>Trusted by the industry's finest</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                {reviews.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className='bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative group hover:border-black transition-all duration-700'
                    >
                        <Quote className='absolute top-8 right-8 text-gray-50 opacity-0 group-hover:opacity-100 group-hover:text-gray-100 transition-all duration-700' size={60} />
                        
                        <div className='flex gap-1 mb-8'>
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} className='fill-black text-black' />)}
                        </div>

                        <p className='text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose italic mb-10 opacity-70'>
                            "{item.comment}"
                        </p>

                        <div className='flex items-center gap-4'>
                            <div className='w-14 h-14 rounded-2xl overflow-hidden shadow-xl shadow-black/10'>
                                <img src={item.image} className='w-full h-full object-cover' alt={item.name} />
                            </div>
                            <div>
                                <h4 className='text-xs font-black uppercase tracking-widest text-gray-900'>{item.name}</h4>
                                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1'>{item.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials
