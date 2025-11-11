// src/components/Navbar/Navbar.jsx

import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaShoppingCart, FaTrashAlt, FaUser } from "react-icons/fa";
// 1. GANTI NAMA LINK DARI REACT-SCROLL
import { Link as ScrollLink } from "react-scroll"; 
// 2. TAMBAHKAN LINK DARI REACT-ROUTER-DOM UNTUK PINDAH HALAMAN
import { Link as RouterLink } from "react-router-dom"; 
import DarkMode from "./DarkMode";

const MenuLinks = [
  { id: 1, name: "Home", link: "home" },
  { id: 2, name: "Shop", link: "shop" },
  { id: 3, name: "Footer", link: "footer" },
  { id: 4, name: "Blogs", link: "blogs" },
];

// 3. TAMBAHKAN HELPER FUNCTIONS UNTUK HARGA
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
  // Menghapus semua titik dari string
  return parseFloat(priceStr.replace(/\./g, '')); 
};


const Navbar = ({ 
  cartCount, 
  cartItems, 
  removeFromCart, 
  showCart, 
  setShowCart,
  onCheckout,
  isLoggedIn,
  user
}) => {

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  // 4. PERBAIKI FUNGSI GETTOTALPRICE
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Gunakan parsePrice di sini
      return total + parsePrice(item.price) * item.quantity;
    }, 0);
  };

  const total = getTotalPrice(); // Hitung total sekali saja

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-primary font-semibold tracking-widest text-2xl uppercase sm:text-3xl"
            >
              StarG
            </a>
            {/* Menu Items */}
            <div className="hidden lg:block">
              <ul className="flex items-center gap-4">
                {MenuLinks.map((data) => (
                  <li key={data.id}>
                  {/* Gunakan ScrollLink di sini */}
                    <ScrollLink
                      to={data.link}
                      smooth={true}
                      duration={1000}
                      offset={-70}
                      className="inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200 cursor-pointer"
                    >
                      {data.name}
                    </ScrollLink>
                  </li>
                ))}
                {/* Dropdown */}
                {/* ... (Dropdown Quick Links Anda tetap sama) ... */}
              </ul>
            </div>
          </div>
          {/* Navbar Right section */}
          <div className="flex justify-between items-center gap-4">
            {/* ... (Search Bar Anda tetap sama) ... */}

            {/* Cart Icon */}
            <button className="relative p-3" onClick={handleCartClick}>
              <FaShoppingCart className="text-xl text-gray-600 dark:text-gray-400" />
              {cartCount > 0 && (
                <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                  {cartCount}
                  <span className="animate-ping absolute inline-flex p-[7px] rounded-full bg-red-400 opacity-75"></span>
b              </div>
              )}
            </button>
            
            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 top-16 bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg w-[300px] z-50 transition-transform transform duration-300 ease-in-out scale-100">
                <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
                {cartItems.length > 0 ? (
                  <>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2"> {/* Tambahkan max-h dan overflow */}
                      {cartItems.map((item) => {
                          // Hitung harga per item
                          const itemPrice = parsePrice(item.price);
                          const itemTotal = itemPrice * item.quantity;
                          return (
                        <li key={item.id} className="flex items-center gap-4 justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-semibold text-sm">{item.title}</h4> {/* Kecilkan font jika perlu */}
                              <p className="text-gray-500 dark:text-gray-300 text-xs"> {/* Kecilkan font */}
                                {/* 5. PERBAIKI TAMPILAN HARGA */}
                                {formatCurrency(itemPrice)} x {item.quantity}
                              </p>
                                <p className="font-semibold text-sm">{formatCurrency(itemTotal)}</p>
                            </div>
              T           </div>
                          {/* Delete Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrashAlt className="text-lg" />
                          </button>
                        </li>
                        )
                      })}
                    </ul>
                    <div className="mt-4 flex justify-between items-center border-t pt-2">
                      <h4 className="font-semibold">Total:</h4>
                      <span className="text-lg font-bold">
                          {/* 6. PERBAIKI TAMPILAN TOTAL */}
                          {formatCurrency(total)}
                        </span>
                    </div>

                      {/* 7. TAMBAHKAN TOMBOL CHECKOUT */}
                      <RouterLink
                        to="/checkout"
                        onClick={() => setShowCart(false)} // Tutup dropdown saat diklik
                        className="w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-all duration-300 block mt-4"
                      >
                        Go to Checkout
                      </RouterLink>
                  </>
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>
            )}
            {/* Dark Mode section */}
            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;