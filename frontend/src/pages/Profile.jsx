import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Smartphone, ShieldCheck, Key, Eye, EyeOff, Send, User, ChevronRight, Activity, Globe } from 'lucide-react'

const Profile = () => {
    const { user, updatePassword, sendOTP, verifyOTPAndChangePassword } = useContext(AuthContext);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState('password'); 
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (!user) return null;

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            const res = await sendOTP(user.phone);
            if (res.success) {
                setOtpSent(true);
                toast.success(`OTP sent to ${(user.phone || '').replace(/.(?=.{4})/g, '*')}`);
            }
        } catch (error) {
            toast.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyAndChange = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        if (formData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters!");
        }

        setLoading(true);
        try {
            let res;
            if (verificationMethod === 'password') {
                res = await updatePassword(formData.oldPassword, formData.newPassword);
            } else {
                res = await verifyOTPAndChangePassword(formData.otp, formData.newPassword);
            }

            if (res.success) {
                toast.success(res.message);
                setIsChangingPassword(false);
                setOtpSent(false);
                setFormData({ oldPassword: '', otp: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='min-h-screen bg-[#fafafa] pt-28 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-24'
        >
            <div className='max-w-[1440px] mx-auto'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest mb-4'>
                            <User size={12} />
                            Manage Account
                        </div>
                        <div className='text-4xl sm:text-5xl lg:text-6xl'>
                            <Title text1={'MY'} text2={'PROFILE'} />
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsChangingPassword(!isChangingPassword);
                            setOtpSent(false);
                        }}
                        className='px-8 py-4 bg-white border border-gray-100 shadow-xl shadow-black/5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 flex items-center gap-3 active:scale-95'
                    >
                        {isChangingPassword ? 'Cancel Update' : 'Security Suite'}
                        <ChevronRight size={14} />
                    </motion.button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                    {/* User Identity Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-4'
                    >
                        <div className='bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group'>
                            {/* Decorative Background */}
                            <div className='absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700' />
                            
                            <div className='relative z-10'>
                                <div className='w-24 h-24 bg-black rounded-[28px] flex items-center justify-center text-white text-4xl font-black italic relative shadow-2xl shadow-black/20 mb-8 overflow-hidden'>
                                    {user.name.charAt(0)}
                                    <div className='absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent' />
                                </div>
                                <div className='space-y-8'>
                                    <div>
                                        <p className='text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2'>Elite Member</p>
                                        <h3 className='text-3xl font-black italic tracking-tighter text-gray-900 leading-none'>
                                            {user.name}
                                        </h3>
                                    </div>
                                    <div className='space-y-6 pt-6 border-t border-gray-50'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400'>
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <p className='text-[9px] font-black text-gray-300 uppercase tracking-widest'>Email</p>
                                                <p className='text-xs font-bold text-gray-600 truncate max-w-[200px]'>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400'>
                                                <Smartphone size={18} />
                                            </div>
                                            <div>
                                                <p className='text-[9px] font-black text-gray-300 uppercase tracking-widest'>Phone</p>
                                                <p className='text-xs font-bold text-gray-600'>{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='pt-6'>
                                        <div className='px-4 py-2 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-green-100 flex items-center gap-2 w-fit'>
                                            <ShieldCheck size={12} />
                                            Identity Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dynamic Content Section */}
                    <div className='lg:col-span-8'>
                        <AnimatePresence mode='wait'>
                            {!isChangingPassword ? (
                                <motion.div 
                                    key="info"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className='grid grid-cols-1 md:grid-cols-2 gap-8'
                                >
                                    <div className='bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between h-[300px] group hover:border-black transition-all duration-500'>
                                        <div>
                                            <div className='w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500'>
                                                <Activity size={24} />
                                            </div>
                                            <h3 className='text-xl font-black italic uppercase tracking-tighter mb-4'>Elite Status</h3>
                                            <p className='text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest opacity-70'>
                                                Account active since 2024. Your premium benefits include early access to new drops and personalized consultations.
                                            </p>
                                        </div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2'>
                                            View Performance <ChevronRight size={12} />
                                        </div>
                                    </div>

                                    <div className='bg-black p-10 rounded-[40px] shadow-2xl shadow-black/20 flex flex-col justify-between h-[300px] text-white group'>
                                        <div>
                                            <div className='w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md mb-6'>
                                                <Lock size={24} />
                                            </div>
                                            <h3 className='text-xl font-black italic uppercase tracking-tighter mb-4'>Cryptic Vault</h3>
                                            <p className='text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest'>
                                                Your digital assets and credentials are protected by industry-leading encryption protocols. Keep your secret keys safe.
                                            </p>
                                        </div>
                                        <div className='text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors cursor-pointer flex items-center gap-2'>
                                            Review Audit Log <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : user.isDemo ? (
                                <motion.div 
                                    key="demo-restricted"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className='bg-red-50/20 p-16 rounded-[40px] border border-red-100 flex flex-col items-center text-center'
                                >
                                    <div className='w-20 h-20 bg-red-100 rounded-[28px] flex items-center justify-center text-red-600 mb-8 shadow-xl shadow-red-500/10'>
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className='text-2xl font-black italic uppercase tracking-tighter text-red-900 mb-4'>Security Restricted</h3>
                                    <p className='text-xs font-bold text-red-600/60 max-w-sm mx-auto leading-loose uppercase tracking-widest mb-10'>
                                        Access to security credentials is locked for the <strong>Public Demo Environment</strong>. To explore these features, please authenticate with a personal account.
                                    </p>
                                    <button 
                                        onClick={() => setIsChangingPassword(false)}
                                        className='px-10 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 active:scale-95'
                                    >
                                        Return To Safety
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="change"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className='bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden'
                                >
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-10' />
                                    
                                    <h3 className='text-2xl font-black italic uppercase tracking-tighter mb-10'>Security Credentials</h3>
                                    
                                    {/* Tabbed Switch */}
                                    <div className='flex p-2 bg-gray-50 rounded-[22px] mb-10 border border-gray-100'>
                                        <button 
                                            onClick={() => { setVerificationMethod('password'); setOtpSent(false); }}
                                            className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-500 ${verificationMethod === 'password' ? 'bg-white shadow-xl shadow-black/5 text-black' : 'text-gray-400'}`}
                                        >
                                            Standard Verification
                                        </button>
                                        <button 
                                            onClick={() => setVerificationMethod('otp')}
                                            className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-500 ${verificationMethod === 'otp' ? 'bg-white shadow-xl shadow-black/5 text-black' : 'text-gray-400'}`}
                                        >
                                            Phone OTP Bridge
                                        </button>
                                    </div>

                                    <form onSubmit={handleVerifyAndChange} className='space-y-8'>
                                        <div className='grid grid-cols-1 gap-6'>
                                            {verificationMethod === 'password' ? (
                                                <div className='relative'>
                                                    <div className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-300'>
                                                        <Lock size={18} />
                                                    </div>
                                                    <input 
                                                        type={showPasswords ? 'text' : 'password'}
                                                        required 
                                                        placeholder='CURRENT PASSCODE'
                                                        value={formData.oldPassword}
                                                        onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                                                        className='w-full pl-16 pr-16 py-5 bg-gray-50 border border-gray-100 rounded-[22px] text-xs font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all uppercase tracking-widest'
                                                    />
                                                </div>
                                            ) : (
                                                <div className='space-y-4'>
                                                    <p className='text-[10px] font-black text-blue-600 uppercase tracking-widest pl-4'>BRIDGE VIA {user.phone}</p>
                                                    <div className='flex gap-4'>
                                                        <div className='relative flex-1'>
                                                            <div className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-300'>
                                                                <ShieldCheck size={18} />
                                                            </div>
                                                            <input 
                                                                type='text'
                                                                placeholder='6-DIGIT CORE'
                                                                maxLength={6}
                                                                value={formData.otp}
                                                                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                                                className='w-full pl-16 py-5 bg-gray-50 border border-gray-100 rounded-[22px] text-xs font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all uppercase tracking-widest'
                                                            />
                                                        </div>
                                                        <button 
                                                            type='button'
                                                            onClick={handleSendOTP}
                                                            disabled={loading || otpSent}
                                                            className='px-8 bg-black text-white rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2'
                                                        >
                                                            {loading ? '...' : (otpSent ? 'Resend' : <Send size={14} />)}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50'>
                                                <div className='relative'>
                                                    <div className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-300'>
                                                        <Key size={18} />
                                                    </div>
                                                    <input 
                                                        type={showPasswords ? 'text' : 'password'}
                                                        required 
                                                        placeholder='NEW PASSCODE'
                                                        value={formData.newPassword}
                                                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                        className='w-full pl-16 pr-16 py-5 bg-gray-50 border border-gray-100 rounded-[22px] text-xs font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all uppercase tracking-widest'
                                                    />
                                                    <button 
                                                        type='button'
                                                        onClick={() => setShowPasswords(!showPasswords)}
                                                        className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black'
                                                    >
                                                        {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <div className='relative'>
                                                    <div className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-300'>
                                                        <Key size={18} />
                                                    </div>
                                                    <input 
                                                        type={showPasswords ? 'text' : 'password'}
                                                        required 
                                                        placeholder='CONFIRM NEW'
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                        className='w-full pl-16 py-5 bg-gray-50 border border-gray-100 rounded-[22px] text-xs font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all uppercase tracking-widest'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            type='submit'
                                            disabled={loading}
                                            className='w-full py-6 bg-black text-white rounded-[30px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 h-16 leading-none'
                                        >
                                            {loading ? 'Transmitting...' : 'Apply Security Lock'}
                                            <ChevronRight size={14} className='group-hover:translate-x-2 transition-transform' />
                                        </button>
                                    </form>

                                    <div className='mt-10 p-6 bg-amber-50 rounded-[30px] border border-amber-100 flex gap-4'>
                                        <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 font-black italic'>!</div>
                                        <p className='text-[10px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed'>
                                            <strong>Advisory:</strong> Complex credentials ensure maximum protection. Avoid using repetitive numeric sequences.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Profile
