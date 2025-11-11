import React, { useState } from "react";
import Button from "../Shared/Button";

const ProductCard = ({ data, addToCart, onCheckout, isLoggedIn }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (item) => {
    addToCart(item, quantity);
    setQuantity(1);
  };

  const handleCheckout = (item) => {
    onCheckout(item, quantity);
    setQuantity(1);
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
                      handleCheckout(item);
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
