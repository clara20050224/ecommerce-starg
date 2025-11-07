// File: src/components/checkout/checkout.jsx
import React from 'react';

// Jika Anda menggunakan TypeScript (file .tsx), Anda perlu menambahkan ini
// di atas file (di luar function) untuk memberi tahu TypeScript
// bahwa 'window.snap' itu ada:
//
// declare global {
//   interface Window { snap: any; }
// }

const CheckoutPage = () => {

  /**
   * Fungsi ini dipanggil ketika tombol "Bayar Sekarang" diklik.
   */
  const handlePay = () => {
    console.log("Tombol Bayar diklik. Memanggil backend Flask...");

    // 1. PANGGIL API BACKEND (FLASK)
    //    Pastikan server Flask Anda (app.py) berjalan di port 5000
    //    dan sudah ditambahkan CORS.
    fetch("http://127.0.0.1:5000/create_transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Anda bisa mengirim data dari form checkout di sini.
      // Backend (app.py) Anda saat ini menggunakan 'gross_amount: 50'
      // jadi kita tidak perlu mengirim body untuk saat ini.
    })
    .then((response) => response.json())
    .then((data) => {
      // data adalah respons dari Flask, berisi:
      // { "token": "...", "redirect_url": "..." }

      if (data.error) {
        alert("Gagal membuat transaksi: " + data.error);
        return;
      }

      // Pastikan script snap.js sudah dimuat dari index.html
      if (!window.snap) {
        alert("Midtrans Snap.js (window.snap) tidak ditemukan. Pastikan script sudah ditambahkan di index.html");
        return;
      }

      // 2. BUKA POP-UP PEMBAYARAN MIDTRANS
      //    Gunakan token yang kita dapat dari Flask (data.token)
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          /* Pembayaran sukses! */
          console.log("Payment Success:", result);
          alert("Pembayaran Berhasil! (Pesan dari React)");
          
          // Nanti: Anda bisa pindah halaman ke /payment-success
          // menggunakan React Router di sini.
        },
        onPending: function (result) {
          /* Menunggu pembayaran */
          console.log("Payment Pending:", result);
          alert("Pembayaran Menunggu konfirmasi.");
        },
        onError: function (result) {
          /* Pembayaran gagal */
          console.log("Payment Error:", result);
          alert("Pembayaran Gagal.");
        },
        onClose: function () {
          /* Pop-up ditutup sebelum pembayaran selesai */
          console.log("Pop-up pembayaran ditutup oleh pengguna.");
        }
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Koneksi ke server backend gagal. Pastikan server Flask (midtrans/app.py) Anda sudah berjalan.");
    });
  };


  // Ini adalah tampilan (JSX) Anda
  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#fff', color: '#333', fontFamily: 'sans-serif' }}>
      <h1>Halaman Checkout</h1>
      <p>Ini adalah tempat untuk form checkout Anda, ringkasan keranjang, dll.</p>
      
      <hr style={{ margin: '2rem 0' }} />
      
      {/* Ini adalah bagian pentingnya */}
      <div style={{ 
          padding: '24px', 
          border: '1px solid #e0e0e0', 
          borderRadius: '12px', 
          maxWidth: '450px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
      }}>
        <h2>Ringkasan Pembayaran</h2>
        <p style={{ fontSize: '18px', color: '#555' }}>Total Tagihan:</p>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111', margin: '10px 0 25px 0' }}>
          Rp 50 
          <span style={{ fontSize: '16px', color: '#777' }}> (dari app.py)</span>
        </p>
        
        {/* Tombol ini sekarang memanggil fungsi handlePay */}
        <button 
          onClick={handlePay} 
          style={{
            padding: '14px 28px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;