import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Trash2, Calendar, Percent, Sparkles, AlertCircle } from 'lucide-react';

const AdminCoupons = () => {
    const { backendUrl } = useContext(ShopContext);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const fetchCoupons = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            const response = await axios.get(`${backendUrl}/api/coupons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch coupons");
        }
    }, [backendUrl]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            setLoading(true);
            await axios.post(`${backendUrl}/api/coupons`, {
                code: code.toUpperCase(),
                discount: Number(discount),
                expiryDate: expiryDate || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Coupon created successfully");
            setCode('');
            setDiscount('');
            setExpiryDate('');
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create coupon");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${backendUrl}/api/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-0"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-indigo-200'>
                        <Sparkles size={12} />
                        Promotion Suite
                    </div>
                    <div className="text-3xl">
                        <Title text1={'COUPON'} text2={'VAULT'} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Create Coupon Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 sticky top-28">
                        <div className='flex items-center gap-4 mb-10'>
                            <div className='w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl'>
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Mint New Coupon</h3>
                        </div>
                        
                        <form onSubmit={handleCreateCoupon} className="space-y-8">
                            <div className='space-y-2'>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Ticket size={14} /> Coupon Code
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. ELITE50"
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[22px] text-sm font-black focus:border-black focus:bg-white outline-none transition-all uppercase tracking-widest"
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Percent size={14} /> Discount Value
                                </label>
                                <input 
                                    type="number" 
                                    required 
                                    min="1"
                                    max="100"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="20"
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[22px] text-sm font-black focus:border-black focus:bg-white outline-none transition-all text-indigo-600"
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Calendar size={14} /> Sunset Date (Expiry)
                                </label>
                                <input 
                                    type="date" 
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[22px] text-sm font-black focus:border-black focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <button 
                                disabled={loading}
                                type="submit" 
                                className="w-full bg-black text-white py-6 rounded-[30px] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-2xl shadow-black/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? 'TRANSMITTING...' : 'INITIALIZE COUPON'}
                                <Plus size={14} />
                            </button>
                        </form>

                        <div className='mt-10 p-6 bg-indigo-50 rounded-[30px] border border-indigo-100 flex gap-4'>
                            <AlertCircle className='w-5 h-5 text-indigo-600 shrink-0' />
                            <p className='text-[10px] font-bold text-indigo-800 uppercase tracking-widest leading-relaxed'>
                                Coupons apply globally to the cart total. Ensure codes are unique and professional.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Asset</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Benefit</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Time-Lock</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence>
                                    {coupons.length > 0 ? coupons.map((coupon, index) => (
                                        <motion.tr 
                                            key={coupon._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-gray-50/50 transition-all duration-500"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className='w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black italic'>#</div>
                                                    <span className="font-black tracking-[0.2em] text-gray-900 uppercase text-xs">
                                                        {coupon.code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                    {coupon.discount}% REDUCTION
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className='flex flex-col items-center gap-1'>
                                                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                                                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'INFINITE'}
                                                    </p>
                                                    {coupon.expiryDate && <div className='w-8 h-0.5 bg-gray-100 rounded-full' />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                                    className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:rotate-12 transition-all duration-500 ml-auto group-hover:shadow-lg group-hover:shadow-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td colSpan="4" className="px-8 py-32 text-center text-gray-400">
                                                <div className='flex flex-col items-center gap-4'>
                                                    <div className='w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mb-2'>
                                                        <Ticket size={40} className='opacity-30' />
                                                    </div>
                                                    <p className='text-[10px] font-black uppercase tracking-[0.3em] font-sans'>No Assets Detected</p>
                                                    <p className='text-[8px] font-bold text-gray-300 uppercase tracking-widest max-w-[200px] leading-relaxed'>Initialize your first promotion to boost store conversion rates.</p>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminCoupons;
