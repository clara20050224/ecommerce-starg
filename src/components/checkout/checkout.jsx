import React from 'react';

// Jika Anda menggunakan TypeScript (file .tsx), Anda perlu menambahkan ini
// di atas file (di luar function) untuk memberi tahu TypeScript
// bahwa 'window.snap' itu ada:
//
// declare global {
//   interface Window { snap: any; }
// }

// Data Dummy untuk dikirim ke Backend, sesuai harapan app.py
const DUMMY_TRANSACTION_DATA = {
    gross_amount: 150000, // Total Rp 150.000
    item_details: [
        { id: "prod001", price: 120000, quantity: 1, name: "White Top Stripes" },
        { id: "shipping", price: 30000, quantity: 1, name: "Shipping Fee" },
    ],
    customer_details: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "081234567890",
    }
};

const CheckoutPage = () => {

  /**
   * Fungsi ini dipanggil ketika tombol "Bayar Sekarang" diklik.
   */
  const handlePay = () => {
    console.log("Tombol Bayar diklik. Mengirim data ke backend Flask...");

    // 1. PANGGIL API BACKEND (FLASK)
    fetch("http://127.0.0.1:5000/create_transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // PERUBAHAN KRUSIAL: Mengirim data transaksi ke backend
      body: JSON.stringify(DUMMY_TRANSACTION_DATA), 
    })
    .then((response) => response.json())
    .then((data) => {
      
      if (data.message && data.message.includes("Missing required")) {
        alert("KESALAHAN BACKEND: Backend tidak menerima data yang lengkap. Pastikan app.py Anda sudah diupdate.");
        return;
      }

      if (!data.token) {
        alert("Gagal mendapatkan Midtrans Token: " + (data.message || "Respon backend tidak valid"));
        return;
      }

      // Pastikan script snap.js sudah dimuat dari index.html
      if (!window.snap) {
        alert("Midtrans Snap.js (window.snap) tidak ditemukan. Pastikan script sudah ditambahkan di index.html");
        return;
      }

      // 2. BUKA POP-UP PEMBAYARAN MIDTRANS
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          console.log("Payment Success:", result);
          alert("Pembayaran Berhasil! Total: " + DUMMY_TRANSACTION_DATA.gross_amount);
          // Nanti: Kosongkan keranjang, arahkan ke halaman sukses, dll.
        },
        onPending: function (result) {
          console.log("Payment Pending:", result);
          alert("Pembayaran Menunggu konfirmasi.");
        },
        onError: function (result) {
          console.log("Payment Error:", result);
          alert("Pembayaran Gagal.");
        },
        onClose: function () {
          console.log("Pop-up pembayaran ditutup oleh pengguna.");
        }
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Koneksi ke server backend gagal. Pastikan server Flask (midtrans/app.py) Anda sudah berjalan di http://127.0.0.1:5000.");
    });
  };


  // Ini adalah tampilan (JSX) Anda
  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#fff', color: '#333', fontFamily: 'sans-serif' }}>
      <h1>Halaman Checkout (Uji Coba Midtrans)</h1>
      <p>Backend Flask Anda harus berjalan di <code style={{ color: 'red' }}>http://127.0.0.1:5000</code>.</p>
      
      <hr style={{ margin: '2rem 0' }} />
      
      {/* Bagian Ringkasan Pembayaran */}
      <div style={{ 
          padding: '24px', 
          border: '1px solid #e0e0e0', 
          borderRadius: '12px', 
          maxWidth: '450px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
      }}>
        <h2>Ringkasan Pembayaran</h2>
        <p style={{ fontSize: '18px', color: '#555' }}>Total Tagihan:</p>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', margin: '10px 0 25px 0' }}>
          Rp {DUMMY_TRANSACTION_DATA.gross_amount.toLocaleString('id-ID')}
        </p>
        
        {/* Tombol Bayar Sekarang */}
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