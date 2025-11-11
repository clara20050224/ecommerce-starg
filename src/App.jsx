import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Login from './pages/Login';
import Profile from './pages/Profile';
import CheckoutPopup from './components/CheckoutPopup/CheckoutPopup';

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
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { username: 'admin', email: 'admin@example.com' };
  });
  const [cartCount, setCartCount] = React.useState(0);
  const [cartItems, setCartItems] = React.useState([]);
  const [showCart, setShowCart] = React.useState(false);
  const [checkoutPopupOpen, setCheckoutPopupOpen] = React.useState(false);

  const handleLogin = () => { 
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    toast.success('Logged in successfully!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setCartItems([]);
    setCartCount(0);
    toast.info('Logged out successfully!');
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

  const handleProceedToPayment = async (customerData) => {
    setCheckoutPopupOpen(false);
    
    // Prepare transaction data for Midtrans
    const parsePrice = (priceStr) => {
      if (!priceStr) return 0;
      // Hapus semua karakter non-digit kecuali titik desimal (jika ada), lalu ubah ke float
      // Contoh: "Rp. 1.200.000" -> "1200000" -> 1200000.0
      const cleanedPrice = priceStr.replace(/[^\d,]/g, '').replace(',', '.');
      return parseFloat(cleanedPrice) || 0;
    };

    const itemDetails = cartItems.map((item) => ({
      id: item.id.toString(),
      price: parsePrice(item.price),
      quantity: item.quantity || 1,
      name: item.title,
    }));

    const grossAmount = cartItems.reduce((total, item) => {
      return total + parsePrice(item.price) * (item.quantity || 1);
    }, 0);

    const transactionData = {
      transaction_details: {
        gross_amount: grossAmount,
        order_id: `ORDER-${Date.now()}`,
      },
      customer_details: {
        first_name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
      },
      item_details: itemDetails,
    };

    try {
      // Call backend to create transaction
      // Perbaikan: Gunakan URL yang benar sesuai dengan endpoint di server.js
      const response = await fetch('http://127.0.0.1:5000/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      // Periksa status HTTP dari respons
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        toast.error('Gagal membuat transaksi: ' + data.error);
        return;
      }

      if (!window.snap) {
        toast.error('Midtrans Snap.js tidak ditemukan. Pastikan script sudah ditambahkan di index.html');
        return;
      }

      // Open Midtrans payment popup (Pop Up Mode dari dokumentasi Midtrans)
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          console.log('Payment Success:', result);
          toast.success('Pembayaran Berhasil!');
          // Clear cart after successful payment
          setCartItems([]);
          setCartCount(0);
          setShowCart(false);
        },
        onPending: function (result) {
          console.log('Payment Pending:', result);
          toast.info('Pembayaran Menunggu konfirmasi.');
        },
        onError: function (result) {
          console.log('Payment Error:', result);
          toast.error('Pembayaran Gagal.');
        },
        onClose: function () {
          console.log('Pop-up pembayaran ditutup oleh pengguna.');
          // Anda bisa menambahkan logika di sini jika ingin mengembalikan ke checkout, dll.
        }
      });
    } catch (err) {
      console.error('Fetch error:', err);
      // Pesan error ini akan muncul jika fetch gagal (misalnya network error, server tidak merespons, atau respons bukan JSON)
      toast.error('Koneksi ke server backend gagal. Pastikan server Node.js (backend/server.js) Anda sudah berjalan.');
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
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

  const HomePage = () => (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        showCart={showCart} 
        setShowCart={setShowCart}
        onCheckout={() => {
          if (cartItems.length === 0) {
            toast.warning('Keranjang kosong!');
            return;
          }
          setCheckoutPopupOpen(true);
        }}
        user={user}
      />
      <Hero />
      <Category />
      <Category2 />
      <Banner data={BannerData} />
      <Products 
        isLoggedIn={isLoggedIn}
        addToCart={addToCart}
        onCheckout={(product, quantity) => {
          const singleItem = [{ ...product, quantity: quantity || 1 }];
          setCartItems(singleItem);
          setCartCount(quantity || 1);
          setCheckoutPopupOpen(true);
        }}
      />
      <Banner data={BannerData2} />
      <Blogs />
      <Partners />
      <Footer />
      <CheckoutPopup
        isOpen={checkoutPopupOpen}
        onClose={() => setCheckoutPopupOpen(false)}
        cartItems={cartItems}
        onProceedToPayment={handleProceedToPayment}
      />
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar
              isLoggedIn={isLoggedIn}
              cartCount={cartCount}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              showCart={showCart} 
              setShowCart={setShowCart}
              onCheckout={() => {
                if (cartItems.length === 0) {
                  toast.warning('Keranjang kosong!');
                  return;
                }
                setCheckoutPopupOpen(true);
              }}
              user={user}
            />
            <Profile user={user} onLogout={handleLogout} />
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
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
  );
};

export default App;