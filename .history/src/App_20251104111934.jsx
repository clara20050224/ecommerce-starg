import React from 'react';
// 1. IMPORT DARI REACT ROUTER
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Category from './components/Category/Category';
import Category2 from './components/Category/Category2';
import Banner from './components/Banner/Banner';
import Products from './components/Products/Products';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import headphone from './assets/hero/headphone.png';
import watch from './assets/hero/watch.png';
import Blogs from './components/Blogs/Blogs';
import Partners from './components/Partners/Partners';
import Footer from './components/Footer/Footer';

// 2. IMPORT HALAMAN BARU KITA
import Checkout from './components/Checkout/Checkout'; // Halaman Checkout
import OrderSuccess from './components/Checkout/OrderSuccess'; // Halaman Sukses
import Heading from './components/Shared/Heading'; // Asumsi Anda punya ini

const BannerData = {
  discount: '30% OFF',
  title: 'Fine Smile',
  date: '10 Jan to 28 Jan',
  image: headphone,
  title2: 'Summer Outfit Recommendation',
  title3: 'Summer Sale',
  title4: 'A casual summer look with a sporty touch — a navy tank top, striped shirt, denim shorts, and classic sneakers for a simple yet stylish outfit.',
  bgColor: '#f42c37',
};

const BannerData2 = {
  discount: "30% OFF",
  title: "Happy Hours",
  date: "14 Jan to 28 Jan",
  image: watch,
  title2: "Casual Outfit for Man",
  title3: "Summer Sale",
  title4: "A sleek monochrome street style — black plaid shirt, washed denim pants, and all-black sneakers for a clean, confident, and effortlessly cool look.",
  bgColor: "#2dcc6f",
};

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const [loginPopup, setLoginPopup] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [cartItems, setCartItems] = React.useState([]);
  const [showCart, setShowCart] = React.useState(false); 

  const handleOrderPopup = () => {
    if (!isLoggedIn) {
      setLoginPopup(true);
    } else {
      setOrderPopup(!orderPopup);
    }
  };

  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };

  const handleLogin = () => { 
    setIsLoggedIn(true);
    setLoginPopup(false);
    toast.success('Logged in successfully!');
  };

  const addToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }

    setCartCount(cartCount + quantity);
    setShowCart(true); 
    toast.success('Product added to cart!');
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (itemToRemove) {
      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedCartItems);
      setCartCount(cartCount - itemToRemove.quantity);
      
      if (updatedCartItems.length === 0) {
        setShowCart(false);
      }
      
      toast.info('Product removed from cart!');
    }
  };

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-sine',
      delay: 100,
      offset: 100,
    });
    AOS.refresh();
  }, []);

  // 3. UBAH BAGIAN RETURN UNTUK MENGGUNAKAN ROUTER
  return (
    <BrowserRouter>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
        <Navbar
          handleLoginPopup={handleLoginPopup}
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          showCart={showCart} 
          setShowCart={setShowCart} 
          orderPopup={orderPopup}
          setOrderPopup={setOrderPopup}
          handleOrderPopup={handleOrderPopup}
        />

        {/* 4. GUNAKAN <Routes> UNTUK MENDEFINISIKAN HALAMAN */}
        <Routes>
          {/* Rute 1: Halaman Utama */}
          <Route 
            path="/"
            element={
              <>
                <Hero handleOrderPopup={handleOrderPopup} />
                  <Category />
                  <Category2 />
                  <Banner data={BannerData} />
                  <Products 
                    orderPopup={orderPopup} 
                    handleOrderPopup={handleOrderPopup} 
                    isLoggedIn={isLoggedIn} 
                    handleLoginPopup={handleLoginPopup} 
                    handleLogin={handleLogin} 
                    addToCart={addToCart} 
                  />
                <Banner data={BannerData2} />
                  <Blogs />
                  <Partners />
              </>
            }
          />

          {/* Rute 2: Halaman Checkout */}
          <Route 
            path="/checkout"
            element={
              <Checkout 
                cart={cartItems}       // INI KUNCINYA: Berikan data keranjang
                setCart={setCartItems} // Berikan fungsi set keranjang
                setCartCount={setCartCount} // Berikan fungsi set jumlah
                setShowCart={setShowCart} // Berikan fungsi set tampilkan
              />
            }
          />

          {/* Rute 3: Halaman Sukses */}
          <Route path="/order-success" element={<OrderSuccess />} />
          
        </Routes>
        
        <Footer />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
