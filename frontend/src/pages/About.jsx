import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Heart, Target } from 'lucide-react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className='pt-10'>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-2xl text-center mb-16'
      >
          <Title text1={'OUR'} text2={'STORY'} />
          <p className='text-gray-500 text-sm mt-4 max-w-lg mx-auto'>Redefining excellence in fashion and lifestyle since our inception. We don't just sell products; we deliver experiences.</p>
      </motion.div>

      <div className='flex flex-col lg:flex-row gap-16 mb-28 items-center'>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='w-full lg:w-1/2 relative group'
          >
            <div className='absolute -inset-4 bg-blue-600/5 rounded-[40px] -z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500'></div>
            <img className='w-full rounded-[32px] shadow-2xl saturate-110' src={assets.about_img} alt="About Forever" />
            <div className='absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white hidden md:block'>
              <p className='text-2xl font-black text-gray-900'>Since 2024</p>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>The Journey Started</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='flex flex-col justify-center gap-8 lg:w-1/2'
          >
              <div className='space-y-6'>
                <h3 className='text-3xl font-black text-gray-900 leading-tight flex items-center gap-3'>
                  <Target className='text-blue-600' /> Our Mission
                </h3>
                <p className='text-gray-600 leading-relaxed text-lg'>Forever was born out of a passion for innovation and a desire to revolutionize the way people shop. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase premium products from the comfort of their homes.</p>
                <p className='text-gray-500 leading-relaxed'>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. We're dedicated to providing a seamless shopping experience that exceeds expectations.</p>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-gray-50 p-6 rounded-3xl border border-gray-100 font-bold'>
                  <p className='text-2xl text-blue-600'>99%</p>
                  <p className='text-xs text-gray-400 uppercase tracking-widest'>Customer Satisfaction</p>
                </div>
                <div className='bg-gray-50 p-6 rounded-3xl border border-gray-100 font-bold'>
                  <p className='text-2xl text-blue-600'>1M+</p>
                  <p className='text-xs text-gray-400 uppercase tracking-widest'>Products Delivered</p>
                </div>
              </div>
          </motion.div>
      </div>

      <div className='text-center mb-16'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-32'
      >
          <motion.div variants={itemVariants} className='group bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 hover:border-blue-500 transition-all duration-500'>
            <div className='w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner'>
              <ShieldCheck size={28} />
            </div>
            <h4 className='text-xl font-black text-gray-900 mb-4'>Quality Assurance</h4>
            <p className='text-gray-500 leading-relaxed'>We meticulously select and vet each product to ensure it meets our stringent quality standards. Only the best makes it to our store.</p>
          </motion.div>

          <motion.div variants={itemVariants} className='group bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 hover:border-blue-500 transition-all duration-500'>
            <div className='w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner'>
              <Zap size={28} />
            </div>
            <h4 className='text-xl font-black text-gray-900 mb-4'>Hassle-Free Shopping</h4>
            <p className='text-gray-500 leading-relaxed'>With our user-friendly interface and lightning-fast ordering process, shopping has never been easier or more enjoyable.</p>
          </motion.div>

          <motion.div variants={itemVariants} className='group bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 hover:border-blue-500 transition-all duration-500'>
            <div className='w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner'>
              <Heart size={28} />
            </div>
            <h4 className='text-xl font-black text-gray-900 mb-4'>Exceptional Support</h4>
            <p className='text-gray-500 leading-relaxed'>Our team of dedicated professionals is here 24/7 to assist you, ensuring your satisfaction remains our top priority.</p>
          </motion.div>
      </motion.div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
