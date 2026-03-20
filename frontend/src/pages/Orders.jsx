import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/AuthContext'
import Title from '../components/Title';
import { Truck, CheckCircle, Package, Clock, MapPin, Receipt, CreditCard, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {

  const { currency, orders, navigate, getImageUrl, allProducts } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const [trackingId, setTrackingId] = useState(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
        navigate('/login');
    }
  }, [user, navigate]);

  const trackingSteps = [
    { name: 'Confirmed', icon: <Package size={18} />, desc: 'Order received and confirmed.' },
    { name: 'Processing', icon: <Clock size={18} />, desc: 'Items are being packed with care.' },
    { name: 'Shipped', icon: <Truck size={18} />, desc: 'Package is on its way to you.' },
    { name: 'Out for Delivery', icon: <MapPin size={18} />, desc: 'Delivery partner is nearby.' },
    { name: 'Delivered', icon: <CheckCircle size={18} />, desc: 'Package delivered successfully!' }
  ];

  const getStatusLevel = (status) => {
    switch (status) {
        case 'Order Placed': return 0;
        case 'Processing': return 1;
        case 'Shipped': return 2;
        case 'Out for Delivery': return 3;
        case 'Delivered': return 4;
        default: return 0;
    }
  };

  return (
    <div className='pt-10'>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-16'
      >
        <Title text1={'MY'} text2={'PURCHASES'} />
        <p className='text-gray-500 text-sm mt-4'>Keep track of your orders and delivery status in real-time.</p>
      </motion.div>

      <div className='max-w-4xl mx-auto'>
        {!orders || orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-32 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200'
            >
                 <div className='w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6 text-gray-300'>
                   <Package size={32} />
                 </div>
                 <h3 className='text-xl font-black text-gray-900 mb-2'>No orders yet</h3>
                 <p className='text-gray-500 text-sm mb-8'>Your shopping journey is just one click away.</p>
                 <button onClick={() => navigate('/collection')} className='bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:shadow-black/20'>Start Shopping</button>
            </motion.div>
        ) : (
          <div className='space-y-10'>
          {[...orders].reverse().map((order, index) => {
            const currentLevel = getStatusLevel(order.status || 'Order Placed');
            const isTracking = trackingId === order._id;

            return (
              <motion.div 
                key={order._id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden group hover:border-blue-500/30 transition-all duration-300'
              >
                  {/* Order Header */}
                  <div className='bg-gray-50/50 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100'>
                      <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600'>
                            <Receipt size={20} />
                          </div>
                          <div>
                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Order Reference</p>
                            <p className='font-mono text-sm font-bold text-gray-900'>#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                      </div>
                      
                      <div className='flex gap-4'>
                        <button 
                          onClick={() => setTrackingId(isTracking ? null : order._id)}
                          className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${isTracking ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}
                        >
                          {isTracking ? 'Close Tracking' : 'Track Package'}
                        </button>
                      </div>
                  </div>

                  {/* Tracking Timeline */}
                  <AnimatePresence>
                  {isTracking && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='overflow-hidden bg-blue-50/30 border-b border-blue-100'
                    >
                        <div className='p-8 sm:p-12'>
                          <div className='relative flex justify-between items-center max-w-2xl mx-auto mb-10'>
                              {/* Connection Lines */}
                              <div className='absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full'></div>
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(currentLevel / (trackingSteps.length - 1)) * 100}%` }}
                                  className='absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 rounded-full transition-all duration-1000' 
                              ></motion.div>

                              {trackingSteps.map((step, idx) => (
                                  <div key={idx} className='relative z-10 flex flex-col items-center gap-3'>
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${idx <= currentLevel ? 'bg-blue-600 text-white shadow-blue-200 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                          {step.icon}
                                      </div>
                                      <p className={`text-[10px] font-black uppercase tracking-tighter text-center max-w-[80px] ${idx <= currentLevel ? 'text-gray-900' : 'text-gray-300'}`}>
                                          {step.name}
                                      </p>
                                  </div>
                              ))}
                          </div>
                          <div className='bg-white p-6 rounded-2xl border border-blue-100 max-w-lg mx-auto text-center'>
                              <p className='text-sm font-bold text-gray-900 mb-1'>Currently: <span className='text-blue-600 uppercase'>{order.status || 'Order Placed'}</span></p>
                              <p className='text-xs text-gray-500 font-medium'>{trackingSteps[currentLevel].desc}</p>
                          </div>
                        </div>
                    </motion.div>
                  )}
                  </AnimatePresence>

                  {/* Order Items */}
                  <div className='p-6 sm:p-8 divide-y divide-gray-50'>
                  {order.products.map((item, idx) => {
                      // Lookup product in allProducts (merged list) to ensure we have the correct image (local or API)
                      const productInfo = allProducts.find(p => p._id === (item.product?._id || item.product));
                      const pData = productInfo || item.product || {};
                      const imgSource = pData.image;
                      // Handle both image arrays and single strings
                      const img = Array.isArray(imgSource) ? imgSource[0] : imgSource;
                      
                      return (
                        <div key={idx} className='py-6 flex flex-col sm:flex-row items-center gap-8'>
                            <div className='relative group/img'>
                              <img className='w-24 h-32 rounded-2xl shadow-md object-cover group-hover/img:scale-105 transition-transform duration-500' src={getImageUrl(img)} alt={pData.name} />
                              <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-black shadow-lg'>
                                x{item.quantity}
                              </div>
                            </div>
                            
                            <div className='flex-1 text-center sm:text-left'>
                                <p className='text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1'>{pData.category || 'Premium Collection'}</p>
                                <h3 className='text-lg font-black text-gray-900 mb-2 uppercase tracking-tight'>{pData.name || 'Product'}</h3>
                                <div className='flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                                    <span className='flex items-center gap-1.5'><span className='w-1.5 h-1.5 bg-gray-300 rounded-full'></span> Size: <span className='text-gray-900'>{item.size}</span></span>
                                    <span className='flex items-center gap-1.5'><span className='w-1.5 h-1.5 bg-gray-300 rounded-full'></span> Price: <span className='text-gray-900'>{currency}{item.price}</span></span>
                                </div>
                            </div>

                            <div className='text-right'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>Item Subtotal</p>
                                <p className='text-xl font-black text-gray-900'>{currency}{item.price * item.quantity}</p>
                            </div>
                        </div>
                      )
                  })}
                  </div>
                  
                  {/* Order Footer / Meta */}
                  <div className='bg-gray-50/50 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
                      <div className='space-y-4'>
                          <div className='flex items-center gap-3 text-gray-400'>
                            <MapPin size={16} />
                            <p className='text-[10px] font-black uppercase tracking-widest'>Delivery Location</p>
                          </div>
                          <p className='text-sm text-gray-600 font-bold leading-relaxed pr-4'>{order.address}</p>
                      </div>

                      <div className='space-y-4'>
                          <div className='flex items-center gap-3 text-gray-400'>
                            <CreditCard size={16} />
                            <p className='text-[10px] font-black uppercase tracking-widest'>Payment & Info</p>
                          </div>
                          <div className='space-y-2'>
                              <p className='text-xs font-bold text-gray-900 uppercase tracking-wide'>
                                Method: <span className='bg-white px-3 py-1 rounded-lg border border-gray-200 ml-2'> {order.paymentMethod}</span>
                              </p>
                              <div className='flex items-center gap-2'>
                                <Calendar size={14} className='text-gray-400' />
                                <p className='text-[10px] text-gray-400 font-bold uppercase tracking-tighter'>Ordered: {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                              </div>
                          </div>
                      </div>

                      <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-end'>
                          <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>Grand Total</p>
                          <div className='flex items-baseline gap-1'>
                            <span className='text-sm font-black text-gray-400 uppercase'>{currency}</span>
                            <span className='text-4xl font-black text-gray-900 tracking-tighter'>{order.totalAmount}</span>
                          </div>
                          <div className='mt-4 flex items-center gap-2 text-[9px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full'>
                            <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                            {order.payment ? 'Payment Successful' : 'Payment Pending'}
                          </div>
                      </div>
                  </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
