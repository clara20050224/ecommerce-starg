
import React from "react";
import Button from "../Shared/Button";

// --- LOGIKA KONVERSI DITAMBAHKAN DI SINI ---

// 1. Tentukan kurs (misal: 1 USD = Rp 15.000)
// Anda bisa ubah nilai ini sesuai kurs yang berlaku
const USD_TO_IDR_RATE = 15000;

// 2. Buat fungsi untuk memformat mata uang ke Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Tidak menampilkan desimal (Rp 15.000, bukan Rp 15.000,00)
  }).format(number);
};

// --- AKHIR PENAMBAHAN ---

import Button from "../Shared/Button";

const ProductCard = ({ data, handleOrderPopup }) => {
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
              <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200 rounded-md">
                <Button
                  text="Add to cart"
                  bgColor="bg-primary"
                  textColor="text-white"
                  handler={() => handleOrderPopup(item)}
                />


                
              </div>
            </div>
            <div className="leading-7">
              <h2 className="font-semibold">{item.title}</h2>
              <h2 className="font-bold">${item.price}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
