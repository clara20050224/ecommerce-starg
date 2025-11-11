import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
// import Button from '../Shared/Button'; // Jika Anda ingin tetap menggunakan komponen Button, uncomment ini

const CheckoutPopup = ({
  isOpen,
  onClose,
  cartItems,
  onProceedToPayment,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onProceedToPayment(formData);
      // Reset form
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Hapus semua karakter non-digit kecuali titik desimal (jika ada), lalu ubah ke float
    const cleanedPrice = priceStr.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanedPrice) || 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parsePrice(item.price) * (item.quantity || 1);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Optimasi: Jangan render jika tidak terbuka
  if (!isOpen) return null;

  // Optimasi: Tampilkan pesan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
        <div className="relative w-full max-w-md p-6 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl">
          <IoCloseOutline
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500"
          />
          
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          
          {/* Pesan bahwa keranjang kosong */}
          <div className="mb-6">
            <p className="text-red-500">Keranjang belanja kosong. Tidak ada item untuk dibayar.</p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-md p-6 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 rounded-xl max-h-[90vh] overflow-y-auto">
        <IoCloseOutline
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500"
        />
        
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        
        {/* Cart Summary */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Ringkasan Pesanan</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span>{item.title} x {item.quantity || 1}</span>
                <span>{formatCurrency(parsePrice(item.price) * (item.quantity || 1))}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Masukkan email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Masukkan nomor telepon"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;