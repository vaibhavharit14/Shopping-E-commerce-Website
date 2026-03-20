import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/AuthContext';
import Title from '../components/Title';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import CartTotal from '../components/CartTotal';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { allProducts, currency, cartItems, updateQuantity, navigate, getImageUrl, getCartAmount } = useContext(ShopContext);
    const { user } = useContext(AuthContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: cartItems[items][item]
                        })
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, allProducts])

    return (
        <div className='min-h-screen bg-[#fafafa] pt-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-24'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest mb-4'>
                            <ShoppingBag size={12} />
                            Your Selection
                        </div>
                        <div className='text-3xl sm:text-4xl md:text-5xl'>
                            <Title text1={'SHOPPING'} text2={'BAG'} />
                        </div>
                    </div>
                    <div className='flex items-center gap-6 bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm self-end md:self-auto'>
                        <div className='text-right'>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Subtotal</p>
                            <p className='text-xl font-black italic'>{currency}{getCartAmount().toFixed(2)}</p>
                        </div>
                        <div className='w-[1px] h-8 bg-gray-100'></div>
                        <div className='text-right'>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Items</p>
                            <p className='text-xl font-black italic'>{cartData.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                    {/* Cart Items List */}
                    <div className='lg:col-span-7 space-y-6'>
                        <AnimatePresence mode='popLayout'>
                            {cartData.length > 0 ? (
                                cartData.map((item, index) => {
                                    const productData = allProducts.find((product) => product._id === item._id);
                                    if (!productData) return null;

                                    return (
                                        <motion.div
                                            key={`${item._id}-${item.size}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='group bg-white p-4 sm:p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 flex flex-row items-center gap-4 sm:gap-8 relative overflow-hidden'
                                        >
                                            <div className='relative w-20 h-28 sm:w-28 sm:h-36 bg-gray-50 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-700'>
                                                <img 
                                                    className='w-full h-full object-cover'
                                                    src={getImageUrl(Array.isArray(productData.image) ? productData.image[0] : productData.image)} 
                                                    alt={productData.name} 
                                                />
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <div className='flex flex-col sm:flex-row justify-between items-start mb-4 gap-2'>
                                                    <div className='min-w-0 flex-1'>
                                                        <h3 className='text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors truncate'>
                                                            {productData.name}
                                                        </h3>
                                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 w-fit px-3 py-1 rounded-full'>
                                                            Size: {item.size}
                                                        </p>
                                                    </div>
                                                    <p className='text-lg sm:text-xl font-black italic ml-auto sm:ml-0'>{currency}{productData.price}</p>
                                                </div>

                                                <div className='flex items-center justify-between mt-auto'>
                                                    <div className='flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100'>
                                                        <button 
                                                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                                            className='w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all'
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <div className='w-12 text-center text-sm font-black'>
                                                            {item.quantity}
                                                        </div>
                                                        <button 
                                                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                            className='w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all'
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.size, 0)}
                                                        className='p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group/trash'
                                                    >
                                                        <Trash2 size={20} className='group-hover/trash:scale-110 transition-transform' />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-12'
                                >
                                    <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200'>
                                        <ShoppingBag size={48} />
                                    </div>
                                    <div className='max-w-xs'>
                                        <h3 className='text-xl font-black uppercase tracking-widest mb-2'>Bag is empty</h3>
                                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose'>
                                            Looks like you haven't added anything to your collection yet.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/collection')}
                                        className='px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-black/5 hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-3'
                                    >
                                        Explore Trends <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className='lg:col-span-5'>
                        <div className='sticky top-32'>
                            <CartTotal />
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => user ? navigate('/place-order') : navigate('/login', { state: { from: '/place-order' } })} 
                                disabled={cartData.length === 0}
                                className='w-full bg-black text-white py-6 rounded-[30px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-black/20 mt-10 flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed h-16 leading-none'
                            >
                                Secure Checkout
                                <ArrowRight size={14} className='group-hover:translate-x-2 transition-transform' />
                            </motion.button>
                            
                            <div className='mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4'>
                                <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0 font-black italic'>!</div>
                                <p className='text-[10px] font-bold text-blue-800 uppercase tracking-widest leading-relaxed'>
                                    Orders placed today are eligible for premium tracked global shipping.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
