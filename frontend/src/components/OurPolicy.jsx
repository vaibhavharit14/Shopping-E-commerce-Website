import React from 'react'
import { ShieldCheck, ArrowRightLeft, HeadphoneOff, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const OurPolicy = () => {
  const policies = [
    {
      icon: ArrowRightLeft,
      title: "Easy Exchange",
      desc: "Hassle-free exchange on all orders",
      color: "bg-blue-50 text-blue-600",
      delay: 0.1
    },
    {
      icon: ShieldCheck,
      title: "7 Days Return",
      desc: "No questions asked return policy",
      color: "bg-green-50 text-green-600",
      delay: 0.2
    },
    {
      icon: HeadphoneOff,
      title: "24/7 Support",
      desc: "Instant help whenever you need",
      color: "bg-purple-50 text-purple-600",
      delay: 0.3
    },
    {
      icon: BadgeCheck,
      title: "Quality Assured",
      desc: "Every product is multi-check verified",
      color: "bg-amber-50 text-amber-600",
      delay: 0.4
    }
  ];

  return (
    <div className='py-24 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-white relative overflow-hidden'>
      {/* Decorative background element */}
      <div className='absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent'></div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: policy.delay, duration: 0.5 }}
            className='group p-8 rounded-[32px] border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 text-center relative overflow-hidden'
          >
            <div className={`w-16 h-16 ${policy.color} rounded-2xl flex items-center justify-center m-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-current/10`}>
              <policy.icon size={28} />
            </div>
            <h3 className='text-sm font-black text-gray-900 uppercase tracking-widest mb-2 italic'>{policy.title}</h3>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-tighter leading-relaxed'>{policy.desc}</p>
            
            {/* Subtle glass effect accent */}
            <div className='absolute -right-4 -bottom-4 w-12 h-12 bg-gray-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy
