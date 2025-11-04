'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { CiShoppingCart, CiHeart } from 'react-icons/ci';
import { FaRegEye } from "react-icons/fa6";
import { FiArrowRight } from 'react-icons/fi';
import { openSans } from '../Font/font';

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('All Product');

  const products = [
    {
      name: 'ASUS Zenbook 14 OLED Laptop',
      desc: 'ASUS Zenbook 14 OLED is a touch screen laptop...',
      price: '400,000',
      rating: 5,
      reviews: 738,
      image: '/laptop-category.jpg',
      label: { text: 'HOT', color: 'bg-red-500' }
    },
    {
      name: 'HP Laptop 15-fd0232nia',
      desc: 'HP Laptop 15-fd0232nia, FreeDOS 3.0, 15.6"',
      price: '112,300',
      rating: 4.5,
      reviews: 536,
      image: '/laptop-category.jpg'
    },
    {
      name: 'HP LaserJet MFP M236dw Printer',
      desc: 'HP LaserJet MFP M236dw Printer...',
      price: '54,360',
      rating: 4.5,
      reviews: 423,
      image: '/printer-category.png',
      label: { text: 'BEST DEALS', color: 'bg-[#00aeef]' }
    },
    {
      name: 'DELL 22" LED P2217H Monitor',
      desc: 'DELL 22" LED P2217H NEW',
      price: '25,000',
      rating: 4,
      reviews: 816,
      image: '/monitor-category.png'
    },
    {
      name: 'DELL OPTIPLEX 5050MT C17 Desktop',
      desc: 'DELL OPTIPLEX 5050MT C17, 6TH GEN, 8GB, 256GB',
      price: '108,500',
      rating: 5,
      reviews: 647,
      image: '/laptop-category.jpg'
    },
    {
      name: 'DELL LED SE2222H Monitor',
      desc: 'DELL LED SE2222H NEW',
      price: '22,000',
      oldPrice: '30,000',
      rating: 4.5,
      reviews: 877,
      image: '/monitor-category.png',
      label: { text: '25% OFF', color: 'bg-yellow-400 text-black' }
    },
    {
      name: 'DELL VOSTRO 3020 C13 Desktop',
      desc: 'DELL VOSTRO 3020 C13 13GEN 8GB 256GBSSD',
      price: '108,000',
      rating: 5,
      reviews: 426,
      image: '/laptop-category.jpg'
    },
    {
      name: 'Lenovo IdeaPad Slim 315 Laptop',
      desc: 'Lenovo IdeaPad Slim 315 - 13th Gen Core i7 13620H',
      price: '106,000',
      rating: 5,
      reviews: 583,
      image: '/laptop-category.jpg',
      label: { text: 'SALE', color: 'bg-green-500' }
    }
  ];

  const tabs = ['All Product', 'Printers', 'Laptop', 'Desktops', 'LEDs'];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">☆</span>);
    }
    return stars;
  };

  return (
    <div className={`w-full py-8 lg:py-12 bg-white ${openSans.className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Banner */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-blue-900 to-black rounded-lg overflow-hidden h-full">
              <div className="p-6 text-white">
                <p className="text-xs uppercase tracking-wide mb-2">LAPTOPS & PRINTERS</p>
                <h2 className="text-3xl font-bold mb-2">50% Discount</h2>
                <p className="text-lg mb-4">On All Products</p>
                
                <div className="bg-gray-800 p-3 rounded mb-4">
                  <p className="text-xs text-center">Offers ends in: DD : HH : MM : SS</p>
                </div>
                
                <button className="w-full bg-[#00aeef] hover:bg-[#0099d9] text-white py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  SHOP NOW
                  <FiArrowRight />
                </button>
              </div>
              
              <div className="mt-4 overflow-hidden flex justify-center items-end h-112">
                <Image
                  src="/stacked-laptops.jpg"
                  alt="Stacked Laptops"
                  width={600}
                  height={600}
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Right Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 ">Featured Products</h2>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex gap-4 flex-wrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-0 py-2 transition relative ${
                        activeTab === tab
                          ? 'text-gray-900 font-bold'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00aeef]"></span>
                      )}
                    </button>
                  ))}
                </div>
                
                <a href="#" className="text-[#00aeef] hover:text-[#0099d9] font-medium flex items-center gap-2 ml-auto">
                  Browse All Product
                  <FiArrowRight />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col"
                >
                  {product.label && (
                    <div className={`absolute top-2 left-2 ${product.label.color} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                      {product.label.text}
                    </div>
                  )}

                  {/* Hover icons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-white rounded-full p-2 hover:bg-gray-100">
                      <CiHeart className="text-lg" />
                    </div>
                    <div className="bg-white rounded-full p-2 hover:bg-gray-100">
                      <CiShoppingCart className="text-lg" />
                    </div>
                    <div className="bg-white rounded-full p-2 hover:bg-gray-100">
                      <FaRegEye className="text-lg" />
                    </div>
                  </div>

                  <div className="w-full h-40 flex items-center justify-center p-4 bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-yellow-400 mb-2 text-sm">
                      {renderStars(product.rating)}
                      <span className="text-gray-600 text-xs ml-1">({product.reviews})</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-1">{product.desc}</p>
                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-base font-bold text-gray-900">Rs. {product.price}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">Rs. {product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;

