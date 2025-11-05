// src/components/Checkout/Checkout.js

import React, { useState } from 'react';
import Heading from '../Shared/Heading';

// Helper function untuk mem-parse harga (cth: "120.000" menjadi 120000)
const parsePrice = (priceStr) => {
  return parseFloat(priceStr.replace(/\./g, ''));
};

// Helper function untuk format mata uang IDR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Checkout = ({ cart, setCart, handlePlaceOrder }) => {
  // State untuk data formulir
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Kalkulasi Total ---
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      // Pastikan item memiliki quantity
      const quantity = item.quantity || 1; 
      return total + parsePrice(item.price) * quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  // Contoh logika ongkir: gratis jika > 500rb, selain itu 20rb
  const shipping = subtotal > 500000 ? 0 : 20000;
  const tax = subtotal * 0.11; // Pajak 11%
  const total = subtotal + shipping + tax;

  // --- Handler Submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Kumpulkan semua data pesanan
    const orderDetails = {
      customer: formData,
      items: cart,
      summary: {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
      },
    };
    
    // Panggil fungsi handlePlaceOrder dari App.js
    handlePlaceOrder(orderDetails);
  };

  // Jika keranjang kosong
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
        {/* Kolom 1: Formulir Data Diri & Pembayaran */}
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

            {/* Detail Pembayaran */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
              <input name="cardNumber" type="text" placeholder="Card Number (e.g., 1234 ...)" onChange={handleInputChange} value={formData.cardNumber} className="w-full p-3 border rounded-md" required />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input name="expiry" type="text" placeholder="MM/YY" onChange={handleInputChange} value={formData.expiry} className="w-full p-3 border rounded-md" required />
                <input name="cvc" type="text" placeholder="CVC" onChange={handleInputChange} value={formData.cvc} className="w-full p-3 border rounded-md" required />
              </div>
            </div>
          </form>
        </div>

        {/* Kolom 2: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm sticky top-28">
            <h3 className="text-xl font-semibold mb-4">Your Order</h3>
            
            {/* List Item */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(parsePrice(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Kalkulasi Total */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (11%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Tombol Place Order */}
            <button
              type="submit"
              form="checkout-form" // Menghubungkan ke form di kolom sebelah
              className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-all duration-300 mt-6 font-semibold text-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;