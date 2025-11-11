// File: backend/server.js
import 'dotenv/config'; // otomatis load .env
import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';

// Debug: Log apakah environment variables berhasil dibaca
console.log("Environment variables loaded:", !!process.env.MIDTRANS_SERVER_KEY, !!process.env.MIDTRANS_CLIENT_KEY);
console.log("PORT from .env or default:", process.env.PORT || 5000);

const app = express();

// Middleware untuk parsing body JSON dan CORS
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', // Default Vite port
    'http://127.0.0.1:5173', // Alternatif localhost
    // Tambahkan URL produksi Anda nanti, contoh: 'https://yourdomain.com'
  ],
  credentials: true,
}));

console.log("Mengonfigurasi Midtrans...");
let core = new midtransClient.CoreApi({
  isProduction: false, // Ganti ke true jika produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});
console.log("Konfigurasi Midtrans selesai.");

// Endpoint untuk membuat transaksi Snap
app.post('/api/create-transaction', async (req, res) => {
  try {
    const { order_id, gross_amount, customer_details, item_details } = req.body;

    // Validasi input dasar
    if (!order_id || !gross_amount) {
      return res.status(400).json({ error: 'order_id dan gross_amount wajib disertakan.' });
    }

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount
      },
      customer_details: customer_details, // opsional
      item_details: item_details          // opsional
    };

    const transactionResponse = await core.transaction().create(parameter);
    const { token, redirect_url } = transactionResponse;

    // Kirim token Snap ke frontend
    res.json({ token, redirect_url });
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);

    // Jika Midtrans mengembalikan error detail
    if (error.apiResponse) {
      res.status(500).json({ error: `Gagal membuat transaksi pembayaran: ${error.apiResponse.status_message}` });
    } else {
      res.status(500).json({ error: 'Gagal membuat transaksi pembayaran.' });
    }
  }
});

// Endpoint untuk testing (opsional)
app.get('/', (req, res) => {
  res.json({ message: 'Server berjalan dengan baik. Gunakan POST /api/create-transaction untuk pembayaran.' });
});

// Contoh endpoint webhook (akan ditambahkan ke server.js nanti)
app.post('/api/handle-notification', async (req, res) => {
  try {
    const notification = req.body;
    const transaction = await core.transaction().notification(notification);
    const { transaction_status, order_id, fraud_status } = transaction;

    // Lakukan logika update database berdasarkan status
    if (transaction_status === 'capture' && fraud_status === 'accept') {
      // Pembayaran berhasil
      console.log('Pembayaran Sukses untuk order_id:', order_id);
      // Update status di database Anda
    } else if (transaction_status === 'settlement') {
      // Pembayaran diselesaikan (bisa dari VA, E-Wallet, dsb)
      console.log('Pembayaran Diselesaikan untuk order_id:', order_id);
      // Update status di database Anda
    }
    // ... tambahkan kondisi lain seperti pending, deny, expire, cancel

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Error handling notification:', error);
    res.status(500).json({ error: 'Failed to handle notification' });
  }
});

const PORT = process.env.PORT || 5000;
console.log(`Mencoba menjalankan server di port ${PORT}...`);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

console.log("Perintah app.listen telah dieksekusi, menunggu koneksi...");