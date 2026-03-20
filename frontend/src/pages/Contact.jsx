import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='pt-10'>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center text-3xl mb-16'
      >
          <Title text1={'GET IN'} text2={'TOUCH'} />
          <p className='text-gray-500 text-sm mt-4 max-w-lg mx-auto'>We're here to help! Reach out to us for any queries, collaborations, or just to say hello.</p>
      </motion.div>

      <div className='flex flex-col lg:flex-row gap-16 mb-28 items-stretch bg-gray-50/50 p-8 lg:p-16 rounded-[40px] border border-gray-100'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='w-full lg:w-1/2 overflow-hidden rounded-[32px] shadow-2xl relative'
        >
          <img className='w-full h-[500px] lg:h-[600px] object-cover' src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" alt="Contact Us" />
          <div className='absolute inset-0 bg-blue-600/10 mix-blend-multiply'></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className='w-full lg:w-1/2 flex flex-col justify-between py-2'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-10'>
            <div className='space-y-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600'><MapPin /></div>
              <h3 className='font-black text-gray-900 uppercase tracking-widest text-xs'>Our Store</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>Sector 5, Udaipur<br />Rajasthan, India - 313001</p>
            </div>
            <div className='space-y-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600'><Phone /></div>
              <h3 className='font-black text-gray-900 uppercase tracking-widest text-xs'>Call Us</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>(+91) 07423-07423<br />Mon - Sat: 10AM - 7PM</p>
            </div>
            <div className='space-y-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600'><Mail /></div>
              <h3 className='font-black text-gray-900 uppercase tracking-widest text-xs'>Email Us</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>support@forever.com<br />hr@forever.com</p>
            </div>
            <div className='space-y-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600'><Globe /></div>
              <h3 className='font-black text-gray-900 uppercase tracking-widest text-xs'>Online Presence</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>vocalforlocal.com<br />instagram.com/forever</p>
            </div>
          </div>

          <div className='bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 mt-12 lg:mt-0'>
              <h3 className='font-black text-gray-900 mb-2'>Careers at Forever</h3>
              <p className='text-gray-500 text-sm mb-6'>Learn more about our teams and job openings in design, marketing, and tech.</p>
              <button className='w-full bg-black text-white px-8 py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20'>EXPLORE OPPORTUNITIES</button>
          </div>
        </motion.div>
      </div>

      <NewsletterBox/>

    </div>
  )
}

export default Contact
