import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ShopContextProvider from "./context/ShopContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import BackButton from "./components/BackButton";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ShopContextProvider>
          <div className="min-h-screen relative overflow-hidden bg-[#fafafa] selection:bg-blue-100">
            {/* Symmetrical Background Highlights */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50/60 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[50%] bg-purple-50/40 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-50/30 rounded-full blur-[100px] -z-10"></div>
            
            {/* Global Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.2] -z-10"></div>

            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <ToastContainer 
                position="top-center" 
                autoClose={1500} 
                limit={1}
                hideProgressBar={true}
                pauseOnHover={false}
              />
              <BackButton />
              <ScrollToTop />
              <Navbar />
              <SearchBar />
              <div className="pt-24 sm:pt-32">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:productId" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/place-order" element={<PlaceOrder />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        </ShopContextProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;