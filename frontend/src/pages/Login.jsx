import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, Github } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const { login, register, user } = useContext(AuthContext);
    const { navigate } = useContext(ShopContext);
    const location = useLocation();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (currentState === 'Login') {
                await login(email, password);
                // Removed redundant toast
            } else {
                await register(name, email, password);
                toast.success('Account created!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        setLoading(true);
        try {
            // Fetch user info using the access token
            const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            
            const userData = res.data;
            const googleUser = {
                name: userData.name,
                email: userData.email,
                role: 'user',
                picture: userData.picture,
                isGoogleUser: true
            };
            
            await login(userData.email, 'GOOGLE_AUTH_HIDDEN_KEY', googleUser);
            // Removed redundant toast
        } catch (error) {
            console.error(error);
            toast.error('Google Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => toast.error('Google Login Failed'),
    });

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            // Pre-emptively clear demo cart to fix the "ghost item" bug
            localStorage.removeItem("cart_user12123@gmail.com");
            await login('user12123@gmail.com', 'user12123');
            // Toast removed as requested by user to reduce notifications
        } catch (error) {
            toast.error('Demo failed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            const redirectPath = location.state?.from || '/';
            navigate(redirectPath);
        }
    }, [user, navigate, location.state])

    return (
        <div className='min-h-[95vh] flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden'>
            
            {/* Background Accents */}
            <div className='absolute top-0 left-0 w-full h-full -z-10'>
                <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60' />
                <div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-50 rounded-full blur-[120px] opacity-60' />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className='w-full max-w-[480px] bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative'
            >
                <div className='p-8 sm:p-12'>
                    {/* Header */}
                    <div className='text-center mb-10'>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className='inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6'
                        >
                            <Sparkles size={12} className='text-yellow-400' />
                            {currentState === 'Login' ? 'Member Portal' : 'New Era Starts Here'}
                        </motion.div>
                        <h2 className='text-4xl font-black tracking-tighter text-gray-900 mb-3 uppercase italic'>
                            {currentState === 'Login' ? 'Welcome' : 'Join Us'}
                        </h2>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
                            {currentState === 'Login' ? 'Access your elite profile' : 'Become part of the movement'}
                        </p>
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-4'>
                        <AnimatePresence mode='wait'>
                            {currentState === 'Sign Up' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className='relative group'
                                >
                                    <div className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors'>
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='w-full bg-gray-50/50 border border-gray-100 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all'
                                        placeholder='FULL NAME'
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className='relative group'>
                            <div className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors'>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full bg-gray-50/50 border border-gray-100 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all'
                                placeholder='EMAIL ADDRESS'
                            />
                        </div>

                        <div className='relative group'>
                            <div className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors'>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full bg-gray-50/50 border border-gray-100 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all'
                                placeholder='PASSWORD'
                            />
                        </div>

                        {currentState === 'Login' && (
                            <div className='flex justify-end'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black cursor-pointer transition-colors'>
                                    Forgot Password?
                                </p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className='w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/10 flex items-center justify-center gap-3 active:bg-gray-900 leading-none h-14'
                        >
                            {loading ? (
                                <div className='h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin' />
                            ) : (
                                <>
                                    {currentState === 'Login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Social Login */}
                    <div className='mt-8 pt-8 border-t border-gray-50'>
                        <p className='text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] text-center mb-6'>Social Access</p>
                        
                        <div className='space-y-3'>
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => googleLogin()}
                                className='w-full h-14 flex items-center justify-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all hover:border-black'
                            >
                                <div className='w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-50'>
                                    <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className='w-4 h-4' />
                                </div>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-900'>Continue With Google</span>
                            </motion.button>

                            {currentState === 'Login' && (
                                <button 
                                    onClick={handleDemoLogin}
                                    className='w-full h-12 flex items-center justify-center gap-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all'
                                >
                                    <User size={14} /> Demo Access
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='mt-10 text-center'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
                            {currentState === 'Login' ? "New here? " : "Already elite? "}
                            <span 
                                onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                                className='text-black cursor-pointer hover:underline underline-offset-4 decoration-2'
                            >
                                {currentState === 'Login' ? 'Join the movement' : 'Log in here'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer Link */}
                <div className='bg-gray-50 p-6 flex items-center justify-center gap-2 border-t border-gray-100'>
                    <ShieldCheck size={14} className='text-green-500' />
                    <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Secure SSL Encryption</span>
                </div>
            </motion.div>
        </div>
    )
}

export default Login;