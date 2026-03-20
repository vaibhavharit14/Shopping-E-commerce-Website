import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // Here you would normally send the email to your backend
    }

  return (
    <div className='relative overflow-hidden bg-slate-900 text-white rounded-[40px] px-8 py-16 sm:px-16 sm:py-24 text-center mt-32'>
      {/* Decorative Glow */}
      <div className='absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]'></div>
      <div className='absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]'></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative z-10'
      >
        <div className='flex justify-center mb-6'>
          <div className='w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md'>
            <Mail className='text-blue-400' />
          </div>
        </div>
        <p className='text-3xl sm:text-4xl font-black mb-4'>Join the Forever Circle</p>
        <p className='text-slate-400 text-sm max-w-lg mx-auto font-medium mb-10'>
          Subscribe to our newsletter for exclusive early access to new drops, seasonal sales, and curated style guides delivered straight to your inbox.
        </p>

        <form onSubmit={onSubmitHandler} className='max-w-xl mx-auto flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10'>
          <input 
            className='flex-1 bg-transparent px-6 py-4 outline-none text-sm placeholder-slate-500 font-medium' 
            type="email" 
            placeholder='you@example.com' 
            required
          />
          <button 
            type='submit' 
            className='bg-white text-black font-black text-xs px-10 py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2'
          >
            SUBSCRIBE <Send size={14} />
          </button>
        </form>
        
        <p className='text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest'>We respect your privacy. Unsubscribe at any time.</p>
      </motion.div>
    </div>
  )
}

export default NewsletterBox
