import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Youtube, ArrowUpRight } from 'lucide-react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-[#050505] text-white mt-32 pt-24 pb-12 relative overflow-hidden'>
            {/* Top Border Glow */}
            <div className='absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent' />
            
            {/* Background Accents */}
            <div className='absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]' />
            <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]' />

            <div className='max-w-[1440px] mx-auto px-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24'>
                    
                    {/* Brand Section */}
                    <div className='col-span-1 lg:col-span-2'>
                        <div className='flex items-center gap-3 mb-8 group cursor-pointer'>
                            <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700 shadow-2xl shadow-white/10'>
                                <img src={assets.iconblack} className='w-6' alt="Logo" />
                            </div>
                            <div>
                                <h2 className='text-2xl font-black italic tracking-tighter leading-none text-white'>FOREVER<span className='text-blue-500'>.</span></h2>
                                <p className='text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1'>Luxury Essentials</p>
                            </div>
                        </div>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm mb-10 opacity-60'>
                            Pioneering the future of fashion. We combine clinical precision with artistic vision to bring you the finest attire in the digital age.
                        </p>
                        <div className='flex gap-4'>
                            {[
                                { icon: Instagram, link: '#' },
                                { icon: Facebook, link: '#' },
                                { icon: Twitter, link: '#' },
                                { icon: Youtube, link: '#' }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.link}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className='w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300'
                                >
                                    <social.icon size={16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8'>Navigation</h4>
                        <ul className='space-y-4'>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Collections', path: '/collection' },
                                { name: 'Our Story', path: '/about' },
                                { name: 'Get In Touch', path: '/contact' }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className='text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group'>
                                        {item.name}
                                        <ArrowUpRight size={10} className='opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all' />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop Categories */}
                    <div>
                        <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8'>Shop Elite</h4>
                        <ul className='space-y-4'>
                            {['Men', 'Women', 'Kids', 'Accessories'].map((item, i) => (
                                <li key={i}>
                                    <Link to='/collection' className='text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors'>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8'>Connect</h4>
                        <ul className='space-y-6'>
                            <li className='flex items-center gap-4 text-xs font-bold text-gray-400'>
                                <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500'>
                                    <Phone size={14} />
                                </div>
                                +91 98765 43210
                            </li>
                            <li className='flex items-center gap-4 text-xs font-bold text-gray-400'>
                                <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500'>
                                    <Mail size={14} />
                                </div>
                                support@VHforever.com
                            </li>
                            <li className='flex items-center gap-4 text-xs font-bold text-gray-400'>
                                <div className='w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500'>
                                    <MapPin size={14} />
                                </div>
                                Rajasthan, India
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8'>
                    <div className='flex items-center gap-2'>
                        <span className='text-[10px] font-black text-gray-600 uppercase tracking-widest italic'>Secure Payments Via</span>
                        <div className='flex gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer'>
                            <div className='px-2 py-1 bg-white rounded text-[8px] font-black text-black'>VISA</div>
                            <div className='px-2 py-1 bg-white rounded text-[8px] font-black text-black'>MASTER</div>
                            <div className='px-2 py-1 bg-white rounded text-[8px] font-black text-black'>UPI</div>
                        </div>
                    </div>
                    
                    <p className='text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]'>
                        © {currentYear} FOREVER. VH. INC. ENGINEERED WITH PRECISION.
                    </p>

                    <div className='flex gap-6'>
                        {['Privacy', 'Terms', 'Shipment'].map((item, i) => (
                            <span key={i} className='text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer'>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
