// src/components/Navbar/Navbar.js

import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // 1. IMPORT LINK UNTUK CHECKOUT

// Helper function untuk format mata uang IDR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function untuk mem-parse harga (cth: "120.000" menjadi 120000)
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/\./g, ''));
};


const Navbar = ({
  handleLoginPopup,
  isLoggedIn,
  cartCount,
  cartItems,
  removeFromCart,
  showCart,
  setShowCart,
  // Prop orderPopup tidak lagi dibutuhkan di sini jika checkout via halaman
}) => {

  // 2. FUNGSI BARU UNTUK MENGHITUNG TOTAL DENGAN BENAR
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const total = calculateTotal(); // Hitung totalnya

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40 shadow-md">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src="/path-to-your-logo.png" alt="Logo" className="w-10" />
              Starg
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            {/* Cart Button */}
            <button
              className="bg-primary/90 hover:bg-primary transition-all duration-200 text-white p-2 rounded-full relative"
              onClick={() => setShowCart(!showCart)}
            >
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute -top-1 -right-1 flex items-center justify-center text-xs">
                  {cartCount}
                </div>
              )}
            </button>

            {/* Login/User Button */}
            {isLoggedIn ? (
              <button
                className="text-gray-700 dark:text-white"
                // onClick={() => alert('User profile page')} // TODO
              >
                <FaUserCircle className="text-3xl" />
              </button>
            ) : (
              <button
                className="bg-secondary text-white px-4 py-2 rounded-full"
                onClick={handleLoginPopup}
              >
                Login
              </button>
            )}

            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute top-full right-4 lg:right-16 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 z-50">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Cart Items</h3>
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div>
                              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{item.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(parsePrice(item.price))} x {item.quantity}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t my-3 pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        {/* 3. TAMPILKAN TOTAL YANG SUDAH DIFORMAT */}
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                    
                    {/* 4. TOMBOL CHECKOUT BARU */}
                    <Link
                      to="/checkout"
                      onClick={() => setShowCart(false)} // Tutup dropdown saat diklik
                      className="w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-all duration-300 block"
                    >
                      Go to Checkout
                    </Link>
                  </>
                ) : (
                  <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Lower Navbar (Link) */}
      <div className="data-aos='zoom-in' flex justify-center">
        <ul className="sm:flex hidden items-center gap-4">
          <li>
            <Link to="/" className="inline-block px-4 py-2 hover:text-primary">Home</Link>
          </li>
          <li>
            <a href="/#shop" className="inline-block px-4 py-2 hover:text-primary">Shop</a>
          </li>
          <li>
            <a href="/#footer" className="inline-block px-4 py-2 hover:text-primary">Footer</a>
          </li>
          <li>
            <a href="/#blogs" className="inline-block px-4 py-2 hover:text-primary">Blogs</a>
          </li>
          <li className="group relative cursor-pointer">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Quick Links
              {/* ... (dropdown icon) ... */}
            </a>
            {/* ... (dropdown menu) ... */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;