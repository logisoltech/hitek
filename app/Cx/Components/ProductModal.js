'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaStar, FaShoppingCart, FaFacebook, FaTwitter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { FaCopy, FaPinterest } from 'react-icons/fa6';

const ProductModal = ({ isOpen, onClose, product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('light-blue');
  const [quantity, setQuantity] = useState(1);
  const [selectedMemory, setSelectedMemory] = useState('16GB');
  const [selectedSize, setSelectedSize] = useState('14-inch');
  const [selectedStorage, setSelectedStorage] = useState('1TB');
  const thumbnailScrollRef = useRef(null);

  if (!isOpen || !product) return null;

  const images = [
    '/big-laptop.png',
    '/big-laptop.png',
    '/big-laptop.png',
    '/big-laptop.png',
    '/big-laptop.png',
    '/big-laptop.png'
  ];

  const colors = [
    { name: 'light-blue', class: 'bg-blue-300' },
    { name: 'light-gray', class: 'bg-gray-300' }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-blue-400 fill-current" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const scrollThumbnailsLeft = () => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollThumbnailsRight = () => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white rounded-sm max-w-6xl w-full max-h-[96vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6">
            {/* Close Button */}
            

          <div className="p-8 grid gap-12 justify-center items-start product-modal-grid">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 bg-white border p-6 border-gray-300 rounded-sm overflow-hidden flex items-center justify-center min-h-[400px]">
                <Image
                  src={images[selectedImage]}
                  alt={product?.name || 'Product'}
                  width={600}
                  height={500}
                  className="w-full h-auto object-contain max-w-full max-h-full"
                />
              </div>

              {/* Thumbnail Carousel */}
              <div className="relative flex items-center gap-2">
                {/* Left Arrow */}
                <button
                  onClick={scrollThumbnailsLeft}
                  className="shrink-0 w-10 h-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full flex items-center justify-center transition z-10"
                  aria-label="Scroll thumbnails left"
                >
                  <FaChevronLeft className="text-sm" />
                </button>

                {/* Thumbnail Container */}
                <div 
                  ref={thumbnailScrollRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 border-2 rounded-sm overflow-hidden transition ${
                        selectedImage === index ? 'border-[#00aeef]' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain"
                      />
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={scrollThumbnailsRight}
                  className="shrink-0 w-10 h-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full flex items-center justify-center transition z-10"
                  aria-label="Scroll thumbnails right"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-4">
              {/* Rating and Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(4.7)}
                  </div>
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
                    >
                    <FaTimes className="text-2xl" />
                    </button>
                  <span className="text-sm text-black font-bold">4.7 Star Rating</span>
                  <span className="text-sm text-gray-600">(21,671 User feedback)</span>
                </div>
                <h1 className="text-xl text-gray-900 mb-4">
                  2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray
                </h1>
              </div>

              {/* SKU and Brand */}
              <div className='flex justify-between'>
                <div className="space-y-1 text-sm text-gray-600">
                    <p>Sku: <span className="font-bold text-black">A264671</span></p>
                    <p>Brand: <span className="font-bold text-black">Apple</span></p>
                </div>

                <div className="space-y-1 text-sm">
                    <p className="text-gray-600 font-medium">Availability: <span className="font-bold text-green-500">In Stock</span></p>
                    <p className="text-gray-600">Category: <span className="font-bold text-black">Electronics Devices</span></p>
                </div>
              </div>
              {/* Pricing */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#00aeef]">PKR 150,000</span>
                <span className="text-xl text-gray-400 line-through">PKR 202,000</span>
                <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">21% OFF</span>
              </div>

              {/* Availability */}

              {/* Row 1: Colors and Memory */}
              <div className="grid grid-cols-2 gap-4">
                {/* Color Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color.name ? 'border-[#00aeef]' : 'border-gray-300'
                        } ${color.class}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Memory Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memory:</label>
                  <select
                    value={selectedMemory}
                    onChange={(e) => setSelectedMemory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option>16GB unified memory</option>
                    <option>8GB unified memory</option>
                    <option>32GB unified memory</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Size and Storage */}
              <div className="grid grid-cols-2 gap-4">
                {/* Size Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option>14-inch Liquid Retina XDR display</option>
                    <option>13-inch Retina display</option>
                    <option>16-inch Liquid Retina XDR display</option>
                  </select>
                </div>

                {/* Storage Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage:</label>
                  <select
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option>1TB SSD Storage</option>
                    <option>256GB SSD Storage</option>
                    <option>512GB SSD Storage</option>
                    <option>2TB SSD Storage</option>
                  </select>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className='flex gap-4'>
                <div>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-12 border border-gray-300 rounded-sm hover:bg-gray-100 flex items-center justify-center"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-12 text-center border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    />
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-12 border border-gray-300 rounded-sm hover:bg-gray-100 flex items-center justify-center"
                    >
                        +
                    </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-[50%] bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-sm font-bold flex items-center justify-center gap-2 transition">
                    <FaShoppingCart />
                    ADD TO CART
                </button>
              </div>


              {/* Share Product */}
              <div className='flex justify-between'>
                <p className='text-sm font-medium text-gray-700'>+ Add to Wishlist</p>
                <div className='flex gap-2'>
                    <p className="text-sm font-medium text-gray-700 ">Share product:</p>
                    <div className="flex items-center gap-3">
                    <button className="text-gray-600 hover:text-[#00aeef] transition">
                        <FaCopy className="text-xl" />
                    </button>
                    <button className="text-gray-600 hover:text-[#00aeef] transition">
                        <FaFacebook className="text-xl" />
                    </button>
                    <button className="text-gray-600 hover:text-[#00aeef] transition">
                        <FaTwitter className="text-xl" />
                    </button>
                    <button className="text-gray-600 hover:text-[#00aeef] transition">
                        <FaPinterest className="text-xl" />
                    </button>
                    </div>
                </div>
              </div>

              {/* Safe Checkout */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">100% Guarantee Safe Checkout</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Image src="/visa-black.png" alt="Visa" width={50} height={30} className="object-contain" />
                  <Image src="/mastercard.png" alt="Mastercard" width={30} height={30} className="object-contain" />
                  <Image src="/easypaisa.png" alt="EasyPaisa" width={20} height={20} className="object-contain" />
                  <Image src="/sadapay.png" alt="SadaPay" width={20} height={30} className="object-contain" />
                  <Image src="/nayapay.png" alt="NayaPay" width={25} height={30} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .product-modal-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .product-modal-grid {
            grid-template-columns: 45% 55%;
          }
        }
      `}</style>
    </>
  );
};

export default ProductModal;
