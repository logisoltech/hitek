'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaStar, FaShoppingCart, FaFacebook, FaTwitter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { FaCopy, FaPinterest } from 'react-icons/fa6';
import { openSans } from '../Font/font';
import { useCart } from '../Providers/CartProvider';

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return Number.isNaN(value) ? fallback : value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const formatPrice = (value) => {
  const numeric = toNumber(value, 0);
  return `PKR ${numeric.toLocaleString('en-PK')}`;
};

const sanitizeProduct = (input) => {
  if (!input) return null;
  return {
    ...input,
    price: toNumber(input.price, 0),
    rating: toNumber(input.rating, 4.5),
    reviews: toNumber(input.reviews, 0),
  };
};

const ProductModal = ({ isOpen, onClose, product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const thumbnailScrollRef = useRef(null);
  const { addToCart } = useCart();

  const [productData, setProductData] = useState(() => sanitizeProduct(product));
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      setProductData(sanitizeProduct(product));
      setProductError('');
      setLoadingProduct(false);
      return;
    }

    const sanitized = sanitizeProduct(product);
    setProductData(sanitized);

    if (!product?.id) return;

    let active = true;
    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setProductError('');
        const response = await fetch(`http://localhost:3001/api/laptops/${product.id}`);
        if (!response.ok) {
          throw new Error('Failed to load product details');
        }
        const data = await response.json();
        if (!active) return;
        setProductData(sanitizeProduct({ ...product, ...data }));
      } catch (error) {
        console.error('Product modal fetch error:', error);
        if (active) {
          setProductError(error.message || 'Failed to refresh product details.');
          setProductData(sanitized);
        }
      } finally {
        if (active) setLoadingProduct(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [isOpen, product]);

  const productImages = useMemo(() => {
    const source = productData;
    if (!source) return ['/big-laptop.png'];
    if (Array.isArray(source.images) && source.images.length > 0) {
      return source.images.map((img) => img || '/big-laptop.png');
    }
    if (source.image) {
      return [source.image];
    }
    return ['/big-laptop.png'];
  }, [productData]);

  const renderProductImage = (src, alt, className, size) => {
    if (src?.startsWith('http')) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={size ? { width: size.width, height: size.height } : undefined}
        />
      );
    }
    const width = size?.width || 600;
    const height = size?.height || 500;
    return (
      <Image
        src={src || '/big-laptop.png'}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  };

  if (!isOpen || !productData) return null;

  const name = productData.name || 'Product';
  const ratingValue = toNumber(productData.rating, 4.5);
  const reviewsCount = toNumber(productData.reviews, 0);
  const priceValue = toNumber(productData.price, 0);
  const brand = productData.brand || 'Unknown';
  const sku = productData.model || productData.series || `SKU-${productData.id}`;
  const formattedPrice = formatPrice(priceValue);
  const description = productData.description || productData.title || name;
  const specs = [
    { label: 'Processor', value: productData.processor },
    { label: 'Graphics', value: productData.graphics },
    { label: 'Memory', value: productData.memory },
    { label: 'Storage', value: productData.storage },
    { label: 'Display', value: productData.display },
    { label: 'Operating System', value: productData.os },
  ].filter((spec) => spec.value);

  const handleAddToCart = () => {
    addToCart(
      {
        id: productData.id,
        name,
        image: productImages[0],
        price: priceValue,
      },
      quantity,
    );
    onClose();
  };

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
        className={`fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 ${openSans.className}`}
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-sm max-w-6xl w-full max-h-[96vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6">
            <div className="p-8 grid gap-12 justify-center items-start product-modal-grid">
              <div>
                <div className="mb-4 bg-white border p-6 border-gray-300 rounded-sm overflow-hidden flex items-center justify-center min-h-[400px]">
                  {renderProductImage(productImages[selectedImage], name, 'w-full h-auto object-contain max-w-full max-h-full', {
                    width: 600,
                    height: 500,
                  })}
                </div>

                <div className="relative flex items-center gap-2">
                  <button
                    onClick={scrollThumbnailsLeft}
                    className="shrink-0 w-10 h-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full flex items-center justify-center transition z-10"
                    aria-label="Scroll thumbnails left"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  <div
                    ref={thumbnailScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`shrink-0 border-2 rounded-sm overflow-hidden transition ${
                          selectedImage === index ? 'border-[#00aeef]' : 'border-gray-200'
                        }`}
                      >
                        {renderProductImage(img, `Thumbnail ${index + 1}`, 'w-20 h-20 object-contain', {
                          width: 80,
                          height: 80,
                        })}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={scrollThumbnailsRight}
                    className="shrink-0 w-10 h-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full flex items-center justify-center transition z-10"
                    aria-label="Scroll thumbnails right"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
                  aria-label="Close product modal"
                >
                  <FaTimes className="text-2xl" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(ratingValue)}
                    </div>
                    <span className="text-sm text-black font-bold">
                      {ratingValue.toFixed(1)} Star Rating
                    </span>
                    <span className="text-sm text-gray-600">
                      ({reviewsCount.toLocaleString('en-PK')} user feedback)
                    </span>
                  </div>
                  <h1 className="text-xl text-gray-900 mb-3 leading-snug">
                    {name}
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm text-gray-600">
                  <div className="space-y-1">
                    <p>
                      SKU: <span className="font-semibold text-gray-900">{sku}</span>
                    </p>
                    <p>
                      Brand: <span className="font-semibold text-gray-900">{brand}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    {productData.category && (
                      <p>
                        Category:{' '}
                        <span className="font-semibold text-gray-900">
                          {productData.category}
                        </span>
                      </p>
                    )}
                    {productData.availability && (
                      <p>
                        Availability:{' '}
                        <span className="font-semibold text-green-500">
                          {productData.availability}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#00aeef]">{formattedPrice}</span>
                  {productData.oldPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(productData.oldPrice)}
                    </span>
                  )}
                </div>

                {productError && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                    {productError}
                  </div>
                )}

                {loadingProduct && (
                  <div className="text-sm text-blue-500">Refreshing product details...</div>
                )}

                {specs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-gray-200 rounded-sm p-4">
                    {specs.map((spec) => (
                      <div key={spec.label} className="text-sm">
                        <span className="font-semibold text-gray-900">{spec.label}:</span>{' '}
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
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
                        onChange={(e) =>
                          setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
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

                  <button
                    onClick={handleAddToCart}
                    className="w-[50%] bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-sm font-bold flex items-center justify-center gap-2 transition"
                  >
                    <FaShoppingCart />
                    ADD TO CART
                  </button>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700">+ Add to Wishlist</p>
                  <div className="flex gap-2">
                    <p className="text-sm font-medium text-gray-700">Share product:</p>
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

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    100% Guarantee Safe Checkout
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Image
                      src="/visa-black.png"
                      alt="Visa"
                      width={50}
                      height={30}
                      className="object-contain"
                    />
                    <Image
                      src="/mastercard.png"
                      alt="Mastercard"
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                    <Image
                      src="/easypaisa.png"
                      alt="EasyPaisa"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <Image
                      src="/sadapay.png"
                      alt="SadaPay"
                      width={20}
                      height={30}
                      className="object-contain"
                    />
                    <Image
                      src="/nayapay.png"
                      alt="NayaPay"
                      width={25}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
