import React, { useState, useEffect } from "react";
import Button from "../Shared/Button";

// Fungsi untuk memuat script Snap.js secara dinamis
const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Gunakan sandbox
    script.setAttribute("data-client-key", "SB-Mid-client-<your-client-key>"); // Ganti dengan Client Key Sandbox Anda
    script.onload = () => {
      if (window.snap) {
        resolve(window.snap);
      } else {
        reject(new Error("Midtrans Snap failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Midtrans Snap script"));
    document.body.appendChild(script);
  });
};

const ProductCard = ({ data, addToCart, onCheckout, isLoggedIn }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (item) => {
    addToCart(item, quantity);
    setQuantity(1);
  };

  // Ganti fungsi handleCheckout untuk integrasi Midtrans
  const handleCheckout = async (item) => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk checkout.");
      // Redirect ke halaman login jika perlu
      return;
    }

    try {
      // 1. Muat script Snap.js
      const snap = await loadMidtransScript();

      // 2. Siapkan data untuk dikirim ke backend
      const transactionData = {
        order_id: `ORDER-${Date.now()}-${item.id}`, // Generate order ID
        gross_amount: item.price * quantity,
        customer_details: {
          // Ambil data customer dari auth state Anda
          first_name: "John", // Ganti dengan data sesungguhnya
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "081234567891"
        },
        item_details: [
          {
            id: item.id,
            price: item.price,
            quantity: quantity,
            name: item.title
          }
        ]
      };

      // 3. Panggil endpoint backend untuk membuat transaksi
      const response = await fetch('http://127.0.0.1:5000/api/create-transaction', { // Tambahkan '/api/'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const { token, error } = await response.json();

      if (error) {
        console.error("Error dari backend:", error);
        alert("Gagal memulai pembayaran: " + error);
        return;
      }

      // 4. Gunakan token untuk membuka Snap popup
      snap.show({
        token: token,
        onSuccess: function(result){
          console.log('Pembayaran berhasil!', result);
          alert('Pembayaran berhasil!');
          // Lakukan redirect atau update state sesuai kebutuhan
          // Misalnya, redirect ke halaman sukses atau kosongkan cart
          // window.location.href = '/success'; // Contoh redirect
        },
        onPending: function(result){
          console.log('Pembayaran pending...', result);
          alert('Pembayaran sedang diproses.');
          // Biasanya tidak redirect, biarkan user menyelesaikan pembayaran
        },
        onError: function(result){
          console.log('Pembayaran gagal!', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function(){
          console.log('Modal ditutup oleh user');
          // Handle jika user menutup popup tanpa menyelesaikan pembayaran
        }
      });

      setQuantity(1); // Reset quantity setelah checkout dimulai

    } catch (err) {
      console.error("Error memulai checkout:", err);
      alert("Terjadi kesalahan saat memulai pembayaran.");
    }
  };


  return (
    <div className="mb-10 w-[100%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
        {data.map((item) => (
          <div
            data-aos="fade-up"
            data-aos-delay={item.aosDelay}
            className="group"
            key={item.id}
          >
            <div className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="h-[280px] w-[360px] object-cover rounded-md"
              />
              <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center gap-2 duration-200 rounded-md flex-col">
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 p-2 text-center border rounded-md dark:bg-gray-800 dark:text-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    text="Add to cart"
                    bgColor="bg-primary"
                    textColor="text-white"
                    handler={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  />
                  <Button
                    text="Checkout"
                    bgColor="bg-green-600"
                    textColor="text-white"
                    handler={(e) => {
                      e.stopPropagation();
                      handleCheckout(item); // Panggil fungsi baru
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="leading-7">
              <h2 className="font-semibold">{item.title}</h2>
              <h2 className="font-bold">Rp. {item.price}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;