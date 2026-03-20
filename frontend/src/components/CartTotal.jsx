import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

import { toast } from 'react-toastify';
import { Tag, Truck, ShieldCheck, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount, applyCoupon, discount, setDiscount, coupon, setCoupon } = useContext(ShopContext);

    const subtotal = getCartAmount();
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee - discountAmount;

    const handleApplyCoupon = () => {
        if (!coupon.trim()) {
            toast.info('Please enter a coupon code');
            return;
        }
        applyCoupon(coupon.toUpperCase());
    }

    return (
        <div className='w-full bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden'>
            <div className='p-8'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20'>
                        <Tag size={18} />
                    </div>
                    <p className='text-xl font-black italic tracking-tight uppercase'>Order Summary</p>
                </div>

                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Subtotal</p>
                        <p className='text-sm font-black text-gray-900'>{currency}{subtotal.toFixed(2)}</p>
                    </div>
                    
                    <AnimatePresence>
                        {discount > 0 && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className='flex justify-between items-center text-green-600'
                            >
                                <p className='text-xs font-bold uppercase tracking-widest'>Discount ({discount}%)</p>
                                <p className='text-sm font-black'>- {currency}{discountAmount.toFixed(2)}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className='flex justify-between items-center'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Shipping Fee</p>
                        <div className='flex items-center gap-2'>
                            {delivery_fee === 0 ? (
                                <span className='text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase'>Free</span>
                            ) : null}
                            <p className='text-sm font-black text-gray-900'>{currency}{delivery_fee.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className='h-[1px] bg-gray-100 my-6'></div>

                    <div className='flex justify-between items-end'>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1'>Total Amount</p>
                            <p className='text-3xl font-black text-gray-900 tracking-tighter'>
                                <span className='text-base font-bold text-gray-400 mr-1'>{currency}</span>
                                {total.toFixed(2)}
                            </p>
                        </div>
                        <div className='flex flex-col items-end gap-1'>
                            <div className='flex items-center gap-1 text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-lg'>
                                <ShieldCheck size={10} /> Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon Section */}
                <div className='mt-10 overflow-hidden'>
                    <label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 pl-2'>
                        <Ticket size={12} className='text-blue-500' /> Have a promo code?
                    </label>
                    <div className='relative flex items-center bg-gray-50 rounded-[24px] border border-gray-100 p-1 group focus-within:border-black transition-all duration-300'>
                        <input 
                            type="text" 
                            placeholder="E.G. SUMMER20" 
                            className='flex-1 bg-transparent pl-6 pr-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none placeholder:text-gray-300 w-full'
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                        <button 
                            onClick={handleApplyCoupon}
                            className='bg-black text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-gray-800 active:scale-95 transition-all whitespace-nowrap'
                        >
                            Apply
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {discount > 0 && (
                            <motion.button 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => { setDiscount(0); setCoupon(''); toast.info('Coupon removed'); }}
                                className='mt-3 flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors'
                            >
                                <X size={10} /> Remove Coupon
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className='mt-6 flex items-center justify-center gap-4 py-2 border-t border-gray-50'>
                    <div className='flex items-center gap-1.5 opacity-50 grayscale'>
                        <Truck size={14} />
                        <span className='text-[8px] font-black uppercase tracking-widest'>Fast Delivery</span>
                    </div>
                    <div className='w-1 h-1 bg-gray-200 rounded-full'></div>
                    <div className='flex items-center gap-1.5 opacity-50 grayscale'>
                        <ShieldCheck size={14} />
                        <span className='text-[8px] font-black uppercase tracking-widest'>1 Year Warranty</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
