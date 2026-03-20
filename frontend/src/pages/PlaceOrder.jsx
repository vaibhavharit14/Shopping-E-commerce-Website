import React, { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import OrderSuccess from '../components/OrderSuccess'
import { MapPin, Phone, Mail, User, CreditCard, Wallet, Truck, ChevronRight, X, Trash2, Check, Sparkles } from 'lucide-react'

const InputField = ({ icon: Icon, label, ...props }) => (
    <div className='relative group'>
        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors'>
            <Icon size={16} />
        </div>
        <input 
            {...props}
            className='w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold placeholder:text-gray-300 placeholder:font-medium focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all'
        />
    </div>
);

const PlaceOrder = () => {

    const [method, setMethod] = useState('');
    const [rememberAddress, setRememberAddress] = useState(false);
    const { navigate, cartItems, allProducts, placeOrder, getCartAmount, delivery_fee, backendUrl, discount, coupon } = useContext(ShopContext);
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const [orderDone, setOrderDone] = useState(false);

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);

    useEffect(() => {
        if (user) {
            const list = localStorage.getItem(`savedAddressesList_${user.email}`);
            if (list) {
                setSavedAddresses(JSON.parse(list));
            }
            
            const oldSaved = localStorage.getItem(`savedAddress_${user.email}`);
            if (oldSaved && (!list || JSON.parse(list).length === 0)) {
                const parsedOld = JSON.parse(oldSaved);
                setSavedAddresses([parsedOld]);
                localStorage.setItem(`savedAddressesList_${user.email}`, JSON.stringify([parsedOld]));
                setFormData(parsedOld);
                setRememberAddress(true);
            }
        }
    }, [user])

    const fillSavedAddress = () => {
        if (!user) {
            toast.info("Please login to use your saved addresses");
            return;
        }
        
        if (savedAddresses.length === 0) {
            toast.info("No saved addresses found.");
            return;
        }

        if (savedAddresses.length === 1) {
            setFormData(savedAddresses[0]);
            setRememberAddress(true);
        } else {
            setShowAddressModal(true);
        }
    }

    const selectAddress = (address) => {
        setFormData(address);
        setRememberAddress(true);
        setShowAddressModal(false);
    }

    const deleteAddress = (index, e) => {
        e.stopPropagation();
        const updated = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updated);
        localStorage.setItem(`savedAddressesList_${user.email}`, JSON.stringify(updated));
        toast.info("Address deleted");
    }



    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Premium Collection',
            order_id: order.id,
            handler: async (response) => {
                try {
                    const discountData = JSON.parse(localStorage.getItem('lastOrderDiscount') || '{}');
                    const storedItems = JSON.parse(localStorage.getItem('lastOrderItems') || '[]');
                    
                    const orderData = {
                        products: storedItems.map(item => ({
                            product: item.product,
                            quantity: item.quantity,
                            size: item.size
                        })),
                        address: localStorage.getItem('lastOrderAddress'),
                        subtotal: discountData.subtotal,
                        discountAmount: discountData.discountAmount,
                        deliveryFee: discountData.deliveryFee,
                        totalAmount: discountData.totalAmount,
                        paymentMethod: 'Razorpay'
                    };
                    
                    await placeOrder(orderData);
                    setOrderDone(true);
                } catch (error) {
                    toast.error("Auth Failure");
                }
            },
            modal: {
                ondismiss: function() {
                    setMethod('cod');
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: { color: "#000000" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    }


    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!user) {
            toast.info("Identification required");
            return;
        }

        if (!method) {
            toast.error("Choose payment method");
            return;
        }

        try {
            let orderItems = [];

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        let itemInfo = allProducts.find(product => product._id === items);
                        
                        if (itemInfo) {
                            itemInfo = structuredClone(itemInfo);
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error("Cart is empty");
                return;
            }

            if (rememberAddress) {
                const isDuplicate = savedAddresses.some(addr => 
                    addr.street === formData.street && addr.city === formData.city
                );

                if (!isDuplicate) {
                    const updatedList = [formData, ...savedAddresses].slice(0, 5);
                    setSavedAddresses(updatedList);
                    localStorage.setItem(`savedAddressesList_${user.email}`, JSON.stringify(updatedList));
                }
            }

            const addressString = `${formData.firstName} ${formData.lastName}, ${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}, ${formData.country}. Tel: ${formData.phone}`;
            const subtotalValue = getCartAmount();
            const discValue = (subtotalValue * discount) / 100;
            const finalTotal = subtotalValue + delivery_fee - discValue;

            if (method === 'cod') {
                const orderData = {
                    products: orderItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        size: item.size
                    })),
                    address: addressString,
                    subtotal: subtotalValue,
                    discountAmount: discValue,
                    couponCode: coupon,
                    deliveryFee: delivery_fee,
                    totalAmount: finalTotal,
                    paymentMethod: 'COD'
                };

                await placeOrder(orderData);
                setOrderDone(true);
                toast.success("Order Placed");
            } else if (method === 'razorpay') {
                const orderItemsForStorage = orderItems.map(item => ({
                    ...item,
                    product: item._id
                }));
                localStorage.setItem('lastOrderItems', JSON.stringify(orderItemsForStorage));
                localStorage.setItem('lastOrderAddress', addressString);
                localStorage.setItem('lastOrderDiscount', JSON.stringify({
                    subtotal: subtotalValue,
                    discountAmount: discValue,
                    deliveryFee: delivery_fee,
                    totalAmount: finalTotal
                }));
                
                try {
                    const response = await axios.post(backendUrl + '/api/payments/create-order', {
                        amount: finalTotal,
                        orderId: 'temp_' + Date.now()
                    });
                    
                    if (response.data.order) {
                        initPay(response.data.order);
                    }
                } catch (error) {
                    toast.error("Gateway Offline");
                }
            } else {
                toast.info("Stripe coming soon");
            }
        } catch (error) {
            toast.error("Process Failed");
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-16 pt-10 min-h-[80vh] border-t border-gray-50'>
         
            {/* Left Side: Delivery Information */}
            <div className='flex flex-col gap-8 w-full lg:max-w-[500px]'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='space-y-2'
                >
                    <div className='flex items-center justify-between'>
                        <Title text1={'DELIVERY'} text2={'DETAILS'} />
                        {user && savedAddresses.length > 0 && (
                            <button 
                                type='button' 
                                onClick={fillSavedAddress}
                                className='flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all shadow-sm'
                            >
                                <Sparkles size={12} /> Auto Fill
                            </button>
                        )}
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <InputField icon={User} name='firstName' value={formData.firstName} onChange={onChangeHandler} placeholder='First Name' required />
                    <InputField icon={User} name='lastName' value={formData.lastName} onChange={onChangeHandler} placeholder='Last Name' required />
                </div>

                <InputField icon={Mail} type='email' name='email' value={formData.email} onChange={onChangeHandler} placeholder='Email Address' required />
                <InputField icon={MapPin} name='street' value={formData.street} onChange={onChangeHandler} placeholder='Street Address' required />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <InputField icon={MapPin} name='city' value={formData.city} onChange={onChangeHandler} placeholder='City' required />
                    <InputField icon={MapPin} name='state' value={formData.state} onChange={onChangeHandler} placeholder='State' required />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <InputField icon={MapPin} name='zipcode' type='number' value={formData.zipcode} onChange={onChangeHandler} placeholder='Zipcode' required />
                    <InputField icon={MapPin} name='country' value={formData.country} onChange={onChangeHandler} placeholder='Country' required />
                </div>

                <InputField icon={Phone} type='number' name='phone' value={formData.phone} onChange={onChangeHandler} placeholder='Phone Number' required />
                
                {user && (
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRememberAddress(!rememberAddress)}
                        className='flex items-center gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-100 cursor-pointer select-none group'
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberAddress ? 'bg-black border-black shadow-lg shadow-black/10' : 'border-gray-200 bg-white'}`}>
                            {rememberAddress && <Check size={14} className='text-white stroke-[4]' />}
                        </div>
                        <div className='flex-1'>
                            <p className='text-xs font-black text-gray-900 uppercase tracking-tighter'>Remember this address</p>
                            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Save for future purchases</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Right Side: Order Summary & Payment */}
            <div className='flex-1 flex flex-col gap-10'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <CartTotal />
                </motion.div>

                <div className='space-y-8'>
                    <div className='flex items-center gap-4 -mb-6'>
                        <Title text1={'PAYMENT'} text2={'MODE'} />
                        <div className='h-[1px] flex-1 bg-gray-100'></div>
                    </div>
                
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {/* Stripe */}
                        <div 
                            onClick={() => { setMethod('stripe'); }} 
                            className={`group p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${method === 'stripe' ? 'border-black bg-black text-white shadow-2xl shadow-black/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                            <div className='flex items-center justify-between mb-8'>
                                <CreditCard size={24} className={method === 'stripe' ? 'text-white' : 'text-gray-400'} />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'stripe' ? 'border-white bg-white' : 'border-gray-200'}`}>
                                    {method === 'stripe' && <div className='w-2 h-2 bg-black rounded-full' />}
                                </div>
                            </div>
                            <p className='text-sm font-black uppercase tracking-widest'>Stripe</p>
                            <p className={`text-[9px] font-bold uppercase mt-1 ${method === 'stripe' ? 'text-gray-400' : 'text-gray-300'}`}>Global Cards</p>
                            {method === 'stripe' && <div className='absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-2xl' />}
                        </div>
                        
                        {/* Razorpay */}
                        <div 
                            onClick={() => { setMethod('razorpay'); }} 
                            className={`group p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${method === 'razorpay' ? 'border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                            <div className='flex items-center justify-between mb-8'>
                                <Wallet size={24} className={method === 'razorpay' ? 'text-white' : 'text-gray-400'} />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'razorpay' ? 'border-white bg-white' : 'border-gray-200'}`}>
                                    {method === 'razorpay' && <div className='w-2 h-2 bg-blue-600 rounded-full' />}
                                </div>
                            </div>
                            <p className='text-sm font-black uppercase tracking-widest'>Razorpay</p>
                            <p className={`text-[9px] font-bold uppercase mt-1 ${method === 'razorpay' ? 'text-blue-100' : 'text-gray-300'}`}>UPI / Cards / Net</p>
                        </div>

                        {/* COD */}
                        <div 
                            onClick={() => { setMethod('cod'); }} 
                            className={`group p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${method === 'cod' ? 'border-green-600 bg-green-600 text-white shadow-2xl shadow-green-200' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                            <div className='flex items-center justify-between mb-8'>
                                <Truck size={24} className={method === 'cod' ? 'text-white' : 'text-gray-400'} />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-white bg-white' : 'border-gray-200'}`}>
                                    {method === 'cod' && <div className='w-2 h-2 bg-green-600 rounded-full' />}
                                </div>
                            </div>
                            <p className='text-sm font-black uppercase tracking-widest'>COD</p>
                            <p className={`text-[9px] font-bold uppercase mt-1 ${method === 'cod' ? 'text-green-100' : 'text-gray-300'}`}>Pay on delivery</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-end gap-6 pt-6 border-t border-gray-100'>
                        {user ? (
                            <button 
                                type='submit' 
                                className='w-full sm:w-auto bg-black text-white px-20 py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all'
                            >
                                Confirm Order
                            </button>
                        ) : (
                            <div className='w-full bg-gray-50 p-8 rounded-[32px] border border-gray-100 text-center'>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6'>Authentication Required</p>
                                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                                    <button 
                                        type='button' 
                                        onClick={() => navigate('/login', { state: { from: '/place-order' } })}
                                        className='flex-1 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg'
                                    >
                                        Log In to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                        <p className='text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center w-full'>
                            By clicking confirm, you agree to our <span className='text-black underline cursor-pointer'>Terms of Service</span>
                        </p>
                    </div>
                </div>
            </div>

            <OrderSuccess show={orderDone} onComplete={() => navigate('/orders')} />

            {/* Address Selection Modal */}
            <AnimatePresence>
                {showAddressModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4'
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className='bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100'
                        >
                            <div className='p-8 border-b flex justify-between items-center'>
                                <div>
                                    <h3 className='font-black text-2xl tracking-tighter'>SAVED ADDRESSES</h3>
                                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-1'>Select a delivery destination</p>
                                </div>
                                <button 
                                    type='button' 
                                    onClick={() => setShowAddressModal(false)}
                                    className='p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all'
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className='max-h-[50vh] overflow-y-auto p-8 space-y-4'>
                                {savedAddresses.map((addr, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => selectAddress(addr)}
                                        className='group relative bg-gray-50/50 border border-gray-100 rounded-[24px] p-6 cursor-pointer hover:border-black hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all'
                                    >
                                        <div className='flex justify-between items-start mb-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                                                    <User size={14} className='text-gray-400' />
                                                </div>
                                                <p className='font-black text-sm uppercase tracking-tight'>{addr.firstName} {addr.lastName}</p>
                                            </div>
                                            <button 
                                                type='button' 
                                                onClick={(e) => deleteAddress(index, e)}
                                                className='p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100'
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className='text-xs text-gray-500 font-bold leading-relaxed'>
                                            {addr.street}, {addr.city}, {addr.state} {addr.zipcode}, {addr.country}
                                        </p>
                                        <div className='flex items-center gap-2 mt-4 text-[9px] font-black text-gray-400 uppercase'>
                                            <Phone size={10} /> {addr.phone}
                                        </div>
                                        <div className='absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0'>
                                            <ChevronRight size={18} className='text-black' />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className='p-8 bg-gray-50 text-center border-t border-gray-100'>
                                <p className='text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]'>Fast & Secure Delivery</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    )
}

export default PlaceOrder
