'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaRegEye } from 'react-icons/fa';
import { CiShoppingCart, CiHeart } from 'react-icons/ci';
import { openSans } from '../Font/font';
import ProductModal from '../Components/ProductModal';

const Laptop = () => {
  const scrollContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const parseNumeric = (value, fallback = 0) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number') return Number.isNaN(value) ? fallback : value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = Number(cleaned);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:3001/api/laptops');
        if (!response.ok) {
          throw new Error('Failed to load laptops');
        }
        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          price: parseNumeric(item.price, 0),
          rating: parseNumeric(item.rating, 4.5),
          reviews: parseNumeric(item.reviews, 120),
          description: item.description || item.title || item.name,
          image: item.image || '/laptop-category.jpg',
        }));
        setProducts(normalized);
      } catch (err) {
        console.error('Laptops fetch error:', err);
        setError(err.message || 'Failed to load laptops.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayProducts = useMemo(() => products.slice(0, 12), [products]);

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={`w-full py-8 lg:py-12 bg-white ${openSans.className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Laptops</h2>
        </div>

        <div className="relative px-12">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full p-3 shadow-lg transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="w-full text-sm text-gray-500 p-8 text-center">
                Loading laptops...
              </div>
            ) : error ? (
              <div className="w-full text-sm text-red-500 p-8 text-center">
                {error}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="w-full text-sm text-gray-500 p-8 text-center">
                No laptops available right now.
              </div>
            ) : (
              displayProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="relative bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col shrink-0 w-[234px] h-[320px]"
              >
                {product.label && (
                  <div className={`absolute top-2 left-2 ${product.label.color} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                    {product.label.text}
                  </div>
                )}

                {/* Hover icons */}
                <div 
                  className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => e.stopPropagation()}
                >
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
                    src="/laptop-category.jpg"
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2 text-sm">
                      {renderStars(product.rating)}
                      <span className="text-gray-600 text-xs ml-1">
                        ({Number(product.reviews || 0).toLocaleString('en-PK')})
                      </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-base font-bold text-gray-900">
                      PKR {Number(product.price || 0).toLocaleString('en-PK')}
                    </span>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full p-3 shadow-lg transition"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Laptop;

