import { useState, useContext, useMemo, useEffect } from "react";

import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { Package, Truck, MapPin, ShoppingBag, DollarSign, Calendar, CreditCard, ArrowLeft, PlusCircle, Image as ImageIcon, Type, Layers, Save, X, Ticket, ShieldCheck, ChevronRight, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import AdminCoupons from "../components/AdminCoupons";

export default function AdminDashboard() {
  const { adminOrders, fetchAllOrders, updateOrder, allProducts, getProductsData, backendUrl } = useContext(ShopContext);
  const [products, setProducts] = useState(allProducts);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'inventory', 'orders', 'add-product', 'coupons'

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestSeller: false,
    stock: 10,
    image: [""]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProducts(allProducts);
    fetchAllOrders();
  }, [allProducts, fetchAllOrders]);

  const statusOptions = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    
    // Safety check for orders
    const safeOrders = adminOrders || [];
    
    const totalRevenue = safeOrders.reduce((acc, order) => acc + (order.totalAmount || order.amount || 0), 0);
    const todayCollection = safeOrders
        .filter(order => new Date(order.createdAt || order.date).toDateString() === today)
        .reduce((acc, order) => acc + (order.totalAmount || order.amount || 0), 0);
    const unpaidOrders = safeOrders.filter(o => o.paymentStatus === 'Unpaid').length;
    
    return { 
      totalRevenue, 
      todayCollection, 
      unpaidOrders, 
      productCount: products.length, 
      orderCount: safeOrders.length 
    };
  }, [adminOrders, products]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Track updated to: ${newStatus}`);
  };

  const startEdit = (product) => {
    setEditProduct(product._id);
    setFormData({ name: product.name, price: product.price, stock: product.stock });
  };

  const saveEdit = () => {
    setProducts(products.map((p) => p._id === editProduct ? { ...p, ...formData } : p));
    setEditProduct(null);
    toast.success("Product Updated!");
  };

  const [localFiles, setLocalFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setLocalFiles([...localFiles, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeLocalFile = (index) => {
    const updatedFiles = localFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setLocalFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login as Admin again");
            return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append("name", newProduct.name);
        formDataPayload.append("description", newProduct.description);
        formDataPayload.append("price", newProduct.price);
        formDataPayload.append("category", newProduct.category);
        formDataPayload.append("subCategory", newProduct.subCategory);
        formDataPayload.append("stock", newProduct.stock);
        formDataPayload.append("bestSeller", newProduct.bestSeller);
        formDataPayload.append("sizes", JSON.stringify(newProduct.sizes));

        // Add regular URLs
        newProduct.image.forEach(url => {
            if (url.trim()) formDataPayload.append("image", url);
        });

        // Add local files
        localFiles.forEach(file => {
            formDataPayload.append("images", file);
        });

        const response = await axios.post(`${backendUrl}/api/products`, formDataPayload, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        if (response.data) {
            toast.success("Product launched successfully!");
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "Men",
                subCategory: "Topwear",
                sizes: ["S", "M", "L", "XL"],
                bestSeller: false,
                stock: 10,
                image: [""]
            });
            setLocalFiles([]);
            setPreviews([]);
            getProductsData();
            setActiveTab('portal');
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This will also remove its photos permanently to save storage space.")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login as Admin again");
          return;
        }

        const response = await axios.delete(`${backendUrl}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          toast.success("Product and photos deleted permanently!");
          getProductsData(); // Refresh list from server
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const addImageField = () => {
    setNewProduct({...newProduct, image: [...newProduct.image, ""]});
  };

  const updateImageField = (index, value) => {
    const updatedImages = [...newProduct.image];
    updatedImages[index] = value;
    setNewProduct({...newProduct, image: updatedImages});
  };

  const removeImageField = (index) => {
    const updatedImages = newProduct.image.filter((_, i) => i !== index);
    setNewProduct({...newProduct, image: updatedImages});
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-12 bg-[#fafafa] min-h-screen font-sans"
    >
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
        <div className="flex flex-col gap-2">
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest w-fit shadow-lg shadow-black/10'>
                <ShieldCheck size={12} />
                Secure Control Node
            </div>
            {activeTab !== 'portal' && (
                <button 
                  onClick={() => setActiveTab('portal')} 
                  className="flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] uppercase tracking-widest transition group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>
            )}
        </div>
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-gray-900 leading-none uppercase">
                <span className="text-gray-400 font-light not-italic">STORE</span> CONTROL
            </h2>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Status</p>
                <p className="text-xs font-bold text-green-600 uppercase tracking-tighter flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Operational
                </p>
            </div>
        </div>
      </div>

      {/* PORTAL VIEW (The Square Boxes) */}
      {activeTab === 'portal' && (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="max-w-7xl mx-auto"
        >
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white p-8 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 flex items-center justify-between group hover:border-black transition-all duration-500 overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 leading-none">Daily Revenue</p>
                        <p className="text-3xl font-black italic tracking-tighter text-gray-900">₹{stats.todayCollection}</p>
                    </div>
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
                        <DollarSign size={24} />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors" />
                </motion.div>

                <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white p-8 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 flex items-center justify-between group hover:border-black transition-all duration-500 overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 leading-none">Pending Tasks</p>
                        <p className="text-3xl font-black italic tracking-tighter text-gray-900">{stats.unpaidOrders} Units</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
                        <CreditCard size={24} />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                </motion.div>

                <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-black p-8 rounded-[40px] shadow-2xl shadow-black/20 flex items-center justify-between text-white group overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 leading-none">Global Sales</p>
                        <p className="text-3xl font-black italic tracking-tighter">₹{stats.totalRevenue}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md transition-all duration-500 shadow-sm relative z-10">
                        <Calendar size={24} />
                    </div>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                </motion.div>
            </div>

            {/* MAIN NAVIGATION BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Add Product Box */}
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    onClick={() => setActiveTab('add-product')}
                    className="group bg-white p-10 rounded-[48px] shadow-2xl shadow-black/5 border border-gray-100 hover:border-black transition-all duration-700 cursor-pointer flex flex-col justify-between h-[360px] relative overflow-hidden"
                >
                    <div className='absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors' />
                    <div>
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-sm mb-8">
                            <PlusCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none">Catalog<br/>Expansion</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Launch fresh arrivals and define your store's aesthetic.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className='text-[10px] font-black text-amber-600 uppercase tracking-widest'>Launch Node</span>
                        <ChevronRight className='text-amber-600 group-hover:translate-x-2 transition-transform' size={16} />
                    </div>
                </motion.div>

                {/* Inventory Box */}
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    onClick={() => setActiveTab('inventory')}
                    className="group bg-white p-10 rounded-[48px] shadow-2xl shadow-black/5 border border-gray-100 hover:border-black transition-all duration-700 cursor-pointer flex flex-col justify-between h-[360px] relative overflow-hidden"
                >
                    <div className='absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors' />
                    <div>
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm mb-8">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none">Digital<br/>Inventory</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Systematic stock tracking and precision price management.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className='text-[10px] font-black text-blue-600 uppercase tracking-widest'>{stats.productCount} Total SKU</span>
                        <ChevronRight className='text-blue-600 group-hover:translate-x-2 transition-transform' size={16} />
                    </div>
                </motion.div>

                {/* Orders Box */}
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    onClick={() => setActiveTab('orders')}
                    className="group bg-white p-10 rounded-[48px] shadow-2xl shadow-black/5 border border-gray-100 hover:border-black transition-all duration-700 cursor-pointer flex flex-col justify-between h-[360px] relative overflow-hidden"
                >
                    <div className='absolute -top-12 -right-12 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors' />
                    <div>
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm mb-8">
                            <Truck size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none">Logistics<br/>Command</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Global shipment monitoring and order fulfillment protocols.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className='text-[10px] font-black text-green-600 uppercase tracking-widest'>{stats.orderCount} Pending</span>
                        <ChevronRight className='text-green-600 group-hover:translate-x-2 transition-transform' size={16} />
                    </div>
                </motion.div>

                {/* Coupons Box */}
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    onClick={() => setActiveTab('coupons')}
                    className="group bg-white p-10 rounded-[48px] shadow-2xl shadow-black/5 border border-gray-100 hover:border-black transition-all duration-700 cursor-pointer flex flex-col justify-between h-[360px] relative overflow-hidden"
                >
                    <div className='absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors' />
                    <div>
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm mb-8">
                            <Ticket size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none">Promotion<br/>Protocol</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Mint conversion-boosting assets and discount credentials.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className='text-[10px] font-black text-indigo-600 uppercase tracking-widest'>Admin Shield</span>
                        <ChevronRight className='text-indigo-600 group-hover:translate-x-2 transition-transform' size={16} />
                    </div>
                </motion.div>
            </div>
        </motion.div>
      )}

      {/* ADD PRODUCT VIEW */}
      {activeTab === 'add-product' && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto pb-32"
        >
            <div className="bg-white rounded-[60px] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
                <div className="bg-black p-12 text-white relative overflow-hidden">
                    <div className='relative z-10'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-md'>
                            <Plus size={12} />
                            Administrative Protocol
                        </div>
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                            New Product <span className='text-gray-500 font-light not-italic'>Registration</span>
                        </h3>
                    </div>
                    <div className='absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl' />
                </div>
                
                <form onSubmit={handleAddProduct} className="p-10 md:p-16 space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Primary Metadata */}
                        <div className="space-y-10">
                            <div className='flex items-center gap-4 mb-2'>
                                <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-100'>
                                    <Type size={18} />
                                </div>
                                <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-400'>Primary Metadata</h4>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Product Title</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newProduct.name}
                                    onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})}
                                    placeholder="e.g. CORE OVERSIZED TEE"
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-black text-sm uppercase tracking-widest"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Valuation (INR)</label>
                                    <input 
                                        required
                                        type="number" 
                                        value={newProduct.price}
                                        onChange={(e)=>setNewProduct({...newProduct, price: e.target.value})}
                                        placeholder="0.00"
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-black text-xl text-black"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Stock Level</label>
                                    <input 
                                        type="number" 
                                        value={newProduct.stock}
                                        onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})}
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-black text-xl text-center"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Category</label>
                                    <select 
                                        value={newProduct.category}
                                        onChange={(e)=>setNewProduct({...newProduct, category: e.target.value})}
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Sub-Type</label>
                                    <select 
                                        value={newProduct.subCategory}
                                        onChange={(e)=>setNewProduct({...newProduct, subCategory: e.target.value})}
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                                    >
                                        <option value="Topwear">Topwear</option>
                                        <option value="Bottomwear">Bottomwear</option>
                                        <option value="Winterwear">Winterwear</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 p-6 bg-gray-50 rounded-[28px] border border-gray-100'>
                                <input 
                                    id="bestseller"
                                    type="checkbox" 
                                    checked={newProduct.bestSeller}
                                    onChange={(e)=>setNewProduct({...newProduct, bestSeller: e.target.checked})}
                                    className="w-6 h-6 accent-black cursor-pointer rounded-lg"
                                />
                                <label htmlFor="bestseller" className="text-[10px] font-black text-gray-900 uppercase cursor-pointer tracking-widest">Mark as Bestseller Item</label>
                            </div>
                        </div>

                        {/* Extended Specifications */}
                        <div className="space-y-10">
                            <div className='flex items-center gap-4 mb-2'>
                                <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-100'>
                                    <Layers size={18} />
                                </div>
                                <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-400'>Specifications</h4>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Product Narrative</label>
                                <textarea 
                                    required
                                    rows="6"
                                    value={newProduct.description}
                                    onChange={(e)=>setNewProduct({...newProduct, description: e.target.value})}
                                    placeholder="Crafted from premium heavy-weight cotton..."
                                    className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all font-medium text-sm leading-relaxed"
                                ></textarea>
                            </div>

                            <div className='space-y-6'>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Sizing Matrix</label>
                                <div className='flex flex-wrap gap-3'>
                                    {["S", "M", "L", "XL", "XXL"].map(size => (
                                        <div 
                                            key={size}
                                            onClick={() => {
                                                const updatedSizes = newProduct.sizes.includes(size)
                                                    ? newProduct.sizes.filter(s => s !== size)
                                                    : [...newProduct.sizes, size];
                                                setNewProduct({...newProduct, sizes: updatedSizes});
                                            }}
                                            className={`px-6 py-4 rounded-2xl text-xs font-black cursor-pointer transition-all border-2 ${newProduct.sizes.includes(size) ? 'bg-black text-white border-black shadow-xl shadow-black/10' : 'bg-white text-gray-400 border-gray-100 hover:border-black'}`}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Asset Management */}
                    <div className="space-y-12 pt-16 border-t-2 border-dashed border-gray-100">
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-100'>
                                <ImageIcon size={18} />
                            </div>
                            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-400'>Visual Asset Management</h4>
                        </div>

                        {/* URL Method */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] pl-1">External Links</label>
                                <button 
                                    type="button"
                                    onClick={addImageField}
                                    className="text-[10px] font-black text-gray-400 hover:text-black flex items-center gap-2 transition-colors uppercase tracking-widest"
                                >
                                    <Plus size={14} /> Add Source
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {newProduct.image.map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <input 
                                            type="url" 
                                            value={url}
                                            onChange={(e) => updateImageField(idx, e.target.value)}
                                            placeholder="Source URL"
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[24px] focus:border-black focus:bg-white outline-none transition-all text-xs font-bold pr-14"
                                        />
                                        {newProduct.image.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeImageField(idx)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Local Upload */}
                        <div className="bg-gray-50/50 p-10 rounded-[48px] border border-gray-100">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8 block">Local Upload Hub</label>
                            
                            <div className="flex flex-wrap gap-6">
                                <label className="w-32 h-32 border-4 border-dashed border-gray-200 rounded-[30px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-black transition-all text-gray-300 hover:text-black group">
                                    <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black mt-2 tracking-[0.2em]">BROWSE</span>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>

                                {previews.map((preview, idx) => (
                                    <div key={idx} className="relative w-32 h-32 group">
                                        <img src={preview} className="w-full h-full object-cover rounded-[30px] border-2 border-white shadow-xl" alt="" />
                                        <button 
                                            type="button"
                                            onClick={() => removeLocalFile(idx)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform hover:bg-black"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-10">
                        <button 
                            disabled={isSubmitting}
                            type="submit"
                            className="flex-1 bg-black text-white p-8 rounded-[30px] font-black text-[12px] uppercase tracking-[0.5em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isSubmitting ? "PROCESSING..." : (
                                <>
                                    <Save size={18} /> INITIALIZE CATALOG ENTRY
                                </>
                            )}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('portal')}
                            className="px-12 bg-white text-gray-400 rounded-[30px] font-black text-[10px] uppercase border-2 border-gray-100 hover:border-black hover:text-black transition-all tracking-[0.2em]"
                        >
                            Abort
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
      )}

      {/* INVENTORY VIEW */}
      {activeTab === 'inventory' && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-in pb-32"
        >
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12'>
                <div className='space-y-1'>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                        Digital <span className='text-gray-400 font-light not-italic'>Inventory</span>
                    </h3>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Totaling {products.length} Professional Assets</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Product Asset</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Price Node</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock Level</th>
                            <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((p) => (
                        <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={p._id} 
                            className="group hover:bg-gray-50/50 transition-all duration-500"
                        >
                            {editProduct === p._id ? (
                            <>
                                <td className="px-10 py-8"><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none font-black text-xs uppercase" /></td>
                                <td className="px-10 py-8 text-center"><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-24 bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none font-black text-xs text-center" /></td>
                                <td className="px-10 py-8 text-center"><input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-20 bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none font-black text-xs text-center" /></td>
                                <td className="px-10 py-8 text-right space-x-3">
                                    <button onClick={saveEdit} className="px-6 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-colors">Apply</button>
                                    <button onClick={() => setEditProduct(null)} className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Cancel</button>
                                </td>
                            </>
                            ) : (
                            <>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className='w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0'>
                                            <img src={(p.image && p.image.length > 0) ? (p.image[0].startsWith('/uploads') ? `${backendUrl}${p.image[0]}` : p.image[0]) : ''} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div>
                                            <p className='text-xs font-black uppercase tracking-widest text-gray-900 mb-1'>{p.name}</p>
                                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic'>{p.category} | {p.subCategory}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className="text-sm font-black italic tracking-tighter text-black">₹{p.price}</span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <div className='flex flex-col items-center gap-1'>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                            {p.stock || (p.isDemo ? '--' : 50)} Units
                                        </span>
                                        {p.stock < 10 && <p className='text-[8px] font-bold text-red-400 uppercase animate-pulse'>Critical Low</p>}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500'>
                                        <button onClick={() => startEdit(p)} className="w-10 h-10 bg-gray-50 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all">
                                            <Plus size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p._id)} className="w-10 h-10 bg-gray-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </>
                            )}
                        </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
      )}

      {/* ORDERS VIEW */}
      {activeTab === 'orders' && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-32"
        >
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12'>
                <div className='space-y-1'>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                        Fulfillment <span className='text-gray-400 font-light not-italic'>Command</span>
                    </h3>
                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>{adminOrders.length} Active Shipment Protocols</p>
                </div>
            </div>

            {adminOrders.length === 0 ? (
                <div className="bg-white rounded-[60px] p-32 text-center border border-gray-100 shadow-2xl shadow-black/5">
                    <Package className="mx-auto text-gray-100 mb-8" size={80} />
                    <p className="text-gray-900 font-black text-2xl uppercase tracking-tighter italic">No Active Protocols</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Standing by for incoming customer orders.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10">
                    {adminOrders.map((order) => (
                        <motion.div 
                            layout
                            key={order._id} 
                            className="bg-white p-10 rounded-[48px] shadow-2xl shadow-black/5 border border-gray-100 flex flex-col xl:flex-row justify-between items-stretch gap-10 relative overflow-hidden group"
                        >
                            <div className="flex-1 space-y-8 relative z-10">
                                <div className="flex flex-wrap gap-3">
                                    <div className='px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10'>
                                        SIG: {order._id.slice(-8).toUpperCase()}
                                    </div>
                                    <div className='px-4 py-1.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100'>
                                        {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
                                    <div className='space-y-4 mb-8'>
                                        {(order.products || []).map((item, i) => (
                                            <div key={i} className="flex justify-between items-center group/item">
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-2 h-2 rounded-full bg-black scale-0 group-hover/item:scale-100 transition-transform' />
                                                    <p className='text-xs font-black uppercase tracking-widest text-gray-900'>
                                                        {item.product?.name || 'ASSET'} 
                                                        <span className='ml-2 text-gray-400 font-bold tracking-tighter lowercase'>x{item.quantity}</span>
                                                        {item.size && <span className="ml-2 px-2 py-0.5 rounded-md bg-white border border-gray-100 text-[8px]">{item.size}</span>}
                                                    </p>
                                                </div>
                                                <p className="text-xs font-black italic tracking-tighter text-black">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 space-y-3">
                                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                             <p>Manifest Subtotal</p>
                                             <p className='text-gray-900'>₹{order.subtotal}</p>
                                         </div>
                                         {order.discountAmount > 0 && (
                                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-600">
                                                 <p>Promo Deduction</p>
                                                 <p>- ₹{order.discountAmount}</p>
                                             </div>
                                         )}
                                         <div className="flex justify-between items-center pt-2">
                                             <p className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Total Valuation</p>
                                             <p className="text-3xl font-black italic tracking-tighter text-black leading-none">₹{order.totalAmount || order.amount}</p>
                                         </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 xl:max-w-xs space-y-8 flex flex-col justify-center border-l-2 border-dashed border-gray-50 pl-10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 italic"><MapPin size={12} /> Destination Node</p>
                                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-600 leading-relaxed uppercase tracking-tighter">{order.address}</p>
                                    </div>
                                </div>
                                {order.user && (
                                    <div className='flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 w-fit'>
                                        <div className='w-6 h-6 rounded-full bg-black flex items-center justify-center text-white'>
                                            <ShoppingBag size={10} />
                                        </div>
                                        <p className="text-[8px] text-gray-900 font-black uppercase tracking-widest">{typeof order.user === 'object' ? order.user.email : order.user}</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-full xl:w-80 bg-black p-10 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-black/20 transition-all duration-500">
                                <div className='relative z-10'>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Tracking Control</p>
                                    <div className='relative group/select'>
                                        <select 
                                            value={order.status || 'Order Placed'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="w-full bg-white/10 border border-white/10 p-5 rounded-[20px] focus:outline-none focus:border-white/40 font-black text-[10px] uppercase tracking-widest transition-all appearance-none cursor-pointer hover:bg-white/20"
                                        >
                                            {statusOptions.map(opt => <option key={opt} value={opt} className='bg-black'>{opt}</option>)}
                                        </select>
                                        <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40'>
                                            <ChevronRight size={16} className='rotate-90' />
                                        </div>
                                    </div>
                                </div>

                                <div className='relative z-10'>
                                    <div className={`w-full py-4 rounded-[20px] text-center text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg transition-all ${order.paymentStatus === 'Paid' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        Payment Status: {order.paymentStatus || 'Unpaid'}
                                    </div>
                                </div>
                                
                                <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl' />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
      )}

      {/* COUPONS VIEW */}
      {activeTab === 'coupons' && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-32"
        >
            <AdminCoupons />
        </motion.div>
      )}
    </motion.div>
  );
}
