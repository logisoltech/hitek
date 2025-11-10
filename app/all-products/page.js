'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../Cx/Layout/Navbar';
import Footer from '../Cx/Layout/Footer';
import { CiSearch } from 'react-icons/ci';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiHeart, CiShoppingCart } from 'react-icons/ci';
import { FaRegEye } from 'react-icons/fa6';
import { FiArrowRight } from 'react-icons/fi';
import { openSans } from '../Cx/Font/font';

export default function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [priceRange, setPriceRange] = useState({ min: 150000, max: 200000 });
  const [selectedPriceRange, setSelectedPriceRange] = useState('150000-200000');
  const [activeFilters, setActiveFilters] = useState(['Laptops', 'Core i7']);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const parseNumeric = (value, fallback = 0) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    const cleaned = value.toString().replace(/[^\d.-]/g, '');
    const num = Number(cleaned);
    return Number.isNaN(num) ? fallback : num;
  };

  const extractImageArray = (item) => {
    if (!item) return [];
    const candidates = [
      item.imageUrls,
      item.image_urls,
      item.images,
      item.imageurls,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate
          .map((url) => (typeof url === 'string' ? url.trim() : ''))
          .filter((url) => url);
      }
    }
    if (typeof item.image === 'string' && item.image.trim()) {
      return [item.image.trim()];
    }
    return [];
  };

  const normalizeProduct = (item, type) => {
    if (!item) return null;
    const placeholder = type === 'printer' ? '/printer-category.png' : '/laptop-category.jpg';
    const rawImages = extractImageArray(item);
    const primaryImage = rawImages[0] || item.image || placeholder;
    const imageArray = rawImages.length ? rawImages : [primaryImage];
    const hasId = item.id !== null && item.id !== undefined;
    const rawId = hasId ? item.id.toString() : '';
    const computedName = (item.name ||
      [item.brand, item.series, item.model].filter(Boolean).join(' ').trim() ||
      (type === 'printer' ? 'Printer' : 'Laptop')).trim();
    const rawDescription =
      typeof item.description === 'string' ? item.description.trim() : '';
    const computedDescription =
      rawDescription ||
      (type === 'printer'
        ? [item.resolution, item.copyfeature, item.scanfeature, item.duplex]
            .filter(Boolean)
            .join(' • ')
        : item.processor || item.graphics || '') ||
      computedName;
    const parsedPrice = parseNumeric(item.price);
    const hasPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;

    return {
      ...item,
      id: rawId,
      sourceId: item.id,
      type,
      category: type === 'printer' ? 'Printers' : 'Laptops',
      cartId: hasId ? `${type}-${rawId}` : undefined,
      price: hasPrice ? parsedPrice : 0,
      hasPrice,
      rating: parseNumeric(item.rating, 4.5),
      reviews: parseNumeric(item.reviews, 0),
      name: computedName,
      description: computedDescription,
      image: primaryImage,
      imageUrls: imageArray,
      image_urls: imageArray,
      images: imageArray,
    };
  };

  useEffect(() => {
    const fetchCategory = async (url, type) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load ${type} products`);
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : [];
        const normalized = items
          .map((item) => normalizeProduct(item, type))
          .filter(Boolean);
        return { data: normalized, error: null };
      } catch (error) {
        console.error(`${type} products fetch error:`, error);
        return { data: [], error: error.message || `Failed to load ${type} products` };
      }
    };

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setFetchError('');

      const [laptopsResult, printersResult] = await Promise.all([
        fetchCategory('http://localhost:3001/api/laptops', 'laptop'),
        fetchCategory('http://localhost:3001/api/printers', 'printer'),
      ]);

      const combined = [...laptopsResult.data, ...printersResult.data];
      setProducts(combined);

      if (laptopsResult.error && printersResult.error) {
        setFetchError('Failed to load products. Please try again.');
      } else if (laptopsResult.error || printersResult.error) {
        setFetchError('Some product categories failed to load.');
      }

      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setActiveFilters((prev) => {
      const withoutCategories = prev.filter((filter) => filter !== 'Laptops' && filter !== 'Printers');
      return [selectedCategory, ...withoutCategories];
    });
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    if (selectedCategory === 'Laptops') {
      return products.filter((product) => product.category === 'Laptops');
    }
    if (selectedCategory === 'Printers') {
      return products.filter((product) => product.category === 'Printers');
    }
    return [];
  }, [products, selectedCategory]);

  const formatCurrency = (value) =>
    (Number(value) || 0).toLocaleString('en-PK');

  const formatNumber = (value) =>
    (Number(value) || 0).toLocaleString('en-US');

  const categories = [
    'Laptops',
    'Desktop PCs',
    'Printers',
    'Scanners',
    'LED Monitors',
    'Printer Toners',
    'Printer Cartridges',
    'Refurbished Laptops',
    'Refurbished Desktop PCs',
    'Computer Accessories'
  ];

  const priceRanges = [
    { label: 'All Price', value: 'all' },
    { label: 'Under PKR 50,000', value: '0-50000' },
    { label: 'PKR 50,000 to PKR 100,000', value: '50000-100000' },
    { label: 'PKR 100,000 to PKR 150,000', value: '100000-150000' },
    { label: 'PKR 150,000 to PKR 200,000', value: '150000-200000' },
    { label: 'PKR 200,000 to PKR 300,000', value: '200000-300000' },
    { label: 'PKR 300,000 to PKR 400,000', value: '300000-400000' }
  ];

  const brands = ['HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'Samsung', 'Apple', 'Microsoft'];

  const popularTags = [
    'Game', 'Laptop', 'Intel', 'Asus Laptops', 'Macbook', 'SSD', 
    'Graphics Card', 'Processor', 'Slim', 'Ryzen', 'AMD', 'Microsoft', 'Samsung'
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">☆</span>);
    }
    return stars;
  };

  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const renderProductImage = (src, alt, className, size = { width: 160, height: 160 }) => {
    if (src?.startsWith('http')) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ width: size.width, height: size.height }}
        />
      );
    }
    return (
      <Image
        src={src || '/laptop-category.jpg'}
        alt={alt}
        width={size.width}
        height={size.height}
        className={className}
      />
    );
  };

  const ProductCard = ({ product }) => {
    const productType = (product.type || 'laptop').toLowerCase();
    const productId = product.id ? encodeURIComponent(product.id) : '';
    const productHref = productId ? `/product/${productId}?type=${encodeURIComponent(productType)}` : '#';
    const productDescription = product.description || 'Specifications coming soon.';
    const hasPrice = product.hasPrice || (Number.isFinite(product.price) && product.price > 0);
    const images = Array.isArray(product.imageUrls) && product.imageUrls.length
      ? product.imageUrls
      : [product.image || (productType === 'printer' ? '/printer-category.png' : '/laptop-category.jpg')];
    const [activeImage, setActiveImage] = useState(0);

    const handlePrev = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveImage((prev) => (prev + 1) % images.length);
    };

    const handleDotSelect = (event, index) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveImage(index);
    };

    return (
      <Link
        href={productHref}
        className="relative bg-white border border-gray-300 rounded-sm overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col"
      >
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

        <div className="relative w-full h-40 flex items-center justify-center p-4 bg-white">
          {renderProductImage(
            images[activeImage],
            `${product.name} preview ${activeImage + 1}`,
            'object-contain transition-opacity duration-200 max-h-full max-w-full',
            { width: 160, height: 160 },
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-600 rounded-full p-1 hover:bg-white"
                aria-label="Previous product image"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border border-gray-200 text-gray-600 rounded-full p-1 hover:bg-white"
                aria-label="Next product image"
              >
                <FaChevronRight className="text-xs" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => handleDotSelect(event, index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === activeImage ? 'bg-[#00aeef]' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-yellow-400 mb-2 text-sm">
            {renderStars(product.rating)}
            <span className="text-gray-600 text-xs ml-1">({formatNumber(product.reviews)})</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-1">{productDescription}</p>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-base font-bold text-blue-500">
              {hasPrice ? `Rs. ${formatCurrency(product.price)}` : 'Price on request'}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${openSans.className}`}>
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 bg-white">
        {/* Breadcrumbs */}
        <div className="bg-gray-100 border-b border-gray-200 py-5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center px-4 gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#00aeef] transition">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">All Products</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="w-64 shrink-0 space-y-4 sticky top-4 h-fit">
              {/* Category */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">CATEGORY</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#00aeef] focus:ring-[#00aeef]"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">PRICE RANGE</h3>
                <div className="space-y-4">
                  {/* Price Range Slider */}
                  <div className="px-2">
                    <div className="relative h-8">
                      <div className="absolute w-full h-2 bg-gray-200 rounded-sm top-3"></div>
                      <div 
                        className="absolute h-2 bg-[#00aeef] rounded-sm top-3"
                        style={{
                          left: `${(priceRange.min / 500000) * 100}%`,
                          width: `${((priceRange.max - priceRange.min) / 500000) * 100}%`
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange.min}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val < priceRange.max) {
                            setPriceRange({ ...priceRange, min: val });
                          }
                        }}
                        className="absolute top-0 w-full h-8 opacity-0 cursor-pointer z-20"
                      />
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange.max}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > priceRange.min) {
                            setPriceRange({ ...priceRange, max: val });
                          }
                        }}
                        className="absolute top-0 w-full h-8 opacity-0 cursor-pointer z-30"
                      />
                      <div 
                        className="absolute top-2 w-4 h-4 bg-[#00aeef] rounded-full border-2 border-white shadow pointer-events-none"
                        style={{ left: `calc(${(priceRange.min / 500000) * 100}% - 8px)` }}
                      ></div>
                      <div 
                        className="absolute top-2 w-4 h-4 bg-[#00aeef] rounded-full border-2 border-white shadow pointer-events-none"
                        style={{ left: `calc(${(priceRange.max / 500000) * 100}% - 8px)` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                      <span>PKR {(priceRange.min / 1000).toFixed(0)}K</span>
                      <span>PKR {(priceRange.max / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Min price"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Max price"
                    />
                  </div>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={selectedPriceRange === range.value}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="w-4 h-4 text-[#00aeef] focus:ring-[#00aeef]"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Brands */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">POPULAR BRANDS</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#00aeef] focus:ring-[#00aeef] rounded"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Laptop Banner */}
              <div className="bg-white rounded-sm p-4 mb-14 border border-gray-300 shadow-lg">
                <div className="mb-3">
                  <Image
                    src="/laptop-category.jpg"
                    alt="Lenovo Laptop"
                    width={200}
                    height={150}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="text-center mb-3">
                  <p className="text-lg font-bold text-black mb-1">Heavy on Features.</p>
                  <p className="text-lg font-bold text-black mb-3">Light on Price.</p>
                  <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 inline-block mb-3">
                    Only for: PKR 200,000
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full bg-[#00aeef] hover:bg-[#0099d9] text-white px-4 py-2 rounded-sm font-semibold transition flex items-center justify-center gap-2">
                    <CiShoppingCart className="text-lg" />
                    ADD TO CART
                  </button>
                  <button className="w-full border-2 border-[#00aeef] text-[#00aeef] hover:bg-[#00aeef] hover:text-white px-4 py-2 rounded-sm font-semibold transition flex items-center justify-center gap-2">
                    VIEW DETAILS
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Search and Filters Bar */}
              <div className="bg-white rounded-sm p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Search */}
                  <div className="flex-1 max-w-md">
                    <div className="flex rounded overflow-hidden border border-gray-300">
                      <input
                        type="text"
                        placeholder="Search for anything..."
                        className="flex-1 px-4 py-2 text-gray-900 bg-white focus:outline-none"
                      />
                      <button className="bg-white text-gray-700 px-4 hover:bg-gray-100 transition">
                        <CiSearch className="text-xl" />
                      </button>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    >
                      <option>Most Popular</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-700 font-medium">Active Filters:</span>
                    {activeFilters.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {filter}
                        <button
                          onClick={() => removeFilter(filter)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                  {loadingProducts
                    ? 'Loading results...'
                    : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'result' : 'results'} found.`}
                </div>
              </div>

            

              {/* Product Grid */}
              <div className="pl-4 mb-6">
                {loadingProducts ? (
                  <div className="py-12 text-sm text-gray-600 text-center">Loading products...</div>
                ) : fetchError ? (
                  <div className="py-12 text-sm text-red-600 text-center">{fetchError}</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-12 text-sm text-gray-600 text-center">No products available yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.cartId || `${product.type}-${product.id}`}
                        product={product}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-auto pt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-3 rounded-full border-blue-400 border-2 text-blue-400 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full transition ${
                      currentPage === page
                        ? 'bg-[#00aeef] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {String(page).padStart(2, '0')}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
                  disabled={currentPage === 6}
                  className="px-3 py-3 border-2 border-blue-400 text-blue-400 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
