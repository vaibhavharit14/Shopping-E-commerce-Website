import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { Search, User, ShoppingCart, Menu, X, ChevronRight, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "COLLECTION", path: "/collection" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ${scrolled ? "py-3 bg-[#fafafa]/80 backdrop-blur-xl shadow-lg border-b border-gray-100" : "py-6 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Back Arrow */}
        <div className="flex items-center gap-4">

          <Link to="/" className="flex items-center gap-2 group">
              <img src={assets.vaibhav_logo} className={`w-10 sm:w-14 h-auto transition-all duration-500 object-contain`} alt="Logo" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-gray-900">
              FOREVER<span className="text-blue-600">.</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name}
              to={link.path} 
              className={({ isActive }) => `text-xs font-black tracking-widest transition-all duration-300 hover:text-blue-600 relative py-2 ${isActive ? "text-blue-600" : "text-gray-500"}`}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Search 
              onClick={() => setShowSearch(true)} 
              className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors" 
            />
          </motion.div>
          
          <div className="group relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to={user ? "/profile" : "/login"}>
                <User className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors" />
              </Link>
            </motion.div>
            
            <AnimatePresence>
              {user && (
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-48 bg-white/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all">
                      <User size={14} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-green-600 hover:bg-green-50/50 rounded-xl transition-all">
                      <ShoppingCart size={14} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 rounded-xl transition-all border-t border-gray-50 mt-1 pt-3">
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50/50 rounded-xl transition-all mt-1"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className="relative group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              {getCartCount() > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white flex items-center justify-center rounded-full text-[8px] font-black shadow-lg shadow-blue-200"
                >
                  {getCartCount()}
                </motion.span>
              )}
            </motion.div>
          </Link>

          <motion.div whileTap={{ scale: 0.9 }} className="sm:hidden">
            <Menu
              onClick={() => setShowMobileMenu(true)}
              className="w-6 h-6 cursor-pointer text-gray-800"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src={assets.vaibhav_logo} className="w-12 h-auto object-contain" alt="Logo" />
                <h2 className="text-xl font-black">FOREVER</h2>
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8">
              <div className="flex flex-col px-6 gap-2">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.name}
                    onClick={() => setShowMobileMenu(false)}
                    to={link.path}
                    className={({ isActive }) => `flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "text-gray-900 hover:bg-gray-50"}`}
                  >
                    <span className="text-lg font-black tracking-widest">{link.name}</span>
                    <ChevronRight size={20} className="opacity-50" />
                  </NavLink>
                ))}
              </div>

              <div className="mt-12 px-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Account & Settings</p>
                <div className="flex flex-col gap-4">
                  {user ? (
                    <>
                      <Link onClick={() => setShowMobileMenu(false)} to="/profile" className="flex items-center gap-4 text-gray-900 font-bold">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><User size={20}/></div>
                        My Profile
                      </Link>
                      <Link onClick={() => setShowMobileMenu(false)} to="/orders" className="flex items-center gap-4 text-gray-900 font-bold">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><ShoppingCart size={20}/></div>
                        Track Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link onClick={() => setShowMobileMenu(false)} to="/admin" className="flex items-center gap-4 text-gray-900 font-bold">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Settings size={20}/></div>
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setShowMobileMenu(false); }} 
                        className="flex items-center gap-4 text-red-500 font-bold mt-4 pt-4 border-t border-gray-100"
                      >
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><LogOut size={20}/></div>
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      onClick={() => setShowMobileMenu(false)} 
                      to="/login"
                      className="bg-black text-white p-5 rounded-2xl text-center font-black tracking-widest text-sm shadow-xl hover:shadow-black/20"
                    >
                      LOGIN / REGISTER
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest border-t border-gray-50">
              © 2026 Forever Inc.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}