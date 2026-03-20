import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { Star, ShieldCheck, Truck, RefreshCcw, Heart, Share2, Sparkles, ChevronRight } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Product = () => {

    const { productId } = useParams();
    const { products, apiProducts, currency, addToCart, getImageUrl } = useContext(ShopContext);

    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')
    const [activeTab, setActiveTab] = useState('description');

    const fetchProductData = useCallback(() => {
        let item = products.find((item) => item._id === productId);
        if (!item && apiProducts) {
            item = apiProducts.find((item) => item._id === productId);
        }
        
        if (item) {
            setProductData(item);
            setImage(Array.isArray(item.image) ? getImageUrl(item.image[0]) : getImageUrl(item.image));
            setSize('');
        }
    }, [productId, products, apiProducts, getImageUrl])

    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProductData])

    if (!productData) return <div className='h-screen flex items-center justify-center'><div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin' /></div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='pt-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-24 bg-transparent'
        >
            {/* Breadcrumbs */}
            <div className='flex items-center gap-2 mb-10 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2'>
                <Link to="/" className='hover:text-black transition-colors'>Home</Link>
                <ChevronRight size={12} className='shrink-0' />
                <Link to="/collection" className='hover:text-black transition-colors'>Collection</Link>
                <ChevronRight size={12} className='shrink-0' />
                <span className='text-black truncate'>{productData.name}</span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 mb-24'>
                
                {/* Image Gallery */}
                <div className='lg:col-span-7 flex flex-col-reverse md:flex-row gap-4'>
                    <div className='flex md:flex-col overflow-x-auto md:overflow-y-auto gap-3 shrink-0 md:w-24 max-h-[600px] scrollbar-hide'>
                        {(Array.isArray(productData.image) && productData.image.length > 0 ? productData.image : [productData.image]).map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setImage(getImageUrl(item))}
                                className={`w-20 h-24 md:w-full md:h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${image === getImageUrl(item) ? 'border-black' : 'border-gray-50'}`}
                            >
                                <img src={getImageUrl(item)} className='w-full h-full object-cover' alt="" />
                            </motion.div>
                        ))}
                    </div>
                    <div className='flex-1 relative group bg-gray-50 rounded-[40px] overflow-hidden aspect-[4/5]'>
                        <motion.img 
                            key={image}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={image} 
                            className='w-full h-full object-cover' 
                            alt="" 
                        />
                        <button className='absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all'>
                            <Heart size={20} className='text-gray-900' />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className='lg:col-span-5 py-2'>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2'>
                                <Sparkles size={10} />
                                High Demand
                            </div>
                            <div className='flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full'>
                                {[1,2,3,4].map(star => <Star key={star} size={10} className='fill-black text-black' />)}
                                <Star size={10} className='text-gray-300' />
                                <span className='text-[10px] font-bold text-gray-500 ml-1'>(122 Reviews)</span>
                            </div>
                        </div>

                        <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 uppercase italic mb-4 leading-tight'>
                            {productData.name}
                        </h1>
                        
                        <div className='flex items-baseline gap-4 mb-6'>
                            <p className='text-4xl font-black italic'>{currency}{productData.price}</p>
                            <p className='text-sm font-medium text-gray-300 line-through'>{currency}{(productData.price * 1.2).toFixed(0)}</p>
                        </div>

                        <p className='text-sm text-gray-500 font-medium uppercase tracking-widest opacity-60 leading-relaxed mb-10'>
                            {productData.description}
                        </p>

                        <div className='space-y-8'>
                            {/* Size Selection */}
                            <div>
                                <div className='flex justify-between items-center mb-4'>
                                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>Select Dimension</p>
                                    <p className='text-[9px] font-black text-blue-600 uppercase tracking-widest cursor-pointer underline underline-offset-4'>Size Guide</p>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    {productData.sizes.map((item, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setSize(item)} 
                                            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xs font-black transition-all duration-300 ${size === item ? 'bg-black text-white border-black shadow-xl shadow-black/20' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (!size) {
                                            toast.warn('Please select a size first');
                                        } else {
                                            addToCart(productData._id, size);
                                            toast.success('Added to collection');
                                        }
                                    }} 
                                    className='flex-1 bg-black text-white px-8 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:bg-gray-900 h-16 leading-none'
                                >
                                    Add To Bag
                                    <ChevronRight size={14} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='w-16 h-16 rounded-[22px] border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shrink-0'
                                >
                                    <Share2 size={20} className='text-gray-400' />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <div className='grid grid-cols-2 gap-4 mt-12 pt-12 border-t border-gray-50'>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600'>
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p className='text-[9px] font-black uppercase tracking-widest text-gray-900'>Authenticity</p>
                                <p className='text-[8px] font-bold text-gray-400 uppercase tracking-tighter'>100% Guaranteed</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600'>
                                <Truck size={18} />
                            </div>
                            <div>
                                <p className='text-[9px] font-black uppercase tracking-widest text-gray-900'>Fast Shipping</p>
                                <p className='text-[8px] font-bold text-gray-400 uppercase tracking-tighter'>2-4 Business Days</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600'>
                                <RefreshCcw size={18} />
                            </div>
                            <div>
                                <p className='text-[9px] font-black uppercase tracking-widest text-gray-900'>Returns</p>
                                <p className='text-[8px] font-bold text-gray-400 uppercase tracking-tighter'>7 Day Window</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600'>
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <p className='text-[9px] font-black uppercase tracking-widest text-gray-900'>Exclusive</p>
                                <p className='text-[8px] font-bold text-gray-400 uppercase tracking-tighter'>Limited Edition</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Reviews Tabs */}
            <div className='mb-24'>
                <div className='flex gap-12 border-b border-gray-100 mb-10'>
                    {['description', 'reviews'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === tab ? 'text-black' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId='activeTab' className='absolute bottom-0 left-0 w-full h-[3px] bg-black' />
                            )}
                        </button>
                    ))}
                </div>
                
                <AnimatePresence mode='wait'>
                    {activeTab === 'description' ? (
                        <motion.div 
                            key='desc'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='max-w-4xl'
                        >
                            <div className='space-y-6 text-sm font-medium text-gray-400 uppercase tracking-widest leading-loose opacity-70'>
                                <p>This exceptional piece represents the pinnacle of contemporary design, merging traditional craftsmanship with avant-garde aesthetics. Every thread has been chosen with purpose, and every seam engineered for longevity.</p>
                                <p>Our commitment to excellence ensures that you're not just buying a product, but investing in a legacy of style. Experience the difference of premium materials and meticulous attention to detail that sets Forever apart from the industry standards.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key='rev'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className='space-y-8'>
                                {[1,2].map(i => (
                                    <div key={i} className='p-8 rounded-[32px] bg-gray-50 border border-gray-100 max-w-2xl'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <div>
                                                <p className='text-xs font-black uppercase tracking-widest'>Elite Customer {i}</p>
                                                <div className='flex gap-1 mt-1'>
                                                    {[1,2,3,4,5].map(s => <Star key={s} size={8} className='fill-black text-black' />)}
                                                </div>
                                            </div>
                                            <p className='text-[10px] font-bold text-gray-300 uppercase tracking-tighter'>Verified Purchase</p>
                                        </div>
                                        <p className='text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed'>Absolutely stunning quality. The fit is perfect and the material feels incredibly premium. Highly recommended for anyone looking for true luxury.</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Related Products Section */}
            <div className='pt-24 border-t border-gray-50'>
                <div className='flex justify-between items-end mb-12'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest mb-4'>More In Shop</div>
                        <h2 className='text-4xl font-black tracking-tighter uppercase italic'>Related Pieces</h2>
                    </div>
                </div>
                <RelatedProducts category={productData.category} subCategory={productData.subCategory} id={productData._id} />
            </div>

        </motion.div>
    )
}

export default Product
