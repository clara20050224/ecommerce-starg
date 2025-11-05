// src/components/Checkout/Checkout.js

import React, { useState } from 'react';
import Heading from '../Shared/Heading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

// ... (helper parsePrice dan formatCurrency tetap sama) ...
const parsePrice = (priceStr) => {
  return parseFloat(priceStr.replace(/\./g, ''));
};
// ...

// Terima prop dari App.js
const Checkout = ({ cart, setCart, setCartCount, setShowCart }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  
  // State untuk melacak loading
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ... (Kalkulasi subtotal, shipping, tax, total tetap sama) ...
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      const quantity = item.quantity || 1; 
      return total + parsePrice(item.price) * quantity;
    }, 0);
  };
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500000 ? 0 : 20000;
  const tax = subtotal * 0.11;
  const total = subtotal + shipping + tax;

  // --- INI FUNGSI YANG KITA UBAH ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    setIsLoading(true); // Mulai loading
    toast.info('Processing your order... (Simulation)');

    // 1. Ganti panggilan 'fetch' dengan 'setTimeout' untuk simulasi
    setTimeout(() => {
      console.log('SIMULATION: Order Placed', {
        customer: formData,
        items: cart,
        summary: { subtotal, shipping, tax, total },
      });
      
      // 2. Tampilkan pesan sukses
      toast.success('Order placed successfully! (Simulation)');

      // 3. Kosongkan keranjang & navigasi
      setCart([]);
      setCartCount(0);
      setShowCart(false);
      navigate('/order-success');
      
      // Tidak perlu set isLoading(false) karena kita pindah halaman
    }, 2500); // Tunda selama 2.5 detik untuk simulasi
  };

  // ... (JSX untuk 'cart is empty' tetap sama) ...
  if (!cart || cart.length === 0) {
    return (
      <div className="container py-12">
        <Heading title="Checkout" subtitle="Complete Your Order" />
        <p className="text-center text-xl text-gray-600">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12" id="checkout">
      <Heading title="Checkout" subtitle="Complete Your Order" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom 1: Formulir Data Diri */}
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Detail Pengiriman */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" type="text" placeholder="Full Name" onChange={handleInputChange} value={formData.name} className="w-full p-3 border rounded-md" required />
                <input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} value={formData.email} className="w-full p-3 border rounded-md" required />
              </div>
              <input name="phone" type="tel" placeholder="Phone Number" onChange={handleInputChange} value={formData.phone} className="w-full p-3 border rounded-md mt-4" required />
              <input name="address" type="text" placeholder="Street Address" onChange={handleInputChange} value={formData.address} className="w-full p-3 border rounded-md mt-4" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input name="city" type="text" placeholder="City" onChange={handleInputChange} value={formData.city} className="w-full p-3 border rounded-md" required />
                <input name="zip" type="text" placeholder="ZIP / Postal Code" onChange={handleInputChange} value={formData.zip} className="w-full p-3 border rounded-md" required />
              </div>
            </div>
            
            {/* Bagian detail kartu kredit tidak diperlukan karena ini simulasi */}

          </form>
        </div>

        {/* Kolom 2: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm sticky top-28">
            <h3 className="text-xl font-semibold mb-4">Your Order</h3>
            
            {/* ... (List Item) ... */}
            
            {/* ... (Kalkulasi Total) ... */}

            {/* Tombol Place Order */}
            <button
              type="submit"
              form="checkout-form"
              className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-all duration-300 mt-6 font-semibold text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading} // Nonaktifkan tombol saat loading
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;