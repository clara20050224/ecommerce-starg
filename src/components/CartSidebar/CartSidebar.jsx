import React from 'react';
// 🚨 PENTING: Anda harus mengimpor 'useNavigate' dari React Router
import { useNavigate } from 'react-router-dom'; 

// Anggap CartSidebar menerima prop seperti isCartOpen, closeCart, dan cartData
const CartSidebar = ({ isCartOpen, closeCart, cartData }) => {
    // 1. Inisialisasi hook navigate
    const navigate = useNavigate();

    // Fungsi yang dipanggil saat tombol "Go to Checkout" diklik
    const handleGoToCheckout = () => {
        // Cek apakah keranjang kosong
        if (!cartData || cartData.length === 0) {
            // Bisa berikan pesan error atau biarkan tombol disabled
            alert("Keranjang Anda kosong!");
            return;
        }

        // 2. Lakukan 2 Aksi Utama:
        
        // A. Tutup Sidebar/Popup Keranjang
        // Asumsi Anda memiliki fungsi `closeCart` yang dikirim sebagai prop
        if (typeof closeCart === 'function') {
            closeCart(); 
        }

        // B. Navigasi ke Halaman Checkout
        // Pastikan route ini sesuai dengan konfigurasi router Anda
        navigate('/checkout'); 
    };

    // ... (Kalkulasi dan rendering item keranjang di sini)
    
    return (
        <div className={`cart-sidebar ${isCartOpen ? 'open' : 'closed'}`}>
            {/* ... Item Keranjang di sini ... */}
            
            <div className="cart-footer">
                <button 
                    onClick={handleGoToCheckout} // Gunakan fungsi yang baru
                    className="go-to-checkout-button"
                    // Tampilan seperti yang ada di gambar (warna merah)
                    style={{
                        backgroundColor: '#ff4d4f', 
                        color: 'white', 
                        padding: '12px 20px', 
                        borderRadius: '6px',
                        width: '100%',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Go to Checkout
                </button>
            </div>
        </div>
    );
};

// export default CartSidebar; 
// Anda mungkin perlu menyesuaikan format export jika komponen Anda menggunakan gaya yang berbeda