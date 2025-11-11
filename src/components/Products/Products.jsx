
import React from 'react';
import Heading from '../Shared/Heading';
import ProductCard from './ProductCard';

import Img1 from '../../assets/product/p-1.jpg';
import Img2 from '../../assets/product/p-2.jpg';
import Img3 from '../../assets/product/p-3.jpg';
import Img4 from '../../assets/product/p-4.jpg';
import Img5 from '../../assets/product/p-5.jpg';
import Img6 from '../../assets/product/p-9.jpg';
import Img7 from '../../assets/product/p-7.jpg';

const ProductsData = [
  { id: 1, img: Img1, title: 'Cute White Top', price: '120.000', aosDelay: '000' },
  { id: 2, img: Img2, title: 'white top with blue stripes ', price: '420.000', aosDelay: '200.000' },
  { id: 3, img: Img3, title: 'Cream Top', price: '320.000', aosDelay: '400.000' },
  { id: 4, img: Img4, title: 'Cerry Hoodie', price: '220.000', aosDelay: '600.000' },
];

const ProductsData2 = [
  { id: 5, img: Img5, title: 'Flare Pants', price: '120.000', aosDelay: '000' },
  { id: 6, img: Img6, title: 'Jeans Pants', price: '420.000', aosDelay: '200.000' },
  { id: 7, img: Img7, title: 'Brown Hoodie', price: '320.000', aosDelay: '400.000' },
  { id: 8, img: Img5, title: 'Flare Pants', price: '220.000', aosDelay: '600.000' },
];

const Products = ({
  isLoggedIn,
  addToCart,
  onCheckout,
}) => {
  return (
    <div id="shop">
      <div className="container">
        <Heading title="Our Products" subtitle="Explore Our Products" />
        <ProductCard 
          data={ProductsData} 
          addToCart={addToCart}
          onCheckout={onCheckout}
          isLoggedIn={isLoggedIn}
        />
        <ProductCard 
          data={ProductsData2} 
          addToCart={addToCart}
          onCheckout={onCheckout}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default Products;
