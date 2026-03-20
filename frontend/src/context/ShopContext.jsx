import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { products as localProducts } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const { user } = useContext(AuthContext);
    const currency = '₹';
    const delivery_fee = 50;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const [products] = useState(localProducts);
    const [apiProducts, setApiProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const getProductsData = async () => {
        console.log("Fetching products from:", backendUrl + '/api/products');
        try {
            const response = await axios.get(backendUrl + '/api/products');
            if (response.data) {
                console.log("API Products Received:", response.data.length);
                setApiProducts(response.data);
            }
        } catch (error) {
            console.error("API Fetch Error:", error);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    // Load/Clear cart based on User Login/Logout
    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cart_${user.email}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : {});
        } else {
            setCartItems({});
            setCoupon('');
            setDiscount(0);
        }
    }, [user]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (user && Object.keys(cartItems).length > 0) {
            localStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));
        } else if (user && Object.keys(cartItems).length === 0) {
            localStorage.removeItem(`cart_${user.email}`);
        }
    }, [cartItems, user]);
    const [orders, setOrders] = useState([]);
    const [adminOrders, setAdminOrders] = useState([]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get(backendUrl + '/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Fetch Orders Error:", error);
        }
    };

    const fetchAllOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get(backendUrl + '/api/orders/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdminOrders(response.data);
            return response.data;
        } catch (error) {
            console.error("Fetch All Orders Error:", error);
            setAdminOrders([]);
            return [];
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user]);

    const placeOrderBackend = async (orderData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(backendUrl + '/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                fetchOrders();
                setCartItems({}); // Clear cart after successful order
                setCoupon('');    // Reset coupon for next order
                setDiscount(0);   // Reset discount
                return response.data.order;
            }
        } catch (error) {
            console.error("Place Order Error:", error);
            toast.error(error.response?.data?.msg || "Failed to place order");
            throw error;
        }
    }

    const updateOrderStatus = async (orderId, data) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${backendUrl}/api/orders/${orderId}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllOrders();
            toast.success("Order updated");
        } catch (error) {
            console.error("Update Order Error:", error);
            toast.error("Failed to update order");
        }
    }

    const applyCoupon = async (code) => {
        if (!code) {
            setDiscount(0);
            return false;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/coupons/validate`, { code });
            if (response.data) {
                setDiscount(response.data.discount);
                toast.success(`Coupon Applied! You got ${response.data.discount}% OFF.`);
                return true;
            }
        } catch (error) {
            setDiscount(0);
            toast.error(error.response?.data?.message || "Invalid Coupon Code");
            return false;
        }
    }

    const addToCart = async (itemId, size) => {
        if (!size) return false;
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        return true;
    }

    const getCartCount = () => {
        let totalCount = 0;
        if (!cartItems) return 0;
        for (const items in cartItems) {
            // Only count if product exists in our catalog
            const exists = allProducts.some(p => p._id === items);
            if (exists) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = allProducts.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
            }
        }
        return totalAmount;
    }

    const navigate = useNavigate();

    const allProducts = useMemo(() => {
        const merged = new Map();
        
        // Start with local products
        products.forEach(p => merged.set(p._id, { ...p }));
        
        // Merge API products
        apiProducts.forEach(apiP => {
            if (merged.has(apiP._id)) {
                const existing = merged.get(apiP._id);
                merged.set(apiP._id, {
                    ...existing,
                    ...apiP,
                    // Keep existing image if API image is empty
                    image: (apiP.image && apiP.image.length > 0) ? apiP.image : existing.image
                });
            } else {
                merged.set(apiP._id, apiP);
            }
        });
        
        return Array.from(merged.values());
    }, [products, apiProducts]);

    const getImageUrl = (img) => {
        const fallback = 'https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image';
        
        if (!img || (Array.isArray(img) && img.length === 0)) return fallback;
        
        const targetImg = Array.isArray(img) ? img[0] : img;
        if (!targetImg || typeof targetImg !== 'string') return fallback;

        if (targetImg.startsWith('/uploads') || targetImg.startsWith('uploads/') || targetImg.startsWith('uploads\\')) {
            const cleanPath = targetImg.replace(/\\/g, '/');
            return `${backendUrl.replace(/\/$/, '')}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
        }
        
        return targetImg;
    }

    const value = {
        products, apiProducts, allProducts, currency, delivery_fee, backendUrl,
        cartItems, setCartItems, addToCart, getCartCount,
        updateQuantity, getCartAmount,
        search, setSearch, showSearch, setShowSearch,
        navigate,
        coupon, setCoupon, discount, setDiscount, applyCoupon,
        orders, adminOrders, placeOrder: placeOrderBackend, updateOrder: updateOrderStatus,
        fetchOrders, fetchAllOrders, getProductsData, getImageUrl
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
