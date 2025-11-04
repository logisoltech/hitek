'use client';

import React from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { openSans } from '../Font/font';

const ShoppingCartPopup = ({ isOpen, onClose, cartItems = [] }) => {
  if (!isOpen) return null;

  // Sample cart items - replace with actual cart data
  const items = cartItems.length > 0 ? cartItems : [
    {
      id: 1,
      name: 'HP OMEN 16T-WF100 GAMING I7-14700HX 16GB',
      price: 150000,
      quantity: 1,
      image: '/big-laptop.png'
    },
    {
      id: 2,
      name: 'HP VICTUS 15-FA0033 CI5 12TH GEN 8GB 512GB',
      price: 188000,
      quantity: 1,
      image: '/big-laptop.png'
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString('en-US')}`;
  };

  return (
    <div 
      className={`absolute top-full right-0 mt-2 w-96 bg-white rounded-sm shadow-2xl z-50 border border-gray-200 ${openSans.className}`}
      onMouseEnter={(e) => {
        e.stopPropagation();
        // Keep popup open when hovering over it
      }}
      onMouseLeave={(e) => {
        // Only close if not moving to parent or bridge
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Shopping Cart ({items.length.toString().padStart(2, '0')})</h3>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="px-4 py-3 flex gap-3 hover:bg-gray-50 transition relative">
              {/* Product Image */}
              <div className="shrink-0 w-16 h-16 border border-gray-200 rounded overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-gray-900 font-medium mb-1 line-clamp-2 pr-6">
                  {item.name}
                </h4>
                <div className="flex items-center">
                  <span className="text-sm text-[#00aeef] font-medium">
                    {item.quantity} x {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              {/* Remove Button - Centered Vertically */}
              <button
                onClick={() => {/* Handle remove */}}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-red-500 transition"
                aria-label="Remove item"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            {index < items.length - 1 && <hr className="border-gray-200" />}
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Sub-Total:</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 space-y-2">
        <button className="w-full bg-[#00aeef] hover:bg-[#0099d9] text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition">
          CHECKOUT NOW
          <FiArrowRight />
        </button>
        <button className="w-full border-2 border-[#00aeef] text-[#00aeef] hover:bg-[#00aeef] hover:text-white py-3 rounded-sm font-bold transition">
          VIEW CART
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartPopup;
